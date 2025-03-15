import { Request, Response } from "express";
import CouponService from "../../services/ecommerce/coupon.service";

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

  // Add coupon
  async addCoupon(req: Request, res: Response): Promise<void> {
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
  }

  // Get Coupon
  async getCoupon(req: Request, res: Response): Promise<void> {
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
  }

  // Get all coupon
  async getAllCoupon(req: Request, res: Response): Promise<void> {
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
  }

  // Update coupon
  async updateCoupon(req: Request, res: Response): Promise<void> {
    const userId = req.user?.user_id;
    const retrievedCoupon = await this.serviceInstance.updateCoupon(
      userId,
      req.body
    );
    if (retrievedCoupon == 0) {
      res.status(404).json({ message: "Not found Coupon" });
      return;
    }
    res.status(200).json({
      message: "Coupon updated successfully",
    });
  }

  // Count of Coupon
  async countCoupon(req: Request, res: Response): Promise<void> {
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
  }

  // Delete coupon
  async deleteCoupon(req: Request, res: Response): Promise<void> {
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
    res.status(200).json({ message: "Coupon deleted Successfully", data: [] });
  }

  // Apply coupon
  async applyCoupon(req: Request, res: Response): Promise<void> {
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
  }
}

export default CouponController;
