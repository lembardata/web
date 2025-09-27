import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  FileSpreadsheet,
  Brain,
  Activity,
  CreditCard,
  BookOpen,
  HelpCircle,
  Settings,
} from "lucide-react";

export type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

export const navigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Spreadsheets", href: "/spreadsheets", icon: FileSpreadsheet },
  { name: "AI Queries", href: "/ai-queries", icon: Brain },
  { name: "Activity", href: "/activity", icon: Activity },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Documentation", href: "/documentation", icon: BookOpen },
  { name: "Support", href: "/support", icon: HelpCircle },
  { name: "Settings", href: "/settings", icon: Settings },
];