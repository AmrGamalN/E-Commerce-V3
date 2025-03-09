import { z } from "zod";

export const FollowDto = z.object({
  followerId: z.string(),
  followingId: z.string(),
  followingName: z.string(),
});

export const FollowAddDto = FollowDto.pick({
  followingId: true,
});

export type FollowDtoType = z.infer<typeof FollowDto>;
export type FollowAddDtoType = z.infer<typeof FollowAddDto>;
