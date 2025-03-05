// import React, { useState, useEffect } from "react";
// import { getMessaging, onMessage } from "firebase/messaging";
// import { initializeApp } from "firebase/app";
// import "../Notifications.css";

// const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG_CLIENT);
// const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     const unsubscribe = onMessage(messaging, (payload) => {
//       console.log("📩 Incoming notification:", payload);
//       setNotifications((prev) => [
//         { id: Date.now(), title: payload.notification.title, body: payload.notification.body, read: false },
//         ...prev,
//       ]);
//     });

//     return () => unsubscribe();
//   }, []);

//   const markAsRead = (id) => {
//     setNotifications((prev) =>
//       prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
//     );
//     setIsOpen(false);
//   };

//   return (
//     <div className="notification-container">
//       <div className="notification-icon" onClick={() => setIsOpen(!isOpen)}>
//         🔔
//         {notifications.some((notif) => !notif.read) && (
//           <span className="notification-badge">{notifications.filter((notif) => !notif.read).length}</span>
//         )}
//       </div>

//       {isOpen && (
//         <div className="notification-dropdown">
//           {notifications.length === 0 ? (
//             <p className="empty-message">No notifications</p>
//           ) : (
//             notifications.map((notif) => (
//               <div
//                 key={notif.id}
//                 className={`notification-item ${notif.read ? "read" : "unread"}`}
//                 onClick={() => markAsRead(notif.id)}
//               >
//                 <strong>{notif.title}</strong>
//                 <p>{notif.body}</p>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Notifications;


import React, { useState, useEffect } from "react";
import { getMessaging, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import "../css/Notifications.css";

const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG_CLIENT);
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // جلب userId من localStorage
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Incoming notification:", payload);
      if (payload.data && payload.data.userId === userId) {
        setNotifications((prev) => [
          { id: Date.now(), title: payload.notification.title, body: payload.notification.body, read: false },
          ...prev,
        ]);
      }
    });
  
    return () => unsubscribe();
  }, [userId]);
  

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
    setIsOpen(false); 
  };

  return (
    <div className="notification-container">
      <div className="notification-icon" onClick={() => setIsOpen(!isOpen)}>
        🔔
        {notifications.some((notif) => !notif.read) && (
          <span className="notification-badge">{notifications.filter((notif) => !notif.read).length}</span>
        )}
      </div>

      {isOpen && (
        <div className="notification-dropdown">
          {notifications.length === 0 ? (
            <p className="empty-message">No notifications</p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`notification-item ${notif.read ? "read" : "unread"}`}
                onClick={() => markAsRead(notif.id)}
              >
                <strong>{notif.title}</strong>
                <p>{notif.body}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;

