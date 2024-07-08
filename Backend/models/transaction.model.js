import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["cash", "card"],
      required: true,
    },
    category: {
      type: String,
      enum: ["saving", "expense", "income", "investment", "loan", "other"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      default: "Unknown",
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.models("Transaction", transactionSchema);

export default Transaction;
