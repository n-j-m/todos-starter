import { getDb } from "@/db";
import { User } from "lucia";

export type AppDb = ReturnType<typeof getDb>;

export type AppEnvironmentVars = {
  DATABASE_URL: string;
  AUTH_SECRET: string;
};

export type AppEnv = {
  Bindings: AppEnvironmentVars;
};

export type AuthedAppVars = { user: User; sessionId: string };

export type AuthedAppEnv = AppEnv & {
  Bindings: AppEnvironmentVars;
  Variables: AuthedAppVars;
};
