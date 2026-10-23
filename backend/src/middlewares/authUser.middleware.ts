import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";
import db from "../config/db.js";

export function authUser(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies.token as string | undefined;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const decodedToken = verifyToken(token);

        const user = db
            .prepare("SELECT id, name, email FROM users WHERE id = ?")
            .get(decodedToken.id) as { id: number; name: string; email: string } | undefined;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
}