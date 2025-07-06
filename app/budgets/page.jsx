"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const quotes = [
    "A budget is telling your money where to go instead of wondering where it went. – Dave Ramsey",
    "Do not save what is left after spending, but spend what is left after saving. – Warren Buffett",
    "Beware of little expenses; a small leak will sink a great ship. – Benjamin Franklin",
    "It’s not your salary that makes you rich, it’s your spending habits. – Charles A. Jaffe",
    "The art is not in making money, but in keeping it. – Proverb",
    "Wealth consists not in having great possessions, but in having few wants. – Epictetus",
    "Money looks better in the bank than on your feet. – Sophia Amoruso",
    "Financial freedom is available to those who learn about it and work for it. – Robert Kiyosaki",
    "Do not go broke trying to look rich. – Unknown",
    "Save money, and money will save you. – Jamaican Proverb"
  ];

  useEffect(() => {
    fetchBudgets();
  }, []);

  async function fetchBudgets() {
    setLoading(true);
    const res = await axios.get("/api/budgets");
    setBudgets(res.data.budgets);
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this budget?")) return;
    try {
      await axios.delete(`/api/budgets/${id}`);
      setBudgets((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }

  function handleEdit(id) {
    router.push(`/budgets/edit/${id}`);
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {loading ? (
        <div className="flex flex-col justify-center items-center h-96 space-y-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          <div className="text-center text-muted-foreground max-w-md text-sm">
            {quotes[Math.floor(Math.random() * quotes.length)]}
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h1 className="text-2xl font-semibold">All Budgets</h1>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by category..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border rounded px-3 py-1 text-sm w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Button onClick={() => router.push("/budgets/add")}>+ New Budget</Button>
            </div>
          </div>
          {budgets.filter(b => b.category.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
            <p className="text-muted-foreground text-sm">No budgets found.</p>
          ) : (
            <div className="space-y-4">
              {budgets
                .filter(b => b.category.toLowerCase().includes(search.toLowerCase()))
                .map((b) => (
                  <Card key={b._id}>
                    <CardHeader>
                      <CardTitle className="text-base">
                        {b.category} - ₹{b.amount}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                      <p>
                        <strong>Month:</strong> {b.month}
                      </p>
                      <p>
                        <strong>Created:</strong>{" "}
                        {new Date(b.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex gap-4 pt-2">
                        <Button size="sm" onClick={() => handleEdit(b._id)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(b._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </>
      )}

    </div>
  );
}