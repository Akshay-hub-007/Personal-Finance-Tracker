"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

export function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
  async function fetchTransactions() {
    try {
      const res = await axios.get("/api/transactions");
      setTransactions(res.data.transactions.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  }

  fetchTransactions();
}, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No transactions found.</p>
        ) : (
          transactions.map((tx) => (
            <div key={tx._id} className="flex justify-between text-sm">
              <span>{tx.description}</span>
              <span className={tx.type === "income" ? "text-green-600" : "text-red-600"}>
                ₹{tx.amount}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
