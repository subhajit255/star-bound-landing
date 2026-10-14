import { Router, type IRouter } from "express";
import { db, websitePagesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetWebsitePagesResponse, UpdateWebsitePagesBody, UpdateWebsitePagesResponse } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";
import { defaultPages } from "../lib/defaultPages";

const router: IRouter = Router();

router.get("/website-pages", async (req, res): Promise<void> => {
  await db.insert(websitePagesTable).values({ id: 1, content: defaultPages }).onConflictDoNothing();
  let [row] = await db.select().from(websitePagesTable).where(eq(websitePagesTable.id, 1));

  if (row) {
    const content = row.content as { pages?: Array<{ eyebrow?: string; title?: string }> } | undefined;
    const isLegacy =
      content?.pages?.[0]?.eyebrow === "A clearer view of AI operations" ||
      content?.pages?.[0]?.title === "Understand your AI teams at a glance." ||
      process.env["FORCE_RESET_CONTENT"] === "true" ||
      req.query["force_reset"] === "true";

    if (isLegacy) {
      const [updated] = await db
        .update(websitePagesTable)
        .set({ content: defaultPages, updatedAt: new Date() })
        .where(eq(websitePagesTable.id, 1))
        .returning();
      if (updated) {
        row = updated;
      }
    }
  }

  res.set("Cache-Control", "no-store").json(GetWebsitePagesResponse.parse({ ...row.content, updatedAt: row.updatedAt }));
});

router.put("/website-pages", requireAdmin, async (req, res): Promise<void> => {
  const parsed = UpdateWebsitePagesBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please check all page fields and their length limits." });
    return;
  }
  if (new Set(parsed.data.pages.map((p) => p.slug)).size !== 7) {
    res.status(400).json({ error: "Include each of the seven website pages exactly once." });
    return;
  }
  if (parsed.data.pages.some((p) => !p.title.trim() || !p.seoTitle.trim() ||
      (p.imagePath !== null && !/^\/objects\/uploads\/[a-zA-Z0-9-]+$/.test(p.imagePath)))) {
    res.status(400).json({ error: "Titles cannot be blank and images must be uploaded through the website admin." });
    return;
  }
  const [row] = await db.insert(websitePagesTable).values({ id: 1, content: parsed.data, updatedAt: new Date() })
    .onConflictDoUpdate({ target: websitePagesTable.id, set: { content: parsed.data, updatedAt: new Date() } }).returning();
  res.set("Cache-Control", "no-store").json(UpdateWebsitePagesResponse.parse({ ...row.content, updatedAt: row.updatedAt }));
});

export default router;