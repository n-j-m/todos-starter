import { authorize } from "@/auth/authorize";
import { AppEnv } from "@/types";
import { Hono } from "hono";

export const protectedRoute = new Hono<AppEnv>().get("/", authorize, (c) => {
  return c.json({
    user: c.var.user,
    sessionId: c.var.sessionId,
  });
});
