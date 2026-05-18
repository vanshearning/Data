CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY,
	"user_id" integer NOT NULL,
	"amount_rs" numeric(10,2) NOT NULL,
	"data_mb" numeric(10,2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"device_id" text NOT NULL UNIQUE,
	"balance" numeric(10,2) DEFAULT '0' NOT NULL,
	"total_data_sold_mb" numeric(10,2) DEFAULT '0' NOT NULL,
	"is_selling" boolean DEFAULT false NOT NULL,
	"selling_started_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "withdrawals" (
	"id" serial PRIMARY KEY,
	"user_id" integer NOT NULL,
	"amount_rs" numeric(10,2) NOT NULL,
	"upi_id" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");