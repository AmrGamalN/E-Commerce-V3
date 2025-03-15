import express from "express";
import ConversationController from "../../controllers/messaging/conversation.controller";
import AuthenticationMiddleware from "../../middlewares/authentication";
const authMiddlewareService = AuthenticationMiddleware.getInstance();
import { expressValidator } from "../../middlewares/expressValidator";
import { idValidator } from "../../validations/general.validator";
import { asyncHandler } from "../../middlewares/handleError";

const controller = ConversationController.getInstance();
const router = express.Router();

// Count conversation
router.get(
  "/count",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  asyncHandler(controller.countConversation.bind(controller))
);

// Get conversation
router.get(
  "/get/:id",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.getConversation.bind(controller))
);

// Get all conversation
router.get(
  "/get-all",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  asyncHandler(controller.getAllConversation.bind(controller))
);

export default router;
