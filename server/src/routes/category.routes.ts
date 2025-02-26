import express, { Request, Response } from "express";
import AuthenticationMiddleware from "../middlewares/auth.middleware";
import {
  categoryValidator,
  subCategoryValidator,
} from "../validations/category.validator";
import { idValidator } from "../validations/general.validator";
import { expressValidator } from "../middlewares/express.validator.middleware";
import { validatorBody } from "../middlewares/zod.validator.middleware";
import { CategoryDto } from "../dto/category.dto";
import CategoryController from "../controllers/category.controller";
const controller = CategoryController.getInstance();
const router = express.Router();

// Count categories
router.get(
  "/count",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  async (req: Request, res: Response) => {
    await controller.countCategories(req, res);
  }
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
  async (req: Request, res: Response) => {
    await controller.addCategory(req, res);
  }
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
  async (req: Request, res: Response) => {
    await controller.updateCategory(req, res);
  }
);

// Delete category
router.delete(
  "/delete/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.deleteCategory(req, res);
  }
);

// Get category
router.get(
  "/get/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.getCategory(req, res);
  }
);

// Get all categories
router.get(
  "/get-all",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  async (req: Request, res: Response) => {
    await controller.getAllCategory(req, res);
  }
);

export default router;
