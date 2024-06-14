import { authorize } from "@/auth/authorize";
import { getDbFromContext } from "@/db";
import {
  createTodo,
  deleteTodo,
  getTodo,
  getTodos,
  updateTodo,
} from "@/db/services/todo";
import { AuthedAppEnv } from "@/types";
import { getParamNumber } from "@/utils/params";
import { InternalServerException, NotFoundException } from "@/utils/problems";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const newTodoRequestSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  complete: z.boolean({ coerce: true }).optional(),
});
const validateNewTodoRequest = zValidator("json", newTodoRequestSchema);

const updateTodoRequestSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    complete: z.boolean({ coerce: true }).optional(),
  })
  .superRefine((schema, ctx) => {
    if (Object.keys(schema).length === 0) {
      ctx.addIssue({
        message: "No updates sent",
        code: "custom",
      });
    }
  });
const validateUpdateTodoRequest = zValidator("json", updateTodoRequestSchema);

export const todoRoutes = new Hono<AuthedAppEnv>()
  .post("/", authorize, validateNewTodoRequest, async (c) => {
    const db = getDbFromContext(c);

    const newTodoRequest = c.req.valid("json");
    const owner = c.get("user");
    const listId = getParamNumber(c, "listId");

    const created = await createTodo(db, {
      ...newTodoRequest,
      ownerId: owner.id,
      listId,
    });

    if (!created) {
      throw new InternalServerException("Unable to create todo item");
    }

    return c.json({ created }, 201);
  })
  .get("/", authorize, async (c) => {
    const db = getDbFromContext(c);
    const owner = c.get("user");
    const listId = getParamNumber(c, "listId");

    const todos = await getTodos(db, owner.id, listId);

    return c.json({ todos });
  })
  .get("/:id{[0-9]+}", authorize, async (c) => {
    const db = getDbFromContext(c);
    const owner = c.get("user");
    const listId = getParamNumber(c, "listId");

    const id = getParamNumber(c, "id");

    const todo = await getTodo(db, owner.id, listId, id);

    if (!todo) {
      throw new NotFoundException();
    }

    return c.json({ todo });
  })
  .put("/:id{[0-9]+}", authorize, validateUpdateTodoRequest, async (c) => {
    const db = getDbFromContext(c);
    const owner = c.get("user");
    const listId = getParamNumber(c, "listId");

    const id = getParamNumber(c, "id");

    const updateTodoRequest = c.req.valid("json");

    const updated = await updateTodo(
      db,
      owner.id,
      listId,
      id,
      updateTodoRequest
    );

    if (!updated) {
      throw new NotFoundException();
    }

    return c.json({ updated });
  })
  .delete("/:id{[0-9]+}", authorize, async (c) => {
    const db = getDbFromContext(c);
    const owner = c.get("user");
    const listId = getParamNumber(c, "listId");

    const id = getParamNumber(c, "id");

    const deleted = await deleteTodo(db, owner.id, listId, id);

    if (!deleted) {
      throw new NotFoundException();
    }

    return c.json({ deleted });
  });
