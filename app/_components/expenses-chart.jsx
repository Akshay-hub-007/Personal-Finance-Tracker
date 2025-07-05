"use client"
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from "axios";

export function MonthlyExpensesChart() {
  const [data, setData] = useState([]);
  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await axios.get("/api/transactions");
        const transactions = res.data.transactions;

        const grouped = {};

        transactions.forEach((tx) => {
          if (tx.type === "expense") {
            const month = new Date(tx.date).toLocaleString("default", { month: "short" });
            grouped[month] = (grouped[month] || 0) + tx.amount;
          }
        });

        const formatted = Object.entries(grouped).map(([month, total]) => ({
          month,
          total
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
        <CardTitle>Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
