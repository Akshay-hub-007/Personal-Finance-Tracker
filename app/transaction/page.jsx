"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchTransactions() {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data.transactions);
    }

    fetchTransactions();
  }, []);

  const handleEdit = (id) => {
    router.push(`/transaction/edit/${id}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">All Transactions</h1>
        <Button onClick={() => router.push("/transaction/add")}>+ New Transaction</Button>
      </div>
      <div className="space-y-4">
        {transactions.length === 0 && (
          <p className="text-muted-foreground text-sm">No transactions found.</p>
        )}

        {transactions.map((t) => (
          <Card key={t._id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                ₹{t.amount.toLocaleString()}
              </CardTitle>
              <Badge className={t.type === "income" ? "bg-green-500" : "bg-red-500"}>
                {t.type}
              </Badge>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p><strong>Description:</strong> {t.description}</p>
              <p><strong>Category:</strong> {t.category}</p>
              <p><strong>Date:</strong> {new Date(t.date).toLocaleDateString()}</p>

              <div className="pt-2 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(t._id)}>Edit</Button>
                <Button size="sm" variant="destructive">Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
