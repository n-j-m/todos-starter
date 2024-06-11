import { sessions } from "@/db/schema/sessions";
import { users } from "@/db/schema/users";
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

export function getDatabaseAndConnection(url: string) {
  const connection = new Database(url);

  connection.exec("PRAGMA journal_mode = WAL;");

  const db = drizzle(connection, { schema: { users, sessions } });

  return { connection, db };
}

export function getDb(url: string) {
  const { db } = getDatabaseAndConnection(url);

  return db;
}
