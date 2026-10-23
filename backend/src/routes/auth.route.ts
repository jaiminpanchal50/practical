import { Router } from "express";
import { registerValidator, loginValidator } from "../validator/auth.validator.js";
import { login, register } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, register);

authRouter.post("/login", loginValidator, login);

export default authRouter;
