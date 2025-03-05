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
    status = 400
  ): void {
    res.status(status).json({
      message,
      error: error instanceof Error ? error.message : error,
    });
  }

  // Get Report
  async getReport(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.user_id;
      const retrievedReport = await this.serviceInstance.getReport(
        String(id),
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

  // // Get all report
  // async getAllReport(req: Request, res: Response): Promise<void> {
  //   try {
  //     const userId = req.user?.user_id;
  //     const retrievedReport = await this.serviceInstance.getAllReport(userId);
  //     const count = await this.serviceInstance.countReport(userId);
  //     if (retrievedReport.length == 0) {
  //       res.status(200).json({ message: "Not found Report", data: [] });
  //       return;
  //     }
  //     res.status(200).json({
  //       count: count,
  //       message: "Report get Successfully",
  //       data: retrievedReport,
  //     });
  //   } catch (error) {
  //     this.handleError(res, "Failed to get report", error);
  //   }
  // }

  // // Count of Report
  // async countReport(req: Request, res: Response): Promise<void> {
  //   try {
  //     const userId = req.user?.user_id;
  //     const count = await this.serviceInstance.countReport(userId);
  //     if (count == 0) {
  //       res.status(404).json({ message: "Not found Report", data: 0 });
  //       return;
  //     }
  //     res.status(200).json({
  //       message: "Count report fetched successfully",
  //       data: count,
  //     });
  //   } catch (error) {
  //     this.handleError(res, "Failed to fetch count report!", error);
  //   }
  // }

  // Count of Report
  async addReport(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.user_id;
      const addReport = await this.serviceInstance.addReport(userId, req.body);
      if (!addReport) {
        res.status(400).json({ message: addReport });
        return;
      }
      res.status(200).json({
        message: addReport,
      });
    } catch (error) {
      this.handleError(res, "Failed to add report!", error);
    }
  }
}

export default ReportController;
