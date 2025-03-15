import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "conversations",
      required: true,
    },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    messageType: [
      {
        type: String,
        enum: ["TEXT", "IMAGE", "VIDEO", "OFFER"],
        default: "TEXT",
      },
    ],
    text: { type: String, default: "" },
    attachments: { type: [String], default: [] },
    readStatus: {
      type: Map,
      of: Boolean,
      default: {},
      transform: (val: Map<string, boolean>) =>
        Object.fromEntries(val || new Map()),
    },
  },
  { timestamps: true }
);

messageSchema.index({
  conversationId: 1,
  senderId: 1,
  receiverId: 1,
  createdAt: -1,
});
messageSchema.index({ conversationId: 1, text: 1, createdAt: -1 });
messageSchema.index({ conversationId: 1, createdAt: -1 });

const Message = model("messages", messageSchema);
export default Message;
