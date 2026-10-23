import express, { type Request, type Response } from "express";
import cors from "cors";
import config from "./config/config.js";
import leadRouter from "./routes/lead.route.js";
import authRouter from "./routes/auth.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit"

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true,
  })
);


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    status: 429,
    error: 'Too many requests, please try again later.'
  }
});

app.use(limiter)

// health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Backend is running",
  });
});

// routes
app.use("/api/auth", authRouter);
app.use("/api/leads", leadRouter);


// global error handler
app.use(errorHandler)

export default app;