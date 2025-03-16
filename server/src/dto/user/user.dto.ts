import { z } from "zod";
import { SecurityDto } from "./userSecurity.dto";

const PersonalDto = z.object({
  userId: z.string(),
  gender: z.string(),
  coverImage: z.string().default(""),
  description: z.string().default(""),
  business: z.boolean().default(false),
  personal: z.boolean().default(true),
  addressIds: z.array(z.string()).default([]),
  profileImage: z.string().default(""),
  paymentOptions: z.array(z.string()).default([]),
});

const SocialDto = z.object({
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
});

export const UserDto = PersonalDto.merge(SocialDto).merge(SecurityDto);
export const UserUpdateDto = UserDto.pick({
  coverImage: true,
  paymentOptions: true,
  description: true,
  addressIds: true,
  allowedToShow: true,
  profileImage: true,
})
  .partial()
  .extend({
    name: z.string(),
  });



export type UserUpdateDtoType = z.infer<typeof UserUpdateDto>;
export type UserDtoType = z.infer<typeof UserDto>;
