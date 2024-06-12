import { getLucia } from "@/auth/adapter";
import { getDb } from "@/db";
import { AuthedAppEnv } from "@/types";
import { UnauthorizedException } from "@/utils/problems";
import { env } from "hono/adapter";
import { createFactory } from "hono/factory";
import { jwt, verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";

const factory = createFactory<AuthedAppEnv>();

const secret = process.env.AUTH_SECRET;
if (!secret) {
  throw new Error("No auth secret configured");
}

export const authorize = factory.createMiddleware(async (c, next) => {
  const authHeader = c.req.header("authorization");
  if (!authHeader) {
    throw new UnauthorizedException();
  }

  const { AUTH_SECRET, DATABASE_URL } = env(c);

  const db = getDb(DATABASE_URL);
  const lucia = getLucia(db);

  const token = lucia.readBearerToken(authHeader);
  if (!token) {
    throw new UnauthorizedException();
  }

  let payload: JWTPayload | null | undefined;
  try {
    payload = await verify(token, AUTH_SECRET, "HS256");
  } catch (e) {
    throw new UnauthorizedException();
  }

  const sessionId = payload?.["session"] as string | undefined;
  if (!sessionId) {
    throw new UnauthorizedException();
  }

  const { user, session } = await lucia.validateSession(sessionId);

  if (!session) {
    throw new UnauthorizedException();
  }

  c.set("user", user);
  c.set("sessionId", session.id);

  return await next();
});
