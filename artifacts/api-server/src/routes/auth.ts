import { Router, type IRouter, type Request, type Response } from "express";
import * as oidc from "openid-client";
import { db, usersTable } from "@workspace/db";
import { GetCurrentAuthUserResponse } from "@workspace/api-zod";
import { clearSession, createSession, getOidcConfig, getSessionId, SESSION_COOKIE, SESSION_TTL, type SessionData } from "../lib/auth";

const router: IRouter = Router();
const cookieOptions = { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/", maxAge: 600_000 };
function origin(req: Request): string {
  const proto = req.get("x-forwarded-proto") ?? "https";
  const host = req.get("x-forwarded-host") ?? req.get("host");
  return `${proto}://${host}`;
}
function returnPath(value: unknown): string {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.includes("\\") ? value : "/admin";
}

router.get("/auth/user", (req, res) => {
  res.json(GetCurrentAuthUserResponse.parse({ user: req.isAuthenticated() ? req.user : null }));
});

router.get("/login", async (req, res): Promise<void> => {
  const config = await getOidcConfig();
  const verifier = oidc.randomPKCECodeVerifier();
  const state = oidc.randomState();
  const nonce = oidc.randomNonce();
  const url = oidc.buildAuthorizationUrl(config, {
    redirect_uri: `${origin(req)}/api/callback`,
    scope: "openid email profile offline_access",
    code_challenge: await oidc.calculatePKCECodeChallenge(verifier),
    code_challenge_method: "S256",
    state, nonce,
  });
  for (const [name, value] of Object.entries({
    code_verifier: verifier, state, nonce, return_to: returnPath(req.query.returnTo),
  })) res.cookie(name, value, cookieOptions);
  res.redirect(url.href);
});

router.get("/callback", async (req, res): Promise<void> => {
  const verifier = req.cookies?.code_verifier;
  const state = req.cookies?.state;
  const nonce = req.cookies?.nonce;
  const target = returnPath(req.cookies?.return_to);
  for (const name of ["code_verifier", "state", "nonce", "return_to"]) res.clearCookie(name, { path: "/" });
  if (!verifier || !state || !nonce) {
    res.status(400).send("Your sign-in request expired. Return to /admin and log in again.");
    return;
  }
  try {
    const tokens = await oidc.authorizationCodeGrant(
      await getOidcConfig(),
      new URL(req.originalUrl, origin(req)),
      { pkceCodeVerifier: verifier, expectedState: state, expectedNonce: nonce, idTokenExpected: true },
    );
    const claims = tokens.claims();
    if (!claims?.sub) throw new Error("Missing verified identity");
    const user = {
      id: claims.sub,
      email: typeof claims.email === "string" ? claims.email : null,
      firstName: typeof claims.first_name === "string" ? claims.first_name : null,
      lastName: typeof claims.last_name === "string" ? claims.last_name : null,
      profileImageUrl: typeof claims.profile_image_url === "string" ? claims.profile_image_url : null,
    };
    await db.insert(usersTable).values(user).onConflictDoUpdate({
      target: usersTable.id, set: { ...user, updatedAt: new Date() },
    });
    const data: SessionData = {
      user, access_token: tokens.access_token, refresh_token: tokens.refresh_token,
      expires_at: tokens.expiresIn() ? Math.floor(Date.now() / 1000) + tokens.expiresIn()! : claims.exp,
    };
    res.cookie(SESSION_COOKIE, await createSession(data), { ...cookieOptions, maxAge: SESSION_TTL });
    res.redirect(target);
  } catch {
    req.log.warn("Identity provider sign-in failed");
    res.status(401).send("Sign-in could not be completed. Return to /admin and try again.");
  }
});

router.get("/logout", async (req, res): Promise<void> => {
  await clearSession(res, getSessionId(req));
  const url = oidc.buildEndSessionUrl(await getOidcConfig(), {
    client_id: process.env.REPL_ID!,
    post_logout_redirect_uri: new URL(returnPath(req.query.returnTo), origin(req)).href,
  });
  res.redirect(url.href);
});

export default router;