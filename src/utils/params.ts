import { AppEnv } from "@/types";
import { InternalServerException } from "@/utils/problems";
import { Context } from "hono";

export function getParam<E extends AppEnv, P extends string, R>(
  c: Context<E, P>,
  name: P,
  map: (x: string | undefined) => R
): R {
  const p = c.req.param(name);
  const val = map(p);

  if (!val) {
    throw new InternalServerException(`Unable to get parameter ${name}`);
  }

  return val;
}

export function getParamNumber<E extends AppEnv, P extends string>(
  c: Context<E, P>,
  name: P
): number {
  return getParam(c, name, Number);
}
