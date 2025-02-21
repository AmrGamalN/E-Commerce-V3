import { z } from "zod";

export const baseUserSchema = z.object({
  name: z.string().nullable(),
  email: z.string().email().nonempty("Email is required"),
  mobile: z.string().nullable(),
  gender: z.string().nullable(),
  role: z.enum(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]).default("USER"),
  coverImage: z.string().default(""),
  lastSeen: z.date(),//.default(new Date()),
  description: z.string().default(""),
  business: z.boolean().default(false),
  personal: z.boolean().default(true),
  active: z.boolean().default(true),
  numOfPostsInADay: z.number().default(0),
  followers: z.number().default(0),
  following: z.number().default(0),
  avgRating: z.number().default(0),
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
});

// Add in mongoDb
export const UserDto = baseUserSchema.extend({
  userId: z.string().nonempty("User ID is required"),
  dateOfJoining: z.date().default(new Date()),
});

export type UserDtoType = z.infer<typeof UserDto>;
