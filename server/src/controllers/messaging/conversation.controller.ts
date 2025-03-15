import { Request, Response } from "express";
import ConversationService from "../../services/messaging/conversation.service";

class ConversationController {
  private static Instance: ConversationController;
  private serviceInstance: ConversationService;
  constructor() {
    this.serviceInstance = ConversationService.getInstance();
  }

  public static getInstance(): ConversationController {
    if (!ConversationController.Instance) {
      ConversationController.Instance = new ConversationController();
    }
    return ConversationController.Instance;
  }

  // Get Conversation
  async getConversation(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.user?.user_id;
    const retrievedConversation = await this.serviceInstance.getConversation(
      String(id),
      userId
    );
    if (retrievedConversation == null) {
      res.status(404).json({ message: "Not found Conversation", data: [] });
      return;
    }
    res.status(200).json({
      message: "Conversation get Successfully",
      data: retrievedConversation,
    });
  }

  // Get all conversation
  async getAllConversation(req: Request, res: Response): Promise<void> {
    const userId = req.user?.user_id;
    const retrievedConversation = await this.serviceInstance.getAllConversation(
      userId
    );
    const count = await this.serviceInstance.countConversation(userId);
    if (retrievedConversation.length == 0) {
      res.status(200).json({ message: "Not found Conversation", data: [] });
      return;
    }
    res.status(200).json({
      count: count,
      message: "Conversation get Successfully",
      data: retrievedConversation,
    });
  }

  // Count of Conversation
  async countConversation(req: Request, res: Response): Promise<void> {
    const userId = req.user?.user_id;
    const count = await this.serviceInstance.countConversation(userId);
    if (count == 0) {
      res.status(404).json({ message: "Not found Conversation", data: 0 });
      return;
    }
    res.status(200).json({
      message: "Count conversation fetched successfully",
      data: count,
    });
  }
}

export default ConversationController;
