
import { Router } from "express";
import { createLead, createNote, deleteLead, getAllLead, getAllNote, getLead, updateLead } from "../controllers/lead.controller.js";
import { authUser } from "../middlewares/authUser.middleware.js";
import { leadValidator, noteValidator, updateLeadValidator } from "../validator/lead.validator.js";

const leadRouter = Router();

leadRouter.get("/", authUser, getAllLead);
leadRouter.post("/", authUser, leadValidator, createLead);
leadRouter.get("/:id", authUser, getLead);
leadRouter.patch("/:id", authUser, updateLeadValidator, updateLead);
leadRouter.delete("/:id", authUser, deleteLead);



// notes endpoints
leadRouter.get("/:id/notes", authUser, getAllNote);
leadRouter.post("/:id/notes", authUser, noteValidator, createNote);



export default leadRouter;
