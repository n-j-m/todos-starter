import { getDatabaseAndConnection } from "@/db";
import { sessions } from "@/db/schema/sessions";
import { AppDb } from "@/types";

export async function run(db: AppDb) {
  const results = await db.delete(sessions).returning();

  console.log(`Deleted ${results.length} sessions`);
}
