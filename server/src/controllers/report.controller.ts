import { Request, Response } from "express";
import ReportService from "../services/reportService";

class ReportController {
  private static Instance: ReportController;
  private serviceInstance: ReportService;
  constructor() {
    this.serviceInstance = ReportService.getInstance();
  }

  public static getInstance(): ReportController {
    if (!ReportController.Instance) {
      ReportController.Instance = new ReportController();
    }
    return ReportController.Instance;
  }

  private handleError(
    res: Response,
    message: string,
    error: unknown,
    status = 500
  ): void {
    res.status(status).json({
      message,
      error: error instanceof Error ? error.message : error,
    });
  }

  // Add Report
  async addReport(req: Request, res: Response): Promise<void> {
    try {
      const addReport = await this.serviceInstance.addReport(
        req.user,
        req.body
      );
      if (addReport) {
        res.status(200).json(addReport);
        return;
      }
      res.status(200).json(addReport);
    } catch (error) {
      this.handleError(res, "Failed to add report!", error);
    }
  }

  // Get Report
  async getReport(req: Request, res: Response): Promise<void> {
    try {
      const reportId = req.params.id;
      const userId = req.user?.user_id;
      const retrievedReport = await this.serviceInstance.getReport(
        String(reportId),
        userId
      );
      if (retrievedReport == null) {
        res.status(404).json({ message: "Not found Report", data: [] });
        return;
      }
      res.status(200).json({
        message: "Report get Successfully",
        data: retrievedReport,
      });
    } catch (error) {
      this.handleError(res, "Failed to get report", error);
    }
  }

  // Update report
  async updateReport(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.user_id;
      const retrievedReport = await this.serviceInstance.updateReport(
        userId,
        req.body
      );
      if (retrievedReport == null) {
        res.status(404).json({ message: "Not found report", data: [] });
        return;
      }
      res.status(200).json({
        message: "report updated Successfully",
        data: retrievedReport,
      });
    } catch (error) {
      this.handleError(res, "Failed to update report", error);
    }
  }

  // Update report
  async feedBackReport(req: Request, res: Response): Promise<void> {
    try {
      const adminId = req.user?.user_id;
      const feedBack = await this.serviceInstance.feedBackReport(
        req.body,
        adminId
      );
      if (feedBack == null) {
        res.status(404).json(feedBack);
        return;
      }
      res.status(200).json(feedBack);
    } catch (error) {
      this.handleError(res, "Failed to feedback report", error);
    }
  }

  // Delete report
  async deleteReport(req: Request, res: Response): Promise<void> {
    try {
      const reportId = req.params.id;
      const userId = req.user?.user_id;
      const retrievedReport = await this.serviceInstance.deleteReport(
        String(reportId),
        userId
      );
      if (retrievedReport == 0) {
        res.status(404).json({ message: "Not found report", data: [] });
        return;
      }
      res
        .status(200)
        .json({ message: "report deleted Successfully", data: [] });
    } catch (error) {
      this.handleError(res, "Failed to delete report", error);
    }
  }

  // Get all report
  async getAllReport(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.user_id;
      const retrievedReport = await this.serviceInstance.getAllReport(userId);
      if (retrievedReport.length == 0) {
        res.status(200).json({ message: "Not found Report", data: [] });
        return;
      }
      res.status(200).json({
        message: "Report get Successfully",
        data: retrievedReport,
      });
    } catch (error) {
      this.handleError(res, "Failed to get report", error);
    }
  }

  // Count of Report
  async countReport(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;
      const count = await this.serviceInstance.countReport(String(userId));
      if (count == 0) {
        res.status(404).json({ message: "Not found Report", data: 0 });
        return;
      }
      res.status(200).json({
        message: "Count report fetched successfully",
        data: count,
      });
    } catch (error) {
      this.handleError(res, "Failed to fetch count report!", error);
    }
  }
}

export default ReportController;
