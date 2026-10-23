import type { JwtPayload } from "jsonwebtoken";

export interface IPayload extends JwtPayload {
  id: string;
}
