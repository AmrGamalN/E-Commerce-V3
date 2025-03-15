import express from "express";
import MessageController from "../../controllers/messaging/message.controller";
import AuthenticationMiddleware from "../../middlewares/authentication";
const authMiddlewareService = AuthenticationMiddleware.getInstance();
import { expressValidator } from "../../middlewares/expressValidator";
import { idValidator } from "../../validations/general.validator";
import { searchValidator } from "../../validations/messaging/message.validator";
import { asyncHandler } from "../../middlewares/handleError";

const controller = MessageController.getInstance();
const router = express.Router();

// Send message
router.post(
  "/send",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  asyncHandler(controller.sendMessage.bind(controller))
);

// Get all message
router.get(
  "/get-all/:id",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.getAllMessage.bind(controller))
);

// Search message
router.post(
  "/search",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  searchValidator,
  expressValidator,
  asyncHandler(controller.searchMessage.bind(controller))
);

// Mark message
router.get(
  "/mark",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.markMessagesAsRead.bind(controller))
);

export default router;
