import { model, Schema } from "mongoose";
import { NotificationDtoType } from "../../../dto/messaging/notification.dto";
import { date } from "zod";

const notificationSchema: Schema = new Schema(
  {
    notification: { type: String, required: true },
    type: { type: String, required: true },
    buyerId: { type: String, required: true },
    sellerId: { type: String, required: true },
    itemId: { type: String, required: true },
    time: { type: Date, required: true },
    status: { type: String, required: true ,enum:["read" ,"unread"] ,default :"unread" },
  },
  { timestamps: true }
);

const Notification = model<NotificationDtoType>(
  "notifications",
  notificationSchema
);
export default Notification;
