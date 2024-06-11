import { AppDb } from "@/types";
import * as clearSessions from "@/db/utils/clear-sessions";
import * as clearUsers from "@/db/utils/clear-users";
import { NewUser, users } from "@/db/schema/users";
import { generateIdFromEntropySize } from "lucia";
import { hash } from "@/utils/pwd";

const userData: NewUser[] = [
  {
    id: generateIdFromEntropySize(10),
    email: "test1@example.com",
    password: "",
  },
  {
    id: generateIdFromEntropySize(10),
    email: "test2@example.com",
    password: "",
  },
  {
    id: generateIdFromEntropySize(10),
    email: "test3@example.com",
    password: "",
  },
  {
    id: generateIdFromEntropySize(10),
    email: "test4@example.com",
    password: "",
  },
  {
    id: generateIdFromEntropySize(10),
    email: "test5@example.com",
    password: "",
  },
];

export async function run(db: AppDb) {
  await clearSessions.run(db);

  await clearUsers.run(db);

  const pwd = await hash("Tester.11");

  const results = await db
    .insert(users)
    .values(userData.map((u) => ({ ...u, password: pwd })))
    .returning();

  console.log(`Created ${results.length} users`);
}
