import { sessions } from "@/db/schema/sessions";
import { users } from "@/db/schema/users";
import { todoLists } from "@/db/schema/todo-lists";
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Context } from "hono";
import { env } from "hono/adapter";
import { AppEnv } from "@/types";
import { todos } from "@/db/schema/todos";

export function getDatabaseAndConnection(url: string) {
  const connection = new Database(url);

  connection.exec("PRAGMA journal_mode = WAL;");

  const db = drizzle(connection, {
    schema: { users, sessions, todoLists, todos },
  });

  return { connection, db };
}

export function getDb(url: string) {
  const { db } = getDatabaseAndConnection(url);

  return db;
}

export function getDbFromContext<E extends AppEnv>(c: Context<E>) {
  const { DATABASE_URL } = env(c);
  return getDb(DATABASE_URL);
}
