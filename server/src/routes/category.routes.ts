import express  from "express";
import AuthenticationMiddleware from "../middlewares/authentication";
import {
  categoryValidator,
  subCategoryValidator,
} from "../validations/category.validator";
import { idValidator } from "../validations/general.validator";
import { expressValidator } from "../middlewares/expressValidator";
import { validatorBody } from "../middlewares/zodValidator";
import { CategoryDto } from "../dto/category.dto";
import CategoryController from "../controllers/category.controller";
import { asyncHandler } from "../middlewares/handleError";
const controller = CategoryController.getInstance();
const router = express.Router();

// Count categories
router.get(
  "/count",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  asyncHandler(controller.countCategories.bind(controller))
);

// Add category
router.post(
  "/add",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  [...categoryValidator, ...subCategoryValidator],
  expressValidator,
  validatorBody(CategoryDto),
  asyncHandler(controller.addCategory.bind(controller))
);

// Update category
router.put(
  "/update/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  [...categoryValidator, ...subCategoryValidator],
  idValidator,
  expressValidator,
  validatorBody(CategoryDto),
  asyncHandler(controller.updateCategory.bind(controller))
);

// Delete category
router.delete(
  "/delete/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.deleteCategory.bind(controller))
);

// Get category
router.get(
  "/get/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.getCategory.bind(controller))
);

// Get all categories
router.get(
  "/get-all",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  asyncHandler(controller.getAllCategory.bind(controller))
);

export default router;
