import { getDatabaseAndConnection } from "@/db";
import * as seedLists from "@/db/utils/seed-lists";

async function run() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error("No database url");
  }
  const { connection, db } = getDatabaseAndConnection(DATABASE_URL);

  await seedLists.run(db);

  connection.close();
}

run();
