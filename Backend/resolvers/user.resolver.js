import User from "../models/users.model.js";
import bcrypt from "bcryptjs";

const userResolver = {
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, email, password, gender } = input;
        if (!username || !email || !password || !gender) {
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
          email,
          hashedPassword,
          gender,
          profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
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
        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        });
        // if (!username || !password) {
        //   throw new Error("All fields are required");
        // }
        // const user = await User.findOne({ username });
        // if (!user) {
        //   throw new Error("User not found");
        // }
        // const isMatch = await bcrypt.compare(password, user.hashedPassword);
        // if (!isMatch) {
        //   throw new Error("Invalid credentials");
        // }
        await context.login(user);
        return user;
      } catch (error) {
        console.log("Error in signIn resolver: ", error);
        throw error;
      }
    },

    logout: async (_, g, context) => {
      try {
        await context.logout();
        req.session.destroy((err) => {
          if (err) throw err;
        });
        res.clearCookie("connect.sid");
        return { message: "Logged out successfully" };
      } catch (error) {
        console.log("Error in logout resolver: ", error);
        throw error;
      }
    },
  },

  Query: {
    authUser: async (_, g, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (error) {
        console.log("Error in authUser resolver: ", error);
        throw error;
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
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
