import Notification from "../../models/mongodb/messaging/notification.model";
import { NotificationDtoType, NotificationDto } from "../../dto/messaging/notification.dto";
import { auth } from "../../config/firebaseConfig";
import admin from "firebase-admin";
import { messaging } from "../../config/firebaseConfig";
import { Security } from "../../models/mongodb/user/userSecurity.model";

class NotificationService {
  private static Instance: NotificationService;
  constructor() {}
  public static getInstance(): NotificationService {
    if (!NotificationService.Instance) {
      NotificationService.Instance = new NotificationService();
    }
    return NotificationService.Instance;
  }

  // async storeFcmToken(fcmToken: string, userId: string): Promise<string[]> {
  //   try {
  //     let user = await User.findOne({ userId }).select("fcmTokens");
  //     if (!user) {
  //       throw new Error("User not found");
  //     } else {
  //       if (!user.fcmTokens.includes(fcmToken)) {
  //         user.fcmTokens.push(fcmToken);
  //       }
  //     }

  //     await user.save();
  //     return user.fcmTokens;
  //   } catch (error) {
  //     throw new Error(
  //       error instanceof Error ? error.message : "Error to store token"
  //     );
  //   }
  // }

  // async sendNotification(
  //   userId: string,
  //   title: string,
  //   body: string
  // ): Promise<string> {
  //   try {
  //     const userToken = await User.findOne({ userId }).select("fcmTokens");
  //     if (!userToken) {
  //       throw new Error("User not found or no FCM Token available!");
  //     }

  //     const message = {
  //       token: userToken.fcmTokens[0],
  //       notification: { title, body },
  //     };

  //     const retrievedMessage = await messaging.send(message);
  //     return retrievedMessage;
  //   } catch (error) {
  //     throw new Error(
  //       error instanceof Error ? error.message : "Error to send notification"
  //     );
  //   }
  // }

  async storeFcmToken(fcmToken: string, userId: string): Promise<string[]> {
    try {
      let user = await Security.findOne({ userId }).select("fcmTokens");
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
      const userToken = await Security.findOne({ userId }).select("fcmTokens");
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
}

export default NotificationService;
