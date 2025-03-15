import express from "express";
import AddressController from "../../controllers/user/address.controller";
import AuthenticationMiddleware from "../../middlewares/authentication";
const authMiddlewareService = AuthenticationMiddleware.getInstance();
import { validatorBody } from "../../middlewares/zodValidator";
import { expressValidator } from "../../middlewares/expressValidator";
import { AddressAddDto } from "../../dto/user/address.dto";
import { addressValidator } from "../../validations/user/address.validator";
import { idValidator } from "../../validations/general.validator";
import { asyncHandler } from "../../middlewares/handleError";

const controller = AddressController.getInstance();
const router = express.Router();

// Count address
router.get(
  "/count",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  asyncHandler(controller.countAddress.bind(controller))
);

// Add address
router.post(
  "/add",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  addressValidator,
  expressValidator,
  validatorBody(AddressAddDto),
  asyncHandler(controller.addAddress.bind(controller))
);

// Update address
router.put(
  "/update/:id",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  addressValidator,
  expressValidator,
  validatorBody(AddressAddDto),
  asyncHandler(controller.updateAddress.bind(controller))
);

// Delete address
router.delete(
  "/delete/:id",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.deleteAddress.bind(controller))
);

// Get address
router.get(
  "/get/:id",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.getAddress.bind(controller))
);

// Get all address
router.get(
  "/get-all",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  asyncHandler(controller.getAllAddress.bind(controller))
);

export default router;
