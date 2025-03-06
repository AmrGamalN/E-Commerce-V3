import Conversation from "../models/mongodb/conversation.model";
import Item from "../models/mongodb/item.model";
import { Report } from "../models/mongodb/report.model";
import { sendVerificationEmail } from "../utils/emailUtil";
import {
  ReportDtoType,
  ReportDto,
  ReportAddDtoType,
  ReportUpdateDto,
  ReportUpdateDtoType,
  ReportFeedBackDtoType,
  ReportFeedBackDto,
} from "../dto/report.dto";
import mongoose from "mongoose";

class ReportService {
  private static Instance: ReportService;
  constructor() {}
  public static getInstance(): ReportService {
    if (!ReportService.Instance) {
      ReportService.Instance = new ReportService();
    }
    return ReportService.Instance;
  }

  // Used to add report to ite or conversation
  async addReport(user: any, body: ReportAddDtoType): Promise<object> {
    try {
      const { modelId, reportType, subject, reason } = body;
      const reporterId = user?.user_id;

      // Check if a report already exists
      const existingReport = await Report.findOne({
        modelId,
        reporterId,
      })
        .select(["modelId"])
        .lean();

      if (existingReport) {
        return { message: `Report of ${reportType} already exists` };
      }

      // Determine the appropriate model (Item or Conversation)
      const ReportedModel = reportType === "item" ? Item : Conversation;
      const reportedEntity = await (ReportedModel as any)
        .findOne({
          _id: modelId,
          $or: [{ participants: { $all: [reporterId] } }, { _id: modelId }],
        })
        .select(["userId", "participants"])
        .lean();

      if (!reportedEntity) {
        return { message: `Report of ${reportType} not found` };
      }

      // Create the report
      const report = new Report({
        modelId,
        reporterId,
        reporterName: user?.name,
        reporterEmail: user?.email,
        reportedUserId:
          reportType === "item"
            ? reportedEntity.userId
            : reportedEntity.participants?.find(
                (id: string) => id !== reporterId
              ),
        reportType,
        subject,
        reason,
      });
      await report.save();
      return {
        message: `The report ${reportType} has been added successfully and we will respond to your email '${user?.email}' within 48 hours.`,
        data: report,
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
      const retrievedReport = await Report.findOne({
        _id: reportId,
        reporterId: userId,
      });

      if (retrievedReport == null) {
        throw new Error("Report not found");
      }
      const { _id, ...reportData } = retrievedReport.toObject();
      const parsed = ReportDto.safeParse(reportData);

      if (!parsed.success) {
        throw new Error("Invalid report data");
      }
      const report = { _id, ...parsed.data };
      return report;
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
      });

      const reportDto = retrievedReport.map((report) => {
        const { _id, ...reports } = report.toObject();
        const parsed = ReportDto.safeParse(reports);
        if (!parsed.success) {
          throw new Error("Invalid report data");
        }
        return { _id, ...parsed.data };
      });
      return reportDto;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching report"
      );
    }
  }

  // Update report by itemId or conversationId and userId
  async updateReport(
    userId: string,
    body: ReportUpdateDtoType
  ): Promise<ReportUpdateDtoType | null> {
    try {
      const reportId = body.modelId;
      const parsed = ReportUpdateDto.safeParse(body);
      if (!parsed.success) {
        throw new Error("Invalid report data");
      }

      const updatedReport = await Report.findOneAndUpdate(
        {
          _id: reportId,
          reporterId: userId,
        },
        {
          $set: parsed.data,
        },
        { new: true, runValidators: true }
      );

      return updatedReport ? updatedReport.toObject() : null;
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
  async deleteReport(reportId: string, userId: string): Promise<Number> {
    try {
      const deletedReport = await Report.deleteOne({
        _id: reportId,
        reporterId: userId,
      });
      return deletedReport.deletedCount;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error deleting report"
      );
    }
  }

  async feedBackReport(
    body: ReportFeedBackDtoType,
    adminId: string
  ): Promise<object> {
    try {
      const parsed = ReportFeedBackDto.safeParse(body);
      if (!parsed.success) {
        throw new Error("Invalid report data");
      }

      const result = await Report.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(body.modelId) } },
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

      await Report.updateOne(
        { _id: body.modelId },
        {
          $set: {
            status: parsed.data.status,
            feedBack: {
              ...parsed.data,
              replyId: adminId,
              replyName: adminName,
            },
          },
        }
      );
      await sendVerificationEmail(
        report.reporterEmail,
        "",
        "Report feedback",
        `Your report regarding "${report.subject}" has received feedback: ${body.message}`
      );

      return { message: "Feedback added successfully" };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error in feedback report"
      );
    }
  }
}

export default ReportService;
