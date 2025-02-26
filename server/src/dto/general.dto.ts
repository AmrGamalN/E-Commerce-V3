import { z } from "zod";

export const MongoIdDto = z.object({
    id: z
      .string()
      .trim()
      .length(24)
      .regex(/^[a-fA-F0-9]{24}$/)
      .nonempty("ID IS REQUIRED"),
  });