import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const shipments = sqliteTable("shipments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  trackingId: text("tracking_id").notNull().unique(),
  customerName: text("customer_name").notNull(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  status: text("status").default("PENDING"), // 'PENDING', 'IN_TRANSIT', 'DELIVERED'
  flagged: integer("flagged", { mode: "boolean" }).default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});
