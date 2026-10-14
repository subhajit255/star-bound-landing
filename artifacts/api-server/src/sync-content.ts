import { db, siteContentTable, websitePagesTable, pool } from "@workspace/db";
import { defaultContent } from "./lib/defaultContent";
import { defaultPages } from "./lib/defaultPages";

async function main() {
  console.log("Syncing Star Bound content to PostgreSQL database...");

  await db
    .insert(siteContentTable)
    .values({ id: 1, content: defaultContent, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteContentTable.id,
      set: { content: defaultContent, updatedAt: new Date() },
    });

  console.log("✓ site_content updated with latest Star Bound landing page copy.");

  await db
    .insert(websitePagesTable)
    .values({ id: 1, content: defaultPages, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: websitePagesTable.id,
      set: { content: defaultPages, updatedAt: new Date() },
    });

  console.log("✓ website_pages updated with latest Star Bound pages copy.");
  await pool.end();
  console.log("Database sync completed successfully.");
}

main().catch((err) => {
  console.error("Failed to sync database content:", err);
  process.exit(1);
});
