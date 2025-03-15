import { model, Schema } from "mongoose";
import { OrderDtoType } from "../../../dto/ecommerce/order.dto";

const orderSchema: Schema = new Schema(
  {
    buyerId: { type: String, required: true },
    sellerId: { type: String, required: true },
    itemId: {
      type: String,
      ref: "Item",
      required: true,
    },
    paymentId: { type: String, required: true },
    buyerAddress: { type: String, required: true },
    sellerAddress: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered","refund", "cancelled"],
      required: true,
      default: "pending",
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    currency: {
      type: String,
      enum: ["EGP", "USD", "EUR"],
      default: "EGP",
    },
    priceUnit: { type: Number, required: true, min: 1 },
    courierFee: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 1 },
    discount: { type: Number },
    secretCode: { type: String, required: true },
    isValidSecretCode: { type: Boolean, required: true, default: false }, // Upon delivery of the order, the buyer needs to enter the secret code to verify receipt of the order.

    // option discount [no_discount -coupon_discount- global_discount] used to whish discount user apply on item
    discountType: {
      type: String,
      enum: ["no_discount", "coupon_discount", "global_discount"],
      default: "no_discount",
    },
  },
  { timestamps: true }
);

orderSchema.index({ buyerId: 1 });
orderSchema.index({ sellerId: 1 });
orderSchema.index({ itemId: 1 });
orderSchema.index({ paymentId: 1 });

const Order = model<OrderDtoType>("orders", orderSchema);
export default Order;
