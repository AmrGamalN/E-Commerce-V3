import { z } from "zod";

export const UserDto = z.object({
  _id: z.string().optional(),
  userId: z.string().nonempty("User ID is required"),
  name: z.string(),
  email: z.string().email().nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
  mobile: z.string().nonempty("Password is required"),
  gender: z.string(),
  role: z.enum(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]).default("USER"),
  coverImage: z.string().default(""),
  lastSeen: z.date().default(new Date()),
  description: z.string().default(""),
  business: z.boolean().default(false),
  personal: z.boolean().default(true),
  active: z.boolean().default(true),
  numOfPostsInADay: z.number().default(0),
  followers: z.number().default(0),
  following: z.number().default(0),
  rate: z.object({
    avgRating: z.number(),
    rating: z.array(z.number()).default([0, 0, 0, 0, 0]),
    totalReviews: z.number(),
  }),
  paymentOptions: z.array(z.string()).default([]),
  addressIds: z.array(z.string()).default([]),
  allowedToShow: z.array(z.string()).default([]),
  profileImage: z.string().default(""),
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
  dateOfJoining: z.date().default(new Date()),
  fcmTokens: z.array(z.string()).default([]),
  twoFactorSecret: z.string().default("").optional(),
  isTwoFactorAuth: z.boolean().default(false).optional(),
  numberLogin: z.number().default(0),
  lastFailedLoginTime: z.date(),
});

export const UserUpdateDto = z.object({
  name: z.string().optional(),
  mobile: z.string().optional(),
  coverImage: z.string().default("").optional(),
  paymentOptions: z.array(z.string()).default([]).optional(),
  description: z.string().optional().default(""),
  addressIds: z.array(z.string()).default([]).optional(),
  allowedToShow: z.array(z.string()).default([]).optional(),
  profileImage: z.string().default("").optional(),
});

export type UserUpdateDtoType = z.infer<typeof UserUpdateDto>;
export type UserDtoType = z.infer<typeof UserDto>;
