# 🚛 TMS Backend

Transport Management System backend API built with Node.js, GraphQL, and SQLite.

## ✨ Features

- 🔗 **GraphQL API**: Complete CRUD operations for shipments
- 🔐 **Authentication**: JWT-based auth with role-based access
- 🗄️ **Database**: SQLite with Drizzle ORM
- ⚡ **Real-time**: GraphQL subscriptions support
- ✅ **Validation**: Input validation and error handling

## 🛠️ Tech Stack

- Node.js
- GraphQL (Apollo Server)
- SQLite + Drizzle ORM
- JWT Authentication

## 🚀 Getting Started

1. **Install dependencies:**
```bash
pnpm install
```

2. **Set up environment variables:**
```bash
echo "JWT_SECRET=e22290bdf3365293c131d77a3c52e369ef8c2954b98716f3b72d8c42346eba11" > .env
echo "DATABASE_URL=./local.db" >> .env
echo "PORT=4000" >> .env
```

3. **Generate and setup database:**
```bash
pnpm db:generate
pnpm db:push
```

4. **Start development server:**
```bash
pnpm dev
```

**For production:**
```bash
pnpm start
```

✅ **Server running at:** `http://localhost:4000/graphql`

## 📁 Project Structure

```
src/
├── 📁 config/             # Configuration files
├── 📁 db/                 # Database schema and connection
│   ├── index.js          # Database connection
│   └── schema.js         # Drizzle schema definitions
├── 📁 graphql/            # GraphQL schema and resolvers
│   ├── typeDefs.js       # GraphQL type definitions
│   ├── resolvers.js      # Query/Mutation resolvers
│   └── context.js        # GraphQL context (auth)
├── 📁 middleware/         # Auth and other middleware
│   └── auth.js           # JWT authentication
└── 📄 index.js           # Server entry point
```

## 🔍 GraphQL Schema

### 📊 Queries
```graphql
# Get paginated shipments with optional filtering
listShipments(
  filter: ShipmentFilter
  page: Int = 1
  limit: Int = 10
): PaginatedShipments!

# Get single shipment by tracking ID
getShipmentDetails(trackingId: String!): Shipment
```

### ✏️ Mutations
```graphql
# Create new shipment
addShipment(
  trackingId: String!
  customerName: String!
  origin: String!
  destination: String!
): Shipment!

# Update shipment status
updateShipmentStatus(id: ID!, status: Status!): Shipment!

# Delete shipment (Admin only)
deleteShipmentById(id: ID!): Boolean!
```

## 🔐 Authentication

**Login Mutation:**
```graphql
mutation {
  login(username: "admin", password: "admin@123") {
    token
    user {
      username
      role
    }
  }
}
```

**Default Users:**
| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin@123` | ADMIN |
| `john` | `john@123` | EMPLOYEE |

## 🧪 Try It Out

1. **Start the server** and visit: [`http://localhost:4000/graphql`](http://localhost:4000/graphql)

2. **Login first:**
```graphql
mutation {
  login(username: "admin", password: "admin@123") {
    token
  }
}
```

3. **Add Authorization header:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

4. **Create a shipment:**
```graphql
mutation {
  addShipment(
    trackingId: "TRK-001"
    customerName: "Acme Corp"
    origin: "New York"
    destination: "Los Angeles"
  ) {
    id
    trackingId
    status
  }
}
```

5. **List shipments:**
```graphql
query {
  listShipments {
    items {
      id
      trackingId
      customerName
      status
    }
    totalCount
  }
}
```

## 📊 Status Types

- `PENDING` - Shipment created, awaiting pickup
- `IN_TRANSIT` - Shipment in transit
- `DELIVERED` - Shipment delivered successfully
- `CANCELLED` - Shipment cancelled