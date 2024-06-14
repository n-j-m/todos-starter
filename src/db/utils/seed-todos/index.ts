import { AppDb } from "@/types";
import * as seedLists from "@/db/utils/seed-lists";
import { NewTodo, todos } from "@/db/schema/todos";

const newTodos: NewTodo[] = [
  {
    id: 1,
    title: "Test todo 1",
    description: "Test todo description 1",
    complete: false,
    listId: 0,
    ownerId: "",
  },
  {
    id: 2,
    title: "Test todo 2",
    description: "Test todo description 2",
    complete: false,
    listId: 0,
    ownerId: "",
  },
  {
    id: 3,
    title: "Test todo 3",
    description: "Test todo description 3",
    complete: false,
    listId: 0,
    ownerId: "",
  },
  {
    id: 4,
    title: "Test todo 4",
    description: "Test todo description 4",
    complete: false,
    listId: 0,
    ownerId: "",
  },
  {
    id: 5,
    title: "Test todo 5",
    description: "Test todo description 5",
    complete: false,
    listId: 0,
    ownerId: "",
  },
  {
    id: 6,
    title: "Test todo 6",
    description: "Test todo description 6",
    complete: false,
    listId: 0,
    ownerId: "",
  },
];

export async function run(db: AppDb) {
  await seedLists.run(db);

  const list = await db.query.todoLists.findFirst();

  if (!list) {
    throw new Error("Unable to get a list");
  }

  const owner = await db.query.users.findFirst();

  if (!owner) {
    throw new Error("Unable to get a user");
  }

  const results = await db
    .insert(todos)
    .values(newTodos.map((t) => ({ ...t, listId: list.id, ownerId: owner.id })))
    .returning();

  console.log(
    `Created ${results.length} todos in list '${list.name}' (${list.id}) for user '${owner.email}' (${owner.id})`
  );
}
