import express from "express";
import RegisterController from "../../controllers/auth/register.controller";
import {
  registerEmailValidator,
  registerPhoneValidator,
} from "../../validations/auth/auth.validator";
import { userUploadImage } from "../../middlewares/uploadFile";
import { extractUserImages } from "../../middlewares/extractImagesUrl";
import { validatorBody } from "../../middlewares/zodValidator";
import { expressValidator } from "../../middlewares/expressValidator";
import { RegisterEmailDto, RegisterPhoneDto } from "../../dto/auth/auth.dto";
import { asyncHandler } from "../../middlewares/handleError";
const registerController = RegisterController.getInstance();
const router = express.Router();

// Register by email
router.post(
  "/email",
  userUploadImage,
  extractUserImages,
  registerEmailValidator,
  expressValidator,
  validatorBody(RegisterEmailDto),
  asyncHandler(registerController.registerByEmail.bind(registerController))
);

// Register by phone
router.post(
  "/phone",
  userUploadImage,
  extractUserImages,
  registerPhoneValidator,
  expressValidator,
  validatorBody(RegisterPhoneDto),
  asyncHandler(registerController.registerByPhone.bind(registerController))
);

export default router;
