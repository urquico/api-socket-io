const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors"); // Import the CORS middleware

const app = express();
const server = http.createServer(app);

// Enable CORS for all routes using the cors middleware
app.use(cors());

const io = socketIO(server, {
  cors: {
    origin: "*", // Replace with the origin of your React app
    methods: ["GET", "POST"], // Add any additional HTTP methods your app uses
    credentials: true, // Enable credentials (cookies, authorization headers)
    transports: ["websocket"], // Allow only WebSocket transport
  },
});

const { PORT } = require("./globals");

// Define a sample route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Socket.IO connection event handler
io.on("connection", (socket) => {
  console.log("A new WebSocket connection has been established");

  // Handle messages from the client
  socket.on("message", (message) => {
    console.log(`Received message: ${message}`);

    // Broadcast the message to all connected clients
    io.emit("message", message);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("WebSocket connection closed");
  });
});

// Start the HTTP server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
