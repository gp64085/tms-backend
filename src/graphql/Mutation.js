import { and, eq } from "drizzle-orm";
import { shipments, users } from "../db/schema.js";
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
      console.error(error?.cause?.code);
      if (error?.cause?.code === "CONSTRAINT_UNIQUE") {
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
    const [user] = await db
      .select({ id: users.id, username: users.username, role: users.role })
      .from(users)
      .where(and(eq(users.username, username), eq(users.password, password)))
      .limit(1);

    if (!user) throw new Error("User not found");

    // 2. Generate Token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { token, user };
  },
  signUp: async (_, { username, password }) => {
    try {
      const existingUser = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      if (existingUser.length > 0) {
        throw new Error("User already exists with same username");
      }

      const [newUser] = await db
        .insert(users)
        .values({ username, password })
        .returning({
          id: users.id,
          username: users.username,
          role: users.role,
        });

      const token = jwt.sign(
        { userId: newUser.id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return { token, user: newUser };
    } catch (error) {
      throw new Error("User not found");
    }
  },
};
