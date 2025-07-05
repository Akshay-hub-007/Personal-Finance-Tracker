'use client';
import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function AddTransactionPage() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("expense");

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!amount) newErrors.amount = "Amount is required";
    if (!description) newErrors.description = "Description is required";
    if (!date) newErrors.date = "Date is required";
    if (!category) newErrors.category = "Category is required";
    if (!type) newErrors.type = "Type is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const data = {
      amount: Number(amount),
      description,
      date,
      category,
      type,
    };
    try {
      await axios.post("/api/transactions", data);
      setAmount("");
      setDescription("");
      setDate("");
      setCategory("");
      setType("expense");
      alert("Transaction added successfully!");
    } catch (err) {
      alert("Error adding transaction");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-md mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Add New Transaction</h1>

        <div className="space-y-2">
          <Label>Amount</Label>
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
          <Input
            type="number"
            placeholder="Enter amount (e.g., 2500)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          <Input
            type="text"
            placeholder="e.g., Grocery shopping"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Date</Label>
          {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
          <Input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>Choose category</SelectTrigger>
            <SelectContent>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Transport">Transport</SelectItem>
              <SelectItem value="Utilities">Utilities</SelectItem>
              <SelectItem value="Entertainment">Entertainment</SelectItem>
              <SelectItem value="Rent">Rent</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
          <RadioGroup value={type} onValueChange={setType} className="flex gap-6">
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

        <Button className="w-full mt-4" type="submit">Add Transaction</Button>
      </div>
    </form>
  );
}
