import { Router } from "express";
import { registerValidator, loginValidator } from "../validator/auth.validator.js";
import { getMe, login, register } from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/authUser.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, register);

authRouter.post("/login", loginValidator, login);

authRouter.get("/me", authUser, getMe);

export default authRouter;
