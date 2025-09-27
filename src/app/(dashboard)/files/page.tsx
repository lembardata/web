"use client";

import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  Clock,
  CloudUpload,
  Database,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Globe,
  Grid3X3,
  HardDrive,
  List,
  Lock,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Share2,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";

// Types
interface SpreadsheetFile {
  id: string;
  name: string;
  originalName: string;
  size: number;
  type: string;
  status: "uploading" | "processing" | "ready" | "error";
  uploadProgress?: number;
  createdAt: string;
  updatedAt: string;
  lastAccessedAt?: string;
  rowCount?: number;
  columnCount?: number;
  sheetCount?: number;
  owner: string;
  visibility: "private" | "shared" | "public";
  tags: string[];
  description?: string;
  downloadUrl?: string;
  previewUrl?: string;
}

interface FileStats {
  totalFiles: number;
  totalSize: number;
  storageUsed: number;
  storageLimit: number;
  recentUploads: number;
}

export default function FilesPage() {
  const { user } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Upload state
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);

  // Mock data
  const [files] = useState<SpreadsheetFile[]>([
    {
      id: "file1",
      name: "sales_data_q4_2023.xlsx",
      originalName: "Sales Data Q4 2023.xlsx",
      size: 2048576, // 2MB
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      status: "ready",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:05:00Z",
      lastAccessedAt: "2024-01-17T14:30:00Z",
      rowCount: 1250,
      columnCount: 15,
      sheetCount: 3,
      owner: user?.id || "user1",
      visibility: "private",
      tags: ["sales", "q4", "2023"],
      description:
        "Data penjualan kuartal 4 tahun 2023 dengan breakdown per produk dan region",
      downloadUrl: "#",
      previewUrl: "#",
    },
    {
      id: "file2",
      name: "inventory_tracking.xlsx",
      originalName: "Inventory Tracking.xlsx",
      size: 1536000, // 1.5MB
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      status: "ready",
      createdAt: "2024-01-14T09:30:00Z",
      updatedAt: "2024-01-16T11:20:00Z",
      lastAccessedAt: "2024-01-16T15:45:00Z",
      rowCount: 890,
      columnCount: 12,
      sheetCount: 2,
      owner: user?.id || "user1",
      visibility: "shared",
      tags: ["inventory", "tracking", "warehouse"],
      description:
        "Tracking inventory real-time dengan status stock dan reorder points",
      downloadUrl: "#",
      previewUrl: "#",
    },
    {
      id: "file3",
      name: "customer_database.csv",
      originalName: "Customer Database.csv",
      size: 3145728, // 3MB
      type: "text/csv",
      status: "processing",
      uploadProgress: 75,
      createdAt: "2024-01-17T16:00:00Z",
      updatedAt: "2024-01-17T16:05:00Z",
      rowCount: 2500,
      columnCount: 20,
      sheetCount: 1,
      owner: user?.id || "user1",
      visibility: "private",
      tags: ["customer", "database", "crm"],
      description:
        "Database customer lengkap dengan informasi kontak dan riwayat transaksi",
    },
    {
      id: "file4",
      name: "financial_report.xlsx",
      originalName: "Financial Report 2023.xlsx",
      size: 4194304, // 4MB
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      status: "error",
      createdAt: "2024-01-13T14:15:00Z",
      updatedAt: "2024-01-13T14:20:00Z",
      rowCount: 0,
      columnCount: 0,
      sheetCount: 0,
      owner: user?.id || "user1",
      visibility: "private",
      tags: ["financial", "report", "2023"],
      description: "Laporan keuangan tahunan 2023 - Error saat processing",
    },
  ]);

  const fileStats: FileStats = {
    totalFiles: files.length,
    totalSize: files.reduce((sum, file) => sum + file.size, 0),
    storageUsed: 8 * 1024 * 1024 * 1024, // 8GB
    storageLimit: 50 * 1024 * 1024 * 1024, // 50GB
    recentUploads: files.filter((f) => {
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return new Date(f.createdAt) > dayAgo;
    }).length,
  };

  // Helper functions
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / k ** i).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileIcon = (type: string) => {
    if (type.includes("spreadsheet") || type.includes("excel")) {
      return FileSpreadsheet;
    }
    if (type.includes("csv")) {
      return Database;
    }
    return FileText;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return CheckCircle;
      case "processing":
        return RefreshCw;
      case "uploading":
        return CloudUpload;
      case "error":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "uploading":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ready":
        return "Siap";
      case "processing":
        return "Memproses";
      case "uploading":
        return "Mengupload";
      case "error":
        return "Error";
      default:
        return status;
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return Globe;
      case "shared":
        return Users;
      case "private":
        return Lock;
      default:
        return Lock;
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case "public":
        return "bg-blue-100 text-blue-800";
      case "shared":
        return "bg-green-100 text-green-800";
      case "private":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVisibilityText = (visibility: string) => {
    switch (visibility) {
      case "public":
        return "Publik";
      case "shared":
        return "Dibagikan";
      case "private":
        return "Pribadi";
      default:
        return visibility;
    }
  };

  // Filter and sort functions
  const filteredFiles = files
    .filter((file) => {
      const matchesSearch =
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesType =
        filterType === "all" ||
        (filterType === "excel" && file.type.includes("spreadsheet")) ||
        (filterType === "csv" && file.type.includes("csv"));

      const matchesStatus =
        filterStatus === "all" || file.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: number | string = 0, bValue: number | string = 0;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "size":
          aValue = a.size;
          bValue = b.size;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        // case "updatedAt":
        default:
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  // Event handlers
  const handleFileSelect = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId],
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map((f) => f.id));
    }
  };

  const handleFileUpload = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ];
      return validTypes.includes(file.type);
    });

    if (validFiles.length !== fileArray.length) {
      toast.error(
        "Beberapa file tidak didukung. Hanya file Excel (.xlsx, .xls) dan CSV yang diizinkan.",
      );
    }

    if (validFiles.length === 0) return;

    setUploadingFiles(validFiles);

    try {
      // Simulate upload process
      for (const file of validFiles) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success(`File ${file.name} berhasil diupload`);
      }
    } catch (error) {
      console.log(error)
      toast.error("Gagal mengupload file");
    } finally {
      setUploadingFiles([]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files);
      }
    },
    [handleFileUpload],
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`File ${fileId} berhasil dihapus`);
    } catch (error) {
      console.log(error)
      toast.error("Gagal menghapus file");
    }
  };

  const handleDeleteSelected = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(`${selectedFiles.length} file berhasil dihapus`);
      setSelectedFiles([]);
    } catch (error) {
      console.log(error)
      toast.error("Gagal menghapus file");
    }
  };

  const handleDownloadFile = (file: SpreadsheetFile) => {
    // Simulate download
    toast.success(`Mengunduh ${file.name}`);
  };

  const handlePreviewFile = (file: SpreadsheetFile) => {
    // Simulate preview
    toast.info(`Membuka preview ${file.name}`);
  };

  const handleShareFile = (file: SpreadsheetFile) => {
    // Simulate sharing
    navigator.clipboard.writeText(`https://spreadsheetai.com/files/${file.id}`);
    toast.success("Link file berhasil disalin");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FolderOpen className="h-8 w-8 text-blue-600" />
            File Manager
          </h1>
          <p className="text-gray-600 mt-2">
            Kelola file spreadsheet Anda dengan mudah dan aman
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            id="file-upload"
            multiple
            accept=".xlsx,.xls,.csv"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <Button asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </label>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Files</p>
                <p className="text-2xl font-bold text-gray-900">
                  {fileStats.totalFiles}
                </p>
              </div>
              <FileSpreadsheet className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Storage Used
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatFileSize(fileStats.storageUsed)}
                </p>
                <div className="mt-2">
                  <Progress
                    value={
                      (fileStats.storageUsed / fileStats.storageLimit) * 100
                    }
                    className="h-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(fileStats.storageLimit)} limit
                  </p>
                </div>
              </div>
              <HardDrive className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Recent Uploads
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {fileStats.recentUploads}
                </p>
                <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
              </div>
              <CloudUpload className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Size</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatFileSize(fileStats.totalSize)}
                </p>
                <p className="text-xs text-gray-500 mt-1">All files</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <CloudUpload
              className={`h-16 w-16 mx-auto mb-4 ${
                isDragOver ? "text-blue-600" : "text-gray-400"
              }`}
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isDragOver ? "Drop files here" : "Drag & drop files here"}
            </h3>
            <p className="text-gray-600 mb-4">
              Atau klik tombol di bawah untuk memilih file
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Mendukung file Excel (.xlsx, .xls) dan CSV dengan ukuran maksimal
              10MB
            </p>

            <input
              type="file"
              id="drag-file-upload"
              multiple
              accept=".xlsx,.xls,.csv"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <Button asChild variant="outline">
              <label htmlFor="drag-file-upload" className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Pilih File
              </label>
            </Button>
          </div>

          {/* Upload Progress */}
          {uploadingFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <Separator />
              <h4 className="font-medium text-gray-900">Uploading Files</h4>
              {uploadingFiles.map((file, index) => (
                <div key={file.name+index.toString()} className="flex items-center gap-3">
                  <FileSpreadsheet className="h-4 w-4 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={75} className="flex-1 h-2" />
                      <span className="text-xs text-gray-500">75%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari file..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="ready">Siap</SelectItem>
                  <SelectItem value="processing">Memproses</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updatedAt">Terakhir Diubah</SelectItem>
                  <SelectItem value="createdAt">Tanggal Upload</SelectItem>
                  <SelectItem value="name">Nama</SelectItem>
                  <SelectItem value="size">Ukuran</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>

              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedFiles.length > 0 && (
            <div className="flex items-center justify-between mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-900">
                  {selectedFiles.length} file dipilih
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Hapus
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus File</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus {selectedFiles.length}{" "}
                        file yang dipilih? Tindakan ini tidak dapat dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteSelected}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Files Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFiles.map((file) => {
            const FileIcon = getFileIcon(file.type);
            const StatusIcon = getStatusIcon(file.status);
            const VisibilityIcon = getVisibilityIcon(file.visibility);
            const isSelected = selectedFiles.includes(file.id);

            return (
              <Card
                key={file.id}
                className={`hover:shadow-lg transition-shadow cursor-pointer ${
                  isSelected ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => handleFileSelect(file.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <FileIcon className="h-8 w-8 text-blue-600" />
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm font-medium truncate">
                          {file.originalName}
                        </CardTitle>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handlePreviewFile(file)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDownloadFile(file)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShareFile(file)}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Status and Progress */}
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(file.status)}>
                      <StatusIcon
                        className={`h-3 w-3 mr-1 ${
                          file.status === "processing" ? "animate-spin" : ""
                        }`}
                      />
                      {getStatusText(file.status)}
                    </Badge>

                    <Badge className={getVisibilityColor(file.visibility)}>
                      <VisibilityIcon className="h-3 w-3 mr-1" />
                      {getVisibilityText(file.visibility)}
                    </Badge>
                  </div>

                  {file.status === "processing" && file.uploadProgress && (
                    <div>
                      <Progress value={file.uploadProgress} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        {file.uploadProgress}% complete
                      </p>
                    </div>
                  )}

                  {/* File Info */}
                  {file.status === "ready" && (
                    <div className="text-xs text-gray-500 space-y-1">
                      {file.rowCount && file.columnCount && (
                        <p>
                          {file.rowCount.toLocaleString()} rows ×{" "}
                          {file.columnCount} cols
                        </p>
                      )}
                      {file.sheetCount && file.sheetCount > 1 && (
                        <p>{file.sheetCount} sheets</p>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {file.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {file.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {file.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{file.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  {file.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {file.description}
                    </p>
                  )}

                  {/* Dates */}
                  <div className="text-xs text-gray-500">
                    <p>Upload: {formatDate(file.createdAt)}</p>
                    {file.lastAccessedAt && (
                      <p>Akses: {formatDate(file.lastAccessedAt)}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedFiles.length === filteredFiles.length &&
                          filteredFiles.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th className="p-4 text-left font-medium text-gray-900">
                      Name
                    </th>
                    <th className="p-4 text-left font-medium text-gray-900">
                      Size
                    </th>
                    <th className="p-4 text-left font-medium text-gray-900">
                      Status
                    </th>
                    <th className="p-4 text-left font-medium text-gray-900">
                      Visibility
                    </th>
                    <th className="p-4 text-left font-medium text-gray-900">
                      Updated
                    </th>
                    <th className="p-4 text-left font-medium text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredFiles.map((file) => {
                    const FileIcon = getFileIcon(file.type);
                    const StatusIcon = getStatusIcon(file.status);
                    const VisibilityIcon = getVisibilityIcon(file.visibility);
                    const isSelected = selectedFiles.includes(file.id);

                    return (
                      <tr
                        key={file.id}
                        className={
                          isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                        }
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleFileSelect(file.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <FileIcon className="h-6 w-6 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {file.originalName}
                              </p>
                              {file.description && (
                                <p className="text-sm text-gray-500 line-clamp-1">
                                  {file.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">
                          {formatFileSize(file.size)}
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(file.status)}>
                            <StatusIcon
                              className={`h-3 w-3 mr-1 ${
                                file.status === "processing"
                                  ? "animate-spin"
                                  : ""
                              }`}
                            />
                            {getStatusText(file.status)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge
                            className={getVisibilityColor(file.visibility)}
                          >
                            <VisibilityIcon className="h-3 w-3 mr-1" />
                            {getVisibilityText(file.visibility)}
                          </Badge>
                        </td>
                        <td className="p-4 text-gray-600">
                          {formatDate(file.updatedAt)}
                        </td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handlePreviewFile(file)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDownloadFile(file)}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleShareFile(file)}
                              >
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteFile(file.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredFiles.length === 0 && (
              <div className="text-center py-12">
                <FileSpreadsheet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tidak ada file
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || filterType !== "all" || filterStatus !== "all"
                    ? "Tidak ada file yang sesuai dengan filter"
                    : "Mulai dengan mengupload file spreadsheet pertama Anda"}
                </p>
                {!searchQuery &&
                  filterType === "all" &&
                  filterStatus === "all" && (
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
