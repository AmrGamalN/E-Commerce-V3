import express, { Request, Response } from "express";
import CouponController from "../controllers/coupon.controller";
import AuthenticationMiddleware from "../middlewares/auth.middleware";
import { validatorBody } from "../middlewares/zod.validator.middleware";
import { expressValidator } from "../middlewares/express.validator.middleware";
import {
  CouponAddDto,
  CouponApplyDto,
  CouponUpdateDto,
} from "../dto/coupon.dto";
import {
  couponValidator,
  couponApplyValidator,
  couponUpdateValidator,
} from "../validations/coupon.validator";
import { idValidator } from "../validations/general.validator";

const controller = CouponController.getInstance();
const router = express.Router();

// Count coupon
router.get(
  "/count",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  async (req: Request, res: Response) => {
    await controller.countCoupon(req, res);
  }
);

// Add coupon
router.post(
  "/add",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  couponValidator,
  expressValidator,
  validatorBody(CouponAddDto),
  async (req: Request, res: Response) => {
    await controller.addCoupon(req, res);
  }
);

// Update coupon
router.post(
  "/apply",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  couponApplyValidator,
  expressValidator,
  validatorBody(CouponApplyDto),
  async (req: Request, res: Response) => {
    await controller.applyCoupon(req, res);
  }
);

// Update coupon
router.put(
  "/update",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  couponUpdateValidator,
  expressValidator,
  validatorBody(CouponUpdateDto),
  async (req: Request, res: Response) => {
    await controller.updateCoupon(req, res);
  }
);

// Delete coupon
router.delete(
  "/delete/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.deleteCoupon(req, res);
  }
);

// Get coupon
router.get(
  "/get/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.getCoupon(req, res);
  }
);

// Get all coupon
router.get(
  "/get-all",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  async (req: Request, res: Response) => {
    await controller.getAllCoupon(req, res);
  }
);

export default router;
