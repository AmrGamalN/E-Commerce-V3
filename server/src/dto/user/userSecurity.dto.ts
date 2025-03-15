import { z } from "zod";

export const SecurityDto = z.object({
  userId: z.string(),
  name: z.string(),
  email: z.string().trim().email("PLEASE ENTER A VALID EMAIL"),
  mobile: z.union([z.string(), z.literal(null)]).optional(),
  password: z.string(),
  role: z.enum(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]).default("USER"),
  fcmTokens: z.array(z.string()).default([]),
  twoFactorSecret: z.string().optional(),
  isTwoFactorAuth: z.boolean().default(false),
  numberLogin: z.number().default(0),
  confirmAccount: z.boolean().default(false),
  lastFailedLoginTime: z
    .union([z.date(), z.literal(null)])
    .nullable()
    .optional(),
  active: z.boolean().default(false),
  lastSeen: z
    .union([z.date(), z.literal(null)])
    .nullable()
    .optional(),
  dateOfJoining: z.date().default(() => new Date()),
  signWith: z.enum(["phone", "email"]),
});

export type UserSecurityDtoType = z.infer<typeof SecurityDto>;
