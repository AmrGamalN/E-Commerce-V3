import Conversation from "../../models/mongodb/messaging/conversation.model";
import Item from "../../models/mongodb/ecommerce/item.model";
import { Report } from "../../models/mongodb/ecommerce/report.model";
import { sendVerificationEmail } from "../../utils/sendEmail";
import {
  ReportDtoType,
  ReportDto,
  ReportAddDtoType,
  ReportUpdateDto,
  ReportUpdateDtoType,
  ReportFeedBackDtoType,
  ReportFeedBackDto,
} from "../../dto/ecommerce/report.dto";
import mongoose from "mongoose";
import {
  formatDataAdd,
  formatDataGetAll,
  formatDataGetOne,
  formatDataUpdate,
} from "../../utils/dataFormatter";
import DashboardService from "../dashboard/dashboard.service";

class ReportService {
  private static Instance: ReportService;
  private DashboardService: DashboardService;
  constructor() {
    this.DashboardService = new DashboardService();
  }
  public static getInstance(): ReportService {
    if (!ReportService.Instance) {
      ReportService.Instance = new ReportService();
    }
    return ReportService.Instance;
  }

  // Used to add report to item or conversation
  async addReport(user: any, body: ReportAddDtoType): Promise<object> {
    try {
      const { modelId, reportType, subject, reason } = body;

      // Check if a report already exists
      const existingReport = await Report.findOne({
        modelId,
        reporterId: user?.user_id,
      })
        .select(["modelId"])
        .lean();

      if (existingReport) {
        return { message: `Report of ${reportType} already exists` };
      }

      // Determine the appropriate model (Item or Conversation) || modelId is itemId or  conversationId
      const ReportedModel = reportType === "item" ? Item : Conversation;
      const reportedEntity = await (ReportedModel as any)
        .findOne({
          _id: modelId,
          $or: [{ participants: { $all: [user?.user_id] } }, { _id: modelId }],
        })
        .select(["userId", "participants"])
        .lean();

      if (!reportedEntity) {
        return { message: `Report of ${reportType} not found` };
      }

      if (reportType === "item" && user?.user_id === reportedEntity?.userId) {
        return { message: `Do not allow  to add a report to your item` };
      }

      // Create the report
      const addReport = await Report.create({
        modelId,
        reporterId: user?.user_id,
        reporterName: user?.name,
        reporterEmail: user?.email,
        reportedUserId:
          reportType === "item"
            ? reportedEntity.userId
            : reportedEntity.participants?.find(
                (id: string) => id !== user?.user_id
              ),
        reportType,
        subject,
        reason,
      });

      // Update dashboard
      const updateField = {
        pending: 1,
        totalDeleteReports: 1,
        totalReportItems: reportType === "item" ? 1 : 0,
        totalReportConversations: reportType === "conversation" ? 1 : 0,
      };
      this.DashboardService.updateDashboardRecordsInCaching(updateField);
      return {
        message: `The report ${reportType} has been added successfully and we will respond to your email '${user?.email}' within 48 hours.`,
        data: addReport,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : `Error adding report of ${body.reportType}`
      );
    }
  }

  // Get Report by itemId or conversationId and userId
  async getReport(reportId: string, userId: string): Promise<ReportDtoType> {
    try {
      const retrievedReport = await Report.findById({
        _id: reportId,
        reporterId: userId,
      }).lean();
      return formatDataGetOne(retrievedReport, ReportDto);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching report"
      );
    }
  }

  // Get all report by userId
  async getAllReport(userId: string): Promise<ReportDtoType[]> {
    try {
      const retrievedReport = await Report.find({
        reporterId: userId,
      }).lean();
      return formatDataGetAll(retrievedReport, ReportDto);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching report"
      );
    }
  }

  // Update report by itemId or conversationId and userId
  async updateReport(
    userId: string,
    data: ReportUpdateDtoType
  ): Promise<number> {
    try {
      const parsed = formatDataUpdate(data, ReportUpdateDto);
      const updatedReport = await Report.updateOne(
        {
          _id: new mongoose.Types.ObjectId(data.modelId),
          reporterId: userId,
        },
        {
          $set: parsed,
        }
      );
      return updatedReport.matchedCount;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error updating report"
      );
    }
  }

  // Count of report
  async countReport(userId: string): Promise<number> {
    try {
      const count = await Report.countDocuments({ reporterId: userId });
      return count;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching report count"
      );
    }
  }

  // Delete report by itemId or conversationId and userId
  async deleteReport(reportId: string, userId: string): Promise<object> {
    try {
      const deletedReport = await Report.findOneAndDelete(
        {
          _id: reportId,
          reporterId: userId,
        },
        {
          select: "status reportType",
        }
      ).lean();

      if (!deletedReport) {
        return { message: "Not found report", data: [] };
      }

      // Update dashboard
      const updateField = {
        totalReports: -1,
        totalDeleteReports: 1,
        [String(deletedReport.status)]: -1,
      };
      if (deletedReport.reportType === "item") {
        updateField.totalReportItems = -1;
      } else if (deletedReport.reportType === "conversation") {
        updateField.totalReportConversations = -1;
      }
      this.DashboardService.updateDashboardRecordsInCaching(updateField);
      return { message: "Report deleted Successfully", data: [] };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error deleting report"
      );
    }
  }

  async feedBackReport(
    data: ReportFeedBackDtoType,
    adminId: string
  ): Promise<object> {
    try {
      const parsed = formatDataAdd(data, ReportFeedBackDto);
      const result = await Report.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(data.modelId) } },
        {
          $lookup: {
            from: "users",
            let: { adminId: adminId },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$userId", "$$adminId"] },
                },
              },
              {
                $project: { name: 1 },
              },
            ],
            as: "admin",
          },
        },
        { $unwind: { path: "$admin", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            feedBack: 1,
            reporterEmail: 1,
            subject: 1,
            "admin.name": 1,
          },
        },
      ]);

      if (result.length == 0) {
        return { message: "Report not found" };
      }
      const report = result[0];
      const adminName = report.admin.name;

      if (report.feedBack != null) {
        return { message: "Feedback already exists" };
      }

      const updatedReport = await Report.findByIdAndUpdate(
        { _id: data.modelId },
        {
          $set: {
            status: parsed.status,
            feedBack: {
              ...parsed,
              replyId: adminId,
              replyName: adminName,
            },
          },
        },
        { select: "status" }
      ).lean();

      await sendVerificationEmail(
        report.reporterEmail,
        "",
        "Report feedback",
        `Your report regarding "${report.subject}" has received feedback: ${data.message}`
      );

      // Update dashboard
      if (updatedReport?.status && updatedReport?.status != parsed.status) {
        this.DashboardService.updateDashboardRecordsInCaching({
          [parsed.status]: 1,
          [String(updatedReport.status)]: -1,
        });
      }
      return { message: "Feedback added successfully" };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error in feedback report"
      );
    }
  }

  // Update report status
  async updateReportStatus(reportId: string, status: string): Promise<object> {
    try {
      const updatedStatus = await Report.findByIdAndUpdate(
        {
          _id: reportId,
        },
        {
          $set: { status },
        },
        { select: "status" }
      ).lean();

      if (!updatedStatus) {
        return { message: "Report not found" };
      }

      if (updatedStatus.status === status) {
        return { message: `status of report already ${status}` };
      }

      // Update dashboard
      this.DashboardService.updateDashboardRecordsInCaching({
        [status]: 1,
        [String(updatedStatus.status)]: -1,
      });
      return { message: "Report status updated successfully" };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error updating Report status"
      );
    }
  }
}

export default ReportService;
