import { Router } from "express";

const authRouter = Router();

authRouter.post("/register", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "user registered",
  });
});

authRouter.post("/login", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "user logged in",
  });
});

export default authRouter;
