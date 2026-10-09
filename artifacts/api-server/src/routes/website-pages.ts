import { Router, type IRouter } from "express";
import { db, websitePagesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetWebsitePagesResponse, UpdateWebsitePagesBody, UpdateWebsitePagesResponse } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";
import { defaultPages } from "../lib/defaultPages";

const router: IRouter = Router();

router.get("/website-pages", async (_req, res): Promise<void> => {
  await db.insert(websitePagesTable).values({ id: 1, content: defaultPages }).onConflictDoNothing();
  const [row] = await db.select().from(websitePagesTable).where(eq(websitePagesTable.id, 1));
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