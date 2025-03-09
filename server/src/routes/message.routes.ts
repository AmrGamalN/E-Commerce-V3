import express  from "express";
import MessageController from "../controllers/message.controller";
import AuthenticationMiddleware from "../middlewares/authentication";
import { expressValidator } from "../middlewares/expressValidator";
import { idValidator } from "../validations/general.validator";
import { searchValidator } from "../validations/message.validator";
import { asyncHandler } from "../middlewares/handleError";

const controller = MessageController.getInstance();
const router = express.Router();

// Send message
router.post(
  "/send",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  asyncHandler(controller.sendMessage.bind(controller))
);

// Get all message
router.get(
  "/get-all/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.getAllMessage.bind(controller))
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
  asyncHandler(controller.searchMessage.bind(controller))
);

// Mark message
router.get(
  "/mark",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.markMessagesAsRead.bind(controller))
);

export default router;
