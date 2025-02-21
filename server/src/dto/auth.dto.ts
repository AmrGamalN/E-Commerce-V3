import { z } from "zod";

export const RegisterDto = z.object({
  name: z.string(),
  mobile: z.string(),
  gender: z.string(),
  business: z.boolean().default(false),
  personal: z.boolean().default(true),
  coverImage: z.string().default(""),
  paymentOptions: z.array(z.string().nonempty()).default([]),
  description: z.string().optional().default(""),
  addressIds: z.array(z.string().nonempty()).default([]),
  allowedToShow: z.array(z.string()).default([]),
  profileImage: z.string().default(""),
});

export type RegisterDtoType = z.infer<typeof RegisterDto>;
