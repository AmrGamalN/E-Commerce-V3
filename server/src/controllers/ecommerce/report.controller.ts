import { Request, Response } from "express";
import ReportService from "../../services/ecommerce/report.service";

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

  // Add Report
  async addReport(req: Request, res: Response): Promise<void> {
    const addReport = await this.serviceInstance.addReport(req.user, req.body);
    if (addReport) {
      res.status(200).json(addReport);
      return;
    }
    res.status(200).json(addReport);
  }

  // Get Report
  async getReport(req: Request, res: Response): Promise<void> {
    const reportId = req.params.id;
    const userId = req.body.userId ? req.body.userId : req.user?.user_id;
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
  }

  // Update report
  async updateReport(req: Request, res: Response): Promise<void> {
    const userId = req.body.userId ? req.body.userId : req.user?.user_id;
    const retrievedReport = await this.serviceInstance.updateReport(
      userId,
      req.body
    );
    if (retrievedReport == 0) {
      res.status(404).json({ message: "Not found report" });
      return;
    }
    res.status(200).json({ message: "Report updated successfully" });
  }

  // Update report
  async feedBackReport(req: Request, res: Response): Promise<void> {
    const adminId = req.body.userId ? req.body.userId : req.user?.user_id;
    const feedBack = await this.serviceInstance.feedBackReport(
      req.body,
      adminId
    );
    if (feedBack == null) {
      res.status(404).json(feedBack);
      return;
    }
    res.status(200).json(feedBack);
  }

  // Delete report
  async deleteReport(req: Request, res: Response): Promise<void> {
    const reportId = req.params.id;
    const userId = req.body.userId ? req.body.userId : req.user?.user_id;
    const retrievedReport = await this.serviceInstance.deleteReport(
      String(reportId),
      userId
    );
    if (!retrievedReport) {
      res.status(404).json(retrievedReport);
      return;
    }
    res.status(200).json(retrievedReport);
  }

  // Update Report status
  async updateReportStatus(req: Request, res: Response): Promise<void> {
    const { reportId, status } = req.body;
    const retrievedReport = await this.serviceInstance.updateReportStatus(
      reportId,
      status
    );
    if (retrievedReport == null) {
      res.status(404).json(retrievedReport);
      return;
    }
    res.status(200).json(retrievedReport);
  }

  // Get all report
  async getAllReport(req: Request, res: Response): Promise<void> {
    const userId = req.body.userId ? req.body.userId : req.user?.user_id;
    const retrievedReport = await this.serviceInstance.getAllReport(userId);
    if (retrievedReport.length == 0) {
      res.status(200).json({ message: "Not found Report", data: [] });
      return;
    }
    res.status(200).json({
      message: "Report get Successfully",
      data: retrievedReport,
    });
  }

  // Count of Report
  async countReport(req: Request, res: Response): Promise<void> {
    const userId = req.body.userId ? req.body.userId : req.user?.user_id;
    const count = await this.serviceInstance.countReport(String(userId));
    if (count == 0) {
      res.status(404).json({ message: "Not found Report", data: 0 });
      return;
    }
    res.status(200).json({
      message: "Count report fetched successfully",
      data: count,
    });
  }
}

export default ReportController;
