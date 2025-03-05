// WebSocket Setup (Server-side)
import { Server, Socket } from "socket.io";
let ioInstance: Server;
export const users = new Map<string, string>(); // userId -> socketId

export const initializeSocket = (server: any) => {
  ioInstance = new Server(server);

  ioInstance.on("connection", (socket: Socket) => {
    // console.log("New user connected:", socket.id);

    socket.on("register", (userId: string) => {
      users.set(userId, socket.id);
      ioInstance.emit("onlineUsers", Array.from(users.keys()));
      // console.log(`User ${userId} registered with socket ID: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (const [userId, id] of users.entries()) {
        if (id === socket.id) {
          users.delete(userId);
          break;
        }
      }
      ioInstance.emit("onlineUsers", Array.from(users.keys()));
      // console.log(`User ${userId} disconnected`);
    });
  });

  return ioInstance;
};

export const getSocketInstance = (): Server => {
  if (!ioInstance) {
    throw new Error("WebSocket is not initialized!");
  }
  return ioInstance;
};
