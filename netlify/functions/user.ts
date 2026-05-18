import type { Config } from "@netlify/functions"
import { db } from "../../db/index.js"
import { users, transactions } from "../../db/schema.js"
import { eq } from "drizzle-orm"

const RATE_PER_MB = 0.20 // ₹0.20 per MB
const MB_PER_MINUTE = 1 // 1 MB per minute of selling

async function syncSellingProgress(user: typeof users.$inferSelect) {
  if (!user.isSelling || !user.sellingStartedAt) return user

  const now = new Date()
  const minutesElapsed = (now.getTime() - new Date(user.sellingStartedAt).getTime()) / 60000
  const newDataMb = parseFloat((minutesElapsed * MB_PER_MINUTE).toFixed(2))
  const earnedRs = parseFloat((newDataMb * RATE_PER_MB).toFixed(2))

  if (newDataMb < 0.01) return user

  const [updated] = await db
    .update(users)
    .set({
      balance: String(parseFloat(String(user.balance)) + earnedRs),
      totalDataSoldMb: String(parseFloat(String(user.totalDataSoldMb)) + newDataMb),
      sellingStartedAt: now,
    })
    .where(eq(users.id, user.id))
    .returning()

  if (newDataMb >= 1) {
    await db.insert(transactions).values({
      userId: user.id,
      amountRs: String(earnedRs),
      dataMb: String(newDataMb),
    })
  }

  return updated
}

export default async (req: Request) => {
  const deviceId = req.headers.get("x-device-id")
  if (!deviceId) return Response.json({ error: "Missing device ID" }, { status: 400 })

  if (req.method === "GET") {
    let [user] = await db.select().from(users).where(eq(users.deviceId, deviceId))
    if (!user) {
      ;[user] = await db.insert(users).values({ deviceId }).returning()
    } else {
      user = await syncSellingProgress(user)
    }
    return Response.json(user)
  }

  if (req.method === "POST") {
    const body = await req.json()
    const { action } = body

    let [user] = await db.select().from(users).where(eq(users.deviceId, deviceId))
    if (!user) {
      ;[user] = await db.insert(users).values({ deviceId }).returning()
    }

    if (action === "start") {
      user = await syncSellingProgress(user)
      if (!user.isSelling) {
        ;[user] = await db
          .update(users)
          .set({ isSelling: true, sellingStartedAt: new Date() })
          .where(eq(users.id, user.id))
          .returning()
      }
    } else if (action === "stop") {
      user = await syncSellingProgress(user)
      ;[user] = await db
        .update(users)
        .set({ isSelling: false, sellingStartedAt: null })
        .where(eq(users.id, user.id))
        .returning()
    }

    return Response.json(user)
  }

  return new Response("Method not allowed", { status: 405 })
}

export const config: Config = { path: "/api/user" }
