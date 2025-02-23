import { z } from "zod";

export const ReviewDto = z.object({
  rate: z.number(),
  description: z.string(),
  title: z
    .enum(["bad", "average", "good", "very good", "excellent"])
    .default("good"),
  buyerId: z.string(),
  sellerId: z.string(),
  itemId: z.string(),
});

export const ReviewAddDto = z.object({
  rate: z.number(),
  description: z.string(),
  title: z
    .enum(["bad", "average", "good", "very good", "excellent"])
    .default("good"),
});

export type ReviewDtoType = z.infer<typeof ReviewDto>;
export type ReviewDtoAddType = z.infer<typeof ReviewAddDto>;
