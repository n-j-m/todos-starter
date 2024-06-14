import { users } from "@/db/schema/users";
import * as clearSessions from "@/db/utils/clear-sessions";
import * as clearLists from "@/db/utils/clear-lists";
import { AppDb } from "@/types";

export async function run(db: AppDb) {
  await clearSessions.run(db);

  await clearLists.run(db);

  const results = await db.delete(users).returning();

  console.log(`Deleted ${results.length} users`);
}
