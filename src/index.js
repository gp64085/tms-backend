import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { getUser } from "./graphql/context.js";
import { typeDefs, resolvers } from "./graphql/index.js";
import "dotenv/config";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const token = req.headers.authorization || "";
    return getUser(token);
  },
});

console.log(`🚀  Server ready at: ${url}`);
