import express, { Request, Response } from "express";
import MessageController from "../controllers/message.controller";
import AuthenticationMiddleware from "../middlewares/auth.middleware";
import { expressValidator } from "../middlewares/express.validator.middleware";
import { idValidator } from "../validations/general.validator";
import { searchValidator } from "../validations/message.validator";

const controller = MessageController.getInstance();
const router = express.Router();

// Send message
router.post(
  "/send",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  async (req: Request, res: Response) => {
    await controller.sendMessage(req, res);
  }
);

// Get all message
router.get(
  "/get-all/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.getAllMessage(req, res);
  }
);

// Search message
router.post(
  "/search",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  searchValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.searchMessage(req, res);
  }
);

// Search message
router.get(
  "/mark",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.markMessagesAsRead(req, res);
  }
);

export default router;
