import cron from "node-cron";
import DashboardService from "../../services/dashboard/dashboard.service";
import { Request, Response } from "express";

class scheduleJobs {
  private static instance: scheduleJobs;
  private serviceInstance: DashboardService;
  constructor() {
    this.serviceInstance = new DashboardService();
  }
  public static getInstance(): scheduleJobs {
    if (!scheduleJobs.instance) {
      scheduleJobs.instance = new scheduleJobs();
    }
    return scheduleJobs.instance;
  }

  // Create dashboard in database and redis
  async initializeDashboard(req: Request, res: Response): Promise<void> {
    const createDashboard = await this.serviceInstance.initializeDashboard();
    res.status(200).json(createDashboard);
  }

  // Used to reset all section or custom section
  async resetDashboard(req: Request, res: Response): Promise<void> {
    const { sectionName } = req.body;
    const resetDashboard = await this.serviceInstance.resetDashboard(
      sectionName
    );
    res.status(200).json(resetDashboard);
  }

  // Used to get [ dashboard ] or [ specific section  ]
  async getDashboard(req: Request, res: Response): Promise<void> {
    const { sectionName } = req.body;
    const getDashboard = (await this.serviceInstance.getDashboard(
      sectionName
    )) as {
      data: object;
    };
    if ((getDashboard.data == null)) res.status(404).json(getDashboard);
    res.status(200).json(getDashboard);
  }

  // Used to update section like [ orders , items , reviews ... ]
  async updateSection(req: Request, res: Response): Promise<void> {
    try {
      const updateSection = await this.serviceInstance.updateSection(
        req.body.sectionName,
        req.body
      );

      if (updateSection === 0) {
        res.status(404).json({
          message: "No section was updated, it might not exist.",
        });
      }

      res.status(200).json({
        message: "Dashboard section updated successfully.",
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to update dashboard section"
      );
    }
  }

  // Get total number of category and brands and subcategories and types and save in database
  async getTotalCategoryBrandSubCategory(
    req: Request,
    res: Response
  ): Promise<void> {
    const result =
      (await this.serviceInstance.getTotalCategoryBrandSubCategory()) as {
        data: object;
      };

    if (Object.keys(result).length == 0) {
      res.status(404).json(result);
    }
    res.status(200).json(result);
  }
}

export default scheduleJobs;
