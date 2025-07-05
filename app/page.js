// pages/index.tsx

"use client";
import { useEffect, useState } from "react";
import { CategoryPieChart } from "./_components/category-chart";
import { MonthlyExpensesChart } from "./_components/expenses-chart";
import { RecentTransactions } from "./_components/recent-transactions";
import { SummaryCard } from "./_components/summary-card";
import { BudgetVsActualChart } from "./_components/comparison";

const CATEGORIES = [
  "Food",
  "Transport",
  "Utilities",
  "Entertainment",
  "Rent",
  "Other",
];

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    totalIncome: 0,
    netBalance: 0,
    monthExpenses: 0,
  });
  const [categoryBudgets, setCategoryBudgets] = useState([]); 
  const [categoryActuals, setCategoryActuals] = useState([]); 
  const [insights, setInsights] = useState([]); 
  useEffect(() => {
    async function fetchData() {
      const [transactionsRes, budgetsRes] = await Promise.all([
        fetch("/api/transactions"),
        fetch("/api/budgets"),
      ]);
      const transactionsData = await transactionsRes.json();
      const budgetsData = await budgetsRes.json();
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      let totalExpenses = 0;
      let totalIncome = 0;
      let monthExpenses = 0;
      const categoryTotals = {};
      CATEGORIES.forEach((cat) => (categoryTotals[cat] = 0));
      // Calculate actuals
      (transactionsData.transactions || []).forEach((t) => {
        if (t.type === "expense") {
          totalExpenses += t.amount;
          const d = new Date(t.date);
          if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) {
            monthExpenses += t.amount;
            if (categoryTotals[t.category] !== undefined) {
              categoryTotals[t.category] += t.amount;
            }
          }
        } else if (t.type === "income") {
          totalIncome += t.amount;
        }
      });
      setSummary({
        totalExpenses,
        totalIncome,
        netBalance: totalIncome - totalExpenses,
        monthExpenses,
      });
      // Prepare budgets for this month
      const monthBudgets = (budgetsData.budgets || []).filter((b) => {
        const d = new Date(b.createdAt);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      });
      setCategoryBudgets(monthBudgets);
      // Prepare actuals for chart
      const actuals = CATEGORIES.map((cat) => ({
        category: cat,
        actual: categoryTotals[cat] || 0,
        budget:
          monthBudgets.find((b) => b.category === cat)?.limit || 0,
      }));
      setCategoryActuals(actuals);
      // Insights
      const insightsArr = [];
      actuals.forEach(({ category, actual, budget }) => {
        if (budget > 0) {
          const percent = Math.round((actual / budget) * 100);
          if (actual > budget) {
            insightsArr.push(
              `You are over budget in ${category} by ₹${(actual - budget).toLocaleString()}.`
            );
          } else {
            insightsArr.push(
              `You have used ${percent}% of your ${category} budget.`
            );
          }
        }
      });
      // Highest spending category
      const maxCat = actuals.reduce(
        (max, curr) => (curr.actual > max.actual ? curr : max),
        { category: "", actual: 0 }
      );
      if (maxCat.actual > 0) {
        insightsArr.push(
          `Highest spending: ${maxCat.category} (₹${maxCat.actual.toLocaleString()})`
        );
      }
      setInsights(insightsArr);
    }
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Total Expenses" amount={`₹${summary.totalExpenses.toLocaleString()}`} type="expense" />
        <SummaryCard title="Total Income" amount={`₹${summary.totalIncome.toLocaleString()}`} type="income" />
        <SummaryCard title="Net Balance" amount={`₹${summary.netBalance.toLocaleString()}`} type="balance" />
        <SummaryCard title={`${new Date().toLocaleString('default', { month: 'long' })} Expenses`} amount={`₹${summary.monthExpenses.toLocaleString()}`} type="month" />
      </div>



      <BudgetVsActualChart />

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MonthlyExpensesChart />
        <CategoryPieChart />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
}
