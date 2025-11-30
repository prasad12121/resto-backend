// server.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRouter.js";
import tableRoutes from "./routes/tableRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

// Load env and DB
dotenv.config();
connectDB();

const app = express();

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://resto-frontend-ten.vercel.app"
];

// -------------------------
// 🌍 GLOBAL CORS
// -------------------------
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow Postman / curl
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS Not Allowed"), false);
    },
    credentials: true,
  })
);

// -------------------------
// 🔓 Handle Preflight (OPTIONS)
// -------------------------
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(200);
  }
  next();
});

// Middleware
app.use(express.json());
app.use(cookieParser());

// Debug request log
app.use((req, res, next) => {
  console.log("👉 REQUEST:", req.method, req.url);
  next();
});

// -------------------------
// 📌 HTTP + SOCKET.IO SERVER
// -------------------------
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// -------------------------
// 📌 API ROUTES
// -------------------------
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes());
app.use("/api/tables", tableRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/uploads", express.static("uploads"));

// -------------------------
export default app;
