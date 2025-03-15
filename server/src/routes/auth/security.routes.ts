import express from "express";
import SecurityController from "../../controllers/auth/security.controller";
import { OTPValidator } from "../../validations/auth/auth.validator";
import { expressValidator } from "../../middlewares/expressValidator";
import AuthenticationMiddleware from "../../middlewares/authentication";
import TwoFactorAuthController from "../../controllers/auth/twoFactorAuth.controller";
import { asyncHandler } from "../../middlewares/handleError";
const authMiddlewareService = AuthenticationMiddleware.getInstance();
const securityController = SecurityController.getInstance();
const twoFactorAuthController = TwoFactorAuthController.getInstance();
const router = express.Router();

// refresh token
router.post(
  "/refresh-token",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  asyncHandler(securityController.refreshToken.bind(securityController))
);

router.post(
  "/generate-secret",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  asyncHandler(
    twoFactorAuthController.generateTwoFactorAuthentication.bind(
      twoFactorAuthController
    )
  )
);

router.post(
  "/2fa/verify",
  OTPValidator,
  expressValidator,
  asyncHandler(
    twoFactorAuthController.verifyTwoFactorAuthentication.bind(
      twoFactorAuthController
    )
  )
);

export default router;
