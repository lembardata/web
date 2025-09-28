"use client";

import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  HardDrive,
  RefreshCw,
  Search,
  Share,
  Star,
  Trash2,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateSpreadsheet, useSpreadsheets } from "@/hooks/api/use-sheets";
import { useAuth } from "@/hooks/use-auth";

// Mock spreadsheets data
const mockSpreadsheets = [
  {
    id: "sheet-001",
    name: "sales-data-2023.xlsx",
    originalName: "Q4 Sales Report 2023.xlsx",
    size: 2456789,
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    uploaded: "2024-01-15T10:30:00Z",
    lastModified: "2024-01-15T10:30:00Z",
    status: "processed",
    rows: 15420,
    columns: 12,
    sheets: 3,
    owner: "John Doe",
    shared: false,
    favorite: true,
    tags: ["sales", "2023", "Q4"],
    queries: 12,
    preview: {
      headers: ["Date", "Product", "Revenue", "Region"],
      rows: [
        ["2023-10-01", "Product A", "$12,345", "North"],
        ["2023-10-02", "Product B", "$9,876", "South"],
        ["2023-10-03", "Product C", "$15,432", "East"],
        ["2023-10-04", "Product D", "$7,654", "West"],
      ],
    },
  },
];

// Hapus deklarasi yang tidak dipakai untuk mengatasi linter error
// const fileTypes = [
//   { value: "all", label: "All Types" },
//   { value: "xlsx", label: "Excel (.xlsx)" },
//   { value: "xls", label: "Excel (.xls)" },
//   { value: "csv", label: "CSV" },
// ];
// const statusTypes = [
//   { value: "all", label: "All Status" },
//   { value: "processed", label: "Processed" },
//   { value: "processing", label: "Processing" },
//   { value: "error", label: "Error" },
// ];

