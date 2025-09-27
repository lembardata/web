"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";

export function LogoBrand() {
  return (
    <Link href="/dashboard" className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
        <Sparkles className="h-5 w-5 text-white" />
      </div>
      <span className="text-xl font-bold text-gray-900">SpreadsheetAI</span>
    </Link>
  );
}