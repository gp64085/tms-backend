import dotenv from "dotenv";
dotenv.config();

/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./src/db/schema.js",
  out: "./drizzle",
  dialect: process.env.NODE_ENV === "production" ? "turso" : "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL || "file:local.db", // Use "file:" prefix for a local file
    authToken: process.env.DATABASE_AUTH_TOKEN, // Optional, if your database requires authentication
  },
};
