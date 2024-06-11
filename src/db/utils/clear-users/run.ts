import { getDatabaseAndConnection } from "@/db";
import * as clearUsers from "@/db/utils/clear-users";

async function run() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error("No database url");
  }
  const { connection, db } = getDatabaseAndConnection(DATABASE_URL);

  await clearUsers.run(db);

  connection.close();
}

run();
