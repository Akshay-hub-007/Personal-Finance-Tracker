"use client";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Also missing in your original code

function AppHeader() {
  const router = useRouter();

  return (
    <header className="w-full bg-white shadow-sm py-4 px-6 mb-6 flex items-center justify-between">
      <div
        className="text-xl font-bold tracking-tight text-gray-900 cursor-pointer"
        onClick={() => router.push("/")}
      >
        💸 Finance Dashboard
      </div>
      <nav className="flex gap-6">
        <Link
          href="/transaction"
          className="text-gray-700 hover:text-black font-medium"
        >
          Transactions
        </Link>
        <Link
          href="/budgets"
          className="text-gray-700 hover:text-black font-medium"
        >
          Budgets
        </Link>
      </nav>
    </header>
  );
}

export default AppHeader;
