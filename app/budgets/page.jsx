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
  const router = useRouter();

  useEffect(() => {
    fetchBudgets();
  }, []);

  async function fetchBudgets() {
    const res = await axios.get("/api/budgets");
    setBudgets(res.data.budgets);
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
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">All Budgets</h1>
        <Button onClick={() => router.push("/budgets/add")}>+ New Budget</Button>
      </div>
      {budgets.length === 0 ? (
        <p className="text-muted-foreground text-sm">No budgets found.</p>
      ) : (
        <div className="space-y-4">
          {budgets.map((b) => (
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
    </div>
  );
}
