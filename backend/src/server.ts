import app from "./app.js";
import config from "./config/config.js";
import db from "./config/db.js";
import { initDatabase } from "./config/init-db.js";

// Run migrations/init explicitly
initDatabase();

const server = app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});

// Clean shutdown for tsx and process exit
const shutdown = () => {
  console.log("\nShutting down gracefully...");
  server.close(() => {
    try {
      db.close();
      console.log("Database connection closed.");
    } catch (err) {
      console.error("Error closing DB:", err);
    }
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
