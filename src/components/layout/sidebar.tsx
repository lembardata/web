"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Brain,
  FileSpreadsheet,
  CreditCard,
  Key,
  BookOpen,
  HelpCircle,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  BarChart3,
  Database,
  Shield,
  Bell,
} from "lucide-react";
import { useAuth } from "@/hooks/api";

const navigationItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        description: "Overview dan statistik",
      },
      {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
        description: "Analisis penggunaan",
        badge: "Pro",
      },
    ],
  },
  {
    title: "AI Features",
    items: [
      {
        title: "AI Queries",
        href: "/dashboard/ai-queries",
        icon: Brain,
        description: "Buat dan kelola AI queries",
      },
      {
        title: "AI Models",
        href: "/dashboard/ai-models",
        icon: Zap,
        description: "Kelola model AI",
        badge: "Enterprise",
      },
    ],
  },
  {
    title: "Data Management",
    items: [
      {
        title: "Spreadsheets",
        href: "/dashboard/sheets",
        icon: FileSpreadsheet,
        description: "Kelola spreadsheet Anda",
      },
      {
        title: "Data Sources",
        href: "/dashboard/data-sources",
        icon: Database,
        description: "Sumber data eksternal",
        badge: "Pro",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Billing",
        href: "/dashboard/billing",
        icon: CreditCard,
        description: "Kelola langganan",
      },
      {
        title: "API Keys",
        href: "/dashboard/api-keys",
        icon: Key,
        description: "Kelola API keys",
      },
      {
        title: "Profile",
        href: "/dashboard/profile",
        icon: User,
        description: "Pengaturan profil",
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        title: "Documentation",
        href: "/dashboard/documentation",
        icon: BookOpen,
        description: "Panduan dan dokumentasi",
      },
      {
        title: "Support",
        href: "/dashboard/support",
        icon: HelpCircle,
        description: "Bantuan dan dukungan",
      },
    ],
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notifications] = useState({
    aiQueries: 2,
    billing: 1,
  });

  const userPlan = user?.subscription_plan || "free";

  const isItemAccessible = (item: any) => {
    if (!item.badge) return true;

    if (
      item.badge === "Pro" &&
      ["pro", "enterprise"].includes(userPlan.toLowerCase())
    ) {
      return true;
    }

    if (
      item.badge === "Enterprise" &&
      userPlan.toLowerCase() === "enterprise"
    ) {
      return true;
    }

    return false;
  };

  const getNotificationCount = (href: string) => {
    if (href.includes("ai-queries")) return notifications.aiQueries;
    if (href.includes("billing")) return notifications.billing;
    return 0;
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SA</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">SpreadsheetAI</h2>
              <p className="text-xs text-gray-500 capitalize">
                {userPlan} Plan
              </p>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {navigationItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {!isCollapsed && (
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
              )}

              <div className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  const isAccessible = isItemAccessible(item);
                  const notificationCount = getNotificationCount(item.href);

                  return (
                    <div key={itemIndex} className="relative">
                      {isAccessible ? (
                        <Link href={item.href}>
                          <div
                            className={cn(
                              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                              isActive
                                ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-5 w-5 flex-shrink-0",
                                isActive ? "text-blue-700" : "text-gray-400",
                              )}
                            />

                            {!isCollapsed && (
                              <>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span>{item.title}</span>
                                    <div className="flex items-center space-x-1">
                                      {item.badge && (
                                        <Badge
                                          variant="outline"
                                          className={cn(
                                            "text-xs px-1.5 py-0.5",
                                            item.badge === "Pro" &&
                                              "border-yellow-200 text-yellow-700",
                                            item.badge === "Enterprise" &&
                                              "border-purple-200 text-purple-700",
                                          )}
                                        >
                                          {item.badge}
                                        </Badge>
                                      )}
                                      {notificationCount > 0 && (
                                        <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                                          {notificationCount}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {item.description}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </Link>
                      ) : (
                        <div
                          className={cn(
                            "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed",
                            "text-gray-400",
                          )}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0 text-gray-300" />

                          {!isCollapsed && (
                            <>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span>{item.title}</span>
                                  <div className="flex items-center space-x-1">
                                    {item.badge && (
                                      <Badge
                                        variant="outline"
                                        className={cn(
                                          "text-xs px-1.5 py-0.5 opacity-50",
                                          item.badge === "Pro" &&
                                            "border-yellow-200 text-yellow-700",
                                          item.badge === "Enterprise" &&
                                            "border-purple-200 text-purple-700",
                                        )}
                                      >
                                        {item.badge}
                                      </Badge>
                                    )}
                                    <Shield className="h-3 w-3 text-gray-300" />
                                  </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {item.description}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* Notification dot for collapsed state */}
                      {isCollapsed && notificationCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed ? (
          <div className="space-y-3">
            {/* Upgrade Banner for Free Users */}
            {userPlan.toLowerCase() === "free" && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Upgrade to Pro
                  </span>
                </div>
                <p className="text-xs text-blue-700 mb-2">
                  Unlock advanced AI features and unlimited queries.
                </p>
                <Button size="sm" className="w-full text-xs" asChild>
                  <Link href="/dashboard/billing">Upgrade Now</Link>
                </Button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href="/dashboard/support">
                  <HelpCircle className="h-4 w-4 mr-1" />
                  Help
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href="/dashboard/profile">
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Collapsed upgrade button for free users */}
            {userPlan.toLowerCase() === "free" && (
              <Button size="sm" className="w-full p-2" asChild>
                <Link href="/dashboard/billing">
                  <Zap className="h-4 w-4" />
                </Link>
              </Button>
            )}

            {/* Collapsed quick actions */}
            <div className="flex flex-col space-y-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full p-2"
                asChild
              >
                <Link href="/dashboard/support">
                  <HelpCircle className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full p-2"
                asChild
              >
                <Link href="/dashboard/profile">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
