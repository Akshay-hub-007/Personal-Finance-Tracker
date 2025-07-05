import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Food',
        'Transport',
        'Utilities',
        'Entertainment',
        'Shopping',
        'Health',
        'Rent',
        'Salary',
        'Other',
      ],
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      default: 'expense',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Transaction ||
  mongoose.model('Transaction', TransactionSchema);
