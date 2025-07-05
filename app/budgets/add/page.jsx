"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import axios from "axios";

export default function AddBudgetPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    category: "",
    amount: "",
    month: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
async function handleSubmit(e) {
  e.preventDefault();

  try {
    await axios.post("/api/budgets", form); 
    router.push("/budgets");
  } catch (error) {
    console.error("Error submitting budget:", error);
  }
}

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Add Budget</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Category</Label>
          <Select
            value={form.category}
            onValueChange={(val) => setForm({ ...form, category: val })}
          >
            <SelectTrigger>{form.category || "Select category"}</SelectTrigger>
            <SelectContent>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Transport">Transport</SelectItem>
              <SelectItem value="Rent">Rent</SelectItem>
              <SelectItem value="Utilities">Utilities</SelectItem>
              <SelectItem value="Entertainment">Entertainment</SelectItem>
              <SelectItem value="Health">Health</SelectItem>
              <SelectItem value="Shopping">Shopping</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Amount</Label>
          <Input
            name="amount"
            type="number"
            placeholder="Enter amount"
            value={form.amount}
            onChange={handleChange}
          />
        </div>

        {/* Month */}
        <div>
          <Label>Month (YYYY-MM)</Label>
          <Input
            name="month"
            type="month"
            value={form.month}
            onChange={handleChange}
          />
        </div>

        <Button type="submit" className="w-full mt-4">Add Budget</Button>
      </form>
    </div>
  );
}
