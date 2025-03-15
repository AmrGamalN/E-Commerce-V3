import express from "express";
import FollowController from "../../controllers/user/follow.controller";
import AuthenticationMiddleware from "../../middlewares/authentication";
const authMiddlewareService = AuthenticationMiddleware.getInstance();
import { expressValidator } from "../../middlewares/expressValidator";
import { idValidator } from "../../validations/general.validator";
import { followValidator } from "../../validations/user/follow.validator";
import { asyncHandler } from "../../middlewares/handleError";

const controller = FollowController.getInstance();
const router = express.Router();

// Count follow
router.get(
  "/count",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  followValidator,
  expressValidator,
  asyncHandler(controller.countFollow.bind(controller))
);

// Count follow
router.get(
  "/search",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  followValidator,
  expressValidator,
  asyncHandler(controller.searchFollow.bind(controller))
);

// Add follow
router.post(
  "/add",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  followValidator,
  expressValidator,
  asyncHandler(controller.addFollow.bind(controller))
);

// Delete follow
router.delete(
  "/delete/:id",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  followValidator,
  expressValidator,
  asyncHandler(controller.deleteFollow.bind(controller))
);

// Get follow
router.get(
  "/get/:id",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  followValidator,
  expressValidator,
  asyncHandler(controller.getFollow.bind(controller))
);

// Get all follow
router.get(
  "/get-all",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  asyncHandler(controller.getAllFollow.bind(controller))
);

export default router;
