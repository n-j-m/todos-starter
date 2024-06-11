import { getDatabaseAndConnection } from "@/db";
import * as clearSessions from "@/db/utils/clear-sessions";

async function run() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error("No database url");
  }
  const { connection, db } = getDatabaseAndConnection(DATABASE_URL);

  await clearSessions.run(db);

  connection.close();
}

run();
