import { NewUser, users } from "@/db/schema/users";
import { AppDb } from "@/types";
import { eq } from "drizzle-orm";

export async function getUserByEmail(db: AppDb, email: string) {
  const results = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  return results || null;
}

export async function createUser(db: AppDb, newUser: NewUser) {
  const results = await db.insert(users).values(newUser).returning();

  return results[0] || null;
}
