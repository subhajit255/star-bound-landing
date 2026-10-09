import type { Request, Response, NextFunction } from "express";

export function adminAccess(req: Request): { allowed: boolean; message?: string } {
  const emails = (process.env.STARBOUND_ADMIN_EMAILS ?? "")
    .split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  if (!emails.length) {
    return { allowed: false, message: "The website is ready. Configure STARBOUND_ADMIN_EMAILS with your administrator email to enable editing." };
  }
  if (!req.isAuthenticated()) {
    return { allowed: false, message: "Log in with your approved administrator account to edit the website." };
  }
  const allowed = !!req.user?.email && emails.includes(req.user.email.toLowerCase());
  return { allowed, ...(!allowed ? { message: "This account does not have website administrator access. Use your approved administrator account." } : {}) };
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const access = adminAccess(req);
  if (!access.allowed) {
    res.status(req.isAuthenticated() ? 403 : 401).json({ error: access.message });
    return;
  }
  const origin = req.get("origin");
  const host = req.get("x-forwarded-host") ?? req.get("host");
  if (origin) {
    try {
      if (new URL(origin).host !== host) {
        res.status(403).json({ error: "Cross-origin changes are not allowed." });
        return;
      }
    } catch {
      res.status(400).json({ error: "Invalid request origin." });
      return;
    }
  }
  next();
}