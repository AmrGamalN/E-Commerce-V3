import express from "express";
import OrderController from "../../controllers/ecommerce/order.controller";
import AuthenticationMiddleware from "../../middlewares/authentication";
const authMiddlewareService = AuthenticationMiddleware.getInstance();
import { validatorBody } from "../../middlewares/zodValidator";
import { expressValidator } from "../../middlewares/expressValidator";
import { OrderAddDto, OrderUpdateDto } from "../../dto/ecommerce/order.dto";
import {
  orderAddValidator,
  orderUpdateValidator,
  orderStatusValidator,
  orderFilterValidator,
} from "../../validations/ecommerce/order.validator";
import { idValidator } from "../../validations/general.validator";
import { asyncHandler } from "../../middlewares/handleError";

const controller = OrderController.getInstance();
const router = express.Router();

// Count order for seller
router.get(
  "/count",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  asyncHandler(controller.countOrder.bind(controller))
);

// Add order
router.post(
  "/add",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  orderAddValidator,
  expressValidator,
  validatorBody(OrderAddDto),
  asyncHandler(controller.addOrder.bind(controller))
);

// Update order
router.put(
  "/update",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  orderUpdateValidator,
  expressValidator,
  validatorBody(OrderUpdateDto),
  asyncHandler(controller.updateOrder.bind(controller))
);

// Update order status
router.put(
  "/update/status",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  orderStatusValidator,
  expressValidator,
  asyncHandler(controller.updateOrderStatus.bind(controller))
);

// Delete order
router.delete(
  "/delete/:id",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.deleteOrder.bind(controller))
);

// Filter order
router.get(
  "/filter",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  orderFilterValidator,
  expressValidator,
  asyncHandler(controller.filterOrder.bind(controller))
);

// Get order
router.get(
  "/get/:id",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.getOrder.bind(controller))
);

// Get all order
router.get(
  "/get-all",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  asyncHandler(controller.getAllOrder.bind(controller))
);

export default router;
