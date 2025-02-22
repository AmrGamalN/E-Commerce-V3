import { Request, Response } from "express";
import Categorieservice from "../services/categoryService";

class CategoryController {
  private static Instance: CategoryController;
  private serviceInstance: Categorieservice;
  constructor() {
    this.serviceInstance = Categorieservice.getInstance();
  }

  public static getInstance(): CategoryController {
    if (!CategoryController.Instance) {
      CategoryController.Instance = new CategoryController();
    }
    return CategoryController.Instance;
  }

  private handleError(
    res: Response,
    message: string,
    error: unknown,
    status = 400
  ): void {
    res.status(status).json({
      message,
      error: error instanceof Error ? error.message : error,
    });
  }

  // Add category
  async addCategory(req: Request, res: Response): Promise<void> {
    try {
      const retrievedCategory = await this.serviceInstance.addCategory(
        req.body
      );
      if (!retrievedCategory) {
        res.status(400).json({ message: "Failed to add category" });
        return;
      }
      res.status(200).json({ message: "Category added Successfully" });
    } catch (error) {
      this.handleError(res, "Failed to add category", error);
    }
  }

  // Get Category
  async getCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const retrievedCategory = await this.serviceInstance.getCategory(
        String(id)
      );
      if (retrievedCategory == null) {
        res.status(404).json({ message: "Not found Category", data: [] });
        return;
      }
      res.status(200).json({
        message: "Category get Successfully",
        data: retrievedCategory,
      });
    } catch (error) {
      this.handleError(res, "Failed to get category", error);
    }
  }

  // Get all categories
  async getAllCategory(req: Request, res: Response): Promise<void> {
    try {
      const retrievedCategories = await this.serviceInstance.getAllCategory();
      const count = await this.serviceInstance.countCategories();
      if (retrievedCategories.length == 0) {
        res.status(200).json({ message: "Not found Categories", data: [] });
        return;
      }
      res.status(200).json({
        count: count,
        message: "Categories get Successfully",
        data: retrievedCategories,
      });
    } catch (error) {
      this.handleError(res, "Failed to get categories", error);
    }
  }

  // Update category
  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const retrievedCategory = await this.serviceInstance.updateCategory(
        String(id),

        req.body
      );
      if (retrievedCategory == null) {
        res.status(404).json({ message: "Not found Category", data: [] });
        return;
      }
      res.status(200).json({
        message: "Category updated Successfully",
        data: retrievedCategory,
      });
    } catch (error) {
      this.handleError(res, "Failed to update category", error);
    }
  }

  // Count of Category
  async countCategories(req: Request, res: Response): Promise<void> {
    try {
      const count = await this.serviceInstance.countCategories();
      if (count == 0) {
        res.status(404).json({ message: "Not found Categories", data: 0 });
        return;
      }
      res.status(200).json({
        message: "Count category fetched successfully",
        data: count,
      });
    } catch (error) {
      this.handleError(res, "Failed to fetch count category!", error);
    }
  }

  // Delete category
  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const retrievedCategory = await this.serviceInstance.deleteCategory(
        String(id)
      );
      if (retrievedCategory == 0) {
        res.status(404).json({ message: "Not found Category", data: [] });
        return;
      }
      res
        .status(200)
        .json({ message: "Category deleted Successfully", data: [] });
    } catch (error) {
      this.handleError(res, "Failed to delete category", error);
    }
  }
}

export default CategoryController;
