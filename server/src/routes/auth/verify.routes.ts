import express from "express";
import VerifyController from "../../controllers/auth/verify.controller";
import {
  verifyPhoneValidator,
  verifyEmailValidator,
} from "../../validations/auth/auth.validator";
import { expressValidator } from "../../middlewares/expressValidator";
import { asyncHandler } from "../../middlewares/handleError";
const verifyController = VerifyController.getInstance();
const router = express.Router();

// Verify by email
router.post(
  "/email",
  verifyEmailValidator,
  expressValidator,
  asyncHandler(verifyController.verifyByEmail.bind(verifyController))
);

// Verify by phone
router.post(
  "/phone",
  verifyPhoneValidator,
  expressValidator,
  asyncHandler(verifyController.verifyByPhone.bind(verifyController))
);

export default router;
