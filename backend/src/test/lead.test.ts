import request from "supertest";
import app from "../app.js";
import db from "../config/db.js";
import { generateToken } from "../utils/jwt.js";
import { afterAll, beforeAll, describe, expect, it} from "@jest/globals";

describe("CRM API Route Tests", () => {
    let authToken: string;
    let createdLeadId: number;

    beforeAll(() => {
        // Ensure a test user exists so authUser middleware succeeds
        db.prepare(`
            INSERT OR IGNORE INTO users (id, name, email, password)
            VALUES (?, ?, ?, ?)
        `).run(999, "Test User", "testuser@crm.com", "dummy_hash");

        authToken = generateToken({ id: 999, email: "testuser@crm.com" });
    });

    afterAll(() => {
        // Clean up test data created during tests
        if (createdLeadId) {
            db.prepare("DELETE FROM leads WHERE id = ?").run(createdLeadId);
        }
        db.prepare("DELETE FROM users WHERE id = ?").run(999);
    });

    // 1. Test public health check route
    describe("GET /api/health", () => {
        it("should return 200 and success status", async () => {
            const res = await request(app).get("/api/health");

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Backend is running");
        });
    });

    // 2. Test unauthorized access without token
    describe("GET /api/leads (Authentication guard)", () => {
        it("should return 401 when no auth cookie is provided", async () => {
            const res = await request(app).get("/api/leads");

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Unauthorized");
        });
    });

    // 3. Test validation errors on POST /api/leads
    describe("POST /api/leads (Validation)", () => {
        it("should return 400 when required fields are missing", async () => {
            const res = await request(app)
                .post("/api/leads")
                .set("Cookie", [`token=${authToken}`])
                .send({}); // Missing name & email

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.errors).toBeDefined();
        });

        it("should return 400 when email format is invalid", async () => {
            const res = await request(app)
                .post("/api/leads")
                .set("Cookie", [`token=${authToken}`])
                .send({
                    name: "Alice",
                    email: "invalid-email-format",
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should return 201 and create lead with valid data", async () => {
            const res = await request(app)
                .post("/api/leads")
                .set("Cookie", [`token=${authToken}`])
                .send({
                    name: "Jest Test Lead",
                    email: "jestlead@example.com",
                    phone: "1234567890",
                    status: "new",
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.lead).toBeDefined();
            expect(res.body.lead.name).toBe("Jest Test Lead");

            createdLeadId = res.body.lead.id;
        });
    });

    // 4. Test Edge Case: 404 on non-existent lead
    describe("GET /api/leads/:id (404 Edge Case)", () => {
        it("should return 404 when lead does not exist", async () => {
            const res = await request(app)
                .get("/api/leads/999999")
                .set("Cookie", [`token=${authToken}`]);

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Lead not found");
        });
    });
});
