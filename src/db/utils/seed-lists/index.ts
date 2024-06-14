import { AppDb } from "@/types";
import * as seedUsers from "@/db/utils/seed-users";
import { NewTodoList, todoLists } from "@/db/schema/todo-lists";

const listsData: NewTodoList[] = [
  { id: 1, name: "Test 1", ownerId: "" },
  { id: 2, name: "Test 2", ownerId: "" },
  { id: 3, name: "Test 3", ownerId: "" },
  { id: 4, name: "Test 4", ownerId: "" },
  { id: 5, name: "Test 5", ownerId: "" },
];

export async function run(db: AppDb) {
  await seedUsers.run(db);

  const user = await db.query.users.findFirst();

  if (!user) {
    throw new Error("No users found");
  }

  const results = await db
    .insert(todoLists)
    .values(listsData.map((l) => ({ ...l, ownerId: user.id })))
    .returning();

  console.log(`Created ${results.length} lists`);
}
