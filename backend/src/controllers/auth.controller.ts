
import type { Request, Response, NextFunction } from "express";
import db from "../config/db.js";
import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcryptjs";
import config from "../config/config.js";
import type { IRegisterPayload, ILoginPayload } from "../types/auth.type.js";

interface UserRow {
    id: number;
    name: string;
    email: string;
    password: string;
}

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, email, password } = req.body as IRegisterPayload;

        const normalizedEmail = email.toLowerCase();

        // Check user exists
        const existingUser = db.prepare("SELECT id FROM users WHERE email = ?").get(normalizedEmail);

        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "User already exists",
            });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Insert user
        const result = db
            .prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)")
            .run(name, normalizedEmail, hashedPassword);

        const token = generateToken({
            id: String(result.lastInsertRowid),
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
        });
    } catch (error) {
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body as ILoginPayload;

        const user = db
            .prepare("SELECT id, name, email, password FROM users WHERE email = ?")
            .get(email.toLowerCase()) as UserRow | undefined;

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }

        const token = generateToken({
            id: String(user.id),
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
}
