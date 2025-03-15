import { Request, Response } from "express";
import { client } from "../../config/redisConfig";
import { dashboardFields } from "../../utils/initializeDashboard";

class CachingController {
  private static instance: CachingController;
  constructor() {
  }
  public static getInstance(): CachingController {
    if (!CachingController.instance) {
      CachingController.instance = new CachingController();
    }
    return CachingController.instance;
  }

  // Reset dashboard in cache
  async getCache(req: Request, res: Response): Promise<void> {
    const dashboardData = await client.hGetAll("dashboard");
    if (!dashboardData || Object.keys(dashboardData).length === 0) {
      res.status(404).json({
        success: false,
        message: "No cached data found.",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Dashboard cache retrieved successfully.",
      data: dashboardData,
    });
  }

  // create dashboard in cache
  async createCache(req: Request, res: Response): Promise<void> {
    const defaultCache: Record<string, string> = {};
    dashboardFields.forEach((field) => {
      defaultCache[field] = "0";
    });
    await client.hSet("dashboard", defaultCache);
    res.status(200).json({
      success: true,
      message: "Dashboard cache created successfully.",
    });
  }

  // delete dashboard in cache
  async deleteCache(req: Request, res: Response): Promise<void> {
    const result = await client.del("dashboard");
    if (result === 0) {
      res.status(404).json({
        success: false,
        message: "No cache found to delete.",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Dashboard cache deleted successfully.",
    });
  }

  // Clear all cache
  async clearCache(req: Request, res: Response): Promise<void> {
    await client.flushAll();
    res.status(200).json({
      success: true,
      message: "Cache cleared successfully.",
    });
  }

  // Get all user in cache not verify email or phone yet
  async getUsers(req: Request, res: Response): Promise<void> {
    const keys = await client.keys("userId:*");
    if (keys.length === 0) {
      res.status(404).json({
        success: true,
        message: "Not found users",
        data: [],
      });
      return;
    }
    const usersData = await client.mGet(keys);
    const users = usersData.map((user) => (user ? JSON.parse(user) : null));
    res.status(200).json({
      success: true,
      message: "Cache cleared successfully.",
      data: users,
    });
  }

  // delete all user from cache
  async deleteUsers(req: Request, res: Response): Promise<void> {
    const keys = await client.keys("userId:*");
    if (keys.length === 0) {
      res.status(404).json({
        success: true,
        message: "Not found users",
        data: [],
      });
      return;
    }
    keys.map(async (key: string) => {
      await client.del(key);
    });
    res.status(200).json({
      success: true,
      message: "Users delete from cache successfully.",
      data: [],
    });
  }
}

export default CachingController;
