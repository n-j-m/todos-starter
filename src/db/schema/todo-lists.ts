import { users } from "@/db/schema/users";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const todoLists = sqliteTable("todo_lists", {
  id: integer("id").notNull().primaryKey(),
  name: text("name").notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),
});

const selectSchema = createSelectSchema(todoLists);
const insertSchema = createInsertSchema(todoLists);
const updateSchema = insertSchema.omit({ id: true, ownerId: true });

export type TodoList = z.infer<typeof selectSchema>;
export type NewTodoList = z.infer<typeof insertSchema>;
export type TodoListUpdates = z.infer<typeof updateSchema>;
