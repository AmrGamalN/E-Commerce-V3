import { z } from "zod";
import { baseUserSchema } from "./user.dto";

export const RegisterDto = baseUserSchema.extend({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),
});

export type RegisterDtoType = z.infer<typeof RegisterDto>;
