import express from "express";
import CouponController from "../../controllers/ecommerce/coupon.controller";
import AuthenticationMiddleware from "../../middlewares/authentication";
const authMiddlewareService = AuthenticationMiddleware.getInstance();
import { validatorBody } from "../../middlewares/zodValidator";
import { expressValidator } from "../../middlewares/expressValidator";
import {
  CouponAddDto,
  CouponApplyDto,
  CouponUpdateDto,
} from "../../dto/ecommerce/coupon.dto";
import {
  couponAddValidator,
  couponApplyValidator,
  couponUpdateValidator,
} from "../../validations/ecommerce/coupon.validator";
import { idValidator } from "../../validations/general.validator";
import { asyncHandler } from "../../middlewares/handleError";

const controller = CouponController.getInstance();
const router = express.Router();

// Count coupon
router.get(
  "/count",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  asyncHandler(controller.countCoupon.bind(controller))
);

// Add coupon
router.post(
  "/add",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  couponAddValidator,
  expressValidator,
  validatorBody(CouponAddDto),
  asyncHandler(controller.addCoupon.bind(controller))
);

// Update coupon
router.post(
  "/apply",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  couponApplyValidator,
  expressValidator,
  validatorBody(CouponApplyDto),
  asyncHandler(controller.applyCoupon.bind(controller))
);

// Update coupon
router.put(
  "/update",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  couponUpdateValidator,
  expressValidator,
  validatorBody(CouponUpdateDto),
  asyncHandler(controller.updateCoupon.bind(controller))
);

// Delete coupon
router.delete(
  "/delete/:id",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.deleteCoupon.bind(controller))
);

// Get coupon
router.get(
  "/get/:id",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.getCoupon.bind(controller))
);

// Get all coupon
router.get(
  "/get-all",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  asyncHandler(controller.getAllCoupon.bind(controller))
);

export default router;
