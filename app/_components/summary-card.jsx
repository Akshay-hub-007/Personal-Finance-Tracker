import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SummaryCard({ title, amount, type }) {
  const colors = {
    expense: "text-red-500",
    income: "text-green-500",
    balance: "text-blue-500",
    month: "text-yellow-500",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-semibold ${colors[type]}`}>{amount}</p>
      </CardContent>
    </Card>
  );
}
