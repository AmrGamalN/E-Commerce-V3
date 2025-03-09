import express from "express";
import CouponController from "../controllers/coupon.controller";
import AuthenticationMiddleware from "../middlewares/authentication";
import { validatorBody } from "../middlewares/zodValidator";
import { expressValidator } from "../middlewares/expressValidator";
import {
  CouponAddDto,
  CouponApplyDto,
  CouponUpdateDto,
} from "../dto/coupon.dto";
import {
  couponAddValidator,
  couponApplyValidator,
  couponUpdateValidator,
} from "../validations/coupon.validator";
import { idValidator } from "../validations/general.validator";
import { asyncHandler } from "../middlewares/handleError";

const controller = CouponController.getInstance();
const router = express.Router();

// Count coupon
router.get(
  "/count",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  asyncHandler(controller.countCoupon.bind(controller))
);

// Add coupon
router.post(
  "/add",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  couponAddValidator,
  expressValidator,
  validatorBody(CouponAddDto),
  asyncHandler(controller.addCoupon.bind(controller))
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
  asyncHandler(controller.applyCoupon.bind(controller))
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
  asyncHandler(controller.updateCoupon.bind(controller))
);

// Delete coupon
router.delete(
  "/delete/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.deleteCoupon.bind(controller))
);

// Get coupon
router.get(
  "/get/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.getCoupon.bind(controller))
);

// Get all coupon
router.get(
  "/get-all",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  asyncHandler(controller.getAllCoupon.bind(controller))
);

export default router;
