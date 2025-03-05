import Conversation from "../models/mongodb/conversation.model";
import Item from "../models/mongodb/item.model";
import { Report } from "../models/mongodb/report.model";
import {
  ReportDtoType,
  ReportDto,
  ReportAddDtoType,
  ReportAddDto,
} from "../dto/report.dto";

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
  async addReport(userId: string, body: ReportDtoType): Promise<object> {
    try {
      // Used to select model [item or conversation] and i
      const Model = body.reportType === "item" ? Item : Conversation;
      const retrieved = await (Model as any)
        .findOne({
          _id: body.id,
          $or: [{ participants: { $all: [userId] } }, { userId: userId }],
        })
        .lean();

      if (!retrieved) {
        throw new Error(`${body.reportType} not found`);
      }

      const report = await Report.create({
        id: body.id,
        reporterId: userId,
        reportedUserId:
          body.reportType === "item"
            ? retrieved.userId
            : retrieved.participants.find((id: string) => id !== userId),
        subject: body.subject,
        reason: body.reason,
        reportType: body.reportType,
      });

      await report.save();
      return {
        message: `Add report ${body.reportType} successfully, and we reply when check your report`,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : `Error to add report ${body.reportType}`
      );
    }
  }

  // Get Report by addressId and userId
  async getReport(addressId: string, userId: string): Promise<ReportDtoType> {
    try {
      const retrievedReport = await Report.findOne({
        _id: addressId,
        userId: userId,
      });

      if (retrievedReport == null) {
        throw new Error("Report not found");
      }
      const { _id, ...addressData } = retrievedReport.toObject();
      const parsed = ReportDto.safeParse(addressData);

      if (!parsed.success) {
        throw new Error("Invalid address data");
      }
      const address = { _id, ...parsed.data };
      return address;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching address"
      );
    }
  }

  // Get all address by userId
  async getAllReport(userId: string): Promise<ReportDtoType[]> {
    try {
      const retrievedReport = await Report.find({
        userId: userId,
      });

      const addressDto = retrievedReport.map((address) => {
        const { _id, ...addresses } = address.toObject();
        const parsed = ReportDto.safeParse(addresses);
        if (!parsed.success) {
          throw new Error("Invalid address data");
        }
        return { _id, ...parsed.data };
      });
      return addressDto;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching address"
      );
    }
  }

  // Update address
  async updateReport(
    addressId: string,
    userId: string,
    data: ReportAddDtoType
  ): Promise<ReportAddDtoType | null> {
    try {
      const parsed = ReportAddDto.safeParse(data);
      if (!parsed.success) {
        throw new Error("Invalid address data");
      }

      const updatedReport = await Report.findOneAndUpdate(
        {
          _id: addressId,
          userId: userId,
        },
        {
          $set: parsed.data,
        },
        { new: true, runValidators: true }
      );

      return updatedReport ? updatedReport.toObject() : null;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error updating address"
      );
    }
  }

  // Count of Report
  async countReport(): Promise<number> {
    try {
      const count = await Report.countDocuments();
      return count;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching address count"
      );
    }
  }

  // Delete address
  async deleteReport(addressId: string, userId: string): Promise<Number> {
    try {
      const deletedReport = await Report.deleteOne({
        _id: addressId,
        userId: userId,
      });
      return deletedReport.deletedCount;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error deleting address"
      );
    }
  }
}

export default ReportService;
