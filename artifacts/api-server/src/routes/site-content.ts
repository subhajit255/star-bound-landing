import { Router, type IRouter } from "express";
import { db, siteContentTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetSiteContentResponse, UpdateSiteContentBody, GetAdminAccessResponse } from "@workspace/api-zod";
import { defaultContent } from "../lib/defaultContent";
import { requireAdmin, adminAccess } from "../middlewares/requireAdmin";

const router: IRouter = Router();

router.get("/admin/access", (req, res) => {
  res.set("Cache-Control", "no-store").json(GetAdminAccessResponse.parse(adminAccess(req)));
});

router.get("/site-content", async (_req, res): Promise<void> => {
  await db.insert(siteContentTable).values({ id: 1, content: defaultContent }).onConflictDoNothing();
  const [row] = await db.select().from(siteContentTable).where(eq(siteContentTable.id, 1));
  res.set("Cache-Control", "no-store").json(
    GetSiteContentResponse.parse({ ...row.content, updatedAt: row.updatedAt.toISOString() }),
  );
});

router.put("/site-content", requireAdmin, async (req, res): Promise<void> => {
  const parsed = UpdateSiteContentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please check the content fields and their length limits." });
    return;
  }
  const paths = [parsed.data.heroImagePath, ...parsed.data.features.map((f) => f.imagePath)];
  if (paths.some((path) => path !== null && !/^\/objects\/uploads\/[a-zA-Z0-9-]+$/.test(path))) {
    res.status(400).json({ error: "Images must be uploaded through the website admin." });
    return;
  }
  const [row] = await db.insert(siteContentTable).values({
    id: 1, content: parsed.data, updatedAt: new Date(),
  }).onConflictDoUpdate({
    target: siteContentTable.id, set: { content: parsed.data, updatedAt: new Date() },
  }).returning();
  res.json(GetSiteContentResponse.parse({ ...row.content, updatedAt: row.updatedAt.toISOString() }));
});

export default router;