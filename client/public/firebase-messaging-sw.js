/* eslint-disable no-undef, no-restricted-globals */

importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyClJS0Qj-W2dfPNAY52b1uPkzTSRdALexE",
  authDomain: "authentication-e0891.firebaseapp.com",
  databaseURL: "https://authentication-e0891-default-rtdb.firebaseio.com",
  projectId: "authentication-e0891",
  storageBucket: "authentication-e0891.firebasestorage.app",
  messagingSenderId: "1070372459773",
  appId: "1:1070372459773:web:23370583257ac223591a94",
  measurementId: "G-7JRQCNDSYH",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  });
});
