export const typeDefs = `#graphql

#Enums - Enforces strict values for Status and User Role
enum Status {
    PENDING
    IN_TRANSIT
    DELIVERED
    CANCELLED
}

enum Role {
    ADMIN
    EMPLOYEE
}

# Core Types 
type Shipment {
    id: ID!
    trackingId: String!
    customerName: String!
    origin: String!
    destination: String!
    status: Status!
    flagged: Boolean!
    createdAt: String!
    updatedAt: String!
}

type User {
    id: ID!
    name: String!
    username: String!
    email: String!
    role: Role!
}

# Auth response
type Auth {
    token: String!
    user: User
}

# Response Types (Wrapper for pagination)
type PaginatedShipments {
    items: [Shipment!]!
    totalCount: Int!
    hasMore: Boolean!
}

# Inputs
input ShipmentFilter {
    status: Status
    customerName: String
}

# API contract
type Query {
    # fetches list with optional filter and pagination
    listShipments(
        filter: ShipmentFilter, 
        page: Int = 1, 
        limit: Int = 10
    ): PaginatedShipments!

    # fetches single shipment by trackingId
    getShipmentDetails(trackingId: String!): Shipment
}

type Mutation {
    # User authentication
    login(username: String!, password: String!): Auth!
    # Create a new shipment
    addShipment(
        trackingId: String!
        customerName: String!
        origin: String!
        destination: String!
    ): Shipment!

    # Update the status of an existing shipment
    updateShipmentStatus(
        id: ID!, 
        status: Status!
    ): Shipment!

    # Delete a shipment by trackingId (Admin only - logic handled in resolver)
    deleteShipmentById(id: ID!): Boolean!
}
`;
