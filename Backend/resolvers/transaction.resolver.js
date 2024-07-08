import Transaction from "../models/transaction.model.js";

const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) {
          throw new Error("Unauthorized");
        }
        const userId = context.getUser()._id;
        return await Transaction.find({ userId });
      } catch (error) {
        throw new Error(error.message);
      }
    },
    transaction: async (_, { transactionId },) => {
      try {
        const transaction = await Transaction.findOne(transactionId);
        if (!transaction) {
          throw new Error("Transaction not found");
        }
        return transaction;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        if (!context.getUser()) {
          throw new Error("Unauthorized");
        }
        const userId = context.getUser()._id;
        const newTransaction = new Transaction({
          ...input,
          userId,
        });
        return await newTransaction.save();
      } catch (error) {
        throw new Error(error.message);
      }
    },
    updateTransaction: async (_, { input }, context) => {
      try {
        if (!context.getUser()) {
          throw new Error("Unauthorized");
        }
        const userId = context.getUser()._id;
        const { transactionId, ...updateData } = input;
        const updatedTransaction = await Transaction.findOneAndUpdate(
          { _id: transactionId, userId },
          { $set: updateData },
          { new: true }
        );
        if (!updatedTransaction) {
          throw new Error("Transaction not found or not authorized");
        }
        return updatedTransaction;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    deleteTransaction: async (_, { transactionId }, context) => {
      try {
        if (!context.getUser()) {
          throw new Error("Unauthorized");
        }
        const userId = context.getUser()._id;
        const deletedTransaction = await Transaction.findOneAndDelete({ _id: transactionId, userId });
        if (!deletedTransaction) {
          throw new Error("Transaction not found or not authorized");
        }
        return deletedTransaction;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

export default transactionResolver;
