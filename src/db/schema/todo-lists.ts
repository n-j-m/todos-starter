import { users } from "@/db/schema/users";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todoLists = sqliteTable("todo_lists", {
  id: integer("id").notNull().primaryKey(),
  name: text("name").notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),
});

export type TodoList = typeof todoLists.$inferSelect;
export type NewTodoList = typeof todoLists.$inferInsert;
