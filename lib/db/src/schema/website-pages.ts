import { integer, jsonb, pgTable, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const websitePagesTable = pgTable("website_pages", {
  id: integer("id").primaryKey(),
  content: jsonb("content").notNull().$type<Record<string, unknown>>(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertWebsitePagesSchema = createInsertSchema(websitePagesTable);
export type WebsitePagesRecord = typeof websitePagesTable.$inferSelect;