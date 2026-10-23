import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import config from "./config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Stable path relative to project root
const databasePath = path.isAbsolute(config.DATABASE_PATH) ? config.DATABASE_PATH : path.resolve(__dirname, "../../", config.DATABASE_PATH);

fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const db: Database.Database = new Database(databasePath, { timeout: 5000 });

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.pragma("busy_timeout = 5000");
db.pragma("synchronous = NORMAL");

export default db;
