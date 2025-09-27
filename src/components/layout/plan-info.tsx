"use client";

import { Crown } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type BasicUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  plan?: "starter" | "professional" | "enterprise" | string | null;
};

export function PlanInfo({ user }: { user: BasicUser }) {
  const planLabel =
    user.plan === "professional"
      ? "Professional"
      : user.plan === "enterprise"
        ? "Enterprise"
        : "Starter";

  return (
    <div className="p-4 border-t border-gray-200">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Crown className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">
              {planLabel}
            </span>
          </div>
          {user.plan !== "enterprise" && (
            <Badge variant="outline" className="text-xs">
              {user.plan === "professional" ? "Trial" : "Free"}
            </Badge>
          )}
        </div>

        {user.plan === "starter" && (
          <Link href="/billing">
            <Button size="sm" className="w-full text-xs">
              Upgrade Plan
            </Button>
          </Link>
        )}

        {user.plan === "professional" && (
          <p className="text-xs text-gray-600">xxxx hari trial tersisa</p>
        )}
      </div>
    </div>
  );
}
