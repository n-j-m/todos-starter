import { getDatabaseAndConnection } from "@/db";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("No database url");
}

const { connection, db } = getDatabaseAndConnection(DATABASE_URL);

migrate(db, { migrationsFolder: "./src/db/drizzle" });
connection.close();
