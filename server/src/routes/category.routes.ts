import express, { Request, Response } from "express";
import AuthenticationMiddleware from "../middlewares/auth.middleware";
import {
  categoryValidator,
  subCategoryValidator,
} from "../validations/category.valid";
import {
  resultValidator,
  mongoIdValidator,
} from "../validations/general.valid";
import CategoryController from "../controllers/category.controller";
const controller = CategoryController.getInstance();
const router = express.Router();

// Count categories
router.get(
  "/count",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.authorization,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  async (req: Request, res: Response) => {
    await controller.countCategories(req, res);
  }
);

// Add category
router.post(
  "/add",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.authorization,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  [...categoryValidator, ...subCategoryValidator],
  resultValidator,
  async (req: Request, res: Response) => {
    await controller.addCategory(req, res);
  }
);

// Update category
router.put(
  "/update/:id",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.authorization,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  [...categoryValidator, ...subCategoryValidator],
  resultValidator,
  async (req: Request, res: Response) => {
    await controller.updateCategory(req, res);
  }
);

// Delete category
router.delete(
  "/delete/:id",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.authorization,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  mongoIdValidator,
  resultValidator,
  async (req: Request, res: Response) => {
    await controller.deleteCategory(req, res);
  }
);

// Get category
router.get(
  "/get/:id",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.authorization,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  mongoIdValidator,
  resultValidator,
  async (req: Request, res: Response) => {
    await controller.getCategory(req, res);
  }
);

// Get all categories
router.get(
  "/get-all",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.authorization,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  async (req: Request, res: Response) => {
    await controller.getAllCategory(req, res);
  }
);

export default router;
