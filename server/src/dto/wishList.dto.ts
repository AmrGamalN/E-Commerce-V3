import { z } from "zod";

export const WishListDto = z.object({
  userId: z.string(),
  items: z
    .array(
      z.object({
        itemId: z.string(),
        addedAt: z.date(),
      })
    )
    .default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const WishListAddDto = z.object({
  itemId: z.string(),
});
export type WishListDtoType = z.infer<typeof WishListDto>;
export type WishListAddDtoType = z.infer<typeof WishListAddDto>;
