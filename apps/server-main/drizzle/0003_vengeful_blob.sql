ALTER TABLE "transactions" ALTER COLUMN "performed_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "category_id" SET NOT NULL;