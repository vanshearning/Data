import type { Config } from "@netlify/functions"
import { db } from "../../db/index.js"
import { users, transactions } from "../../db/schema.js"
import { eq, desc } from "drizzle-orm"

export default async (req: Request) => {
  const deviceId = req.headers.get("x-device-id")
  if (!deviceId) return Response.json({ error: "Missing device ID" }, { status: 400 })

  const [user] = await db.select().from(users).where(eq(users.deviceId, deviceId))
  if (!user) return Response.json({ transactions: [] })

  const txns = await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, user.id))
    .orderBy(desc(transactions.createdAt))
    .limit(20)

  return Response.json({ transactions: txns })
}

export const config: Config = { path: "/api/transactions" }
