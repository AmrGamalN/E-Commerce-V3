import { Schema, model } from "mongoose";
import { ReportDtoType } from "../../dto/report.dto";

// Define the schema for a report
const ReportSchema = new Schema(
  {
    id: {
      // Conversation or item
      type: String,
      required: true,
    },
    reporterId: { type: String, required: true },
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
      enum: ["PENDING", "REVIEWED", "RESOLVED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const Report = model<ReportDtoType>("Report", ReportSchema);
