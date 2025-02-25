import { z } from "zod";

const uuidSchema = z.string().uuid();

export default function validateUuid(uuid: string) {
  const validation = uuidSchema.safeParse(uuid);

  return validation.success;
}
