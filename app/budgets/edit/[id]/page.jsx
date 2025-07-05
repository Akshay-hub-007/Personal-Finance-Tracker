'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function EditBudgetPage() {
  const router = useRouter();
  const { id: budgetId } = useParams();

  const [form, setForm] = useState({
    category: "",
    amount: "",
    month: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBudget() {
      try {
        const res = await axios.get(`/api/budgets/${budgetId}`);
        const { category, amount, month } = res.data;
        setForm({ category, amount, month });
        setLoading(false);
      } catch (err) {
        console.error("Failed to load budget:", err);
      }
    }

    if (budgetId) fetchBudget();
  }, [budgetId]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.put(`/api/budgets/${budgetId}`, form);
      router.push("/budgets");
    } catch (err) {
      console.error("Update failed:", err);
    }
  }

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-xl font-bold">Edit Budget</h2>

      <div>
        <label className="block mb-1">Category</label>
        <input
          name="category"
          type="text"
          value={form.category}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Amount</label>
        <input
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Month</label>
        <input
          name="month"
          type="month"
          value={form.month}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
        Update Budget
      </button>
    </form>
  );
}
