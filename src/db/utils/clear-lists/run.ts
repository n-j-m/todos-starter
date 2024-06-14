import * as clearTodoLists from "@/db/utils/clear-lists";
import { getDatabaseAndConnection } from "@/db";

async function run() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error("No database url");
  }
  const { connection, db } = getDatabaseAndConnection(DATABASE_URL);

  await clearTodoLists.run(db);

  connection.close();
}

run();
