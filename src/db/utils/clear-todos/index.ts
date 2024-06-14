import { todos } from "@/db/schema/todos";
import { AppDb } from "@/types";

export async function run(db: AppDb) {
  const results = await db.delete(todos).returning();

  console.log(`Deleted ${results.length} todos.`);
}
