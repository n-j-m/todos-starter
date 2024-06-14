import { authorize } from "@/auth/authorize";
import { getDb } from "@/db";
import {
  createTodoList,
  deleteTodoList,
  getTodoList,
  getTodoListsForOwner,
  updateTodoList,
} from "@/db/services/todo-list";
import { AppEnv, AuthedAppEnv } from "@/types";
import { InternalServerException, NotFoundException } from "@/utils/problems";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { z } from "zod";

const newTodoListRequestSchema = z.object({
  name: z.string(),
});
const validateNewTodoListRequest = zValidator("json", newTodoListRequestSchema);

const todoListUpdateRequestSchema = z.object({
  name: z.string(),
});
const validateTodoListUpdateRequest = zValidator(
  "json",
  todoListUpdateRequestSchema
);

export const todoListRoutes = new Hono<AuthedAppEnv>()
  .post("/", authorize, validateNewTodoListRequest, async (c) => {
    const { DATABASE_URL } = env(c);
    const db = getDb(DATABASE_URL);

    const newTodoListRequest = c.req.valid("json");

    const owner = c.get("user");

    const created = await createTodoList(db, {
      ...newTodoListRequest,
      ownerId: owner.id,
    });

    if (!created) {
      throw new InternalServerException("Unable to create todo list");
    }

    return c.json(created, 201);
  })
  .get("/", authorize, async (c) => {
    const { DATABASE_URL } = env(c);
    const db = getDb(DATABASE_URL);

    const owner = c.get("user");

    const lists = await getTodoListsForOwner(db, owner.id);

    return c.json({ lists });
  })
  .get("/:id{[0-9]+}", authorize, async (c) => {
    const { DATABASE_URL } = env(c);
    const db = getDb(DATABASE_URL);

    const owner = c.get("user");
    const id = Number(c.req.param("id"));
    if (!id) {
      throw new InternalServerException(
        "Unable to get numeric id from request"
      );
    }

    const list = await getTodoList(db, owner.id, id);

    return c.json({ list });
  })
  .put("/:id{[0-9]+}", authorize, validateTodoListUpdateRequest, async (c) => {
    const { DATABASE_URL } = env(c);
    const db = getDb(DATABASE_URL);

    const owner = c.get("user");
    const id = Number(c.req.param("id"));
    if (!id) {
      throw new InternalServerException(
        "Unable to get numeric id from request"
      );
    }

    const todoListUpdateRequest = c.req.valid("json");

    const updated = await updateTodoList(
      db,
      owner.id,
      id,
      todoListUpdateRequest
    );

    if (!updated) {
      throw new NotFoundException();
    }

    return c.json({ updated });
  })
  .delete("/:id{[0-9]}", authorize, async (c) => {
    const { DATABASE_URL } = env(c);
    const db = getDb(DATABASE_URL);

    const owner = c.get("user");
    const id = Number(c.req.param("id"));
    if (!id) {
      throw new InternalServerException(
        "Unable to get numeric id from request"
      );
    }

    const deleted = await deleteTodoList(db, owner.id, id);

    if (!deleted) {
      throw new NotFoundException();
    }

    return c.json({ deleted });
  });
