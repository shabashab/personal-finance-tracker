ALTER TABLE "accounts" ADD COLUMN "initial_balance" numeric DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "currency_usd_exchange_rate" numeric NOT NULL;