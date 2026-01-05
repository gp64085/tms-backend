import jwt from "jsonwebtoken";

export const getUser = (token) => {
  try {
    if (token && token.startsWith("Bearer ")) {
      const user = jwt.verify(
        token.split("Bearer ")[1],
        process.env.JWT_SECRET
      );
      return { user };
    }
    return { user: null };
  } catch (_error) {
    return { user: null };
  }
};
