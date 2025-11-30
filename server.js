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


dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://resto-frontend.vercel.app"
];

app.use((req, res, next) => {
  console.log("👉 REQUEST:", req.method, req.url);
  next();
});
  
// Middlewares
//app.options("/:path(.*)", cors());
// ✅ Handle preflight OPTIONS requests globally
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

app.use(express.json());
app.use(cookieParser());
/*app.use(cors({
  origin: "https://resto-backend-nine.vercel.app", // your frontend URL
  credentials: true
}));*/


// Enable CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow curl, Postman
    if (!allowedOrigins.includes(origin)) {
      return callback(new Error("CORS not allowed"), false);
    }
    return callback(null, true);
  },
  credentials: true
}));



// HTTP server
const server = http.createServer(app);

// Socket.IO server
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // allow both dev + production
    methods: ["GET", "POST", "PUT","DELETE"],
  },
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes());
app.use("/api/tables", tableRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/uploads", express.static("uploads"));

// Listen for client connections
/*
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
*/
// Start server
//const PORT = process.env.PORT || 5001;
//server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Start server only if running locally (optional)

// ✅ Use ES Module export
export default app;