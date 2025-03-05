import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import ChatComponent from "./ChatComponent";

const socket = io("http://localhost:8080", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

const ChatPage = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      socket.emit("register", userId);
    }

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users.filter((id) => id !== userId)); 
    });

    return () => socket.off("onlineUsers");
  }, [userId]);

  return (
    <div className="chat-page">
      <div className="user-list">
        <h3>🔹 Online Users</h3>
        {onlineUsers.length > 0 ? (
          onlineUsers.map((user) => (
            <button key={user} onClick={() => setCurrentChatUser(user)}>
              {user}
            </button>
          ))
        ) : (
          <p>No users online</p>
        )}
      </div>

      <div className="chat-container">
        {currentChatUser ? (
          <ChatComponent userId={userId} currentChatUser={currentChatUser} />
        ) : (
          <p>Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
