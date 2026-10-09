/**
 * Run against the development database:
 * pnpm --filter @workspace/scripts exec tsx ../artifacts/api-server/tests/website.test.ts
 * Only creates and removes synthetic enquiries. It republishes identical page
 * content to exercise saving without replacing website copy.
 */
import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { test } from "node:test";
import express from "express";
import { db, enquiriesTable, enquiryRateLimitsTable, pool } from "@workspace/db";
import { eq } from "drizzle-orm";
import websitePagesRouter from "../src/routes/website-pages";
import enquiriesRouter from "../src/routes/enquiries";

test("website pages and enquiries persist, validate input and protect private data", async () => {
  const priorAllowlist = process.env.STARBOUND_ADMIN_EMAILS;
  process.env.STARBOUND_ADMIN_EMAILS = "website-test@example.invalid";
  const app = express();
  app.use(express.json());
  // This test-only server replaces authentication; production middleware is untouched.
  app.use((req, _res, next) => {
    const role = req.get("x-test-role");
    req.isAuthenticated = (() => Boolean(role)) as typeof req.isAuthenticated;
    if (role) req.user = { id: "website-test", email: role === "admin" ? "website-test@example.invalid" : "not-admin@example.invalid" };
    next();
  });
  app.use("/api", websitePagesRouter, enquiriesRouter);
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  assert(address && typeof address !== "string");
  const base = `http://127.0.0.1:${address.port}/api`;
  const email = `website-test-${randomUUID()}@example.invalid`;
  const key = createHash("sha256").update("127.0.0.1").digest("hex");
  const request = (path: string, method = "GET", data?: unknown, role?: string, origin?: string) => fetch(`${base}${path}`, {
    method, headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      ...(role ? { "x-test-role": role } : {}),
      ...(origin ? { Origin: origin } : {}),
    }, ...(data ? { body: JSON.stringify(data) } : {}),
  });
  try {
    const response = await request("/website-pages");
    assert.equal(response.status, 200);
    const original = await response.json();
    assert.equal(new Set(original.pages.map((p: { slug: string }) => p.slug)).size, 7);
    const payload = { pages: original.pages };
    assert.equal((await request("/website-pages", "PUT", payload)).status, 401);
    assert.equal((await request("/website-pages", "PUT", payload, "other")).status, 403);
    assert.equal((await request("/website-pages", "PUT", payload, "admin", "https://other.invalid")).status, 403);
    assert.equal((await request("/website-pages", "PUT", payload, "admin", "invalid")).status, 400);
    assert.equal((await request("/website-pages", "PUT", { pages: Array(7).fill(original.pages[0]) }, "admin")).status, 400);
    assert.equal((await request("/website-pages", "PUT", {
      pages: original.pages.map((p: object, i: number) => i === 0 ? { ...p, imagePath: "https://untrusted.invalid/image.png" } : p),
    }, "admin")).status, 400);
    const saved = await request("/website-pages", "PUT", payload, "admin");
    assert.equal(saved.status, 200);
    assert.deepEqual((await saved.json()).pages, original.pages);
    assert.deepEqual((await (await request("/website-pages")).json()).pages, original.pages);
    assert.equal((await request("/admin/enquiries")).status, 401);
    assert.equal((await request("/admin/enquiries", "GET", undefined, "other")).status, 403);
    assert.equal((await request("/admin/enquiries/1", "DELETE")).status, 401);
    const input = { name: "Website Test", email, company: "", message: "Synthetic website enquiry test.", interest: "pricing", privacyConsent: true, website: "" };
    assert.equal((await request("/enquiries", "POST", { ...input, name: "  " })).status, 400);
    assert.equal((await request("/enquiries", "POST", { ...input, email: "invalid" })).status, 400);
    assert.equal((await request("/enquiries", "POST", { ...input, privacyConsent: false })).status, 400);
    assert.equal((await request("/enquiries", "POST", { ...input, website: "bot" })).status, 400);
    assert.equal((await request("/enquiries", "POST", input, undefined, "https://other.invalid")).status, 403);
    await db.delete(enquiryRateLimitsTable).where(eq(enquiryRateLimitsTable.key, key));
    let firstId = 0;
    for (let n = 0; n < 5; n++) {
      const res = await request("/enquiries", "POST", input);
      assert.equal(res.status, 201);
      const receipt = await res.json();
      assert(receipt.id > 0 && receipt.message.includes("received"));
      if (n === 0) firstId = receipt.id;
    }
    const rate = await request("/enquiries", "POST", input);
    assert.equal(rate.status, 429);
    assert.equal(rate.headers.get("retry-after"), "3600");
    const inbox = await request("/admin/enquiries", "GET", undefined, "admin");
    assert.equal(inbox.status, 200);
    assert.equal(inbox.headers.get("cache-control"), "no-store");
    const rows = await inbox.json();
    assert(rows.some((r: { id: number; email: string }) => r.id === firstId && r.email === email));
    assert(!("privacyConsent" in rows[0]));
    assert.equal((await request(`/admin/enquiries/${firstId}`, "DELETE", undefined, "admin")).status, 204);
    assert.equal((await request(`/admin/enquiries/${firstId}`, "DELETE", undefined, "admin")).status, 404);
    assert.equal((await request("/admin/enquiries/invalid", "DELETE", undefined, "admin")).status, 400);
    const after = await (await request("/admin/enquiries", "GET", undefined, "admin")).json();
    assert(!after.some((r: { id: number }) => r.id === firstId));
  } finally {
    await db.delete(enquiriesTable).where(eq(enquiriesTable.email, email));
    await db.delete(enquiryRateLimitsTable).where(eq(enquiryRateLimitsTable.key, key));
    if (priorAllowlist === undefined) delete process.env.STARBOUND_ADMIN_EMAILS;
    else process.env.STARBOUND_ADMIN_EMAILS = priorAllowlist;
    server.close();
    await pool.end();
  }
});