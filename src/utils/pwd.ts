// Bun implementation

export async function hash(value: string) {
  return await Bun.password.hash(value, "argon2d");
}

export async function verify(value: string, hashedValue: string) {
  return await Bun.password.verify(value, hashedValue, "argon2d");
}
