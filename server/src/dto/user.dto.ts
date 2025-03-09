import { z } from "zod";

export const UserDto = z.object({
  // User Authentication
  _id: z.string().optional(),
  userId: z.string().nonempty("User ID is required"),
  name: z.string(),
  email: z.string().email().nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
  mobile: z.string().nonempty("Password is required"),
  role: z.enum(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]).default("USER"),

  // User Personal Information
  gender: z.string(),
  coverImage: z.string().default(""),
  description: z.string().default(""),
  business: z.boolean().default(false),
  personal: z.boolean().default(true),
  addressIds: z.array(z.string()).default([]),
  profileImage: z.string().default(""),
  paymentOptions: z.array(z.string()).default([]),

  // User Status Information
  active: z.boolean().default(false),
  lastSeen: z
    .union([z.date(), z.literal(null)])
    .transform((val) => (val === null ? undefined : val))
    .optional(),
  dateOfJoining: z.date().default(() => new Date()),

  // User Social Information
  numOfPostsInADay: z.number().default(0),
  followers: z.number().default(0),
  following: z.number().default(0),
  rate: z.object({
    avgRating: z.number(),
    rating: z.array(z.number()).default([0, 0, 0, 0, 0]),
    totalReviews: z.number(),
  }),
  allowedToShow: z.array(z.string()).default([]),
  itemsListing: z
    .array(
      z.object({ id: z.string().default(""), name: z.string().default("") })
    )
    .default([]),
  purchaseHistory: z
    .array(
      z.object({ id: z.string().default(""), name: z.string().default("") })
    )
    .default([]),

  // User Security Information
  fcmTokens: z.array(z.string()).default([]),
  twoFactorSecret: z.string().default("").optional(),
  isTwoFactorAuth: z.boolean().default(false).optional(),
  numberLogin: z.number().default(0),
  lastFailedLoginTime: z
    .union([z.date(), z.literal(null)])
    .transform((val) => (val === null ? undefined : val))
    .optional(),
});

export const UserUpdateDto = UserDto.pick({
  name: true,
  mobile: true, // delete user not update mobile
  coverImage: true,
  paymentOptions: true,
  description: true,
  addressIds: true,
  allowedToShow: true,
  profileImage: true,
}).partial();

export type UserUpdateDtoType = z.infer<typeof UserUpdateDto>;
export type UserDtoType = z.infer<typeof UserDto>;
