import Category from "../models/mongodb/category.model";
import { CategoryDtoType, CategoryDto } from "../dto/category.dto";

class Categorieservice {
  private static Instance: Categorieservice;
  constructor() {}
  public static getInstance(): Categorieservice {
    if (!Categorieservice.Instance) {
      Categorieservice.Instance = new Categorieservice();
    }
    return Categorieservice.Instance;
  }

  // Add category
  async addCategory(data: CategoryDtoType): Promise<CategoryDtoType> {
    try {
      const parsed = CategoryDto.safeParse(data);
      if (!parsed.success) {
        throw new Error("Invalid category data");
      }
      const category = await Category.create({ ...parsed.data });
      await category.save();
      return category;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error adding categories"
      );
    }
  }

  // Get Category by categoryId and userId
  async getCategory(categoryId: string): Promise<CategoryDtoType> {
    try {
      const retrievedCategory = await Category.findOne({
        _id: categoryId,
      });
      if (retrievedCategory == null) {
        throw new Error("Category not found");
      }
      const parsed = CategoryDto.safeParse(retrievedCategory);

      if (!parsed.success) {
        throw new Error("Invalid category data");
      }
      const category = { _id: retrievedCategory?._id, ...parsed.data };
      return category;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching category"
      );
    }
  }

  // Get all categories by userId
  async getAllCategory(): Promise<CategoryDtoType[]> {
    try {
      const retrievedCategory = await Category.find({});

      const categoryDto = retrievedCategory.map((category) => {
        const { _id, ...categories } = category.toObject();
        const parsed = CategoryDto.safeParse(categories);
        if (!parsed.success) {
          throw new Error("Invalid category data");
        }
        return { _id, ...parsed.data };
      });
      return categoryDto;
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
  ): Promise<CategoryDtoType | null> {
    try {
      const parsed = CategoryDto.safeParse(data);
      if (!parsed.success) {
        throw new Error("Invalid category data");
      }

      const updatedCategory = await Category.findOneAndUpdate(
        {
          _id: categoryId,
        },
        {
          $set: parsed.data,
        },
        { new: true, runValidators: true }
      );

      return updatedCategory ? updatedCategory.toObject() : null;
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

export default Categorieservice;
