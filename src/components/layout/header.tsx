"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  CreditCard,
  HelpCircle,
  Menu,
  Plus,
  Zap,
  FileSpreadsheet,
  Brain,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { useAuth } from "@/hooks/api";
import { cn } from "@/lib/utils";
import { SubscriptionPlan } from "@/types/auth";

interface HeaderProps {
  onMenuClick?: () => void;
  className?: string;
}

// Mock notifications data
const mockNotifications = [
  {
    id: "1",
    type: "success",
    title: "AI Query Completed",
    message:
      'Your data analysis for "Sales Report Q4" has been completed successfully.',
    time: "2 minutes ago",
    read: false,
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    id: "2",
    type: "info",
    title: "New Feature Available",
    message: "Advanced chart generation is now available in your Pro plan.",
    time: "1 hour ago",
    read: false,
    icon: Info,
    color: "text-blue-600",
  },
  {
    id: "3",
    type: "warning",
    title: "Usage Limit Warning",
    message: "You have used 80% of your monthly AI query limit.",
    time: "3 hours ago",
    read: true,
    icon: AlertCircle,
    color: "text-yellow-600",
  },
  {
    id: "4",
    type: "info",
    title: "Spreadsheet Processed",
    message: 'Your uploaded file "Customer Data.xlsx" has been processed.',
    time: "1 day ago",
    read: true,
    icon: FileSpreadsheet,
    color: "text-blue-600",
  },
];

export function Header({ onMenuClick, className }: HeaderProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log("Searching for:", searchQuery);
      // You can navigate to search results page or filter current content
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userPlan: SubscriptionPlan = user?.subscription_plan || "free";
  const userName = user?.name || user?.email || "User";
  const userEmail = user?.email || "";
  const userAvatar = user?.image || "";

  return (
    <header
      className={cn(
        "flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200",
        className,
      )}
    >
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search spreadsheets, queries..."
              className="pl-10 w-64 lg:w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Quick Actions */}
        <div className="hidden md:flex items-center space-x-2">
          <Button size="sm" variant="outline" asChild>
            <Link href="/dashboard/ai-queries">
              <Brain className="h-4 w-4 mr-2" />
              New Query
            </Link>
          </Button>

          <Button size="sm" variant="outline" asChild>
            <Link href="/dashboard/sheets">
              <Plus className="h-4 w-4 mr-2" />
              Upload
            </Link>
          </Button>
        </div>

        {/* Plan Badge */}
        <Badge
          variant="outline"
          className={cn(
            "hidden sm:inline-flex",
            userPlan === "free" && "border-gray-300 text-gray-600",
            userPlan === "pro" &&
              "border-yellow-300 text-yellow-700 bg-yellow-50",
            userPlan === "enterprise" &&
              "border-purple-300 text-purple-700 bg-purple-50",
          )}
        >
          {userPlan === "free" && "Free Plan"}
          {userPlan === "pro" && (
            <>
              <Zap className="h-3 w-3 mr-1" />
              Pro Plan
            </>
          )}
          {userPlan === "enterprise" && (
            <>
              <Zap className="h-3 w-3 mr-1" />
              Enterprise
            </>
          )}
        </Badge>

        {/* Notifications */}
        <Popover open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => {
                    const Icon = notification.icon;
                    return (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-4 hover:bg-gray-50 cursor-pointer transition-colors",
                          !notification.read && "bg-blue-50",
                        )}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <Icon
                            className={cn("h-5 w-5 mt-0.5", notification.color)}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p
                                className={cn(
                                  "text-sm font-medium text-gray-900",
                                  !notification.read && "font-semibold",
                                )}
                              >
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {notification.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-200">
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/dashboard/notifications">
                  View all notifications
                </Link>
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userEmail}
                </p>
                <Badge
                  variant="outline"
                  className={cn(
                    "w-fit mt-1",
                    userPlan === "free" && "border-gray-300 text-gray-600",
                    userPlan === "pro" && "border-yellow-300 text-yellow-700",
                    userPlan === "enterprise" &&
                      "border-purple-300 text-purple-700",
                  )}
                >
                  {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} Plan
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/dashboard/billing">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile?tab=security">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/dashboard/support">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
