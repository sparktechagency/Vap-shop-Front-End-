import { Socket, io } from "socket.io-client";

const SOCKET_URL = "https://www.vapeshopmaps.com"; // Replace with your server URL

let socket: Socket | null = null;

export const initiateSocket = () => {
  if (socket) {
    console.warn("Socket is already initialized");
    return;
  }

  socket = io(SOCKET_URL, {
    transports: ["websocket"], // or ['polling', 'websocket'] depending on your server configuration
  });

  // socket.on("connect", () => {
  //   console.log("Connected to Socket.IO server");
  // });

  // socket.on("disconnect", () => {
  //   console.log("Disconnected from Socket.IO server");
  // });

  socket.on("connect_error", (error) => {
    console.warn("Connection Error:", error.message);
    // Optionally retry connection, show a UI alert, etc.
  });

  socket.on("connect_timeout", () => {
    console.warn("Connection Timeout");
    // Handle connection timeout, such as retrying connection.
  });

  socket.on("reconnect_failed", () => {
    console.warn("Reconnection Failed");
    // Handle reconnection failure, notify the user, etc.
  });

  socket.on("error", (error) => {
    console.warn("Socket Error:", error.message);
    // Handle general socket errors
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null; // Reset the socket instance after disconnection
    console.warn("Socket is disconnect");
  } else {
    console.warn("No socket to disconnect");
  }
};

export const getSocket = () => socket;

export const isSocketConnected = () => socket && socket.connected;
