import { getLucia } from "@/auth/adapter";
import { getDb } from "@/db";
import { AuthedAppContext } from "@/types";
import { UnauthorizedException } from "@/utils/problems";
import { env } from "hono/adapter";
import { createFactory } from "hono/factory";
import { verify } from "hono/jwt";

const factory = createFactory<AuthedAppContext>();

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

  const payload = await verify(token, AUTH_SECRET, "HS256");
  const sessionId = payload["session"] as string;
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
