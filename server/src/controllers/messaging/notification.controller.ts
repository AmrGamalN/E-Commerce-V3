import { Request, Response } from "express";
import NotificationService from "../../services//messaging/notification.service";
import { title } from "process";

class NotificationController {
  private static Instance: NotificationController;
  private serviceInstance: NotificationService;
  constructor() {
    this.serviceInstance = NotificationService.getInstance();
  }

  public static getInstance(): NotificationController {
    if (!NotificationController.Instance) {
      NotificationController.Instance = new NotificationController();
    }
    return NotificationController.Instance;
  }

  private handleError(
    res: Response,
    message: string,
    error: unknown,
    status = 400
  ): void {
    res.status(status).json({
      message,
      error: error instanceof Error ? error.message : error,
    });
  }

  // Store Fcm token
  async storeFcmToken(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.body.userId ? req.body.userId : req.user?.user_id;
      const { fcmToken } = req.body;
      const retrievedToken = await this.serviceInstance.storeFcmToken(
        fcmToken,
        userId
      );
      if (retrievedToken.length == 0) {
        res.status(400).json({ message: "Failed to store token", data: "" });
        return;
      }
      res
        .status(200)
        .json({ message: "Token added Successfully", data: retrievedToken });
    } catch (error) {
      this.handleError(res, "Failed to add token", error);
    }
  }

  // Add Notification
  async sendNotification(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.body.userId ? req.body.userId : req.user?.user_id;
      const { title, body } = req.body;
      const retrievedNotification = await this.serviceInstance.sendNotification(
        userId,
        title,
        body
      );
      if (!retrievedNotification) {
        res.status(400).json({ message: "Failed to add Notification" });
        return;
      }
      res.status(200).json({ message: "Notification added Successfully" });
    } catch (error) {
      this.handleError(res, "Failed to add Notification", error);
    }
  }

  //   // Get Notification
  //   async getNotification(req: Request, res: Response): Promise<void> {
  //     try {
  //       const { id } = req.params;
  //       const userId = req.user?.user_id;
  //       const retrievedNotification = await this.serviceInstance.getNotification(
  //         String(id),
  //         userId
  //       );
  //       if (retrievedNotification == null) {
  //         res.status(404).json({ message: "Not found Notification", data: [] });
  //         return;
  //       }
  //       res.status(200).json({
  //         message: "Notification get Successfully",
  //         data: retrievedNotification,
  //       });
  //     } catch (error) {
  //       this.handleError(res, "Failed to get Notification", error);
  //     }
  //   }

  //   // Get all Notification
  //   async getAllNotification(req: Request, res: Response): Promise<void> {
  //     try {
  //       const userId = req.user?.user_id;
  //       const retrievedNotification =
  //         await this.serviceInstance.getAllNotification(userId);
  //       const count = await this.serviceInstance.countNotification();
  //       if (retrievedNotification.length == 0) {
  //         res.status(200).json({ message: "Not found Notification", data: [] });
  //         return;
  //       }
  //       res.status(200).json({
  //         count: count,
  //         message: "Notification get Successfully",
  //         data: retrievedNotification,
  //       });
  //     } catch (error) {
  //       this.handleError(res, "Failed to get Notification", error);
  //     }
  //   }

  //   // Update Notification
  //   async updateNotification(req: Request, res: Response): Promise<void> {
  //     try {
  //       const { id } = req.params;
  //       const userId = req.user?.user_id;
  //       const retrievedNotification =
  //         await this.serviceInstance.updateNotification(
  //           String(id),
  //           userId,
  //           req.body
  //         );
  //       if (retrievedNotification == null) {
  //         res.status(404).json({ message: "Not found Notification", data: [] });
  //         return;
  //       }
  //       res.status(200).json({
  //         message: "Notification updated Successfully",
  //         data: retrievedNotification,
  //       });
  //     } catch (error) {
  //       this.handleError(res, "Failed to update Notification", error);
  //     }
  //   }

  //   // Count of Notification
  //   async countNotification(req: Request, res: Response): Promise<void> {
  //     try {
  //       const count = await this.serviceInstance.countNotification();
  //       if (count == 0) {
  //         res.status(404).json({ message: "Not found Notification", data: 0 });
  //         return;
  //       }
  //       res.status(200).json({
  //         message: "Count Notification fetched successfully",
  //         data: count,
  //       });
  //     } catch (error) {
  //       this.handleError(res, "Failed to fetch count Notification!", error);
  //     }
  //   }

  //   // Delete Notification
  //   async deleteNotification(req: Request, res: Response): Promise<void> {
  //     try {
  //       const { id } = req.params;
  //       const userId = req.user?.user_id;
  //       const retrievedNotification =
  //         await this.serviceInstance.deleteNotification(String(id), userId);
  //       if (retrievedNotification == 0) {
  //         res.status(404).json({ message: "Not found Notification", data: [] });
  //         return;
  //       }
  //       res
  //         .status(200)
  //         .json({ message: "Notification deleted Successfully", data: [] });
  //     } catch (error) {
  //       this.handleError(res, "Failed to delete Notification", error);
  //     }
  //   }
}

export default NotificationController;
