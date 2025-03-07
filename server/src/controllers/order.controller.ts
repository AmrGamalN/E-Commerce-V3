import { Request, Response } from "express";
import OrderService from "../services/order.service";

class OrderController {
  private static Instance: OrderController;
  private serviceInstance: OrderService;
  constructor() {
    this.serviceInstance = OrderService.getInstance();
  }

  public static getInstance(): OrderController {
    if (!OrderController.Instance) {
      OrderController.Instance = new OrderController();
    }
    return OrderController.Instance;
  }

  private handleError(
    res: Response,
    message: string,
    error: unknown,
    status = 500
  ): void {
    res.status(status).json({
      message,
      error: error instanceof Error ? error.message : error,
    });
  }

  // Add order
  async addOrder(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.user_id;
      const retrievedOrder = await this.serviceInstance.addOrder(
        req.body,
        userId
      );
      if (!retrievedOrder) {
        res.status(400).json(retrievedOrder);
        return;
      }
      res.status(200).json(retrievedOrder);
    } catch (error) {
      this.handleError(res, "Internal server error", error);
    }
  }

  // Get Order
  async getOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.body.userId ? req.body.userId : req.user?.user_id;
      const retrievedOrder = await this.serviceInstance.getOrder(
        String(id),
        userId
      );
      if (retrievedOrder == null) {
        res.status(404).json({ message: "Not found Order", data: [] });
        return;
      }
      res
        .status(200)
        .json({ message: "Order get Successfully", data: retrievedOrder });
    } catch (error) {
      this.handleError(res, "Internal server error", error);
    }
  }

  // Get all order
  async getAllOrder(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.body.userId ? req.body.userId : req.user?.user_id;
      const retrievedOrder = await this.serviceInstance.getAllOrder(userId);
      const count = await this.serviceInstance.countOrder(userId);
      if (retrievedOrder.length == 0) {
        res.status(200).json({ message: "Not found Order", data: [] });
        return;
      }
      res.status(200).json({
        count: count,
        message: "Order get Successfully",
        data: retrievedOrder,
      });
    } catch (error) {
      this.handleError(res, "Internal server error", error);
    }
  }

  // Update order
  async updateOrder(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.user_id;
      const retrievedOrder = await this.serviceInstance.updateOrder(
        userId,
        req.body
      );
      if (retrievedOrder == null) {
        res.status(404).json(retrievedOrder);
        return;
      }
      res.status(200).json(retrievedOrder);
    } catch (error) {
      this.handleError(res, "Internal server error", error);
    }
  }

  // Update order status
  async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { orderId, status } = req.body;
      const retrievedOrder = await this.serviceInstance.updateOrderStatus(
        orderId,
        status
      );
      if (retrievedOrder == null) {
        res.status(404).json(retrievedOrder);
        return;
      }
      res.status(200).json(retrievedOrder);
    } catch (error) {
      this.handleError(res, "Internal server error", error);
    }
  }

  // Count of Order
  async countOrder(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.body.userId ? req.body.userId : req.user?.user_id;
      const count = await this.serviceInstance.countOrder(userId);
      if (count == 0) {
        res.status(404).json({ message: "Not found Order", data: 0 });
        return;
      }
      res.status(200).json({
        message: "Count order fetched successfully",
        data: count,
      });
    } catch (error) {
      this.handleError(res, "Internal server error", error);
    }
  }

  // Delete order
  async deleteOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.body.userId ? req.body.userId : req.user?.user_id;
      const retrievedOrder = await this.serviceInstance.deleteOrder(
        String(id),
        userId
      );
      if (retrievedOrder == 0) {
        res.status(404).json({ message: "Not found Order", data: [] });
        return;
      }
      res.status(200).json({ message: "Order deleted Successfully", data: [] });
    } catch (error) {
      this.handleError(res, "Internal server error", error);
    }
  }
}

export default OrderController;
