"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Brain,
  FileSpreadsheet,
  Clock,
  Users,
  Zap,
  Calendar,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";
import { useAnalytics } from "@/hooks/api";

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalQueries: 1247,
    totalSpreadsheets: 34,
    avgProcessingTime: 2.3,
    successRate: 94.2,
    totalUsers: 1,
    activeUsers: 1,
  },
  queryTrends: {
    daily: [
      { date: "2024-01-01", queries: 45, success: 42, failed: 3 },
      { date: "2024-01-02", queries: 52, success: 49, failed: 3 },
      { date: "2024-01-03", queries: 38, success: 36, failed: 2 },
      { date: "2024-01-04", queries: 61, success: 58, failed: 3 },
      { date: "2024-01-05", queries: 47, success: 44, failed: 3 },
      { date: "2024-01-06", queries: 55, success: 52, failed: 3 },
      { date: "2024-01-07", queries: 43, success: 41, failed: 2 },
    ],
    weekly: [
      { week: "Week 1", queries: 341, success: 322, failed: 19 },
      { week: "Week 2", queries: 298, success: 281, failed: 17 },
      { week: "Week 3", queries: 367, success: 349, failed: 18 },
      { week: "Week 4", queries: 241, success: 228, failed: 13 },
    ],
  },
  topQueries: [
    {
      query: "Analisis penjualan bulanan",
      count: 23,
      avgTime: 1.8,
      successRate: 96,
    },
    { query: "Prediksi revenue Q4", count: 18, avgTime: 3.2, successRate: 89 },
    { query: "Laporan inventory", count: 15, avgTime: 2.1, successRate: 93 },
    {
      query: "Analisis customer churn",
      count: 12,
      avgTime: 4.1,
      successRate: 92,
    },
    {
      query: "Forecast demand produk",
      count: 11,
      avgTime: 2.8,
      successRate: 95,
    },
  ],
  spreadsheetStats: {
    totalFiles: 34,
    totalSize: "2.4 GB",
    avgFileSize: "72 MB",
    mostUsedFormats: [
      { format: "XLSX", count: 28, percentage: 82 },
      { format: "CSV", count: 4, percentage: 12 },
      { format: "XLS", count: 2, percentage: 6 },
    ],
  },
  performanceMetrics: {
    avgQueryTime: 2.3,
    p95QueryTime: 5.8,
    errorRate: 5.8,
    uptime: 99.9,
  },
};

export default function AnalyticsPage() {
  const { data: analytics } = useAnalytics();
  const [timeRange, setTimeRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use real data if available, otherwise fall back to mock data
  const data = analytics || mockAnalytics;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const exportData = () => {
    // Simulate data export
    console.log("Exporting analytics data...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-2 text-gray-600">
            Analisis mendalam tentang penggunaan AI queries dan spreadsheet Anda
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Hari</SelectItem>
              <SelectItem value="30d">30 Hari</SelectItem>
              <SelectItem value="90d">90 Hari</SelectItem>
              <SelectItem value="1y">1 Tahun</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Analytics Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="queries">AI Queries</TabsTrigger>
          <TabsTrigger value="spreadsheets">Spreadsheets</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Queries
                </CardTitle>
                <Brain className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.overview.totalQueries.toLocaleString()}
                </div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% dari periode sebelumnya
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Success Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.overview.successRate}%
                </div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2.1% dari periode sebelumnya
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Avg Processing Time
                </CardTitle>
                <Clock className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.overview.avgProcessingTime}s
                </div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -0.3s dari periode sebelumnya
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Spreadsheets
                </CardTitle>
                <FileSpreadsheet className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.overview.totalSpreadsheets}
                </div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +7 file baru bulan ini
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Query Trends</CardTitle>
                <CardDescription>
                  Tren penggunaan AI queries dalam {timeRange}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">
                      Query Trends Chart
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Grafik tren queries akan ditampilkan di sini
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Success Rate Trends</CardTitle>
                <CardDescription>
                  Persentase keberhasilan queries dalam {timeRange}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">
                      Success Rate Chart
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Grafik success rate akan ditampilkan di sini
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Queries Tab */}
        <TabsContent value="queries" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Queries */}
            <Card>
              <CardHeader>
                <CardTitle>Top AI Queries</CardTitle>
                <CardDescription>
                  Query yang paling sering digunakan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topQueries.map((query, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{query.query}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-600">
                          <span>{query.count} kali</span>
                          <span>Avg: {query.avgTime}s</span>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              query.successRate >= 95
                                ? "border-green-200 text-green-800"
                                : query.successRate >= 90
                                  ? "border-yellow-200 text-yellow-800"
                                  : "border-red-200 text-red-800"
                            }`}
                          >
                            {query.successRate}% success
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Query Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Query Performance</CardTitle>
                <CardDescription>Metrik performa AI queries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">
                        Average Response Time
                      </p>
                      <p className="text-xs text-gray-600">
                        Waktu rata-rata pemrosesan
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">
                        {data.performanceMetrics.avgQueryTime}s
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">95th Percentile</p>
                      <p className="text-xs text-gray-600">
                        95% queries selesai dalam
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-600">
                        {data.performanceMetrics.p95QueryTime}s
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Success Rate</p>
                      <p className="text-xs text-gray-600">
                        Persentase queries berhasil
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        {data.overview.successRate}%
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Error Rate</p>
                      <p className="text-xs text-gray-600">
                        Persentase queries gagal
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">
                        {data.performanceMetrics.errorRate}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Spreadsheets Tab */}
        <TabsContent value="spreadsheets" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* File Format Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Format File Distribution</CardTitle>
                <CardDescription>
                  Distribusi format file spreadsheet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.spreadsheetStats.mostUsedFormats.map(
                    (format, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                          <span className="font-medium">{format.format}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {format.count} files
                          </span>
                          <Badge variant="outline">{format.percentage}%</Badge>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Storage Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Storage Statistics</CardTitle>
                <CardDescription>Statistik penggunaan storage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Total Files</p>
                      <p className="text-xs text-gray-600">
                        Jumlah file spreadsheet
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {data.spreadsheetStats.totalFiles}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Total Size</p>
                      <p className="text-xs text-gray-600">
                        Total ukuran semua file
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {data.spreadsheetStats.totalSize}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Average File Size</p>
                      <p className="text-xs text-gray-600">
                        Rata-rata ukuran file
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {data.spreadsheetStats.avgFileSize}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Performance */}
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Metrik performa sistem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">System Uptime</p>
                      <p className="text-sm text-gray-600">
                        Ketersediaan sistem
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {data.performanceMetrics.uptime}%
                      </p>
                      <Badge className="bg-green-100 text-green-800">
                        Excellent
                      </Badge>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Average Query Time</p>
                      <p className="text-sm text-gray-600">
                        Waktu rata-rata pemrosesan
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {data.performanceMetrics.avgQueryTime}s
                      </p>
                      <Badge className="bg-blue-100 text-blue-800">Good</Badge>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Error Rate</p>
                      <p className="text-sm text-gray-600">Persentase error</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">
                        {data.performanceMetrics.errorRate}%
                      </p>
                      <Badge className="bg-orange-100 text-orange-800">
                        Acceptable
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>
                  Tren performa dalam {timeRange}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">
                      Performance Trends Chart
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Grafik tren performa akan ditampilkan di sini
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
