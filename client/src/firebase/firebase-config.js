import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  deleteToken,
} from "firebase/messaging";

const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG_CLIENT);
const app = initializeApp(firebaseConfig);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered:", registration);
    })
    .catch((err) => {
      console.warn("Service Worker registration failed:", err);
    });
} else {
  console.warn("Service Worker is not supported in this browser.");
}

let messaging;
if ("Notification" in window && "serviceWorker" in navigator) {
  messaging = getMessaging(app);
} else {
  console.warn("Firebase Messaging is not supported on this browser.");
}

export const requestForToken = async (userId) => {
  try {
    const registration = await navigator.serviceWorker.ready;
    // await deleteToken(messaging);
    const currentToken = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_VAPIDKEY,
      serviceWorkerRegistration: registration,
      userId,
    });

    if (!currentToken) {
      console.log("FCM Token not found.");
      return null;
    }
    return currentToken;
  } catch (error) {
    console.error("Error fetching FCM Token:", error);
    return null;
  }
};

onMessage(messaging, (payload) => {
  console.log("Foreground Notification Received:", payload);
});
