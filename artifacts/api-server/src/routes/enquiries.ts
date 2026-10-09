import { createHash } from "node:crypto";
import { Router, type IRouter } from "express";
import { db, enquiriesTable, enquiryRateLimitsTable } from "@workspace/db";
import { desc, eq, lt, sql } from "drizzle-orm";
import { SubmitEnquiryBody, SubmitEnquiryResponse, ListEnquiriesResponse } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();
const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 5;

router.post("/enquiries", async (req, res): Promise<void> => {
  // Reject cross-site browser posts, but permit non-browser clients with no Origin.
  const origin = req.get("origin");
  const host = req.get("x-forwarded-host") ?? req.get("host");
  if (origin) {
    try {
      if (new URL(origin).host !== host) {
        res.status(403).json({ error: "Please submit your enquiry from this website." });
        return;
      }
    } catch {
      res.status(400).json({ error: "Invalid request origin." });
      return;
    }
  }
  const body = req.body;
  const parsed = SubmitEnquiryBody.safeParse(body && typeof body === "object" ? {
    ...body,
    name: typeof body.name === "string" ? body.name.trim() : body.name,
    email: typeof body.email === "string" ? body.email.trim() : body.email,
    company: typeof body.company === "string" ? body.company.trim() : body.company,
    message: typeof body.message === "string" ? body.message.trim() : body.message,
  } : body);
  if (!parsed.success || parsed.data.privacyConsent !== true || parsed.data.website?.trim()) {
    res.status(400).json({ error: "Check your contact details, message and privacy acknowledgement." });
    return;
  }
  const now = new Date();
  // req.ip follows the application's existing trusted proxy configuration.
  const key = createHash("sha256").update(req.ip ?? req.socket.remoteAddress ?? "unknown").digest("hex");
  await db.delete(enquiryRateLimitsTable).where(lt(enquiryRateLimitsTable.expiresAt, now));
  const [counter] = await db.insert(enquiryRateLimitsTable).values({
    key, count: 1, expiresAt: new Date(now.getTime() + WINDOW_MS),
  }).onConflictDoUpdate({
    target: enquiryRateLimitsTable.key,
    set: { count: sql`${enquiryRateLimitsTable.count} + 1` },
    setWhere: sql`${enquiryRateLimitsTable.count} < ${LIMIT}`,
  }).returning();
  if (!counter) {
    res.set("Retry-After", String(WINDOW_MS / 1000)).status(429).json({ error: "Too many enquiries. Please try again in an hour." });
    return;
  }
  const { website: _website, ...input } = parsed.data;
  const [row] = await db.insert(enquiriesTable).values(input).returning({ id: enquiriesTable.id });
  res.set("Cache-Control", "no-store").status(201).json(SubmitEnquiryResponse.parse({
    id: row.id, message: "Thank you. Your enquiry has been received.",
  }));
});

router.get("/admin/enquiries", requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db.select({
    id: enquiriesTable.id, name: enquiriesTable.name, email: enquiriesTable.email,
    company: enquiriesTable.company, message: enquiriesTable.message,
    interest: enquiriesTable.interest, createdAt: enquiriesTable.createdAt,
  }).from(enquiriesTable).orderBy(desc(enquiriesTable.createdAt), desc(enquiriesTable.id));
  res.set("Cache-Control", "no-store").json(ListEnquiriesResponse.parse(rows));
});

router.delete("/admin/enquiries/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    res.status(400).json({ error: "Invalid enquiry ID." });
    return;
  }
  const rows = await db.delete(enquiriesTable).where(eq(enquiriesTable.id, id)).returning({ id: enquiriesTable.id });
  if (!rows.length) {
    res.status(404).json({ error: "Enquiry not found." });
    return;
  }
  res.status(204).end();
});

export default router;