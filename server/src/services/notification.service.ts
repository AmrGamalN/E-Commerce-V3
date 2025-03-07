import Notification from "../models/mongodb/notification.model";
import { NotificationDtoType, NotificationDto } from "../dto/notification.dto";
import { auth } from "../config/firebaseConfig";
import admin from "firebase-admin";
import { messaging } from "../config/firebaseConfig";
import User from "../models/mongodb/user.model";

class NotificationService {
  private static Instance: NotificationService;
  constructor() {}
  public static getInstance(): NotificationService {
    if (!NotificationService.Instance) {
      NotificationService.Instance = new NotificationService();
    }
    return NotificationService.Instance;
  }

  async storeFcmToken(fcmToken: string, userId: string): Promise<string[]> {
    try {
      let user = await User.findOne({ userId }).select("fcmTokens");
      if (!user) {
        throw new Error("User not found");
      } else {
        if (!user.fcmTokens.includes(fcmToken)) {
          user.fcmTokens.push(fcmToken);
        }
      }

      await user.save();
      return user.fcmTokens;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error to store token"
      );
    }
  }

  async sendNotification(
    userId: string,
    title: string,
    body: string
  ): Promise<string> {
    try {
      const userToken = await User.findOne({ userId }).select("fcmTokens");
      if (!userToken) {
        throw new Error("User not found or no FCM Token available!");
      }

      const message = {
        token: userToken.fcmTokens[0],
        notification: { title, body },
      };

      const retrievedMessage = await messaging.send(message);
      return retrievedMessage;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error to send notification"
      );
    }
  }

  // Add notification
  // private async addNotification(
  //   data: NotificationDtoType,
  //   userId: string
  // ): Promise<NotificationDtoType> {
  //   try {
  //     const parsed = NotificationDto.safeParse(data);
  //     if (!parsed.success) {
  //       throw new Error("Invalid notification data");
  //     }
  //     const notification = await Notification.create({
  //       ...parsed.data,
  //       userId,
  //     });
  //     await notification.save();
  //     return notification;
  //   } catch (error) {
  //     throw new Error(
  //       error instanceof Error ? error.message : "Error adding notification"
  //     );
  //   }
  // }

  // // Get Notification by notificationId and userId
  // async getNotification(
  //   notificationId: string,
  //   userId: string
  // ): Promise<NotificationDtoType> {
  //   try {
  //     const retrievedNotification = await Notification.findOne({
  //       _id: notificationId,
  //       userId: userId,
  //     });

  //     if (retrievedNotification == null) {
  //       throw new Error("Notification not found");
  //     }
  //     const parsed = NotificationDto.safeParse(retrievedNotification);

  //     if (!parsed.success) {
  //       throw new Error("Invalid notification data");
  //     }
  //     const notification = { _id: retrievedNotification?._id, ...parsed.data };
  //     return notification;
  //   } catch (error) {
  //     throw new Error(
  //       error instanceof Error ? error.message : "Error fetching notification"
  //     );
  //   }
  // }

  // // Get all notification by userId
  // async getAllNotification(userId: string): Promise<NotificationDtoType[]> {
  //   try {
  //     const retrievedNotification = await Notification.find({
  //       userId: userId,
  //     });

  //     const notificationDto = retrievedNotification.map((notification) => {
  //       const { _id, ...notifications } = notification.toObject();
  //       const parsed = NotificationDto.safeParse(notification);
  //       if (!parsed.success) {
  //         throw new Error("Invalid notification data");
  //       }
  //       return { _id, ...parsed.data };
  //     });
  //     return notificationDto;
  //   } catch (error) {
  //     throw new Error(
  //       error instanceof Error ? error.message : "Error fetching notification"
  //     );
  //   }
  // }

  // // Update notification
  // async updateNotification(
  //   notificationId: string,
  //   userId: string,
  //   data: NotificationDtoType
  // ): Promise<NotificationDtoType | null> {
  //   try {
  //     const parsed = NotificationDto.safeParse(data);
  //     if (!parsed.success) {
  //       throw new Error("Invalid notification data");
  //     }

  //     const updatedNotification = await Notification.findOneAndUpdate(
  //       {
  //         _id: notificationId,
  //         userId: userId,
  //       },
  //       {
  //         $set: parsed.data,
  //       },
  //       { new: true, runValidators: true }
  //     );

  //     return updatedNotification ? updatedNotification.toObject() : null;
  //   } catch (error) {
  //     throw new Error(
  //       error instanceof Error ? error.message : "Error updating notification"
  //     );
  //   }
  // }

  // // Count of Notification
  // async countNotification(): Promise<number> {
  //   try {
  //     const count = await Notification.countDocuments();
  //     return count;
  //   } catch (error) {
  //     throw new Error(
  //       error instanceof Error
  //         ? error.message
  //         : "Error fetching notification count"
  //     );
  //   }
  // }

  // // Delete notification
  // async deleteNotification(
  //   notificationId: string,
  //   userId: string
  // ): Promise<Number> {
  //   try {
  //     const deletedNotification = await Notification.deleteOne({
  //       _id: notificationId,
  //       userId: userId,
  //     });
  //     return deletedNotification.deletedCount;
  //   } catch (error) {
  //     throw new Error(
  //       error instanceof Error ? error.message : "Error deleting notification"
  //     );
  //   }
  // }
}

export default NotificationService;
