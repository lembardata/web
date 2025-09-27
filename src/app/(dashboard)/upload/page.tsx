"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  FileSpreadsheet,
  File,
  X,
  Check,
  AlertCircle,
  Download,
  Eye,
  Trash2,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  FileText,
  Image,
  Archive,
  HardDrive,
  Cloud,
  Share,
  Copy,
  Edit,
  MoreHorizontal,
  FolderOpen,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Info,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  name: string;
  originalName: string;
  size: number;
  type: string;
  status: "uploading" | "processing" | "completed" | "failed";
  progress: number;
  uploadedAt: Date;
  processedAt?: Date;
  url?: string;
  thumbnailUrl?: string;
  metadata: {
    rows?: number;
    columns?: number;
    sheets?: string[];
    encoding?: string;
    delimiter?: string;
  };
  tags: string[];
  description?: string;
  isPublic: boolean;
  downloadCount: number;
  lastAccessed?: Date;
}

interface UploadStats {
  totalFiles: number;
  totalSize: number;
  storageUsed: number;
  storageLimit: number;
  uploadsThisMonth: number;
  uploadLimit: number;
}

const mockFiles: UploadedFile[] = [
  {
    id: "1",
    name: "sales-data-q4-2024.xlsx",
    originalName: "Sales Data Q4 2024.xlsx",
    size: 2.5 * 1024 * 1024, // 2.5MB
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    status: "completed",
    progress: 100,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    processedAt: new Date(Date.now() - 1000 * 60 * 60 * 2 + 30000), // 2 hours ago + 30s
    url: "/api/files/1/download",
    metadata: {
      rows: 1250,
      columns: 15,
      sheets: ["Q4 Sales", "Summary", "Regions"],
      encoding: "UTF-8",
    },
    tags: ["sales", "q4", "2024", "revenue"],
    description: "Quarterly sales data with regional breakdown",
    isPublic: false,
    downloadCount: 5,
    lastAccessed: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: "2",
    name: "customer-analytics.csv",
    originalName: "Customer Analytics.csv",
    size: 1.8 * 1024 * 1024, // 1.8MB
    type: "text/csv",
    status: "processing",
    progress: 75,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    metadata: {
      rows: 3420,
      columns: 8,
      encoding: "UTF-8",
      delimiter: ",",
    },
    tags: ["customer", "analytics", "behavior"],
    description: "Customer behavior and demographics data",
    isPublic: false,
    downloadCount: 0,
  },
  {
    id: "3",
    name: "product-performance.xlsx",
    originalName: "Product Performance.xlsx",
    size: 3.2 * 1024 * 1024, // 3.2MB
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    status: "failed",
    progress: 0,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    metadata: {
      rows: 890,
      columns: 12,
      sheets: ["Products", "Categories"],
      encoding: "UTF-8",
    },
    tags: ["product", "performance", "metrics"],
    description: "Product performance metrics and KPIs",
    isPublic: false,
    downloadCount: 2,
    lastAccessed: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
  },
];

const mockStats: UploadStats = {
  totalFiles: 15,
  totalSize: 45.2 * 1024 * 1024, // 45.2MB
  storageUsed: 45.2 * 1024 * 1024, // 45.2MB
  storageLimit: 1024 * 1024 * 1024, // 1GB
  uploadsThisMonth: 8,
  uploadLimit: 50,
};

