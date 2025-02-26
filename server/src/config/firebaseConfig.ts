import admin from "firebase-admin";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithCustomToken,
} from "firebase/auth";
import dotenv from "dotenv";
dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG_ADMIN as string);

// Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const auth = admin.auth();

// Firebase Client
const serviceClient = JSON.parse(process.env.FIREBASE_CONFIG_CLIENT as string);
const app = initializeApp(serviceClient);
const authentication = getAuth(app);

// Notification
const messaging = admin.messaging();

export {
  auth,
  authentication,
  signInWithEmailAndPassword,
  messaging,
  signInWithCustomToken,
};
