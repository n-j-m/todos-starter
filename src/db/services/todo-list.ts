import {
  NewTodoList,
  TodoList,
  TodoListUpdates,
  todoLists,
} from "@/db/schema/todo-lists";
import { AppDb } from "@/types";
import { and, eq } from "drizzle-orm";

export async function createTodoList(
  db: AppDb,
  newTodoList: NewTodoList
): Promise<TodoList | undefined> {
  const results = await db.insert(todoLists).values(newTodoList).returning();

  return results[0] || undefined;
}

export async function getTodoListsForOwner(
  db: AppDb,
  ownerId: string
): Promise<TodoList[]> {
  const lists = await db.query.todoLists.findMany({
    where: eq(todoLists.ownerId, ownerId),
  });

  return lists;
}

export async function getTodoList(
  db: AppDb,
  ownerId: string,
  listId: number
): Promise<TodoList | undefined> {
  const list = await db.query.todoLists.findFirst({
    where: and(eq(todoLists.ownerId, ownerId), eq(todoLists.id, listId)),
  });

  return list;
}

export async function updateTodoList(
  db: AppDb,
  ownerId: string,
  listId: number,
  listUpdates: TodoListUpdates
): Promise<TodoList | undefined> {
  const results = await db
    .update(todoLists)
    .set(listUpdates)
    .where(and(eq(todoLists.ownerId, ownerId), eq(todoLists.id, listId)))
    .returning();

  return results[0] || undefined;
}

export async function deleteTodoList(
  db: AppDb,
  ownerId: string,
  listId: number
): Promise<TodoList | undefined> {
  const results = await db
    .delete(todoLists)
    .where(and(eq(todoLists.ownerId, ownerId), eq(todoLists.id, listId)))
    .returning();

  return results[0] || undefined;
}
