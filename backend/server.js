const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const http = require("http");
const {Server} = require("socket.io");
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});
//initialize socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
  },

  // ⭐ THIS LINE FIXES ESP32 CONNECTION
  allowEIO3: true,

  transports: ["websocket", "polling"],
});
// Middleware

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.get("/", (req, res) => {
    res.send("IoT Backend Running (CommonJS)");
});
app.use("/api", userRoutes);
app.use("/api", projectRoutes);
app.use("/api", sensorRoutes(io));
// WebSocket
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("joinProject", (projectId) => {
    console.log(`Socket ${socket.id} joined ${projectId}`);
    socket.join(projectId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});