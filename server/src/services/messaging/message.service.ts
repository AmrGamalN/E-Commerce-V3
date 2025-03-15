import Message from "../../models/mongodb/messaging/message.model";
import {User} from "../../models/mongodb/user/user.model";
import Conversation from "../../models/mongodb/messaging/conversation.model";
import {
  MessageDtoType,
  MessageDto,
  MessageAddDto,
  MessageAddDtoType,
} from "../../dto/messaging/message.dto";
import { formatDataAdd, formatDataGetAll } from "../../utils/dataFormatter";
import { Security } from '../../models/mongodb/user/userSecurity.model';
const mongoose = require("mongoose");

class MessageService {
  private static Instance: MessageService;
  constructor() {}
  public static getInstance(): MessageService {
    if (!MessageService.Instance) {
      MessageService.Instance = new MessageService();
    }
    return MessageService.Instance;
  }

  async addMessage(
    data: MessageDtoType,
    buyerName: string
  ): Promise<MessageDtoType> {
    try {
      const parsed = formatDataAdd(data, MessageDto);
      let conversation = await Conversation.findOne({
        participants: { $all: [data.senderId, data.receiverId] },
      });

      if (conversation) {
        const message = await Message.create({
          conversationId: conversation._id,
          senderId: data.senderId,
          receiverId: data.receiverId,
          messageType: data.messageType,
          text: data.text,
          attachments: data.attachments,
          readStatus: { [data.senderId]: true, [data.receiverId]: false },
        });

        conversation.lastMessage = {
          senderId: data.senderId,
          text: data.text,
          attachments: data.attachments,
          messageType: data.messageType,
          timestamp: new Date(),
        };

        await conversation.save();
        await message.save();
      } else {
        const sellerName = await Security.findOne({ userId: data.receiverId })
          .select("name")
          .lean();

        conversation = await Conversation.create({
          participants: [data.senderId, data.receiverId],
          sellerName: sellerName?.name,
          buyerName: buyerName,
          offerDetails: data.offerDetails,
          lastMessage: {
            senderId: data.senderId,
            text: data.text,
            attachments: data.attachments,
            messageType: data.messageType,
            timestamp: new Date(),
          },
        });
        await conversation.save();
        const message = await Message.create({
          conversationId: conversation._id,
          senderId: data.senderId,
          receiverId: data.receiverId,
          messageType: data.messageType,
          text: data.text,
          attachments: data.attachments,
          readStatus: { [data.senderId]: true, [data.receiverId]: false },
        });
        await message.save();
      }

      return parsed;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error adding message"
      );
    }
  }

  // Get all message by userId and conversationId
  async getAllMessage(
    userId: string,
    conversationId: string,
    lastMessageDate?: string | ""
  ): Promise<MessageAddDtoType[]> {
    try {
      // const lastMessageDate = "2025-03-03T15:04:00.210+00:00";
      const query: any = {
        conversationId: new mongoose.Types.ObjectId(conversationId),
        $or: [{ senderId: userId }, { receiverId: userId }],
      };

      if (lastMessageDate && !isNaN(Date.parse(lastMessageDate))) {
        query.createdAt = { $lt: new Date(lastMessageDate) };
      }

      const retrievedMessages = await Message.find(query)
        .sort({ createdAt: -1 })
        .limit(30)
        .lean();

      return formatDataGetAll(retrievedMessages, MessageAddDto);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching message"
      );
    }
  }

  async searchMessage(
    userId: string,
    conversationId: string,
    textSearch: string,
    page: number | 1
  ): Promise<MessageAddDtoType[]> {
    try {
      page = isNaN(page) || page < 1 ? 1 : page;
      const retrievedMessages = await Message.find({
        conversationId: conversationId,
        $or: [{ senderId: userId }, { receiverId: userId }],
        text: { $regex: textSearch, $options: "i" },
      })
        .sort({ createdAt: -1 })
        .skip((page - 1) * 30)
        .limit(30)
        .lean();

      return retrievedMessages
        .map((message) => {
          const { conversationId, ...messages } = message;
          const parsed = MessageAddDto.safeParse({
            ...messages,
          });
          return parsed.success
            ? {
                conversationId,
                ...parsed.data,
              }
            : null;
        })
        .filter(Boolean) as MessageAddDtoType[];
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error finding message"
      );
    }
  }

  // Mark messages as read or unread
  async markMessagesAsRead(
    userId: string,
    conversationId: string
  ): Promise<object> {
    try {
      const lastMessage = await Message.findOne({
        conversationId: conversationId,
        [`readStatus.${userId}`]: { $ne: true },
      })
        .sort({ createdAt: -1 })
        .lean();

      if (!lastMessage) return { message: "All messages already read" };

      const result = await Message.updateMany(
        {
          conversationId,
          createdAt: { $lte: lastMessage.createdAt },
          [`readStatus.${userId}`]: { $ne: true },
        },
        { $set: { [`readStatus.${userId}`]: true } }
      );

      return {
        message:
          result.modifiedCount > 0
            ? "Messages marked as read"
            : "No messages to update",
        updatedCount: result.modifiedCount,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to mark messages"
      );
    }
  }
}

export default MessageService;
