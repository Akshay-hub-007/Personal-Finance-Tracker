import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
        "Food",
        "Transport",
        "Utilities",
        "Entertainment",
        "Shopping",
        "Health",
        "Rent",
        "Other",
      ],
    },
    amount: {
      type: Number,
      required: true,
    },
    month: {
      type: String, 
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Budget || mongoose.model("Budget", BudgetSchema);
