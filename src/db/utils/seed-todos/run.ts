import { getDatabaseAndConnection } from "@/db";
import * as seedTodos from "@/db/utils/seed-todos";

async function run() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error("No database url");
  }
  const { connection, db } = getDatabaseAndConnection(DATABASE_URL);

  await seedTodos.run(db);

  connection.close();
}

run();
