import express from "express";
import AuthController from "../controllers/auth.controller";
import {
  loginValidator,
  registerValidator,
  OTPValidator,
} from "../validations/auth.validator";
import { userUploadImage } from "../middlewares/uploadFile";
import { extractUserImages } from "../middlewares/extractImages";
import { validatorBody } from "../middlewares/zodValidator";
import { expressValidator } from "../middlewares/expressValidator";
import { RegisterDto, LoginEmailDto, LoginPhoneDto } from "../dto/auth.dto";
import AuthenticationMiddleware from "../middlewares/authentication";
import { TwoFactorAuthController } from "../utils/twoFactorAuthentication";
import { asyncHandler } from "../middlewares/handleError";
const controller = AuthController.getInstance();
const router = express.Router();

// Register user
router.post(
  "/register",
  userUploadImage,
  extractUserImages,
  registerValidator,
  expressValidator,
  validatorBody(RegisterDto),
  asyncHandler(controller.registerUser.bind(controller))
);

// Login user with email
router.post(
  "/login-email",
  loginValidator,
  expressValidator,
  validatorBody(LoginEmailDto),
  asyncHandler(controller.loginWithEmail.bind(controller))
);

// Login user with phone
router.post(
  "/login-phone",
  loginValidator,
  expressValidator,
  validatorBody(LoginPhoneDto),
  asyncHandler(controller.loginWithPhone.bind(controller))
);

// Verify email
router.get(
  "/verify-email",
  asyncHandler(controller.verifyEmail.bind(controller))
);

// refresh token
router.post(
  "/refresh-token",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  asyncHandler(controller.refreshToken.bind(controller))
);

// Logout
router.post(
  "/Logout",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  asyncHandler(controller.logOut.bind(controller))
);

router.post(
  "/generate-secret",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  asyncHandler(
    TwoFactorAuthController.generateTwoFactorAuthentication.bind(controller)
  )
);

router.post(
  "/verify-token",
  OTPValidator,
  expressValidator,
  asyncHandler(
    TwoFactorAuthController.VerifyTwoFactorAuthentication.bind(controller)
  )
);

export default router;
