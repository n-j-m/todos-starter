import { getLucia } from "@/auth/adapter";
import { getDb } from "@/db";
import { getUserByEmail } from "@/db/services/user";
import { AppEnv } from "@/types";
import { UnauthorizedException } from "@/utils/problems";
import { verify } from "@/utils/pwd";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { sign } from "hono/jwt";
import { z } from "zod";

const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const validateLoginRequest = zValidator("json", loginRequestSchema);

export const loginRoute = new Hono<AppEnv>().post(
  "/",
  validateLoginRequest,
  async (c) => {
    const { AUTH_SECRET, DATABASE_URL } = env(c);
    const db = getDb(DATABASE_URL);
    const lucia = getLucia(db);

    const { email, password } = c.req.valid("json");

    const user = await getUserByEmail(db, email);

    if (!user || !(await verify(password, user.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const session = await lucia.createSession(user.id, {});

    const token = await sign(
      { sub: user.id, session: session.id },
      AUTH_SECRET,
      "HS256"
    );

    return c.json({ access_token: token });
  }
);
