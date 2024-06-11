import { loginRoute } from "@/routes/login";
import { protectedRoute } from "@/routes/protected";
import { signupRoute } from "@/routes/signup";
import { AppEnv } from "@/types";
import { Hono } from "hono";

const app = new Hono<AppEnv>();

const api = app
  .basePath("/api")
  .route("/signup", signupRoute)
  .route("/login", loginRoute)
  .route("/protected", protectedRoute);

export default app;

export type Api = typeof api;