export default function SpreadsheetsPage() {
  const { user } = useAuth();
  const { data: spreadsheets, isLoading, refetch } = useSpreadsheets();
  const { mutateAsync: createSpreadsheet, isPending: isCreating } =
    useCreateSpreadsheet();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("uploaded");
  // const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSpreadsheet, setSelectedSpreadsheet] = useState<any>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Map data API Spreadsheet -> bentuk UI kartu agar filter/sort tetap berfungsi
  const mappedSheets = useMemo(() => {
    if (!spreadsheets || spreadsheets.length === 0) return [] as any[];
    return spreadsheets.map((s) => ({
      id: s.id,
      name: s.title,
      originalName: s.title,
      size: 0,
      type: "google/sheets",
      uploaded: s.created_at,
      lastModified: s.created_at,
      status: "processed",
      rows: 0,
      columns: 0,
      sheets: 0,
      owner: user?.name ?? "",
      shared: false,
      favorite: false,
      tags: [],
      queries: 0,
      preview: null,
    }));
  }, [spreadsheets, user?.name]);

  // Use mock data jika belum ada data dari API
  const displaySpreadsheets =
    mappedSheets.length > 0 ? mappedSheets : mockSpreadsheets;

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Validasi tipe file
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Tipe file tidak didukung. Unggah file Excel atau CSV.");
        return;
      }

      // Validasi ukuran file (maks 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Ukuran file terlalu besar. Maksimal 10MB.");
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Simulasi progress upload (UI saja)
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(interval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        // API: Tidak ada endpoint upload file di Postman; gunakan Create Sheet.
        await createSpreadsheet({ title: file.name });

        setUploadProgress(100);
        toast.success("Spreadsheet berhasil didaftarkan!");
        setShowUploadDialog(false);
        await refetch();
      } catch (error: any) {
        toast.error(
          error?.response?.data?.error ||
            "Gagal mendaftarkan spreadsheet. Silakan coba lagi.",
        );
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [createSpreadsheet, refetch],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    multiple: false,
  });

  const handleDeleteSpreadsheet = async (spreadsheetId: string) => {
    // Tidak ada endpoint delete sheet pada Postman Collection saat ini
    toast.info("Hapus spreadsheet belum didukung oleh API.");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "processing":
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "uploading":
        return <Upload className="h-4 w-4 text-yellow-600" />;
      default:
        return <FileSpreadsheet className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed":
        return "bg-green-50 text-green-700 border-green-200";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "error":
        return "bg-red-50 text-red-700 border-red-200";
      case "uploading":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / k ** i).toFixed(2)) + " " + sizes[i];
  };

  const filteredSpreadsheets = displaySpreadsheets.filter((sheet) => {
    const matchesSearch =
      sheet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sheet.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sheet.tags?.some((tag: string) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "xlsx" && sheet.type.includes("spreadsheet")) ||
      (typeFilter === "csv" && sheet.type.includes("csv")) ||
      (typeFilter === "xls" && sheet.type.includes("excel")) ||
      (typeFilter === "google" && sheet.type.includes("google"));

    const matchesStatus =
      statusFilter === "all" || sheet.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedSpreadsheets = [...filteredSpreadsheets].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "size":
        return b.size - a.size;
      case "uploaded":
        return new Date(b.uploaded).getTime() - new Date(a.uploaded).getTime();
      case "queries":
        return b.queries - a.queries;
      default:
        return 0;
    }
  });

  const stats = {
    total: displaySpreadsheets.length,
    processed: displaySpreadsheets.filter((s) => s.status === "processed")
      .length,
    processing: displaySpreadsheets.filter((s) => s.status === "processing")
      .length,
    totalSize: displaySpreadsheets.reduce((acc, s) => acc + (s.size || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Spreadsheets</h1>
          <p className="mt-2 text-gray-600">
            Kelola dan analisis file spreadsheet Anda dengan AI
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button disabled={isCreating}>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Daftarkan Spreadsheet</DialogTitle>
                <DialogDescription>
                  Unggah file Excel/CSV untuk mengambil judul, lalu sistem akan
                  mendaftarkan spreadsheet Anda.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  {isDragActive ? (
                    <p className="text-blue-600">Lepaskan file di sini...</p>
                  ) : (
                    <div>
                      <p className="text-gray-600 mb-2">
                        Seret & taruh spreadsheet di sini, atau klik untuk
                        memilih
                      </p>
                      <p className="text-sm text-gray-500">
                        Mendukung: .xlsx, .xls, .csv (maks 10MB)
                      </p>
                    </div>
                  )}
                </div>

                {(isUploading || isCreating) && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Mendaftarkan...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Files</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.processed}</p>
                <p className="text-sm text-gray-600">Processed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.processing}</p>
                <p className="text-sm text-gray-600">Processing</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {formatFileSize(stats.totalSize)}
                </p>
                <p className="text-sm text-gray-600">Total Size</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Input
            placeholder="Cari spreadsheet..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
            <SelectItem value="xls">Excel (.xls)</SelectItem>
            <SelectItem value="csv">CSV</SelectItem>
            <SelectItem value="google">Google Sheets</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="processed">Processed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="uploaded">Tanggal Upload</SelectItem>
            <SelectItem value="name">Nama</SelectItem>
            <SelectItem value="size">Ukuran</SelectItem>
            <SelectItem value="queries">Jumlah Query</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedSpreadsheets.map((sheet) => (
          <Card key={sheet.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {sheet.originalName}
                      </h3>
                      <p className="text-sm text-gray-500">{sheet.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Star
                        className={`h-4 w-4 ${sheet.favorite ? "text-yellow-500" : "text-gray-400"}`}
                      />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4 text-gray-400" />
                    </Button>
                    {sheet.shared && (
                      <Users className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(sheet.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(sheet.status)}
                        <span>{sheet.status}</span>
                      </div>
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {formatFileSize(sheet.size || 0)}
                    </span>
                  </div>

                  {sheet.status === "processing" && sheet.progress && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Processing</span>
                        <span>{sheet.progress}%</span>
                      </div>
                      <Progress value={sheet.progress} className="h-2" />
                    </div>
                  )}

                  {sheet.status === "error" && sheet.error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-800">
                          {sheet.error}
                        </span>
                      </div>
                    </div>
                  )}

                  {sheet.status === "processed" && (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <p className="font-medium">
                          {(sheet.rows || 0).toLocaleString()}
                        </p>
                        <p className="text-gray-500">Rows</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{sheet.columns || 0}</p>
                        <p className="text-gray-500">Columns</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{sheet.sheets || 0}</p>
                        <p className="text-gray-500">Sheets</p>
                      </div>
                    </div>
                  )}

                  {sheet.tags && sheet.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {sheet.tags.map((tag: string) => (
                        <Badge
                          key={`${sheet.id}-${tag}`}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(sheet.uploaded).toLocaleDateString("id-ID")}
                      </span>
                    </div>

                    {sheet.queries > 0 && (
                      <div className="flex items-center space-x-1">
                        <Zap className="h-4 w-4" />
                        <span>{sheet.queries} queries</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex space-x-2">
                      {sheet.status === "processed" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedSpreadsheet(sheet)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSpreadsheet(sheet.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {sortedSpreadsheets.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                ? "Tidak ada spreadsheet ditemukan"
                : "Belum ada spreadsheet"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                ? "Coba ubah filter atau kata kunci pencarian"
                : "Daftarkan spreadsheet untuk memulai"}
            </p>
            <Button onClick={() => setShowUploadDialog(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Daftarkan Spreadsheet
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Preview Dialog */}
      {selectedSpreadsheet && (
        <Dialog
          open={!!selectedSpreadsheet}
          onOpenChange={() => setSelectedSpreadsheet(null)}
        >
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedSpreadsheet.originalName}</DialogTitle>
              <DialogDescription>
                Preview data dari spreadsheet Anda
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-medium">Rows</p>
                  <p className="text-gray-600">
                    {selectedSpreadsheet.rows?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Columns</p>
                  <p className="text-gray-600">{selectedSpreadsheet.columns}</p>
                </div>
                <div>
                  <p className="font-medium">Sheets</p>
                  <p className="text-gray-600">{selectedSpreadsheet.sheets}</p>
                </div>
                <div>
                  <p className="font-medium">Size</p>
                  <p className="text-gray-600">
                    {formatFileSize(selectedSpreadsheet.size || 0)}
                  </p>
                </div>
              </div>

              {selectedSpreadsheet.preview && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b">
                    <h4 className="font-medium">Data Preview</h4>
                  </div>
                  <ScrollArea className="h-64">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          {selectedSpreadsheet.preview.headers.map(
                            (header: string) => (
                              <th
                                key={`${selectedSpreadsheet.id}-h-${header}`}
                                className="text-left p-3 font-medium"
                              >
                                {header}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedSpreadsheet.preview.rows.map(
                          (row: string[], rIndex: number) => (
                            <tr
                              key={`${selectedSpreadsheet.id}-r-${rIndex}`}
                              className="border-b hover:bg-gray-50"
                            >
                              {row.map((cell: string, cIndex: number) => (
                                <td
                                  key={`${selectedSpreadsheet.id}-c-${rIndex}-${cIndex}`}
                                  className="p-3"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </ScrollArea>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedSpreadsheet(null)}
                >
                  Tutup
                </Button>
                <Button>
                  <Zap className="h-4 w-4 mr-2" />
                  Buat AI Query
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
