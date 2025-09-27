"use client";

import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  CheckCircle,
  Database,
  FileSpreadsheet,
  Plus,
  TrendingUp,
  Upload,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";

// Mock data - replace with real data from API
const mockStats = {
  totalQueries: 156,
  totalSpreadsheets: 23,
  monthlyUsage: 78,
  planLimit: 100,
  successRate: 94.2,
  planUsage: {
    queries: { used: 78, limit: 100, percentage: 78 },
    storage: { used: 2.4, limit: 10, percentage: 24 },
    spreadsheets: { used: 23, limit: 50, percentage: 46 },
  },
};

const mockRecentActivities = [
  {
    id: 1,
    title: "Formula optimization untuk Sales Report",
    description: "Mengoptimalkan formula VLOOKUP dan SUMIF",
    timestamp: "2 menit yang lalu",
    status: "completed",
    icon: Bot,
  },
  {
    id: 2,
    title: "Upload Budget 2024 Spreadsheet",
    description: "Berhasil mengupload dan memproses data",
    timestamp: "15 menit yang lalu",
    status: "completed",
    icon: FileSpreadsheet,
  },
  {
    id: 3,
    title: "Analisis Customer Behavior",
    description: "Query AI untuk analisis pola pembelian",
    timestamp: "1 jam yang lalu",
    status: "processing",
    icon: TrendingUp,
  },
];

// Helper functions
const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "processing":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-100 text-green-800">Selesai</Badge>;
    case "processing":
      return <Badge className="bg-yellow-100 text-yellow-800">Proses</Badge>;
    case "failed":
      return <Badge className="bg-red-100 text-red-800">Gagal</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

// const recentActivities = [
//   {
//     id: 1,
//     type: "ai_query",
//     title: "Formula optimization untuk Sales Report",
//     time: "2 menit yang lalu",
//     status: "completed",
//   },
//   {
//     id: 2,
//     type: "spreadsheet",
//     title: "Membuat spreadsheet Budget 2024",
//     time: "15 menit yang lalu",
//     status: "completed",
//   },
//   {
//     id: 3,
//     type: "ai_query",
//     title: "Analisis data customer behavior",
//     time: "1 jam yang lalu",
//     status: "completed",
//   },
//   {
//     id: 4,
//     type: "spreadsheet",
//     title: "Update Inventory Management",
//     time: "3 jam yang lalu",
//     status: "completed",
//   },
// ];

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Selamat datang, {user?.name || "User"}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Berikut adalah ringkasan aktivitas AI spreadsheet Anda hari ini.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button asChild>
            <Link href="/ai-queries">
              <Bot className="mr-2 h-4 w-4" />
              AI Query Baru
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/sheets">
              <Plus className="mr-2 h-4 w-4" />
              Spreadsheet Baru
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total AI Queries
            </CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalQueries}</div>
            <p className="text-xs text-muted-foreground">
              +12% dari bulan lalu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spreadsheets</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockStats.totalSpreadsheets}
            </div>
            <p className="text-xs text-muted-foreground">+3 spreadsheet baru</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% dari minggu lalu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan Usage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockStats.monthlyUsage}/{mockStats.planLimit}
            </div>
            <Progress
              value={(mockStats.monthlyUsage / mockStats.planLimit) * 100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {mockStats.planLimit - mockStats.monthlyUsage} queries tersisa
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>
              Pantau aktivitas AI dan spreadsheet terbaru Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentActivities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <IconComponent className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.timestamp}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex items-center space-x-2">
                      {getStatusIcon(activity.status)}
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/activities">
                  Lihat Semua Aktivitas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>Akses fitur utama dengan cepat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/ai-query/new">
                <Button className="h-20 w-full flex flex-col items-center justify-center space-y-2">
                  <Brain className="h-6 w-6" />
                  <span>Buat AI Query Baru</span>
                </Button>
              </Link>
              <Link href="/spreadsheets/upload">
                <Button
                  variant="outline"
                  className="h-20 w-full flex flex-col items-center justify-center space-y-2"
                >
                  <Upload className="h-6 w-6" />
                  <span>Upload Spreadsheet</span>
                </Button>
              </Link>
              <Link href="/analytics">
                <Button
                  variant="outline"
                  className="h-20 w-full flex flex-col items-center justify-center space-y-2"
                >
                  <BarChart3 className="h-6 w-6" />
                  <span>Lihat Analytics</span>
                </Button>
              </Link>
              <Link href="/api-keys">
                <Button
                  variant="outline"
                  className="h-20 w-full flex flex-col items-center justify-center space-y-2"
                >
                  <Database className="h-6 w-6" />
                  <span>Kelola API Keys</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Plan Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Penggunaan Plan</CardTitle>
            <CardDescription>
              Monitor penggunaan fitur dalam plan Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>AI Queries</span>
                <span>
                  {mockStats.planUsage.queries.used}/
                  {mockStats.planUsage.queries.limit}
                </span>
              </div>
              <Progress value={mockStats.planUsage.queries.percentage} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Storage</span>
                <span>
                  {mockStats.planUsage.storage.used} GB /{" "}
                  {mockStats.planUsage.storage.limit} GB
                </span>
              </div>
              <Progress value={mockStats.planUsage.storage.percentage} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Spreadsheets</span>
                <span>
                  {mockStats.planUsage.spreadsheets.used}/
                  {mockStats.planUsage.spreadsheets.limit}
                </span>
              </div>
              <Progress value={mockStats.planUsage.spreadsheets.percentage} />
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-3">
                Anda menggunakan plan <strong>Free</strong>
              </p>
              <Button className="w-full" asChild>
                <Link href="/dashboard/billing">
                  <Zap className="mr-2 h-4 w-4" />
                  Upgrade ke Pro
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Usage Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Analitik Penggunaan Bulanan</CardTitle>
            <CardDescription>
              Pantau tren penggunaan AI dan spreadsheet Anda
            </CardDescription>
            <div className="flex items-center space-x-2 mt-4">
              <Button
                variant={selectedTimeRange === "7d" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeRange("7d")}
              >
                7 Hari
              </Button>
              <Button
                variant={selectedTimeRange === "30d" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeRange("30d")}
              >
                30 Hari
              </Button>
              <Button
                variant={selectedTimeRange === "90d" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeRange("90d")}
              >
                90 Hari
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Chart akan ditampilkan di sini
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
