const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Create a new Socket.IO instance and attach it to our server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your React frontend
    methods: ["GET", "POST"],
  },
});

app.use(cors());

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Listen for messages from the client
  socket.on("send_message", (data) => {
    console.log("📨 Message received:", data);
    // Broadcast message to all connected clients
    io.emit("receive_message", data);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// Start the HTTP + WebSocket server
server.listen(3001, () => {
  console.log("🚀 Server running on port 3001");
});
