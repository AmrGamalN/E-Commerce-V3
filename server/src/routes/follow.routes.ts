import express from "express";
import FollowController from "../controllers/follow.controller";
import AuthenticationMiddleware from "../middlewares/authentication";
import { expressValidator } from "../middlewares/expressValidator";
import { idValidator } from "../validations/general.validator";
import { followValidator } from "../validations/follow.validator";
import { asyncHandler } from "../middlewares/handleError";

const controller = FollowController.getInstance();
const router = express.Router();

// Count follow
router.get(
  "/count",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  followValidator,
  expressValidator,
  asyncHandler(controller.countFollow.bind(controller))
);

// Count follow
router.get(
  "/search",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  followValidator,
  expressValidator,
  asyncHandler(controller.searchFollow.bind(controller))
);

// Add follow
router.post(
  "/add",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  followValidator,
  expressValidator,
  asyncHandler(controller.addFollow.bind(controller))
);

// Delete follow
router.delete(
  "/delete/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  followValidator,
  expressValidator,
  asyncHandler(controller.deleteFollow.bind(controller))
);

// Get follow
router.get(
  "/get/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  followValidator,
  expressValidator,
  asyncHandler(controller.getFollow.bind(controller))
);

// Get all follow
router.get(
  "/get-all",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  asyncHandler(controller.getAllFollow.bind(controller))
);

export default router;
