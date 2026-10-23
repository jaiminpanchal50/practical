import type { NextFunction, Request, Response } from "express";
import config from "../config/config.js";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error("Unhandled error:", err);
    res.status(500).json({
        success: false,
        message: config.NODE_ENV === "production" ? "Internal server error" : err.message,
    });
}