import { Request, Response } from "express";
import CouponService from "../services/coupon.service";

class CouponController {
  private static Instance: CouponController;
  private serviceInstance: CouponService;
  constructor() {
    this.serviceInstance = CouponService.getInstance();
  }

  public static getInstance(): CouponController {
    if (!CouponController.Instance) {
      CouponController.Instance = new CouponController();
    }
    return CouponController.Instance;
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

  // Add coupon
  async addCoupon(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.user_id;
      const retrievedCoupon = await this.serviceInstance.addCoupon(
        req.body,
        userId
      );
      if (!retrievedCoupon) {
        res.status(400).json({ message: "Failed to add coupon" });
        return;
      }
      res.status(200).json({
        message:
          "Coupon added Successfully ,and remove automatically when finished time",
      });
    } catch (error) {
      this.handleError(res, "Internal server error!", error);
    }
  }

  // Get Coupon
  async getCoupon(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.body.userId ? req.body.userId : req.user?.user_id;
      const retrievedCoupon = await this.serviceInstance.getCoupon(
        String(id),
        userId
      );
      if (retrievedCoupon == null) {
        res.status(404).json({ message: "Not found Coupon", data: [] });
        return;
      }
      res
        .status(200)
        .json({ message: "Coupon get Successfully", data: retrievedCoupon });
    } catch (error) {
      this.handleError(res, "Internal server error!", error);
    }
  }

  // Get all coupon
  async getAllCoupon(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.body.userId ? req.body.userId : req.user?.user_id;
      const retrievedCoupon = await this.serviceInstance.getAllCoupon(userId);
      const count = await this.serviceInstance.countCoupon(userId);
      if (retrievedCoupon.length == 0) {
        res.status(200).json({ message: "Not found Coupon", data: [] });
        return;
      }
      res.status(200).json({
        count: count,
        message: "Coupon get Successfully",
        data: retrievedCoupon,
      });
    } catch (error) {
      this.handleError(res, "Internal server error!", error);
    }
  }

  // Update coupon
  async updateCoupon(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.user_id;
      const retrievedCoupon = await this.serviceInstance.updateCoupon(
        userId,
        req.body
      );
      if (retrievedCoupon == null) {
        res.status(404).json({ message: "Not found Coupon", data: [] });
        return;
      }
      res.status(200).json({
        message: "Coupon updated Successfully",
        data: retrievedCoupon,
      });
    } catch (error) {
      this.handleError(res, "Internal server error!", error);
    }
  }

  // Count of Coupon
  async countCoupon(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.user_id;
      const count = await this.serviceInstance.countCoupon(userId);
      if (count == 0) {
        res.status(404).json({ message: "Not found Coupon", data: 0 });
        return;
      }
      res.status(200).json({
        message: "Count coupon fetched successfully",
        data: count,
      });
    } catch (error) {
      this.handleError(res, "Internal server error!", error);
    }
  }

  // Delete coupon
  async deleteCoupon(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.user_id;
      const retrievedCoupon = await this.serviceInstance.deleteCoupon(
        String(id),
        userId
      );
      if (retrievedCoupon == 0) {
        res.status(404).json({ message: "Not found Coupon", data: [] });
        return;
      }
      res
        .status(200)
        .json({ message: "Coupon deleted Successfully", data: [] });
    } catch (error) {
      this.handleError(res, "Internal server error!", error);
    }
  }

  // Apply coupon
  async applyCoupon(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const userId = req.user?.user_id;
      const retrievedCoupon = await this.serviceInstance.applyCoupon(
        data,
        userId
      );
      if (!retrievedCoupon) {
        res.status(400).json(retrievedCoupon);
        return;
      }
      res.status(200).json(retrievedCoupon);
    } catch (error) {
      this.handleError(res, "Internal server error!", error);
    }
  }
}

export default CouponController;
