import {
  Dashboard,
} from "../../models/mongodb/dashboard/dashboard.model";
import { client } from "../../config/redisConfig";
import {
  dashboardSections,
  dashboardFields,
} from "../../utils/initializeDashboard";
import Category from "../../models/mongodb/category/category.model";

class DashboardService {
  private static Instance: DashboardService;
  constructor() {}
  public static getInstance(): DashboardService {
    if (!DashboardService.Instance) {
      DashboardService.Instance = new DashboardService();
    }
    return DashboardService.Instance;
  }

  // Create dashboard in database and redis
  async initializeDashboard(): Promise<object> {
    try {
      const existingDashboard = await Dashboard.findOne({})
        .select("_id")
        .lean();
      if (!existingDashboard) {
        await Dashboard.create({});
        const pipeline = client.multi();
        dashboardFields.forEach((field) => {
          pipeline.hSetNX("dashboard", field, "0");
        });
        await pipeline.exec();
        return { message: "Create dashboard successfully" };
      }
      return { message: "Dashboard already exists" };
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to initialize Redis fields and model fields"
      );
    }
  }

  // Used to reset all section or specific section
  // If exist section name => reset this section else reset all section
  async resetDashboard(
    sectionName?: keyof typeof dashboardSections
  ): Promise<object> {
    try {
      const clearFields: Record<string, number> = {};
      if (sectionName && dashboardSections[sectionName]) {
        dashboardSections[sectionName].forEach((field) => {
          clearFields[`${sectionName}.${field}`] = 0;
        });
      } else {
        Object.entries(dashboardSections).forEach(([section, fields]) => {
          fields.forEach((field) => {
            clearFields[`${section}.${field}`] = 0;
          });
        });
      }

      const lengthFieldUpdated = Object.keys(clearFields).length;
      if (lengthFieldUpdated > 0) {
        await Dashboard.updateOne({}, { $set: clearFields });
        return { message: `updated ${lengthFieldUpdated} field successfully` };
      }
      return { message: "No field to clear" };
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to reset dashboard fields in database"
      );
    }
  }

  // Used to get [ dashboard ] or [ specific section  ]
  async getDashboard(sectionName?: string): Promise<object> {
    try {
      const getSection = await Dashboard.findOne({})
        .select(sectionName ? sectionName : "")
        .lean();

      if (!getSection) {
        return { message: "Section not found", data: null };
      }

      return { message: "Section found successfully", data: getSection };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch section"
      );
    }
  }

  // Used to update section like [ orders , items , reviews ... ]
  async updateSection(sectionName: string, data: any): Promise<Number> {
    try {
      const updateSection = await Dashboard.updateOne(
        {},
        { $set: { [sectionName]: data } }
      );
      return updateSection.modifiedCount;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to update dashboard section"
      );
    }
  }

  // Get total number of category and brands and subcategories and types and save in database
  async getTotalCategoryBrandSubCategory(): Promise<object> {
    try {
      const totalCategory = await Category.find({})
        .select("visits name subcategories ")
        .lean();

      if (!totalCategory) {
        return { message: "No category found", data: {} };
      }

      // Used to get brand from subcategory or nestedSubCategory
      const { totalSubCategory, totalBrands, totalTypes } = totalCategory
        .flatMap((category: any) => category.subcategories)
        .reduce(
          (acc, subcategory: any) => {
            acc.totalSubCategory += 1;

            acc.totalBrands += [
              ...(subcategory.brands || []), // Not found nestedSubCategory
              subcategory.subcategories?.flatMap((NestedSubCategory: any) => {
                NestedSubCategory.brands;
              }),
            ].length;

            acc.totalTypes += [
              ...(subcategory.types || []), // Not found nestedSubCategory
              ...(subcategory.subcategories?.flatMap(
                (NestedSubCategory: any) => NestedSubCategory.types
              ) || []),
            ].length;

            return acc;
          },
          { totalSubCategory: 0, totalBrands: 0, totalTypes: 0 }
        );

      const fields = {
        "categories.totalCategories": totalCategory.length,
        "categories.totalSubcategories": totalSubCategory,
        "categories.totalBrands": totalBrands,
        "categories.totalTypes": totalTypes,
      };
      await Dashboard.updateOne({}, { $set: fields });
      return {
        message:
          "get total number of 'Categories Subcategories Brands Types' successfully",
        data: fields,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error to get number of category"
      );
    }
  }

  // Used to record value of field automatically when change value of field
  async updateDashboardRecordsInCaching(field: object): Promise<void> {
    try {
      const pipeline = client.multi();
      for (const [fieldName, value] of Object.entries(field)) {
        pipeline.hIncrBy("dashboard", fieldName, value);
      }
      pipeline.exec();
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error updating Redis"
      );
    }
  }
}

export default DashboardService;
