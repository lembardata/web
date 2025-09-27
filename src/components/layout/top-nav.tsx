"use client";

import { Bell, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MobileSidebar } from "./mobile-sidebar";
import type { BasicUser } from "./plan-info";
import { SearchBar } from "./search-bar";
import { UserMenu } from "./user-menu";

export function TopNav({
  user,
  pathname,
  onLogout,
}: {
  user: BasicUser;
  pathname: string;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Mobile menu button + Sheet */}
        <div className="flex items-center lg:hidden">
          <MobileSidebar
            open={open}
            onOpenChange={setOpen}
            user={user}
            pathname={pathname}
            trigger={
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            }
          />
        </div>

        {/* Search */}
        <SearchBar />

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
              3
            </span>
          </Button>

          {/* User menu */}
          <UserMenu user={user} onLogout={onLogout} />
        </div>
      </div>
    </div>
  );
}
