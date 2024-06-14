import { todoLists } from "@/db/schema/todo-lists";
import * as clearTodos from "@/db/utils/clear-todos";
import { AppDb } from "@/types";

export async function run(db: AppDb) {
  await clearTodos.run(db);

  const results = await db.delete(todoLists).returning();

  console.log(`Deleted ${results.length} todo lists.`);
}
