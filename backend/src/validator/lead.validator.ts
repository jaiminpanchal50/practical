
import type { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

function validate(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    next();
}

const validStatuses = ["new", "contacted", "qualified", "lost"];

export const leadValidator = [
    body("name").isString().withMessage("Name must be a string").trim().notEmpty().withMessage("Name is required"),
    body("email").isString().withMessage("Email must be a string").trim().isEmail().withMessage("Invalid email address").normalizeEmail(),

    body("phone").optional({ nullable: true }).isString().withMessage("Phone must be a string").trim(),
    body("status").optional().isIn(validStatuses).withMessage("Invalid lead status"),

    validate,
];

export const updateLeadValidator = [
    body("status").isString().withMessage("Status is required").isIn(validStatuses).withMessage("Invalid lead status"),
    validate,
];


export const noteValidator = [
    body("content").isString().withMessage("Content is required").trim().notEmpty().withMessage("Content is required"),
    validate,
];
