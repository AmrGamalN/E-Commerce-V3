import { Schema, model } from "mongoose";
import { CouponDtoType } from "../../../dto/ecommerce/coupon.dto";

const couponSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    sellerId: { type: String, required: true },
    itemId: { type: String, required: true },
    discount: { type: Number, required: true, min: 1, max: 100 },
    maxUses: { type: Number, required: true },
    remainingUses: { type: Number, required: true }, // In first remainingUses = maxUses and every user use coupon , apply =>  remainingUses - 1
    numberUses: { type: Number, required: true, default: 0 },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // Using TTL [ TIME-TO-LIVE ] to delete coupon auto after finished
  },
  { timestamps: true }
);

const Coupon = model<CouponDtoType>("Coupon", couponSchema);
export default Coupon;
