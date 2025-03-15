import express from "express";
import { asyncHandler } from "../../middlewares/handleError";
import AuthenticationMiddleware from "../../middlewares/authentication";
import FirebaseController from "../../controllers/dashboard/firebase.controller";
const authMiddlewareService = AuthenticationMiddleware.getInstance();
const controller = FirebaseController.getInstance();
const router = express.Router();

// Get all users or get all user verify based on value of verify
router.post(
  "/get-all",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  asyncHandler(controller.getAllUsers.bind(controller))
);

// Delete all user not verify email or phone
router.delete(
  "/users/not-verified",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  asyncHandler(controller.deleteAllUserNotVerify.bind(controller))
);

export default router;
