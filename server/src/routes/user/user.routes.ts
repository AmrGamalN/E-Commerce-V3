import express from "express";
import UserController from "../../controllers/user/user.controller";
import AuthenticationMiddleware from "../../middlewares/authentication";
const authMiddlewareService = AuthenticationMiddleware.getInstance();
import {
  userUpdateValidator,
  userPasswordValidator,
} from "../../validations/user/user.validator";
import { idValidator } from "../../validations/general.validator";
import { expressValidator } from "../../middlewares/expressValidator";
import { validatorBody } from "../../middlewares/zodValidator";
import { UserUpdateDto } from "../../dto/user/user.dto";
import { extractUserImages } from "../../middlewares/extractImagesUrl";
import { userUploadImage} from "../../middlewares/uploadFile";
import { asyncHandler } from "../../middlewares/handleError";

const controller = UserController.getInstance();
const router = express.Router();

// Count all users
router.post(
  "/count",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  asyncHandler(controller.resetPasswordUserByLink.bind(controller))
);

// Reset password by link when user is forget password
router.post(
  "/reset-password",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER","ADMIN", "MANAGER"]),
  asyncHandler(controller.resetPasswordUserByLink.bind(controller))
);

// Update password when user is login
router.post(
  "/update-password",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER","ADMIN", "MANAGER"]),
  userPasswordValidator,
  expressValidator,
  asyncHandler(controller.UpdatePassword.bind(controller))
);

// Update user
router.put(
  "/update",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  userUploadImage,
  extractUserImages,
  userUpdateValidator,
  expressValidator,
  validatorBody(UserUpdateDto),
  asyncHandler(controller.updateUser.bind(controller))
);

// Delete user
router.delete(
  "/delete",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.deleteUser.bind(controller))
);

// Get user
router.get(
  "/get",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  asyncHandler(controller.getUser.bind(controller))
);

// Get all userS
router.get(
  "/get-all",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  asyncHandler(controller.getAllUser.bind(controller))
);

export default router;
