import Conversation from "../../models/mongodb/messaging/conversation.model";
import {
  ConversationDtoType,
  ConversationDto,
} from "../../dto/messaging/conversation.dto";
import { MessageDtoType } from "../../dto/messaging/message.dto";
import {
  formatDataAdd,
  formatDataGetAll,
  formatDataGetOne,
} from "../../utils/dataFormatter";

class ConversationService {
  private static Instance: ConversationService;
  constructor() {}
  public static getInstance(): ConversationService {
    if (!ConversationService.Instance) {
      ConversationService.Instance = new ConversationService();
    }
    return ConversationService.Instance;
  }

  // Add conversation
  async addConversation(data: MessageDtoType): Promise<ConversationDtoType> {
    try {
      const parsed = formatDataAdd(data, ConversationDto);
      let conversation = await Conversation.findOne({
        participants: { $all: [data.senderId, data.receiverId] },
      });

      if (conversation) {
        conversation.offerDetails = data.offerDetails;
        conversation.lastMessage = {
          senderId: data.senderId,
          text: data.text,
          attachments: data.attachments,
          messageType: data.messageType,
          timestamp: new Date(),
        };
        await conversation.save();
      } else {
        conversation = await Conversation.create({
          participants: [data.senderId, data.receiverId],
          offerDetails: data.offerDetails,
          lastMessage: {
            senderId: data.senderId,
            text: data.text,
            attachments: data.attachments,
            messageType: data.messageType,
            timestamp: new Date(),
          },
        });
      }
      return parsed;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error adding message"
      );
    }
  }

  // Get Conversation by conversationId and userId
  async getConversation(
    conversationId: string,
    userId: string
  ): Promise<ConversationDtoType> {
    try {
      const retrievedConversation = await Conversation.findOne({
        _id: conversationId,
        participants: { $all: [userId] },
      });
      return formatDataGetOne(retrievedConversation, ConversationDto);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching conversation"
      );
    }
  }

  // Get all conversation by userId
  async getAllConversation(userId: string): Promise<ConversationDtoType[]> {
    try {
      const retrievedConversation = await Conversation.find({
        participants: { $all: [userId] },
      }).lean();
      return formatDataGetAll(retrievedConversation, ConversationDto);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error fetching conversation"
      );
    }
  }

  // Count of Conversation
  async countConversation(userId: string): Promise<number> {
    try {
      const count = await Conversation.countDocuments({
        participants: { $all: [userId] },
      });
      return count;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error fetching conversation count"
      );
    }
  }
}

export default ConversationService;
