"use client"
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from "axios";

const COLORS = ["#f97316", "#14b8a6", "#6366f1", "#f43f5e", "#10b981", "#eab308"];

export function CategoryPieChart() {
  const [data, setData] = useState([]);

 useEffect(() => {
  async function fetchTransactions() {
    try {
      const res = await axios.get("/api/transactions");
      const transactions = res.data.transactions;
     console.log(transactions)
      const grouped = {};

      transactions.forEach((tx) => {
        if (tx.type === "expense") {
          grouped[tx.category] = (grouped[tx.category] || 0) + tx.amount;
        }
      });

      const formatted = Object.entries(grouped).map(([category, total]) => ({
        name: category,
        value: total
      }));

      setData(formatted);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  }

  fetchTransactions();
}, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
