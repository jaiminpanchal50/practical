import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import config from "./config/config.js";
import leadRouter from "./routes/lead.route.js";
import authRouter from "./routes/auth.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// middlewares
app.use(express.json());
app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true,
  })
);

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