import { z } from "zod";

export const OrderDto = z.object({
  buyerId: z.string(),
  sellerId: z.string(),
  itemId: z.string(),
  paymentId: z.string(),
  buyerAddress: z.string(),
  sellerAddress: z.string(),
  status: z
    .enum(["pending", "processing", "shipped", "delivered","refund", "cancelled"])
    .default("pending"),
  discountType: z
    .enum(["no_discount", "coupon_discount", "global_discount"])
    .default("no_discount"),
  quantity: z.number().min(1).max(10).positive(),
  currency: z.enum(["EGP"]).default("EGP"),
  priceUnit: z.number().positive(),
  discount: z.number().min(0).max(100),
  courierFee: z.number().nonnegative(),
  totalPrice: z.number().positive(),
  secretCode: z.string(),
  isValidSecretCode: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const OrderAddDto = OrderDto.pick({
  itemId: true,
  paymentId: true,
  currency: true,
  quantity: true,
  buyerAddress: true,
});

export const OrderUpdateDto = OrderDto.pick({
  itemId: true,
  currency: true,
  quantity: true,
  buyerAddress: true,
}).extend({
  orderId: z.string(),
});

export type OrderDtoType = z.infer<typeof OrderDto>;
export type OrderAddDtoType = z.infer<typeof OrderAddDto>;
export type OrderUpdateDtoType = z.infer<typeof OrderUpdateDto>;
