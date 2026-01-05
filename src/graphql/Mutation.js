import { eq } from "drizzle-orm";
import { shipments } from "../db/schema.js";
import { db } from "../db/index.js";
import jwt from "jsonwebtoken";

export const ShipmentMutation = {
  addShipment: async (_, args) => {
    const { trackingId, customerName, origin, destination } = args;
    try {
      const shipment = await db
        .insert(shipments)
        .values({
          trackingId,
          customerName,
          origin,
          destination,
        })
        .returning();

      return shipment[0];
    } catch (error) {
      if (error?.cause?.code === "SQLITE_CONSTRAINT_UNIQUE") {
        throw Error("Duplicate tracking ID");
      }

      throw Error("Something went wrong");
    }
  },
  updateShipmentStatus: async (_, { id, status }) => {
    const shipment = await db
      .update(shipments)
      .set({ status })
      .where(eq(shipments.id, id))
      .returning();

    return shipment[0];
  },
  deleteShipmentById: async (_, { id }, context) => {
    if (!context.user || context.user.role !== "ADMIN") {
      throw new Error("Forbidden: Admin access required");
    }

    const shipment = await db
      .delete(shipments)
      .where(eq(shipments.id, id))
      .returning();

    return shipment.length > 0;
  },
};

export const UserMutation = {
  login: async (_, { username, password }) => {
    const users = [
      { id: "1", username: "admin", password: "admin@123", role: "ADMIN" },
      { id: "2", username: "john", password: "john@123", role: "EMPLOYEE" },
    ];

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) throw new Error("User not found");

    // 2. Generate Token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { token, user };
  },
};
