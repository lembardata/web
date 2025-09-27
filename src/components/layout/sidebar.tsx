"use client";

import { LogoBrand } from "./logo-brand";
import { NavigationList } from "./navigation-list";
import { PlanInfo, type BasicUser } from "./plan-info";

export function Sidebar({ user, pathname }: { user: BasicUser; pathname: string }) {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
          <LogoBrand />
        </div>

        {/* Navigation */}
        <NavigationList pathname={pathname} />

        {/* Plan info */}
        <PlanInfo user={user} />
      </div>
    </div>
  );
}