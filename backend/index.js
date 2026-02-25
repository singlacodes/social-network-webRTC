import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import cloudinary from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Chat } from "./models/ChatModel.js";
import { isAuth } from "./middlewares/isAuth.js";
import { User } from "./models/userModel.js";
import { app, server } from "./socket/socket.js";
import path from "path";
import axios from 'axios';

dotenv.config();

// Keep-alive ping to prevent server from sleeping (optional)
const interval = 30000;
const RENDER_URL = process.env.RENDER_URL || `https://social-network-webrtc.onrender.com/api/health`;

function reloadWebsite() {
  axios
    .get(RENDER_URL)
    .then((response) => {
      console.log(
        `Reloaded at ${new Date().toISOString()}: Status Code ${
          response.status
        }`
      );
    })
    .catch((error) => {
      console.error(
        `Error reloading at ${new Date().toISOString()}:`,
        error.message
      );
    });
}

// Only enable keep-alive in production
if (process.env.NODE_ENV === 'production') {
  setInterval(reloadWebsite, interval);
}

cloudinary.v2.config({
  cloud_name: process.env.Cloudinary_Cloud_Name,
  api_key: process.env.Cloudinary_Api,
  api_secret: process.env.Cloudinary_Secret,
});

//using middlewares
const allowedOrigins = [
  "http://localhost:5173",
  "https://social-network-webrtc.onrender.com"
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT;

// Health check endpoint for monitoring
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// to get all chats of user
app.get("/api/messages/chats", isAuth, async (req, res) => {
  try {
    const chats = await Chat.find({
      users: req.user._id,
    }).populate({
      path: "users",
      select: "name profilePic",
    });

    chats.forEach((e) => {
      e.users = e.users.filter(
        (user) => user._id.toString() !== req.user._id.toString()
      );
    });

    res.json(chats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// to get all users
app.get("/api/user/all", isAuth, async (req, res) => {
  try {
    const search = req.query.search || "";
    const users = await User.find({
      name: {
        $regex: search,
        $options: "i",
      },
      _id: { $ne: req.user._id },
    }).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// importing routes
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

//using routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/messages", messageRoutes);

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/frontend/dist")));

// Serve React app for any route that doesn't match API endpoints
app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  } else {
    next();
  }
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb();
});
