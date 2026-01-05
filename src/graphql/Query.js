import { count, desc, eq, like, and } from "drizzle-orm";
import { shipments } from "../db/schema.js";
import { db } from "../db/index.js";

export const ShipmentQuery = {
  listShipments: async (_, { filter, page = 1, limit = 10 }) => {
    const offset = (page - 1) * limit;

    // Dynamic filter
    const conditions = [];

    if (filter?.status) {
      conditions.push(eq(shipments.status, filter.status));
    }

    if (filter?.customerName) {
      conditions.push(like(shipments.customerName, `%${filter.customerName}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const items = await db
      .select()
      .from(shipments)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(shipments.createdAt));

    // Total count
    const totalResult = await db
      .select({ value: count() })
      .from(shipments)
      .where(whereClause);

    const totalCount = totalResult[0].value;
    return {
      items,
      totalCount,
      hasMore: offset + items.length < totalCount,
    };
  },
  getShipmentDetails: async (_, { trackingId }) => {
    const shipment = await db
      .select()
      .from(shipments)
      .where(eq(shipments.trackingId, trackingId))
      .limit(1);

    return shipment[0];
  },
};
