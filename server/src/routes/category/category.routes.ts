import express from "express";
import AuthenticationMiddleware from "../../middlewares/authentication";
const authMiddlewareService = AuthenticationMiddleware.getInstance();
import {
  categoryValidator,
  subCategoryValidator,
} from "../../validations/category/category.validator";
import { idValidator } from "../../validations/general.validator";
import { expressValidator } from "../../middlewares/expressValidator";
import { validatorBody } from "../../middlewares/zodValidator";
import { CategoryDto } from "../../dto/category/category.dto";
import CategoryController from "../../controllers/category/category.controller";
import { asyncHandler } from "../../middlewares/handleError";
const controller = CategoryController.getInstance();
const router = express.Router();

// Count categories
router.get(
  "/count",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  asyncHandler(controller.countCategories.bind(controller))
);

// Add category
router.post(
  "/add",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  [...categoryValidator, ...subCategoryValidator],
  expressValidator,
  validatorBody(CategoryDto),
  asyncHandler(controller.addCategory.bind(controller))
);

// Update category
router.put(
  "/update/:id",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  [...categoryValidator, ...subCategoryValidator],
  idValidator,
  expressValidator,
  validatorBody(CategoryDto),
  asyncHandler(controller.updateCategory.bind(controller))
);

// Delete category
router.delete(
  "/delete/:id",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.deleteCategory.bind(controller))
);

// Get category
router.get(
  "/get/:id",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.getCategory.bind(controller))
);

// Get all categories
router.get(
  "/get-all",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  asyncHandler(controller.getAllCategory.bind(controller))
);

export default router;
