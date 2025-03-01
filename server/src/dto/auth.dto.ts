import { z } from "zod";

export const RegisterDto = z.object({
  name: z.string().nonempty("name is required"),
  mobile: z.string(),
  gender: z.string(),
  business: z.boolean().default(false),
  personal: z.boolean().default(true),
  coverImage: z.string().default(""),
  paymentOptions: z
    .array(z.string().nonempty("payment is required"))
    .default([]),
  description: z.string().optional().default(""),
  addressIds: z.array(z.string().nonempty()).default([]),
  allowedToShow: z.array(z.string()).default([]),
  profileImage: z.string().default(""),
});

export const LoginDto = z
  .object({
    email: z.string().email().nonempty("Email is required").optional(),
    mobile: z
      .string()
      .nonempty("Phone is required")
      .regex(/^\+?[1-9]\d{6,14}$/, "PLEASE ENTER A VALID MOBILE NUMBER")
      .optional(),
    password: z.string(),
  })
  .refine((data) => data.email || data.mobile, {
    message: "EITHER EMAIL OR MOBILE IS REQUIRED",
    path: ["email", "mobile"],
  });

export type RegisterDtoType = z.infer<typeof RegisterDto>;
