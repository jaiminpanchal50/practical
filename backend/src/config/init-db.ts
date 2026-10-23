import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import db from "./db.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const schemaPath = path.resolve(
  currentDir,
  "../../db/schema.sql"
);

export function initDatabase(): void {
  try {
    const schema = fs.readFileSync(schemaPath, "utf8");
    db.exec(schema);
    console.log("SQLite schema initialized successfully");
  } catch (error) {
    console.error("Failed to initialize SQLite schema:", error);
    throw error;
  }
}