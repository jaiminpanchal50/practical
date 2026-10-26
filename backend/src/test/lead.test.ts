import request from "supertest";
import app from "../app.js";
import { describe, expect, it } from "@jest/globals";

describe("CRM API Route Tests", () => {


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

});
