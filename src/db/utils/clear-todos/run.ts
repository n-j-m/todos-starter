import * as clearTodos from "@/db/utils/clear-todos";
import { getDatabaseAndConnection } from "@/db";

async function run() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error("No database url");
  }
  const { connection, db } = getDatabaseAndConnection(DATABASE_URL);

  await clearTodos.run(db);

  connection.close();
}

run();
