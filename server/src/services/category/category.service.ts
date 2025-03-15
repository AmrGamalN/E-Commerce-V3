import Category from "../../models/mongodb/category/category.model";
import { CategoryDtoType, CategoryDto } from "../../dto/category/category.dto";
import {
  formatDataAdd,
  formatDataGetAll,
  formatDataGetOne,
  formatDataUpdate,
} from "../../utils/dataFormatter";

class CategoryService {
  private static Instance: CategoryService;
  constructor() {}
  public static getInstance(): CategoryService {
    if (!CategoryService.Instance) {
      CategoryService.Instance = new CategoryService();
    }
    return CategoryService.Instance;
  }

  // Add category
  async addCategory(data: CategoryDtoType): Promise<CategoryDtoType> {
    try {
      const parsed = formatDataAdd(data, CategoryDto);
      return await Category.create({ ...parsed });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error adding categories"
      );
    }
  }

  // Get Category by categoryId and userId
  async getCategory(categoryId: string): Promise<CategoryDtoType> {
    try {
      const retrievedCategory = await Category.findByIdAndUpdate(
        {
          _id: categoryId,
        },
        {
          $inc: { visits: 1 },
        },
        {
          new: true,
        }
      ).lean();
      return formatDataGetOne(retrievedCategory, CategoryDto);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching category"
      );
    }
  }

  // Get all categories by userId
  async getAllCategory(): Promise<CategoryDtoType[]> {
    try {
      const retrievedCategory = await Category.find({}).lean();
      return formatDataGetAll(retrievedCategory, CategoryDto);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching categories"
      );
    }
  }

  // Update category
  async updateCategory(
    categoryId: string,
    data: CategoryDtoType
  ): Promise<number> {
    try {
      const parsed = formatDataUpdate(data, CategoryDto);
      const updatedCategory = await Category.updateOne(
        {
          _id: categoryId,
        },
        {
          $set: parsed,
        }
      );
      return updatedCategory.matchedCount;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error updating categories"
      );
    }
  }

  // Count of Category
  async countCategories(): Promise<number> {
    try {
      const count = await Category.countDocuments();
      return count;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching category count"
      );
    }
  }

  // Delete category
  async deleteCategory(categoryId: string): Promise<Number> {
    try {
      const deletedCategory = await Category.deleteOne({
        _id: categoryId,
      });
      return deletedCategory.deletedCount;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error deleting categories"
      );
    }
  }
}

export default CategoryService;
