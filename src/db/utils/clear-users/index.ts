import { users } from "@/db/schema/users";
import * as clearSessions from "@/db/utils/clear-sessions";
import { AppDb } from "@/types";

export async function run(db: AppDb) {
  await clearSessions.run(db);

  const results = await db.delete(users).returning();

  console.log(`Deleted ${results.length} users`);
}
