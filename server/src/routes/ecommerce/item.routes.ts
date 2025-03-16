import express from "express";
import ItemController from "../../controllers/ecommerce/item.controller";
import AuthenticationMiddleware from "../../middlewares/authentication";
const authMiddlewareService = AuthenticationMiddleware.getInstance();
import { extractItemImages } from "../../middlewares/extractImagesUrl";
import {
  itemFilterValidator,
  itemValidator,
} from "../../validations/ecommerce/item.validator";
import { idValidator } from "../../validations/general.validator";
import { expressValidator } from "../../middlewares/expressValidator";
import { validatorBody } from "../../middlewares/zodValidator";
import { ItemAddDto } from "../../dto/ecommerce/item.dto";
import { itemUploadImage } from "../../middlewares/uploadFile";
import { asyncHandler } from "../../middlewares/handleError";
import { itemStatusValidator } from "../../validations/ecommerce/item.validator";
const controller = ItemController.getInstance();
const router = express.Router();

// Count items
router.get(
  "/count",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  asyncHandler(controller.countItems.bind(controller))
);

// Add item
router.post(
  "/add",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
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
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  itemUploadImage,
  extractItemImages,
  itemValidator,
  idValidator,
  expressValidator,
  validatorBody(ItemAddDto),
  asyncHandler(controller.updateItem.bind(controller))
);

// Update order status
router.put(
  "/update-status",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  itemStatusValidator,
  expressValidator,
  asyncHandler(controller.updateItemStatus.bind(controller))
);

// Filter item
router.get(
  "/filter",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  itemFilterValidator,
  expressValidator,
  asyncHandler(controller.filterItem.bind(controller))
);

// Delete item
router.delete(
  "/delete/:id",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.deleteItem.bind(controller))
);

// Get item
router.get(
  "/get/:id",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.getItem.bind(controller))
);

// Get all items
router.get(
  "/get-all",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  asyncHandler(controller.getAllItem.bind(controller))
);

export default router;
