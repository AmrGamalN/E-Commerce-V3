import express, { Request, Response } from "express";
import OrderController from "../controllers/order.controller";
import AuthenticationMiddleware from "../middlewares/auth.middleware";
import { validatorBody } from "../middlewares/zod.validator.middleware";
import { expressValidator } from "../middlewares/express.validator.middleware";
import { OrderAddDto, OrderUpdateDto } from "../dto/order.dto";
import {
  orderValidator,
  orderUpdateValidator,
  orderStatusValidator,
} from "../validations/order.validator";
import { idValidator } from "../validations/general.validator";

const controller = OrderController.getInstance();
const router = express.Router();

// Count order for seller
router.get(
  "/count",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  async (req: Request, res: Response) => {
    await controller.countOrder(req, res);
  }
);

// Add order
router.post(
  "/add",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  orderValidator,
  expressValidator,
  validatorBody(OrderAddDto),
  async (req: Request, res: Response) => {
    await controller.addOrder(req, res);
  }
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
  async (req: Request, res: Response) => {
    await controller.updateOrder(req, res);
  }
);

// Update order status
router.put(
  "/update/status",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  orderStatusValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.updateOrderStatus(req, res);
  }
);

// Delete order
router.delete(
  "/delete/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.deleteOrder(req, res);
  }
);

// Get order
router.get(
  "/get/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.getOrder(req, res);
  }
);

// Get all order
router.get(
  "/get-all",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  async (req: Request, res: Response) => {
    await controller.getAllOrder(req, res);
  }
);

export default router;
