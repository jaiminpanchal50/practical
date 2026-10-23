
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import type { IPayload } from "../types/jwt.type.js";

export function generateToken(payload: IPayload): string {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: "1d",
  });
}

export function verifyToken(token: string): IPayload {
  return jwt.verify(token, config.JWT_SECRET) as IPayload;
}
