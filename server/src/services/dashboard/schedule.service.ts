import {
  Dashboard,
  BackupDashboard,
} from "../../models/mongodb/dashboard/dashboard.model";
import { client } from "../../config/redisConfig";
import { dashboardSections } from "../../utils/initializeDashboard";
import Category from "../../models/mongodb/category/category.model";

class ScheduleService {
  private static Instance: ScheduleService;
  constructor() {}
  public static getInstance(): ScheduleService {
    if (!ScheduleService.Instance) {
      ScheduleService.Instance = new ScheduleService();
    }
    return ScheduleService.Instance;
  }

  // Used to update the value of the changed field in the database only
  // Update dashboard every 5 minute
  async autoUpdateDashboard(): Promise<void> {
    try {
      const updateFields: Record<string, number> = {};
      const stats = await client.hGetAll("dashboard");
      if (!stats || Object.keys(stats).length === 0) {
        return;
      }

      Object.entries(dashboardSections).forEach(([section, fields]) => {
        fields.forEach((field) => {
          if (stats[field]) {
            updateFields[`${section}.${field}`] = Number(stats[field]);
          }
        });
      });

      await Dashboard.updateOne({}, { $inc: updateFields }, { upsert: true });
      await client.del("dashboard");
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to update dashboard from Redis"
      );
    }
  }

  // Used to clear  custom fields in dashboard to show what the change every day
  // Clear  specific fields in dashboard every day after 24 hours
  async autoResetSpecificFields(): Promise<void> {
    try {
      const fieldsToClear = {
        "items.newItemsToday": 0,
        "orders.newOrdersToday": 0,
        "reports.newReportsToday": 0,
        "users.newUsersToday": 0,
        "users.totalLoginInDay": 0,
        "users.totalVisitors": 0,
        "reviews.newReviewsToday": 0,
      };
      await Dashboard.updateOne({}, { $set: fieldsToClear });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error to reset fields"
      );
    }
  }

  // Used to save dashboard in backup every day to track backups within the database
  async autoBackupDatabase(): Promise<void> {
    try {
      const retrievedDashboard = await Dashboard.findOne({}).lean();
      if (!retrievedDashboard) {
        throw new Error("Failed backup, Not found dashboard ");
      }
      const { _id, ...dashboardData } = retrievedDashboard;
      await BackupDashboard.create(dashboardData);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error backing up dashboard"
      );
    }
  }

  // Get most visited category  and number visits
  // Update dashboard every 9 minute
  async autoGetMostVisitedCategory(): Promise<void> {
    try {
      const getMaxVisitedCategory = await Category.find({})
        .select("visits name ")
        .sort({ visits: -1 })
        .lean();

      const fields = {
        "categories.mostVisitedCategory": getMaxVisitedCategory[0].name,
        "categories.totalVisitedCategory": getMaxVisitedCategory[0].visits,
      };
      await Dashboard.updateOne({}, { $set: fields });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error to most visited category"
      );
    }
  }
}

export default ScheduleService;
