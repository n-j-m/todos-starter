import { todoLists } from "@/db/schema/todo-lists";
import { users } from "@/db/schema/users";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const todos = sqliteTable("todos", {
  id: integer("id").notNull().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  complete: integer("complete", { mode: "boolean" }).notNull().default(false),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),
  listId: integer("list_id")
    .notNull()
    .references(() => todoLists.id),
});

const newTodoSchema = createInsertSchema(todos);
export type NewTodo = z.infer<typeof newTodoSchema>;

const todoSchema = createSelectSchema(todos);
export type Todo = z.infer<typeof todoSchema>;

const updateTodoSchema = newTodoSchema
  .omit({ ownerId: true, listId: true })
  .extend({
    title: z.string().optional(),
    description: z.string().optional(),
    complete: z.boolean({ coerce: true }).optional(),
  });
export type UpdateTodo = z.infer<typeof updateTodoSchema>;
