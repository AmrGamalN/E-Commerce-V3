import { Request, Response } from "express";
import MessageService from "../../services/messaging/message.service";
import { Server } from "socket.io";
import { getSocketInstance, users } from "../../config/socket.io";

class MessageController {
  private static Instance: MessageController;
  private serviceInstance: MessageService;
  constructor() {
    this.serviceInstance = MessageService.getInstance();
  }

  public static getInstance(): MessageController {
    if (!MessageController.Instance) {
      MessageController.Instance = new MessageController();
    }
    return MessageController.Instance;
  }

  async sendMessage(req: Request, res: Response): Promise<void> {
    const retrievedMessage = await this.serviceInstance.addMessage(
      req.body,
      req.user?.name
    );
    if (!retrievedMessage) {
      res.status(400).json({ message: "Failed to send message" });
      return;
    }

    const io = getSocketInstance();
    const receiverSocketId = users.get(retrievedMessage.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("message", retrievedMessage);
    }

    res
      .status(200)
      .json({ message: "Message sent successfully", data: retrievedMessage });
  }

  // Get all message
  async getAllMessage(req: Request, res: Response): Promise<void> {
    const userId = req.body.userId ? req.body.userId : req.user?.user_id;
    const { id } = req.params;
    const { lastMessageDate } = req.body;
    const retrievedMessage = await this.serviceInstance.getAllMessage(
      userId,
      String(id),
      String(lastMessageDate)
    );

    if (retrievedMessage.length == 0) {
      res.status(200).json({ message: "Not found Message", data: [] });
      return;
    }

    res.status(200).json({
      message: "Message get Successfully",
      data: retrievedMessage,
    });
  }

  // Search message
  async searchMessage(req: Request, res: Response): Promise<void> {
    const userId = req.body.userId ? req.body.userId : req.user?.user_id;
    const { id, textSearch, page } = req.body;
    const retrievedMessage = await this.serviceInstance.searchMessage(
      userId,
      String(id),
      String(textSearch),
      Number(page)
    );

    if (retrievedMessage.length == 0) {
      res.status(200).json({ message: "Not found Message", data: [] });
      return;
    }

    res.status(200).json({
      message: "Message get Successfully",
      count: retrievedMessage.length,
      data: retrievedMessage,
    });
  }

  // Mark messages as read or unread
  async markMessagesAsRead(req: Request, res: Response): Promise<void> {
    const userId = req.user?.user_id;
    const { id } = req.body;
    const retrievedMessage = await this.serviceInstance.markMessagesAsRead(
      userId,
      String(id)
    );

    if (!retrievedMessage) {
      res.status(200).json({ retrievedMessage });
      return;
    }

    res.status(200).json({
      retrievedMessage,
    });
  }
}

export default MessageController;
