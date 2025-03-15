import { Request, Response } from "express";
import CategoryService from "../../services/category/category.service";

class CategoryController {
  private static Instance: CategoryController;
  private serviceInstance: CategoryService;
  constructor() {
    this.serviceInstance = CategoryService.getInstance();
  }

  public static getInstance(): CategoryController {
    if (!CategoryController.Instance) {
      CategoryController.Instance = new CategoryController();
    }
    return CategoryController.Instance;
  }

  // Add category
  async addCategory(req: Request, res: Response): Promise<void> {
    const retrievedCategory = await this.serviceInstance.addCategory(req.body);
    if (!retrievedCategory) {
      res.status(400).json({ message: "Failed to add category" });
      return;
    }
    res.status(200).json({ message: "Category added Successfully" });
  }

  // Get Category
  async getCategory(req: Request, res: Response): Promise<void> {
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
  }

  // Get all categories
  async getAllCategory(req: Request, res: Response): Promise<void> {
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
  }

  // Update category
  async updateCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const retrievedCategory = await this.serviceInstance.updateCategory(
      String(id),
      req.body
    );
    if (retrievedCategory == 0) {
      res.status(404).json({ message: "Not found category" });
      return;
    }
    res.status(200).json({
      message: "Category updated successfully",
    });
  }

  // Count of Category
  async countCategories(req: Request, res: Response): Promise<void> {
    const count = await this.serviceInstance.countCategories();
    if (count == 0) {
      res.status(404).json({ message: "Not found Categories", data: 0 });
      return;
    }
    res.status(200).json({
      message: "Count category fetched successfully",
      data: count,
    });
  }

  // Delete category
  async deleteCategory(req: Request, res: Response): Promise<void> {
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
  }
}

export default CategoryController;
