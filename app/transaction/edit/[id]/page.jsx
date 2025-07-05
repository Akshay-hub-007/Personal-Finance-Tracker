"use client"

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function EditTransactionPage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    amount: "",
    description: "",
    date: "",
    category: "",
    type: "expense",
  });

  async function getTransaction(transactionId) {
    const res = await axios.get(`/api/transactions/${transactionId}`);
    return res.data;
  }

  async function updateTransaction(transactionId, data) {
    return axios.put(`/api/transactions/${transactionId}`, data);
  }

  useEffect(() => {
    if (!id) return;
    getTransaction(id).then(data => {
      setForm({
        amount: data.amount,
        description: data.description,
        date: data.date.slice(0, 10),
        category: data.category,
        type: data.type || "expense",
      });
    });
  }, [id]);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await updateTransaction(id, form);
      router.push("/transaction");
    } catch (err) {
      alert("Error updating transaction");
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Edit Transaction</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Amount</Label>
          <Input
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Description</Label>
          <Input
            name="description"
            type="text"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Date</Label>
          <Input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Category</Label>
          <Select value={form.category} onValueChange={(val) => setForm(prev => ({ ...prev, category: val }))}>
            <SelectTrigger>{form.category || "Select category"}</SelectTrigger>
            <SelectContent>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Transport">Transport</SelectItem>
              <SelectItem value="Rent">Rent</SelectItem>
              <SelectItem value="Utilities">Utilities</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Type</Label>
          <RadioGroup
            value={form.type}
            onValueChange={(val) => setForm(prev => ({ ...prev, type: val }))}
            className="flex gap-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="expense" id="expense" />
              <Label htmlFor="expense">Expense</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="income" id="income" />
              <Label htmlFor="income">Income</Label>
            </div>
          </RadioGroup>
        </div>

        <Button type="submit" className="w-full mt-4">Update Transaction</Button>
      </form>
    </div>
  );
}