const getFileIcon = (type: string) => {
  if (type.includes("spreadsheet") || type.includes("excel")) {
    return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
  }
  if (type.includes("csv")) {
    return <FileText className="h-8 w-8 text-blue-600" />;
  }
  return <File className="h-8 w-8 text-gray-600" />;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "uploading":
      return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
    case "processing":
      return <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />;
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "uploading":
      return "bg-blue-100 text-blue-800";
    case "processing":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileExtension = (filename: string) => {
  return filename.split(".").pop()?.toLowerCase() || "";
};

export default function UploadPage() {
  const { user } = useAuth();
  const [files, setFiles] = useState<UploadedFile[]>(mockFiles);
  const [stats] = useState<UploadStats>(mockStats);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("uploadedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);

    for (const file of acceptedFiles) {
      // Validate file type
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.ms-excel", // .xls
        "text/csv", // .csv
        "application/json", // .json
        "text/plain", // .txt
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error(`File type not supported: ${file.name}`);
        continue;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File too large: ${file.name} (max 10MB)`);
        continue;
      }

      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name.toLowerCase().replace(/\s+/g, "-"),
        originalName: file.name,
        size: file.size,
        type: file.type,
        status: "uploading",
        progress: 0,
        uploadedAt: new Date(),
        metadata: {},
        tags: [],
        isPublic: false,
        downloadCount: 0,
      };

      setFiles((prev) => [newFile, ...prev]);

      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === newFile.id && f.status === "uploading") {
              const newProgress = Math.min(
                f.progress + Math.random() * 20,
                100,
              );
              if (newProgress >= 100) {
                clearInterval(uploadInterval);
                // Start processing
                setTimeout(() => {
                  setFiles((prev2) =>
                    prev2.map((f2) =>
                      f2.id === newFile.id
                        ? { ...f2, status: "processing", progress: 0 }
                        : f2,
                    ),
                  );

                  // Simulate processing
                  const processInterval = setInterval(() => {
                    setFiles((prev3) =>
                      prev3.map((f3) => {
                        if (
                          f3.id === newFile.id &&
                          f3.status === "processing"
                        ) {
                          const newProgress = Math.min(
                            f3.progress + Math.random() * 15,
                            100,
                          );
                          if (newProgress >= 100) {
                            clearInterval(processInterval);
                            return {
                              ...f3,
                              status: "completed",
                              progress: 100,
                              processedAt: new Date(),
                              url: `/api/files/${f3.id}/download`,
                              metadata: {
                                rows: Math.floor(Math.random() * 5000) + 100,
                                columns: Math.floor(Math.random() * 20) + 5,
                                encoding: "UTF-8",
                                ...(file.type === "text/csv" && {
                                  delimiter: ",",
                                }),
                              },
                            };
                          }
                          return { ...f3, progress: newProgress };
                        }
                        return f3;
                      }),
                    );
                  }, 500);
                }, 1000);

                return { ...f, status: "uploading", progress: 100 };
              }
              return { ...f, progress: newProgress };
            }
            return f;
          }),
        );
      }, 300);
    }

    setIsUploading(false);
    toast.success(`${acceptedFiles.length} file(s) uploaded successfully`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
      "application/json": [".json"],
      "text/plain": [".txt"],
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  // Filter and sort files
  const filteredFiles = files
    .filter((file) => {
      const matchesSearch =
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      const matchesStatus =
        statusFilter === "all" || file.status === statusFilter;
      const matchesType =
        typeFilter === "all" ||
        (typeFilter === "excel" && file.type.includes("spreadsheet")) ||
        (typeFilter === "csv" && file.type.includes("csv")) ||
        (typeFilter === "json" && file.type.includes("json"));
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "size":
          aValue = a.size;
          bValue = b.size;
          break;
        case "uploadedAt":
          aValue = a.uploadedAt;
          bValue = b.uploadedAt;
          break;
        default:
          aValue = a.uploadedAt;
          bValue = b.uploadedAt;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    toast.success("File deleted successfully");
  };

  const handleRetryUpload = (fileId: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, status: "uploading", progress: 0 } : f,
      ),
    );
    toast.success("Upload retry initiated");
  };

  const handleDownloadFile = (file: UploadedFile) => {
    // Simulate download
    toast.success(`Downloading ${file.originalName}`);
    setFiles((prev) =>
      prev.map((f) =>
        f.id === file.id
          ? {
              ...f,
              downloadCount: f.downloadCount + 1,
              lastAccessed: new Date(),
            }
          : f,
      ),
    );
  };

  const handleSelectFile = (fileId: string) => {
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

  const handleBulkDelete = () => {
    setFiles((prev) => prev.filter((f) => !selectedFiles.includes(f.id)));
    setSelectedFiles([]);
    toast.success(`${selectedFiles.length} file(s) deleted`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">File Upload</h1>
        <p className="text-gray-600 mt-2">
          Upload and manage your spreadsheet files for AI analysis
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Files</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalFiles}
                </p>
              </div>
              <FileSpreadsheet className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Storage Used
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatFileSize(stats.storageUsed)}
                </p>
                <div className="mt-2">
                  <Progress
                    value={(stats.storageUsed / stats.storageLimit) * 100}
                    className="h-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(stats.storageLimit)} limit
                  </p>
                </div>
              </div>
              <HardDrive className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.uploadsThisMonth}
                </p>
                <div className="mt-2">
                  <Progress
                    value={(stats.uploadsThisMonth / stats.uploadLimit) * 100}
                    className="h-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.uploadLimit} uploads limit
                  </p>
                </div>
              </div>
              <Upload className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    files.filter(
                      (f) =>
                        f.status === "processing" || f.status === "uploading",
                    ).length
                  }
                </p>
              </div>
              <RefreshCw className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="manage">Manage Files</TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          {/* Upload Area */}
          <Card>
            <CardContent className="p-6">
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400",
                )}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                {isDragActive ? (
                  <div>
                    <p className="text-lg font-medium text-blue-600 mb-2">
                      Drop files here to upload
                    </p>
                    <p className="text-gray-600">Release to start uploading</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Drag & drop files here, or click to select
                    </p>
                    <p className="text-gray-600 mb-4">
                      Supports Excel (.xlsx, .xls), CSV, JSON, and TXT files
                    </p>
                    <Button>Select Files</Button>
                  </div>
                )}
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Max file size: 10MB</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Multiple files supported</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Automatic processing</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Upload Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Supported File Types</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-green-600" />
                      <span>Excel files (.xlsx, .xls)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span>CSV files (.csv)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <File className="h-4 w-4 text-purple-600" />
                      <span>JSON files (.json)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span>Text files (.txt)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Best Practices</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Use clear, descriptive file names</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Include column headers in your data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Remove empty rows and columns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Ensure consistent data formatting</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Files Tab */}
        <TabsContent value="manage" className="space-y-6">
          {/* Filters and Controls */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search files..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="uploading">Uploading</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uploadedAt">Upload Date</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="size">Size</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                  >
                    {sortOrder === "asc" ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setViewMode(viewMode === "grid" ? "list" : "grid")
                    }
                  >
                    {viewMode === "grid" ? (
                      <List className="h-4 w-4" />
                    ) : (
                      <Grid className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div className="flex items-center justify-between mt-4 p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedFiles.length} file(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedFiles([])}
                    >
                      Clear Selection
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleBulkDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Files List */}
          {filteredFiles.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Files Found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your filters or search terms."
                    : "Upload your first file to get started."}
                </p>
                <Button
                  onClick={() =>
                    document.querySelector('[value="upload"]')?.click()
                  }
                >
                  Upload Files
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Select All */}
              <div className="flex items-center gap-2 px-2">
                <input
                  type="checkbox"
                  checked={selectedFiles.length === filteredFiles.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
                <Label className="text-sm text-gray-600">
                  Select all ({filteredFiles.length} files)
                </Label>
              </div>

              {/* Files */}
              {filteredFiles.map((file) => (
                <Card
                  key={file.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => handleSelectFile(file.id)}
                        className="rounded border-gray-300 mt-1"
                      />

                      <div className="flex-shrink-0">
                        {getFileIcon(file.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg truncate">
                            {file.originalName}
                          </h3>
                          <Badge className={getStatusColor(file.status)}>
                            {getStatusIcon(file.status)}
                            <span className="ml-1">{file.status}</span>
                          </Badge>
                        </div>

                        {(file.status === "uploading" ||
                          file.status === "processing") && (
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>
                                {file.status === "uploading"
                                  ? "Uploading..."
                                  : "Processing..."}
                              </span>
                              <span>{file.progress}%</span>
                            </div>
                            <Progress value={file.progress} className="h-2" />
                          </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Size:</span>{" "}
                            {formatFileSize(file.size)}
                          </div>
                          <div>
                            <span className="font-medium">Type:</span>{" "}
                            {getFileExtension(file.name).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-medium">Uploaded:</span>{" "}
                            {formatDistanceToNow(file.uploadedAt, {
                              addSuffix: true,
                              locale: id,
                            })}
                          </div>
                          <div>
                            <span className="font-medium">Downloads:</span>{" "}
                            {file.downloadCount}
                          </div>
                        </div>

                        {file.metadata.rows && (
                          <div className="flex gap-4 text-sm text-gray-600 mb-3">
                            <span>
                              <strong>Rows:</strong>{" "}
                              {file.metadata.rows.toLocaleString()}
                            </span>
                            <span>
                              <strong>Columns:</strong> {file.metadata.columns}
                            </span>
                            {file.metadata.sheets && (
                              <span>
                                <strong>Sheets:</strong>{" "}
                                {file.metadata.sheets.length}
                              </span>
                            )}
                          </div>
                        )}

                        {file.description && (
                          <p className="text-sm text-gray-700 mb-3">
                            {file.description}
                          </p>
                        )}

                        {file.tags.length > 0 && (
                          <div className="flex gap-1 mb-3">
                            {file.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2">
                          {file.status === "completed" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadFile(file)}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </Button>
                            </>
                          )}

                          {file.status === "failed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRetryUpload(file.id)}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Retry
                            </Button>
                          )}

                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>

                          <Button variant="outline" size="sm">
                            <Share className="h-4 w-4 mr-2" />
                            Share
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteFile(file.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
