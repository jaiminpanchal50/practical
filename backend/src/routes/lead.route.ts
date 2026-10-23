
import { Router } from "express";
import {  createLead,  deleteLead,  getAllLead,  getLead,  updateLead} from "../controllers/lead.controller.js";
import { authUser } from "../middlewares/authUser.middleware.js";
import {  leadValidator,  updateLeadValidator,} from "../validator/lead.validator.js";

const leadRouter = Router();

leadRouter.get("/", authUser, getAllLead);
leadRouter.post("/", authUser, leadValidator, createLead);
leadRouter.get("/:id", authUser, getLead);
leadRouter.patch("/:id", authUser, updateLeadValidator, updateLead);
leadRouter.delete("/:id", authUser, deleteLead);

export default leadRouter;
