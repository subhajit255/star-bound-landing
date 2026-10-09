import { integer, jsonb, pgTable, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const siteContentTable = pgTable("site_content", {
  id: integer("id").primaryKey(),
  content: jsonb("content").notNull().$type<Record<string, unknown>>(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSiteContentSchema = createInsertSchema(siteContentTable);
export type SiteContentRecord = typeof siteContentTable.$inferSelect;