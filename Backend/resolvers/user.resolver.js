import mongoose from "mongoose";
import User from "../models/users.model.js";
import bcrypt from "bcryptjs";

const userResolver = {
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        console.log("input: ", input);
        const { username, name, password, gender } = input;
        console.log("username: ", username);
        console.log("name: ", name);
        console.log("password: ", password);
        console.log("gender", gender);

        if (!username || !name || !password || !gender) {
          throw new Error("All fields are required");
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new Error("User already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy/?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl/?username=${username}`;

        const newUser = new User({
          username,
          name,
          password: hashedPassword,
          gender,
          profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
        });

        const savedUser = await newUser.save();
        await context.login(savedUser);

        return savedUser;
      } catch (error) {
        console.log("Error in signUp resolver: ", error);
        throw error;
      }
    },

    signIn: async (_, { input }, context) => {
      try {
        const { username, password } = input;
        if(!username || !password) {
          throw new Error("All fields are required");
        }
        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        });
        await context.login(user);
        return user;
      } catch (error) {
        console.log("Error in signIn resolver: ", error);
        throw error;
      }
    },

    logout: async (_, __, { req, res }) => {
      try {
        console.log("logout resolver");
        await new Promise((resolve, reject) => {
          req.logout((err) => {
            if (err) {
              return reject(err);
            }
            req.session.destroy((err) => {
              if (err) {
                return reject(err);
              }
              res.clearCookie("connect.sid");
              resolve();
            });
          });
        });
        return { message: "Logged out successfully" };
      } catch (error) {
        throw new AuthenticationError(
          `Error in logout resolver: ${error.message}`
        );
      }
    },
  },

  Query: {
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser();
        console.log("authUser resolver: ", user);
        return user;
      } catch (error) {
        console.log("Error in authUser resolver: ", error);
        throw error;
      }
    },

    user: async (_, { userId }) => {
      try {
        const objectId = mongoose.Types.ObjectId(userId);
        const user = await User.findById(objectId);
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      } catch (error) {
        console.log("Error in user resolver: ", error);
        throw error;
      }
    },
  },
};

export default userResolver;
