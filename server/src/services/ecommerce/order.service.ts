import Order from "../../models/mongodb/ecommerce/order.model";
import Item from "../../models/mongodb/ecommerce/item.model";
import { generateSecretCode } from "../../utils/generateSecretCode.utils";
import {
  OrderDtoType,
  OrderDto,
  OrderAddDtoType,
  OrderAddDto,
  OrderUpdateDto,
  OrderUpdateDtoType,
} from "../../dto/ecommerce/order.dto";
import mongoose from "mongoose";
import {
  formatDataAdd,
  formatDataGetAll,
  formatDataGetOne,
  formatDataUpdate,
} from "../../utils/dataFormatter";
import ItemService from "./item.service";
import DashboardService from "../dashboard/dashboard.service";

class OrderService {
  private static Instance: OrderService;
  private itemService: ItemService;
  private DashboardService: DashboardService;
  constructor() {
    this.itemService = ItemService.getInstance();
    this.DashboardService = new DashboardService();
  }
  public static getInstance(): OrderService {
    if (!OrderService.Instance) {
      OrderService.Instance = new OrderService();
    }
    return OrderService.Instance;
  }

  // Add order
  async addOrder(data: OrderAddDtoType, userId: string): Promise<object> {
    try {
      const parsed = formatDataAdd(data, OrderAddDto);
      const result = await Item.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(data.itemId) } },
        {
          $lookup: {
            from: "orders",
            let: { userId: userId, itemId: data.itemId },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$buyerId", "$$userId"] },
                      { $eq: ["$itemId", "$$itemId"] },
                    ],
                  },
                },
              },
              { $project: { itemId: 1 } },
            ],
            as: "order",
          },
        },
        { $unwind: { path: "$order", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            userId: 1,
            price: 1,
            allowQuantity: 1,
            discount: 1,
            location: 1,
            availableQuantity: 1,
            "order.itemId": { $ifNull: ["$order.itemId", null] },
          },
        },
      ]);

      const item = result[0];
      if (userId == item.userId) {
        return { message: "Your order cannot be purchased." };
      }

      if (item.order.itemId != null) {
        return { message: "Order already exists" };
      }

      if (parsed.quantity > item.allowQuantity) {
        return { message: " You have exceeded the allowed quantity limit." };
      }

      if (item.availableQuantity == 0) {
        return { message: "Item unavailable" };
      }

      const totalPrice = this.calculateTotalPrice(
        item.price,
        parsed.quantity,
        item.discount
      );

      // Create unique secret code
      let uniqueCode;
      do {
        uniqueCode = generateSecretCode();
      } while (await Order.exists({ code: uniqueCode }));

      const discountType =
        item.discount == 0 ? "no_discount" : "global_discount";
      const newOrder = await Order.create({
        ...parsed,
        buyerId: userId,
        sellerId: item.userId,
        sellerAddress: item.location,
        priceUnit: item.price,
        discount: item.discount,
        totalPrice: totalPrice,
        courierFee: process.env.COURIER_FEE,
        secretCode: uniqueCode,
        discountType: discountType,
      });

      // Update dashboard
      this.DashboardService.updateDashboardRecordsInCaching({
        pending: 1,
        newOrdersToday: 1,
        totalOrders: 1,
      });
      return { message: "Order added Successfully", data: newOrder };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error adding order"
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

  // Get Order by orderId and buyerId
  async getOrder(orderId: string, buyerId: string): Promise<OrderDtoType> {
    try {
      const retrievedOrder = await Order.findById({
        _id: new mongoose.Types.ObjectId(orderId),
        buyerId: buyerId,
      }).lean();
      return formatDataGetOne(retrievedOrder, OrderDto);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching order"
      );
    }
  }

  // Get all order  for buyer
  async getAllOrder(buyerId: string): Promise<OrderDtoType[]> {
    try {
      const retrievedOrder = await Order.find({
        buyerId: buyerId,
      }).lean();
      return formatDataGetAll(retrievedOrder, OrderDto);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching order"
      );
    }
  }

  // Update order
  async updateOrder(userId: string, data: OrderUpdateDtoType): Promise<object> {
    try {
      const parsed = formatDataUpdate(data, OrderUpdateDto);
      const retrievedItem = await this.itemService.getItem(data.itemId, userId);

      if (parsed.quantity > retrievedItem.allowQuantity) {
        return { message: " You have exceeded the allowed quantity limit." };
      }

      const totalPrice = this.calculateTotalPrice(
        retrievedItem.price,
        parsed.quantity,
        Number(retrievedItem.discount)
      );

      const updatedOrder = await Order.updateOne(
        {
          _id: data.orderId,
          buyerId: userId,
        },
        {
          $set: {
            currency: parsed.currency,
            buyerAddress: parsed.buyerAddress,
            quantity: parsed.quantity,
            totalPrice: totalPrice,
          },
        }
      );
      if (updatedOrder.matchedCount == 0) {
        return { message: "Order not found" };
      }

      return { message: "Order updated successfully" };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error updating order"
      );
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: string): Promise<object> {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        {
          _id: orderId,
        },
        {
          $set: { status },
        },
        { select: "status" }
      ).lean();

      if (!updatedOrder) {
        return { message: "Order not found" };
      }

      // Update dashboard
      this.DashboardService.updateDashboardRecordsInCaching({
        [status]: 1,
        [String(updatedOrder.status)]: -1,
      });

      return { message: "Order status updated successfully" };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error updating order status"
      );
    }
  }

  // Count of Order for seller
  async countOrder(sellerId: string): Promise<number> {
    try {
      const count = await Order.countDocuments({ sellerId: sellerId });
      return count;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching order count"
      );
    }
  }

  // Delete order
  async deleteOrder(orderId: string, userId: string): Promise<object> {
    try {
      const deletedOrder = await Order.findOneAndDelete(
        {
          _id: orderId,
          buyerId: userId,
        },
        {
          select: "status",
        }
      ).lean();

      if (!deletedOrder) {
        return { message: "Not found order", data: [] };
      }

      // Update dashboard
      this.DashboardService.updateDashboardRecordsInCaching({
        totalOrders: -1,
        totalDeleteOrders: 1,
        [String(deletedOrder.status)]: -1,
      });
      return { message: "Order deleted Successfully", data: [] };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error deleting order"
      );
    }
  }

  // Filter order by status and is  sold or bought
  async filterOrder(
    filters: Record<string, any>,
    userId: string
  ): Promise<OrderDtoType[]> {
    try {
      const query: Record<string, any> = {};
      const page = Math.max(filters.page, 1);
      filters.orderType === true
        ? (query["sellerId"] = userId)
        : (query["buyerId"] = userId);

      if (filters.status) {
        query["status"] = filters.status;
      }

      if (filters.from && filters.to) {
        query["createdAt"] = {
          $gte: new Date(filters.from),
          $lte: new Date(filters.to),
        };
      }

      const filterOrder = await Order.find(query)
        .skip((page - 1) * 10)
        .limit(10)
        .lean();

      return formatDataGetAll(filterOrder, OrderDto);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error deleting order"
      );
    }
  }
}

export default OrderService;
