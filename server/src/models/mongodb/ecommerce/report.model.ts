import { Schema, model } from "mongoose";
import { ReportDtoType } from "../../../dto/ecommerce/report.dto";

const ReportFeedBackSchema = new Schema(
  {
    replyId: {
      type: String,
      ref: "User",
      required: true,
    },
    replyName: { type: String, required: true },
    message: { type: String, required: true },
    replyTime: { type: Date, default: Date.now },
  },
  { _id: false }
);

// Define the schema for a report
const ReportSchema = new Schema(
  {
    modelId: {
      // Conversation or item
      type: String,
      required: true,
    },
    reporterId: { type: String, required: true },
    reporterName: { type: String, required: true },
    reporterEmail: { type: String, required: true },
    reportedUserId: { type: String, required: true },
    subject: { type: String, required: true },
    reportType: {
      type: String,
      enum: ["item", "conversation"],
      required: true,
    },
    reason: { type: String, required: true, trim: true, maxlength: 500 },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
    feedBack: ReportFeedBackSchema,
  },
  { timestamps: true }
);

export const Report = model<ReportDtoType>("Report", ReportSchema);
