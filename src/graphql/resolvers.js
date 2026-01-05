import { ShipmentMutation, UserMutation } from "./Mutation.js";
import { ShipmentQuery } from "./Query.js";

const resolvers = {
  Query: ShipmentQuery,
  Mutation: { ...ShipmentMutation, ...UserMutation },
};

export default resolvers;
