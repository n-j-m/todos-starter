import { sessions } from "@/db/schema/sessions";
import { users } from "@/db/schema/users";
import { AppDb } from "@/types";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

export function getLucia(db: AppDb) {
  const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

  const lucia = new Lucia(adapter);

  return lucia;
}

declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof getLucia>;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  email: string;
}
