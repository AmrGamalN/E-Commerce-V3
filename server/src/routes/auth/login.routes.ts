import express from "express";
import LoginController from "../../controllers/auth/login.controller";
import {
  loginEmailValidator,
  loginPhoneValidator,
} from "../../validations/auth/auth.validator";

import { validatorBody } from "../../middlewares/zodValidator";
import { expressValidator } from "../../middlewares/expressValidator";
import { LoginEmailDto, LoginPhoneDto } from "../../dto/auth/auth.dto";
import { asyncHandler } from "../../middlewares/handleError";
const loginController = LoginController.getInstance();
const router = express.Router();

// Login by email
router.post(
  "/email",
  loginEmailValidator,
  expressValidator,
  validatorBody(LoginEmailDto),
  asyncHandler(loginController.loginByEmail.bind(loginController))
);

// Login by phone
router.post(
  "/phone",
  loginPhoneValidator,
  expressValidator,
  validatorBody(LoginPhoneDto),
  asyncHandler(loginController.loginByPhone.bind(loginController))
);


export default router;
