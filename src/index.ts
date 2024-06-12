import { loginRoute } from "@/routes/login";
import { protectedRoute } from "@/routes/protected";
import { signupRoute } from "@/routes/signup";
import { todoListRoutes } from "@/routes/todo-lists";
import { AppEnv } from "@/types";
import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono<AppEnv>();

app.use(logger());

const api = app
  .basePath("/api")
  .route("/signup", signupRoute)
  .route("/login", loginRoute)
  .route("/protected", protectedRoute)
  .route("/lists", todoListRoutes);

export default app;

export type Api = typeof api;
