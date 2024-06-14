import { NewTodo, UpdateTodo, todos } from "@/db/schema/todos";
import { AppDb } from "@/types";
import { and, eq } from "drizzle-orm";

export async function createTodo(db: AppDb, newTodo: NewTodo) {
  const results = await db.insert(todos).values(newTodo).returning();

  return results[0] || undefined;
}

export async function getTodos(db: AppDb, ownerId: string, listId: number) {
  const results = await db.query.todos.findMany({
    where: and(eq(todos.ownerId, ownerId), eq(todos.listId, listId)),
  });

  return results;
}

export async function getTodo(
  db: AppDb,
  ownerId: string,
  listId: number,
  id: number
) {
  const result = await db.query.todos.findFirst({
    where: and(
      eq(todos.ownerId, ownerId),
      eq(todos.listId, listId),
      eq(todos.id, id)
    ),
  });

  return result;
}

export async function updateTodo(
  db: AppDb,
  ownerId: string,
  listId: number,
  id: number,
  todoUpdates: UpdateTodo
) {
  const result = await db
    .update(todos)
    .set(todoUpdates)
    .where(
      and(
        eq(todos.ownerId, ownerId),
        eq(todos.listId, listId),
        eq(todos.id, id)
      )
    )
    .returning();

  return result[0] || undefined;
}

export async function deleteTodo(
  db: AppDb,
  ownerId: string,
  listId: number,
  id: number
) {
  const result = await db
    .delete(todos)
    .where(
      and(
        eq(todos.ownerId, ownerId),
        eq(todos.listId, listId),
        eq(todos.id, id)
      )
    )
    .returning();

  return result[0] || undefined;
}
