import dbConnect from "@/lib/db";
import Transaction from "@/models/transactions";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await dbConnect();
      const transaction = await Transaction.create(req.body);
      res.status(201).json({ success: true, transaction });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}