import { defineConfig } from "drizzle-kit";

const url = process.env["DATABASE_URL"];
if (!url) {
  throw new Error("No database url");
}

export default defineConfig({
  schema: "./src/db/schema/*",
  dialect: "sqlite",
  out: "./src/db/drizzle",
  dbCredentials: {
    url,
  },
});
