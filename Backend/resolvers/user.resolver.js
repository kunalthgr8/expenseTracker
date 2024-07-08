import { Query } from "mongoose";
import { users } from "../dummyData/data.js";
const userResolver = {
  Query: {
    users: () => {
      return users;
    },
    user: (parent, args) => {
      const { userId } = args;
      return users.find((user) => user._id === userId);
    },
  },
  Mutation: {},
};

export default userResolver;
