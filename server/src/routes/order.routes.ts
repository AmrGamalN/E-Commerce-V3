import express from "express";
import OrderController from "../controllers/order.controller";
import AuthenticationMiddleware from "../middlewares/authentication";
import { validatorBody } from "../middlewares/zodValidator";
import { expressValidator } from "../middlewares/expressValidator";
import { OrderAddDto, OrderUpdateDto } from "../dto/order.dto";
import {
  orderAddValidator,
  orderUpdateValidator,
  orderStatusValidator,
} from "../validations/order.validator";
import { idValidator } from "../validations/general.validator";
import { asyncHandler } from "../middlewares/handleError";

const controller = OrderController.getInstance();
const router = express.Router();

// Count order for seller
router.get(
  "/count",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  asyncHandler(controller.countOrder.bind(controller))
);

// Add order
router.post(
  "/add",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  orderAddValidator,
  expressValidator,
  validatorBody(OrderAddDto),
  asyncHandler(controller.addOrder.bind(controller))
);

// Update order
router.put(
  "/update",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  orderUpdateValidator,
  expressValidator,
  validatorBody(OrderUpdateDto),
  asyncHandler(controller.updateOrder.bind(controller))
);

// Update order status
router.put(
  "/update/status",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  orderStatusValidator,
  expressValidator,
  asyncHandler(controller.updateOrderStatus.bind(controller))
);

// Delete order
router.delete(
  "/delete/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.deleteOrder.bind(controller))
);

// Get order
router.get(
  "/get/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.getOrder.bind(controller))
);

// Get all order
router.get(
  "/get-all",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  asyncHandler(controller.getAllOrder.bind(controller))
);

export default router;
