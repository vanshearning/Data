import type { Config } from "@netlify/functions"
import { db } from "../../db/index.js"
import { users, withdrawals } from "../../db/schema.js"
import { eq, desc } from "drizzle-orm"

export default async (req: Request) => {
  const deviceId = req.headers.get("x-device-id")
  if (!deviceId) return Response.json({ error: "Missing device ID" }, { status: 400 })

  if (req.method === "GET") {
    const [user] = await db.select().from(users).where(eq(users.deviceId, deviceId))
    if (!user) return Response.json({ withdrawals: [] })

    const list = await db
      .select()
      .from(withdrawals)
      .where(eq(withdrawals.userId, user.id))
      .orderBy(desc(withdrawals.createdAt))

    return Response.json({ withdrawals: list })
  }

  if (req.method === "POST") {
    const { amount, upiId } = await req.json()

    if (!amount || !upiId) {
      return Response.json({ error: "Amount and UPI ID required" }, { status: 400 })
    }

    const withdrawAmount = parseFloat(String(amount))
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      return Response.json({ error: "Invalid amount" }, { status: 400 })
    }

    if (withdrawAmount < 50) {
      return Response.json({ error: "Minimum withdrawal is ₹50" }, { status: 400 })
    }

    const [user] = await db.select().from(users).where(eq(users.deviceId, deviceId))
    if (!user) return Response.json({ error: "User not found" }, { status: 404 })

    const currentBalance = parseFloat(String(user.balance))
    if (withdrawAmount > currentBalance) {
      return Response.json({ error: "Insufficient balance" }, { status: 400 })
    }

    const [withdrawal] = await db.insert(withdrawals).values({
      userId: user.id,
      amountRs: String(withdrawAmount),
      upiId,
    }).returning()

    await db
      .update(users)
      .set({ balance: String(currentBalance - withdrawAmount) })
      .where(eq(users.id, user.id))

    return Response.json({ withdrawal, newBalance: currentBalance - withdrawAmount })
  }

  return new Response("Method not allowed", { status: 405 })
}

export const config: Config = { path: "/api/withdraw" }
