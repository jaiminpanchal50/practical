import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import db from "../src/config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function seed() {
    console.log("🌱 Starting database seeding...");

    // 1. Ensure tables exist by running schema.sql
    const schemaPath = path.resolve(__dirname, "../../db/schema.sql");
    if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, "utf-8");
        db.exec(schema);
    }

    // Wrap inserts in a transaction for speed and atomicity
    const runSeeder = db.transaction(() => {
        // Optional: clear existing records to start fresh
        db.prepare("DELETE FROM notes").run();
        db.prepare("DELETE FROM leads").run();
        db.prepare("DELETE FROM users").run();

        // 2. Seed a Demo User (so you can log in immediately)
        const hashedPassword = bcrypt.hashSync("admin123", 10);
        const userInsert = db.prepare(`
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
        `);
        userInsert.run("Admin User", "admin@crm.com", hashedPassword);
        console.log("✅ Seeded test user: admin@crm.com (Password: admin123)");

        // 3. Seed Sample Leads with different statuses
        const insertLead = db.prepare(`
            INSERT INTO leads (name, email, phone, status)
            VALUES (?, ?, ?, ?)
        `);

        const sampleLeads = [
            { name: "John Doe", email: "john.doe@techcorp.com", phone: "+1 555-0101", status: "new" },
            { name: "Sarah Smith", email: "sarah@acme.inc", phone: "+1 555-0102", status: "contacted" },
            { name: "Michael Chang", email: "michael@innovate.co", phone: "+1 555-0103", status: "qualified" },
            { name: "Emily Davis", email: "emily@startuphub.io", phone: "+1 555-0104", status: "lost" },
            { name: "Alex Johnson", email: "alex.j@globalfirm.org", phone: "+1 555-0105", status: "new" },
            { name: "Jessica Taylor", email: "jessica@creativeagency.net", phone: null, status: "contacted" },
        ];

        const insertedLeadIds: number[] = [];
        for (const lead of sampleLeads) {
            const res = insertLead.run(lead.name, lead.email, lead.phone, lead.status);
            insertedLeadIds.push(Number(res.lastInsertRowid));
        }
        console.log(`✅ Seeded ${sampleLeads.length} sample leads`);

        // 4. Seed Notes for some of the leads
        const insertNote = db.prepare(`
            INSERT INTO notes (leadId, content)
            VALUES (?, ?)
        `);

        // Notes for Lead 1 (John Doe)
        insertNote.run(insertedLeadIds[0], "Inbound lead via web form. Interested in CRM integration.");

        // Notes for Lead 2 (Sarah Smith)
        insertNote.run(insertedLeadIds[1], "First intro call completed. Requested a demo next Tuesday.");
        insertNote.run(insertedLeadIds[1], "Sent product overview PDF and pricing tier details.");

        // Notes for Lead 3 (Michael Chang)
        insertNote.run(insertedLeadIds[2], "Budget approved ($15k). Contract review in progress.");

        // Notes for Lead 4 (Emily Davis)
        insertNote.run(insertedLeadIds[3], "Chose a competing vendor due to existing enterprise contract.");

        console.log("✅ Seeded sample notes for leads");
    });

    try {
        runSeeder();
        console.log("🎉 Database seeding completed successfully!");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
    }
}

seed();
