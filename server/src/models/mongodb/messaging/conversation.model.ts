import { Schema, model } from "mongoose";
import { ConversationDtoType } from "../../../dto/messaging/conversation.dto";

const offerDetailsSchema = new Schema({
  itemId: { type: String, required: true },
  status: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
});

// Define the schema for a conversation
const conversationSchema = new Schema(
  {
    participants: [{ type: String, required: true }], // first is senderId and second is receiverId
    sellerName: { type: String, required: true }, // Get from receiverId from user model
    buyerName: { type: String, required: true }, // The current user
    offerDetails: offerDetailsSchema,
    lastMessage: {
      senderId: { type: String },
      messageType: [
        {
          type: String,
          enum: ["TEXT", "IMAGE", "VIDEO", "OFFER"],
        },
      ],
      text: { type: String },
      attachments: { type: [String], default: [] },
      timestamp: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 });
const Conversation = model<ConversationDtoType>(
  "conversations",
  conversationSchema
);

export default Conversation;
