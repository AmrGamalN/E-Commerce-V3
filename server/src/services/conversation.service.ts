import  Conversation  from "../models/mongodb/conversation.model";
import { ConversationDtoType, ConversationDto } from "../dto/conversation.dto";
import { MessageDtoType } from "../dto/message.dto";

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

      const parsed = ConversationDto.safeParse(data);
      if (!parsed.success) {
        throw new Error("Invalid message data");
      }

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

      return parsed.data;
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

      if (retrievedConversation == null) {
        throw new Error("Conversation not found");
      }
      const { _id, ...conversationData } = retrievedConversation.toObject();
      const parsed = ConversationDto.safeParse(conversationData);

      if (!parsed.success) {
        throw new Error("Invalid conversation data");
      }
      const conversation = { _id, ...parsed.data };
      return conversation;
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
      });

      const conversationDto = retrievedConversation.map((conversation) => {
        const { _id, ...conversations } = conversation.toObject();
        const parsed = ConversationDto.safeParse(conversations);
        if (!parsed.success) {
          throw new Error("Invalid conversation data");
        }
        return { _id, ...parsed.data };
      });
      return conversationDto;
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
