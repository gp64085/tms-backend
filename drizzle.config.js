/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./src/db/schema.js",
  out: "./drizzle",
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL || "file:local.db", // Use "file:" prefix for a local file
  },
};
