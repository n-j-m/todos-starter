import { getDatabaseAndConnection } from "@/db";
import * as seedUsers from "@/db/utils/seed-users";

async function run() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error("No database url");
  }
  const { connection, db } = getDatabaseAndConnection(DATABASE_URL);

  await seedUsers.run(db);

  connection.close();
}

run();
