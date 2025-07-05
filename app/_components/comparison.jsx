"use client";
import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
    LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

export function BudgetVsActualChart() {
    const [data, setData] = useState([]);
    console.log("budget")
    useEffect(() => {
        async function fetchData() {

            const [transactionsRes, budgetsRes] = await Promise.all([
                axios.get("/api/transactions"),
                axios.get("/api/budgets"),
            ]);

            const transactionsData = transactionsRes.data.transactions;
            const budgetsData = budgetsRes.data.budgets;
            console.log(budgetsData, "29")
            console.log(transactionsData, "30")

            const now = new Date();
            const thisMonth = now.getMonth();
            const thisYear = now.getFullYear();

            const CATEGORIES = [
                "Food",
                "Transport",
                "Rent",
                "Utilities",
                "Entertainment",
                "Health",
                "Shopping",
                "Other"
            ];

            const categoryTotals = {};
            CATEGORIES.forEach((cat) => (categoryTotals[cat] = 0));

            (transactionsData || []).forEach((t) => {
                const d = new Date(t.date);
                if (
                    t.type === "expense" &&
                    d.getMonth() === thisMonth &&
                    d.getFullYear() === thisYear
                ) {
                    if (categoryTotals[t.category] !== undefined) {
                        categoryTotals[t.category] += t.amount;
                    }
                }
            });
            const monthBudgets = (budgetsData || []).filter((b) => {
                const d = new Date(b.createdAt);
                return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
            });
            const chartData = CATEGORIES.map((cat) => {
                const budget = monthBudgets.find((b) => b.category === cat)?.amount || 0;
                const spent = categoryTotals[cat] || 0;
                return {
                    category: cat,
                    Budget: budget,
                    Spent: spent,
                    overBudget: spent > budget && budget > 0,
                };
            });
            setData(chartData);
        }
        fetchData();
    }, []);

    // Custom label for over-budget
    const renderCustomLabel = (props) => {
        const { x, y, width, value, index } = props;
        const d = data[index];
        if (d && d.overBudget) {
            return (
                <g>
                    <text x={x + width + 8} y={y + 10} fill="#ef4444" fontSize="12" fontWeight="bold">
                        ⚠ Over Budget!
                    </text>
                </g>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Budget vs Actual (This Month)</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={data} margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip
                            formatter={(value, name) => [
                                `₹${value.toLocaleString()}`,
                                name === "Spent" ? "Spent" : "Budget"
                            ]}
                        />
                        <Legend />
                        <Bar dataKey="Budget" fill="#34d399" radius={[4, 4, 0, 0]}>
                            <LabelList dataKey="Budget" position="top" formatter={(v) => `₹${v.toLocaleString()}`} />
                        </Bar>
                        <Bar
                            dataKey="Spent"
                            fill="#f87171"
                            radius={[4, 4, 0, 0]}
                            {
                            ...{
                                fill: (entry) => (entry.overBudget ? "#dc2626" : "#f87171"),
                            }
                            }
                        >
                            <LabelList dataKey="Spent" position="top" formatter={(v) => `₹${v.toLocaleString()}`} />
                            <LabelList content={renderCustomLabel} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                    {data.map((d) =>
                        d.overBudget ? (
                            <div key={d.category} className="text-red-600 font-semibold flex items-center gap-2">
                                <span>⚠</span> {d.category}: Over budget by ₹{(d.Spent - d.Budget).toLocaleString()}
                            </div>
                        ) : null
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
