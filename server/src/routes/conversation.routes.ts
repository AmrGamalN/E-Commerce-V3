import express, { Request, Response } from "express";
import ConversationController from "../controllers/conversation.controller";
import AuthenticationMiddleware from "../middlewares/auth.middleware";
import { expressValidator } from "../middlewares/express.validator.middleware";
import { idValidator } from "../validations/general.validator";

const controller = ConversationController.getInstance();
const router = express.Router();

// Count conversation
router.get(
  "/count",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  async (req: Request, res: Response) => {
    await controller.countConversation(req, res);
  }
);

// Get conversation
router.get(
  "/get/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.getConversation(req, res);
  }
);

// Get all conversation
router.get(
  "/get-all",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  async (req: Request, res: Response) => {
    await controller.getAllConversation(req, res);
  }
);

export default router;
