import { getLucia } from "@/auth/adapter";
import { getDb } from "@/db";
import { createUser, getUserByEmail } from "@/db/services/user";
import { AppEnv } from "@/types";
import { BadRequestException, InternalServerException } from "@/utils/problems";
import { hash } from "@/utils/pwd";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { sign } from "hono/jwt";
import { generateIdFromEntropySize } from "lucia";
import { z } from "zod";

const signupRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const validateSignupRequest = zValidator("json", signupRequestSchema);

export const signupRoute = new Hono<AppEnv>().post(
  "/",
  validateSignupRequest,
  async (c) => {
    const { AUTH_SECRET, DATABASE_URL } = env(c);
    const db = getDb(DATABASE_URL);
    const lucia = getLucia(db);

    const { email, password } = c.req.valid("json");

    const existing = await getUserByEmail(db, email);

    if (existing) {
      throw new BadRequestException("User with that email already exists.");
    }

    // Hash password
    const hashed = await hash(password);

    const id = generateIdFromEntropySize(10);
    const created = await createUser(db, { id, email, password: hashed });

    if (!created) {
      throw new InternalServerException("Unable to create user");
    }

    const session = await lucia.createSession(id, {});

    const token = await sign(
      { sub: created.id, session: session.id },
      AUTH_SECRET,
      "HS256"
    );

    return c.json({ access_token: token }, 201);
  }
);
