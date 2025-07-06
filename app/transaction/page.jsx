"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
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
    async function fetchTransactions() {
      setLoading(true);
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data.transactions);
      setLoading(false);
    }
    fetchTransactions();
  }, []);

  const handleEdit = (id) => {
    router.push(`/transaction/edit/${id}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
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
            <h1 className="text-2xl font-semibold">All Transactions</h1>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by category..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border rounded px-3 py-1 text-sm w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Button onClick={() => router.push("/transaction/add")}>+ New Transaction</Button>
            </div>
          </div>
          <div className="space-y-4">
            {transactions.filter(t => t.category.toLowerCase().includes(search.toLowerCase())).length === 0 && (
              <p className="text-muted-foreground text-sm">No transactions found.</p>
            )}
            {transactions
              .filter(t => t.category.toLowerCase().includes(search.toLowerCase()))
              .map((t) => (
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
        </>
      )}
    </div>
  );
}
