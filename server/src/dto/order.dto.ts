import { z } from "zod";

export const OrderDto = z.object({
  buyerId: z.string(),
  sellerId: z.string(),
  itemId: z.string(),
  paymentId: z.string(),
  buyerAddress: z.string(),
  sellerAddress: z.string(),
  status: z
    .enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"])
    .default("PENDING"),
  discountType: z
    .enum(["no_discount", "coupon_discount", "global_discount"])
    .default("no_discount"),
  quantity: z.number().min(1).max(10).positive(),
  currency: z.enum(["EGP"]).default("EGP"),
  priceUnit: z.number().positive(),
  discount: z.number().positive(),
  courierFee: z.number().nonnegative(),
  totalPrice: z.number().positive(),
  secretCode: z.string(),
  isValidSecretCode: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const OrderAddDto = z.object({
  itemId: z.string(),
  paymentId: z.string(),
  currency: z.enum(["EGP"]).default("EGP"),
  quantity: z.number().min(1).max(10).positive(),
  buyerAddress: z.string(),
});

export const OrderUpdateDto = z.object({
  itemId: z.string(),
  orderId: z.string(),
  currency: z.enum(["EGP"]).default("EGP"),
  quantity: z.number().min(1).max(10).positive(),
  buyerAddress: z.string(),
});

export type OrderDtoType = z.infer<typeof OrderDto>;
export type OrderAddDtoType = z.infer<typeof OrderAddDto>;
export type OrderUpdateDtoType = z.infer<typeof OrderUpdateDto>;
