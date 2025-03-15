import { z } from "zod";

export const ReviewDto = z.object({
  rate: z.number(),
  description: z.string(),
  buyerName: z.string(),
  title: z
    .enum(["bad", "average", "good", "veryGood", "excellent"])
    .default("good"),
  buyerId: z.string(),
  sellerId: z.string(),
  itemId: z.string(),
});

export const ReviewAddDto = ReviewDto.pick({
  rate: true,
  description: true,
  title: true,
});

export type ReviewDtoType = z.infer<typeof ReviewDto>;
export type ReviewDtoAddType = z.infer<typeof ReviewAddDto>;
