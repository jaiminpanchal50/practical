
import type { NextFunction, Request, Response } from "express";
import db from "../config/db.js";
import type {
    ILeadPayload,
    ILeadRow,
    LeadStatus,
} from "../types/lead.type.js";

const LIMIT = 10;

const ALLOWED_STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "lost"];

function parseLeadId(value: string): number | null {
    const id = Number(value);

    return Number.isSafeInteger(id) && id > 0 ? id : null;
}


export function createLead(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, email, phone, status } = req.body as ILeadPayload;

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedName = name.trim();
        const normalizedPhone = phone?.trim() || null;
        const leadStatus = status ?? "new";

        const result = db.prepare(` INSERT INTO leads (name, email, phone, status) VALUES (?, ?, ?, ?) `).run(normalizedName, normalizedEmail, normalizedPhone, leadStatus);

        console.log("result", result)
        const lead = db.prepare(`SELECT id, name, email, phone, status, createdAt FROM leads WHERE id = ?`).get(Number(result.lastInsertRowid)) as ILeadRow;
        console.log("lead", lead)

        return res.status(201).json({
            success: true,
            message: "Lead created successfully",
            lead,
        });
    } catch (error) {
        return next(error);
    }
}



export function getAllLead(req: Request, res: Response, next: NextFunction) {
    try {
        const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
        const status = typeof req.query.status === "string" ? req.query.status : "";
        const offset = Number(req.query.offset ?? 0);

        if (!Number.isSafeInteger(offset) || offset < 0) {
            return res.status(400).json({
                success: false,
                message: "Offset must be a non-negative integer",
            });
        }

        if (status && !ALLOWED_STATUSES.includes(status as LeadStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid lead status",
            });
        }

        const conditions: string[] = [];
        const params: string[] = [];

        if (search) {
            conditions.push("(name LIKE ? OR email LIKE ?)");
            params.push(`%${search}%`, `%${search}%`);
        }

        if (status) {
            conditions.push("status = ?");
            params.push(status);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        const allLeads = db.prepare(`SELECT id, name, email, phone, status, createdAt FROM leads ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`).all(...params, LIMIT, offset) as ILeadRow[];

        const countResult = db.prepare(`SELECT COUNT(*) AS total FROM leads ${whereClause}`).get(...params) as { total: number };

        return res.status(200).json({
            success: true,
            message: "Leads fetched successfully",
            allLeads,
            pagination: {
                total: countResult.total,
                limit: LIMIT,
                offset,
                hasMore: offset + allLeads.length < countResult.total,
            },
        });
    } catch (error) {
        return next(error);
    }
}

export function getLead(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseLeadId(req.params.id as string);

        if (id === null) {
            return res.status(400).json({
                success: false,
                message: "Invalid lead ID",
            });
        }

        const lead = db.prepare(`SELECT id, name, email, phone, status, createdAt FROM leads WHERE id = ?`).get(id) as ILeadRow | undefined;

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lead fetched successfully",
            lead,
        });
    } catch (error) {
        return next(error);
    }
}

export function updateLead(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseLeadId(req.params.id as string);
        const status = req.body.status as LeadStatus;

        if (id === null) {
            return res.status(400).json({
                success: false,
                message: "Invalid lead ID",
            });
        }

        const existingLead = db
            .prepare("SELECT id FROM leads WHERE id = ?")
            .get(id);

        if (!existingLead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found",
            });
        }

        db.prepare("UPDATE leads SET status = ? WHERE id = ?").run(status, id);

        const updatedLead = db.prepare(`SELECT id, name, email, phone, status, createdAt FROM leads WHERE id = ?`).get(id) as ILeadRow;

        return res.status(200).json({
            success: true,
            message: "Lead updated successfully",
            lead: updatedLead,
        });
    } catch (error) {
        return next(error);
    }
}



export function deleteLead(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseLeadId(req.params.id as string);

        if (id === null) {
            return res.status(400).json({
                success: false,
                message: "Invalid lead ID",
            });
        }

        const result = db.prepare("DELETE FROM leads WHERE id = ?").run(id);

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Lead not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lead deleted successfully",
        });
    } catch (error) {
        return next(error);
    }
}



// notes controllers

export function getAllNote(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseLeadId(req.params.id as string);

        if (id === null) {
            return res.status(400).json({
                success: false,
                message: "Invalid lead ID",
            });
        }


        const isValidLeadId = db.prepare(`SELECT id FROM leads WHERE id = ?`).get(id);

        if (!isValidLeadId) {
            return res.status(404).json({
                success: false,
                message: "Lead not found",
            });
        }

        const notes = db.prepare(`SELECT * FROM notes WHERE leadId = ?`).all(id) as any[];
        console.log(notes);

        return res.status(200).json({
            success: true,
            message: "Notes fetched successfully",
            notes,
        });
    } catch (error) {
        next(error)
    }
}


export function createNote(req: Request, res: Response, next: NextFunction) {
    try {
        const leadId = parseLeadId(req.params.id as string);
        const { content } = req.body;

        if (leadId === null) {
            return res.status(400).json({
                success: false,
                message: "Invalid lead ID",
            });
        }

        const isValidLeadId = db.prepare(`SELECT id FROM leads WHERE id = ?`).get(leadId);

        if (!isValidLeadId) {
            return res.status(404).json({
                success: false,
                message: "Lead not found",
            });
        }

        const normalizedContent = content.trim();


        const result = db.prepare(` INSERT INTO notes (content, leadId) VALUES (?, ?) `).run(normalizedContent, leadId);

        const note = db.prepare(`SELECT id, content, leadId, createdAt FROM notes WHERE id = ?`).get(Number(result.lastInsertRowid)) as any;

        return res.status(201).json({
            success: true,
            message: "Note created successfully",
            note,
        });
    } catch (error) {
        next(error)
    }
}