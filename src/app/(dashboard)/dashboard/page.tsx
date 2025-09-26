"use client";

import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  FileSpreadsheet,
  TrendingUp,
  Users,
  Plus,
  ArrowRight,
  Zap,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useAuth, useAIStats, useSpreadsheets } from "@/hooks/api";

// Mock data - replace with real data from API
const mockStats = {
  totalQueries: 156,
  totalSpreadsheets: 23,
  monthlyUsage: 78,
  planLimit: 100,
  successRate: 94.2,
};

const recentActivities = [
  {
    id: 1,
    type: "ai_query",
    title: "Formula optimization untuk Sales Report",
    time: "2 menit yang lalu",
    status: "completed",
  },
  {
    id: 2,
    type: "spreadsheet",
    title: "Membuat spreadsheet Budget 2024",
    time: "15 menit yang lalu",
    status: "completed",
  },
  {
    id: 3,
    type: "ai_query",
    title: "Analisis data customer behavior",
    time: "1 jam yang lalu",
    status: "completed",
  },
  {
    id: 4,
    type: "spreadsheet",
    title: "Update Inventory Management",
    time: "3 jam yang lalu",
    status: "completed",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: aiStats } = useAIStats();
  const { data: spreadsheets } = useSpreadsheets();

  // Use real data if available, otherwise use mock data
  const stats = aiStats || mockStats;
  const userSpreadsheets = spreadsheets || [];

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total AI Queries
            </CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQueries}</div>
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
              {userSpreadsheets.length || stats.totalSpreadsheets}
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
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% dari minggu lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan Usage</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.monthlyUsage}/{stats.planLimit}
            </div>
            <Progress
              value={(stats.monthlyUsage / stats.planLimit) * 100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.planLimit - stats.monthlyUsage} queries tersisa
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>
              Riwayat AI queries dan spreadsheet yang baru saja Anda buat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {activity.type === "ai_query" ? (
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <FileSpreadsheet className="h-4 w-4 text-green-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Selesai</Badge>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/ai-queries">
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
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Aksi cepat untuk meningkatkan produktivitas Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" asChild>
              <Link href="/ai-queries">
                <Bot className="mr-2 h-4 w-4" />
                Buat AI Query
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/sheets">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Upload Spreadsheet
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/docs">
                <Users className="mr-2 h-4 w-4" />
                Lihat Dokumentasi
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/billing">
                <TrendingUp className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Usage Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Analisis Penggunaan Bulanan</CardTitle>
          <CardDescription>
            Grafik penggunaan AI queries dalam 30 hari terakhir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Grafik analisis akan ditampilkan di sini</p>
              <p className="text-sm text-gray-400 mt-1">
                Integrasi dengan library chart akan dilakukan selanjutnya
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
             <div>
                <CardTitle>Aktivitas Terbaru</CardTitle>
                <CardDescription>
                  Riwayat aktivitas AI queries dan spreadsheet Anda
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/activity">Lihat Semua</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.title}
                        </p>
                        {getStatusIcon(activity.status)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">
                          {activity.timestamp}
                        </p>
                        {getStatusBadge(activity.status)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Plan Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Akses cepat ke fitur utama</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link href="/dashboard/ai-queries">
                  <Brain className="h-4 w-4 mr-2" />
                  Buat AI Query Baru
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/dashboard/sheets">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Spreadsheet
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/dashboard/analytics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Lihat Analytics
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/dashboard/api-keys">
                  <Database className="h-4 w-4 mr-2" />
                  Kelola API Keys
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Plan Usage Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Plan Usage</span>
                <Badge
                  className={`
                    ${userPlan === "free" ? "bg-gray-100 text-gray-800" : ""}
                    ${userPlan === "pro" ? "bg-yellow-100 text-yellow-800" : ""}
                    ${userPlan === "enterprise" ? "bg-purple-100 text-purple-800" : ""}
                  `}
                >
                  {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* AI Queries Usage */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">AI Queries</span>
                  <span className="font-medium">
                    {stats.planUsage.queries.used}/
                    {stats.planUsage.queries.limit}
                  </span>
                </div>
                <Progress
                  value={stats.planUsage.queries.percentage}
                  className="h-2"
                />
              </div>

              {/* Storage Usage */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Storage</span>
                  <span className="font-medium">
                    {stats.planUsage.storage.used}GB/
                    {stats.planUsage.storage.limit}GB
                  </span>
                </div>
                <Progress
                  value={stats.planUsage.storage.percentage}
                  className="h-2"
                />
              </div>

              {/* Spreadsheets Usage */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Spreadsheets</span>
                  <span className="font-medium">
                    {stats.planUsage.spreadsheets.used}/
                    {stats.planUsage.spreadsheets.limit}
                  </span>
                </div>
                <Progress
                  value={stats.planUsage.spreadsheets.percentage}
                  className="h-2"
                />
              </div>

              {userPlan === "free" && (
                <div className="pt-4 border-t">
                  <Button size="sm" className="w-full" asChild>
                    <Link href="/dashboard/billing">
                      <Zap className="h-4 w-4 mr-2" />
                      Upgrade ke Pro
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Monthly Analytics Placeholder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Monthly Usage Analytics</CardTitle>
              <CardDescription>
                Tren penggunaan AI queries dan spreadsheet dalam 30 hari
                terakhir
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={timeRange === "7d" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("7d")}
              >
                7 Hari
              </Button>
              <Button
                variant={timeRange === "30d" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("30d")}
              >
                30 Hari
              </Button>
              <Button
                variant={timeRange === "90d" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("90d")}
              >
                90 Hari
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Chart Analytics</p>
              <p className="text-sm text-gray-500 mt-1">
                Grafik penggunaan akan ditampilkan di sini
              </p>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <Link href="/dashboard/analytics">Lihat Detail Analytics</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
