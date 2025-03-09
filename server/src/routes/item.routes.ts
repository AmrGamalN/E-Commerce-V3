import express from "express";
import ItemController from "../controllers/item.controller";
import AuthenticationMiddleware from "../middlewares/authentication";
import { extractItemImages } from "../middlewares/extractImages";
import { itemValidator } from "../validations/item.validator";
import { idValidator } from "../validations/general.validator";
import { expressValidator } from "../middlewares/expressValidator";
import { validatorBody } from "../middlewares/zodValidator";
import { ItemAddDto } from "../dto/item.dto";
import { itemUploadImage } from "../middlewares/uploadFile";
import { asyncHandler } from "../middlewares/handleError";
const controller = ItemController.getInstance();
const router = express.Router();

// Count items
router.get(
  "/count",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  asyncHandler(controller.countItems.bind(controller))
);

// Add item
router.post(
  "/add",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  itemUploadImage,
  extractItemImages,
  itemValidator,
  expressValidator,
  validatorBody(ItemAddDto),
  asyncHandler(controller.addItem.bind(controller))
);

// Update item
router.put(
  "/update/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  itemUploadImage,
  extractItemImages,
  itemValidator,
  idValidator,
  expressValidator,
  validatorBody(ItemAddDto),
  asyncHandler(controller.updateItem.bind(controller))
);

// Filter item
router.get(
  "/filter",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  asyncHandler(controller.filterItem.bind(controller))
);

// Delete item
router.delete(
  "/delete/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.deleteItem.bind(controller))
);

// Get item
router.get(
  "/get/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.getItem.bind(controller))
);

// Get all items
router.get(
  "/get-all",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  asyncHandler(controller.getAllItem.bind(controller))
);

export default router;
