import express from "express";
import PaymentController from "../../controllers/payment/payment.controller";
import AuthenticationMiddleware from "../../middlewares/authentication";
const authMiddlewareService = AuthenticationMiddleware.getInstance();
import { validatorBody } from "../../middlewares/zodValidator";
import { expressValidator } from "../../middlewares/expressValidator";
import { PaymentDto } from "../../dto/payment/payment.dto";
import { paymentValidator } from "../../validations/payment/payment.validator";
import { idValidator } from "../../validations/general.validator";
import { asyncHandler } from "../../middlewares/handleError";

const controller = PaymentController.getInstance();
const router = express.Router();

// Get user paymentOption
router.get(
  "/get",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  asyncHandler(controller.getPaymentOption.bind(controller))
);

// // Count payment
// router.get(
//   "/count",
//   authMiddlewareService.refreshToken,
//   authMiddlewareService.verifyIdToken,
//   authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
//   asyncHandler(controller.countPayment.bind(controller))
// );

// // Add payment
// router.post(
//   "/add",
//   authMiddlewareService.refreshToken,
//   authMiddlewareService.verifyIdToken,
//   authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
//   paymentValidator,
//   expressValidator,
//   validatorBody(PaymentAddDto),
//   asyncHandler(controller.addPayment.bind(controller))
// );

// // Update payment
// router.put(
//   "/update/:id",
//   authMiddlewareService.refreshToken,
//   authMiddlewareService.verifyIdToken,
//   authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
//   paymentValidator,
//   expressValidator,
//   validatorBody(PaymentAddDto),
//   asyncHandler(controller.updatePayment.bind(controller))
// );

// // Delete payment
// router.delete(
//   "/delete/:id",
//   authMiddlewareService.refreshToken,
//   authMiddlewareService.verifyIdToken,
//   authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
//   idValidator,
//   expressValidator,
//   asyncHandler(controller.deletePayment.bind(controller))
// );

// // Get payment
// router.get(
//   "/get/:id",
//   authMiddlewareService.refreshToken,
//   authMiddlewareService.verifyIdToken,
//   authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
//   idValidator,
//   expressValidator,
//   asyncHandler(controller.getPayment.bind(controller))
// );

// // Get all payment
// router.get(
//   "/get-all",
//   authMiddlewareService.refreshToken,
//   authMiddlewareService.verifyIdToken,
//   authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
//   asyncHandler(controller.getAllPayment.bind(controller))
// );

export default router;
