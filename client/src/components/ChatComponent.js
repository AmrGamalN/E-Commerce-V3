// import React, { useState, useEffect } from "react";
// import io from "socket.io-client";
// import "../css/ChatComponent.css";

// const socket = io("http://localhost:8080", {
//   transports: ["websocket", "polling"],
//   withCredentials: true,
// });

// const ChatComponent = ({ userId, currentChatUser }) => {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const senderId = localStorage.getItem("userId"); // المستخدم الحالي
//   const receiverId = currentChatUser; // المستخدم الذي يتم الدردشة معه

//   useEffect(() => {
//     if (senderId) {
//       socket.emit("register", senderId);
//     }

//     socket.on("message", (receivedMessage) => {
//       console.log("New Message:", receivedMessage);

//       // التحقق من عدم تكرار الرسالة
//       setMessages((prev) => {
//         const isDuplicate = prev.some(
//           (msg) =>
//             msg.senderId === receivedMessage.senderId &&
//             msg.text === receivedMessage.text &&
//             JSON.stringify(msg.attachments) ===
//               JSON.stringify(receivedMessage.attachments)
//         );
//         return isDuplicate ? prev : [...prev, receivedMessage];
//       });
//     });

//     return () => socket.off("message");
//   }, [senderId, receiverId]);

//   const sendMessage = () => {
//     if (message.trim() && receiverId && senderId !== receiverId) {
//       const messageData = {
//         senderId: senderId,
//         receiverId: receiverId,
//         messageType: ["TEXT", "VIDEO"],
//         text: message,
//         attachments: [],
//         readStatus: { [senderId]: true, [receiverId]: false },
//         offerDetails: {
//           itemId: "KboCqdCGQueArlFD13wPO6X123456",
//           price: 200,
//           status: "UNDER_REVIEW",
//           originalPrice: 300,
//         },
//       };
//       socket.emit("message", messageData);
//       setMessages((prev) => [...prev, messageData]);
//       setMessage("");
//     }
//   };

//   return (
//     <div className="chat-container">
//       <h2 className="chat-header">Chat 💬</h2>
//       <div className="chat-box">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`message ${
//               msg.senderId === senderId ? "sent" : "received"
//             }`}
//           >
//             {/* عرض النص إن وجد */}
//             {msg.text && <p>{msg.text}</p>}

//             {/* عرض المرفقات إن وجدت */}
//             {msg.attachments.length > 0 &&
//               msg.attachments.map((attachment, idx) => (
//                 <div key={idx} className="attachment">
//                   {attachment.endsWith(".jpg") ||
//                   attachment.endsWith(".png") ||
//                   attachment.endsWith(".jpeg") ? (
//                     <img
//                       src={attachment}
//                       alt="Attachment"
//                       className="chat-image"
//                     />
//                   ) : (
//                     <a
//                       href={attachment}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       {attachment}
//                     </a>
//                   )}
//                 </div>
//               ))}
//           </div>
//         ))}
//       </div>
//       <div className="chat-input">
//         <input
//           type="text"
//           className="message-input"
//           placeholder="Type a message..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <button className="send-button" onClick={sendMessage}>
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatComponent;

import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "../css/ChatComponent.css";

const ChatComponent = ({ userId, currentChatUser }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const senderId = localStorage.getItem("userId"); // المستخدم الحالي
  const receiverId = currentChatUser; // المستخدم الذي يتم الدردشة معه

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:8080", {
        transports: ["websocket", "polling"],
        withCredentials: true,
      });
    }
    const socket = socketRef.current;

    if (senderId) {
      socket.emit("register", senderId);
    }

    socket.on("message", (receivedMessage) => {
      setMessages((prev) => {
        const isDuplicate = prev.some(
          (msg) =>
            msg.senderId === receivedMessage.senderId &&
            msg.text === receivedMessage.text &&
            JSON.stringify(msg.attachments) ===
              JSON.stringify(receivedMessage.attachments)
        );
        return isDuplicate ? prev : [...prev, receivedMessage];
      });
    });
    return () => {
      socket.off("message");
    };
  }, [senderId, receiverId]);

  const sendMessage = async () => {
    if (message.trim() && receiverId && senderId !== receiverId) {
      const messageData = {
        senderId: senderId,
        receiverId: receiverId,
        messageType: ["TEXT", "VIDEO"],
        text: message,
        attachments: [],
        readStatus: { [senderId]: true, [receiverId]: false },
        offerDetails: {
          itemId: "KboCqdCGQueArlFD13wPO6X123456",
          price: 200,
          status: "UNDER_REVIEW",
          originalPrice: 300,
        },
      };

      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/message/send",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(messageData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to send message");
        }
        
        const savedMessage = await response.json();
        setMessages((prev) => [...prev, savedMessage.data]);
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-header">Chat 💬</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.senderId === senderId ? "sent" : "received"
            }`}
          >
            {msg.text && <p>{msg.text}</p>}
            {Array.isArray(msg.attachments) &&
              msg.attachments.length > 0 &&
              msg.attachments.map((attachment, idx) => (
                <div key={idx} className="attachment">
                  {attachment.endsWith(".jpg") ||
                  attachment.endsWith(".png") ||
                  attachment.endsWith(".jpeg") ? (
                    <img
                      src={attachment}
                      alt="Attachment"
                      className="chat-image"
                    />
                  ) : (
                    <a
                      href={attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {attachment}
                    </a>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          className="message-input"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="send-button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;

