import { pgTable, serial, text, timestamp, boolean, numeric, integer } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial().primaryKey(),
  deviceId: text("device_id").notNull().unique(),
  balance: numeric("balance", { precision: 10, scale: 2 }).notNull().default("0"),
  totalDataSoldMb: numeric("total_data_sold_mb", { precision: 10, scale: 2 }).notNull().default("0"),
  isSelling: boolean("is_selling").notNull().default(false),
  sellingStartedAt: timestamp("selling_started_at"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const transactions = pgTable("transactions", {
  id: serial().primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amountRs: numeric("amount_rs", { precision: 10, scale: 2 }).notNull(),
  dataMb: numeric("data_mb", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

export const withdrawals = pgTable("withdrawals", {
  id: serial().primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amountRs: numeric("amount_rs", { precision: 10, scale: 2 }).notNull(),
  upiId: text("upi_id").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
})
