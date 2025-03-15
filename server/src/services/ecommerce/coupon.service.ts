import Coupon from "../../models/mongodb/ecommerce/coupon.model";
import mongoose from "mongoose";
import { generateSecretCode } from "../../utils/generateSecretCode.utils";
import {
  CouponDto,
  CouponAddDto,
  CouponDtoType,
  CouponApplyDto,
  CouponUpdateDto,
  CouponAddDtoType,
  CouponApplyDtoType,
  CouponUpdateDtoType,
} from "../../dto/ecommerce/coupon.dto";
import Item from "../../models/mongodb/ecommerce/item.model";
import Order from "../../models/mongodb/ecommerce/order.model";
import OrderService from "../../services/ecommerce/order.service";
import {
  formatDataAdd,
  formatDataGetAll,
  formatDataGetOne,
  formatDataUpdate,
} from "../../utils/dataFormatter";

class CouponService {
  private static Instance: CouponService;
  constructor() {}
  public static getInstance(): CouponService {
    if (!CouponService.Instance) {
      CouponService.Instance = new CouponService();
    }
    return CouponService.Instance;
  }

  // Add coupon by seller
  async addCoupon(
    data: CouponAddDtoType,
    userId: string
  ): Promise<CouponAddDtoType> {
    try {
      const parsed = formatDataAdd(data, CouponAddDto);
      const existingCoupon = await Coupon.exists({
        sellerId: userId,
        itemId: data.itemId,
      });

      if (existingCoupon) {
        throw new Error("Coupon already exists for this item");
      }

      // Create unique code
      let uniqueCode;
      do {
        uniqueCode = generateSecretCode();
      } while (await Coupon.exists({ code: uniqueCode }));

      const coupon = await Coupon.create({
        ...parsed,
        sellerId: userId,
        code: uniqueCode,
        remainingUses: parsed.maxUses, // In first remainingUses = maxUses
      });
      await Item.updateOne(
        { _id: new mongoose.Types.ObjectId(data.itemId) },
        { $set: { couponId: coupon._id } }
      );
      return coupon;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error adding coupon"
      );
    }
  }

  // Get Coupon by couponId and userId
  async getCoupon(couponId: string, userId: string): Promise<CouponDtoType> {
    try {
      const retrievedCoupon = await Coupon.findById({
        _id: couponId,
        sellerId: userId,
      }).lean();
      return formatDataGetOne(retrievedCoupon, CouponDto);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching coupon"
      );
    }
  }

  // Get all coupon by userId
  async getAllCoupon(userId: string): Promise<CouponDtoType[]> {
    try {
      const retrievedCoupon = await Coupon.find({
        sellerId: userId,
      }).lean();
      return formatDataGetAll(retrievedCoupon, CouponDto);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching coupons"
      );
    }
  }

  // Update coupon
  async updateCoupon(
    userId: string,
    data: CouponUpdateDtoType
  ): Promise<number> {
    try {
      const parsed = formatDataUpdate(data, CouponUpdateDto);
      const updatedCoupon = await Coupon.updateOne(
        {
          _id: new mongoose.Types.ObjectId(data.couponId),
          sellerId: userId,
        },
        {
          $set: parsed,
        }
      );
      return updatedCoupon.matchedCount;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error updating coupon"
      );
    }
  }

  // Count of Coupon
  async countCoupon(sellerId: string): Promise<number> {
    try {
      const count = await Coupon.countDocuments({ sellerId });
      return count;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching coupon count"
      );
    }
  }

  // Delete coupon
  async deleteCoupon(couponId: string, userId: string): Promise<Number> {
    try {
      const deletedCoupon = await Coupon.deleteOne({
        _id: couponId,
        sellerId: userId,
      });
      return deletedCoupon.deletedCount;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error deleting coupon"
      );
    }
  }

  // Used by buyer
  async applyCoupon(data: CouponApplyDtoType, userId: string): Promise<object> {
    try {
      const parsed = formatDataAdd(data, CouponApplyDto);
      // Search for the coupon, making sure it matches the code and that it has not reached the maximum usage limit.
      const existingCoupon = await Coupon.findById({
        _id: new mongoose.Types.ObjectId(data.couponId),
        code: data.code,
        remainingUses: { $gt: 0 },
      })
        .select("discount maxUses remainingUses numberUses")
        .lean();

      const couponStatus =
        existingCoupon?.remainingUses == 0
          ? "Coupon unavailable"
          : "Coupon not found";
      if (!existingCoupon) {
        return { message: couponStatus };
      }
      // Find the order and make sure the buyer is the current user
      const existingOrder = await Order.findById({
        _id: new mongoose.Types.ObjectId(data.orderId),
        buyerId: userId,
      })
        .select("discount totalPrice discountType")
        .lean();

      if (!existingOrder) {
        return { message: "Order not found" };
      }

      // Check if the coupon is already applied
      if (existingOrder.discountType === "coupon_discount") {
        return { message: "Coupon already applied to this order" };
      }

      // total price after discount
      const totalPrice = this.calculateTotalPrice(
        data.price,
        data.quantity,
        existingCoupon.discount
      );

      await Order.updateOne(
        { _id: new mongoose.Types.ObjectId(data.orderId) },
        {
          $set: {
            totalPrice: totalPrice,
            discountType: "coupon_discount",
            discount: existingCoupon.discount,
          },
        }
      );

      await Coupon.updateOne(
        { _id: new mongoose.Types.ObjectId(data.couponId) },
        {
          $inc: { remainingUses: -1, numberUses: 1 },
        }
      );

      return { message: "Coupon apply successfully" };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error deleting order"
      );
    }
  }

  private calculateTotalPrice(
    price: number,
    quantity: number,
    discount: number
  ): number {
    const discountValue = discount / 100;
    const total = price * quantity + Number(process.env.COURIER_FEE);
    return total - total * discountValue;
  }
}

export default CouponService;
