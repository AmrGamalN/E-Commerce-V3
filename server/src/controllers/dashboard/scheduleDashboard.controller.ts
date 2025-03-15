import cron from "node-cron";
import ScheduleService from "../../services/dashboard/schedule.service";
import { Request, Response } from "express";
const service = ScheduleService.getInstance();
const jobs: Record<string, cron.ScheduledTask | number> = {};

class ScheduleDashboard {
  private static instance: ScheduleDashboard;
  private serviceInstance: ScheduleService;
  constructor() {
    this.serviceInstance = ScheduleService.getInstance();
  }
  public static getInstance(): ScheduleDashboard {
    if (!ScheduleDashboard.instance) {
      ScheduleDashboard.instance = new ScheduleDashboard();
    }
    return ScheduleDashboard.instance;
  }

  // Initialize schedule Jobs
  initializeJobs() {
    this.scheduleMostVisitedCategory();
    this.ScheduleDashboardUpdate();
    this.ScheduleDashboardCleanup();
    this.ScheduleDashboardBackup();
  }

  // Get most visited category  and number visits
  // Update dashboard every 9 minute
  private scheduleMostVisitedCategory() {
    jobs["visitCategory"] = cron.schedule("0 0 * * *", async () => {
      console.log("Fetching most visited category...");
      await this.serviceInstance.autoGetMostVisitedCategory();
    });
  }

  // Using to update dashboard every 5 minutes
  private ScheduleDashboardUpdate() {
    jobs["updateDashboard"] = cron.schedule("*/1 0* * * *", async () => {
      console.log("Updating dashboard...");
      await this.serviceInstance.autoUpdateDashboard();
    });
  }

  // Clear specific fields in dashboard every day at midnight
  private ScheduleDashboardCleanup() {
    jobs["cleanupDashboard"] = cron.schedule("0 0 * * *", async () => {
      console.log("Resetting dashboard fields...");
      await this.serviceInstance.autoResetSpecificFields();
    });
  }

  // Used to save dashboard in backup every day to track backups within the database
  private ScheduleDashboardBackup() {
    jobs["backupDashboard"] = cron.schedule("0 0 * * *", async () => {
      console.log("Backup dashboard");
      await this.serviceInstance.autoBackupDatabase();
    });
  }

  // Start or stop a specific scheduled job
  manageJob(req: Request, res: Response) {
    const { scheduleName, action } = req.body;
    const job = jobs[scheduleName];
    if (action == false) {
      if (typeof job === "object" && typeof job.stop === "function") {
        job.stop();
      }
      return res.status(200).json({
        message: `Job '${scheduleName}' stopped successfully.`,
        success: true,
      });
    }
    if (action == true) {
      if (typeof job === "object" && typeof job.start === "function") {
        job.start();
      }
      return res.status(200).json({
        message: `Job '${scheduleName}' started successfully.`,
        success: true,
      });
    }
  }

  manageAllJobs(req: Request, res: Response) {
    const { action } = req.body;
    if (action == false) {
      Object.values(jobs).forEach((job) => {
        if (typeof job === "object" && typeof job.stop === "function") {
          job.stop();
        }
      });
      return res.status(200).json({
        message: "All scheduled jobs terminated successfully",
        success: true,
      });
    }

    if (action == true) {
      Object.values(jobs).forEach((job) => {
        if (typeof job === "object" && typeof job.start === "function") {
          job.start();
        }
      });
      return res.status(200).json({
        message: "All scheduled jobs started successfully",
        success: true,
      });
    }
  }
}

export default ScheduleDashboard;
