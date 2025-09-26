"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileSpreadsheet,
  Upload,
  Search,
  Download,
  Eye,
  Trash2,
  Share,
  Star,
  FileText,
  Zap,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Calendar,
  HardDrive,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useDropzone } from "react-dropzone";
import { useSpreadsheets } from "@/hooks/api/use-sheets";

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
    tags: ["sales", "q4", "2023"],
    queries: 5,
    lastQuery: "2024-01-15T11:30:00Z",
    preview: {
      headers: ["Date", "Product", "Category", "Sales", "Quantity", "Revenue"],
      rows: [
        ["2023-10-01", "Product A", "Electronics", "$1,250", "5", "$6,250"],
        ["2023-10-01", "Product B", "Clothing", "$850", "12", "$10,200"],
        ["2023-10-02", "Product C", "Electronics", "$2,100", "3", "$6,300"],
      ],
    },
  },
  {
    id: "sheet-002",
    name: "customer-data.csv",
    originalName: "Customer Database Export.csv",
    size: 1234567,
    type: "text/csv",
    uploaded: "2024-01-14T16:20:00Z",
    lastModified: "2024-01-14T16:20:00Z",
    status: "processing",
    progress: 75,
    rows: 8950,
    columns: 8,
    sheets: 1,
    owner: "Jane Smith",
    shared: true,
    favorite: false,
    tags: ["customers", "database"],
    queries: 2,
    lastQuery: "2024-01-14T17:00:00Z",
  },
  {
    id: "sheet-003",
    name: "inventory-data.xlsx",
    originalName: "Inventory Management.xlsx",
    size: 987654,
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    uploaded: "2024-01-13T09:15:00Z",
    lastModified: "2024-01-13T09:15:00Z",
    status: "error",
    error: "Invalid file format. Please check the file structure.",
    rows: 0,
    columns: 0,
    sheets: 0,
    owner: "Mike Johnson",
    shared: false,
    favorite: false,
    tags: ["inventory"],
    queries: 0,
  },
  {
    id: "sheet-004",
    name: "financial-data.xlsx",
    originalName: "Financial Report 2023.xlsx",
    size: 3456789,
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    uploaded: "2024-01-12T14:45:00Z",
    lastModified: "2024-01-12T14:45:00Z",
    status: "processed",
    rows: 25600,
    columns: 15,
    sheets: 5,
    owner: "Sarah Wilson",
    shared: true,
    favorite: true,
    tags: ["finance", "report", "2023"],
    queries: 8,
    lastQuery: "2024-01-15T09:20:00Z",
    preview: {
      headers: ["Month", "Revenue", "Expenses", "Profit", "Growth %"],
      rows: [
        ["Jan 2023", "$125,000", "$85,000", "$40,000", "12.5%"],
        ["Feb 2023", "$135,000", "$88,000", "$47,000", "17.5%"],
        ["Mar 2023", "$142,000", "$92,000", "$50,000", "6.4%"],
      ],
    },
  },
];

const fileTypes = [
  { value: "all", label: "All Files" },
  { value: "xlsx", label: "Excel (.xlsx)" },
  { value: "csv", label: "CSV (.csv)" },
  { value: "xls", label: "Excel Legacy (.xls)" },
];

const statusTypes = [
  { value: "all", label: "All Status" },
  { value: "processed", label: "Processed" },
  { value: "processing", label: "Processing" },
  { value: "error", label: "Error" },
  { value: "uploading", label: "Uploading" },
];

export default function SpreadsheetsPage() {
  const { user } = useAuth();
  const { spreadsheets, isLoading, uploadSpreadsheet, deleteSpreadsheet } =
    useSpreadsheets();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("uploaded");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSpreadsheet, setSelectedSpreadsheet] = useState<any>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Use mock data if spreadsheets from hook is empty
  const displaySpreadsheets =
    spreadsheets?.length > 0 ? spreadsheets : mockSpreadsheets;

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Validate file type
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "File type not supported. Please upload Excel or CSV files.",
        );
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size too large. Maximum size is 10MB.");
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Simulate upload progress
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(interval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        await uploadSpreadsheet(file);

        setUploadProgress(100);
        toast.success("Spreadsheet uploaded successfully!");
        setShowUploadDialog(false);
      } catch (error) {
        toast.error("Failed to upload spreadsheet. Please try again.");
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [uploadSpreadsheet],
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
    try {
      await deleteSpreadsheet(spreadsheetId);
      toast.success("Spreadsheet deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete spreadsheet.");
    }
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
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "uploading":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes("spreadsheet") || type.includes("excel")) {
      return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
    }
    if (type.includes("csv")) {
      return <FileText className="h-8 w-8 text-blue-600" />;
    }
    return <FileSpreadsheet className="h-8 w-8 text-gray-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
      (typeFilter === "xls" && sheet.type.includes("excel"));

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
    totalSize: displaySpreadsheets.reduce((acc, s) => acc + s.size, 0),
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
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Spreadsheet</DialogTitle>
                <DialogDescription>
                  Upload file Excel atau CSV untuk dianalisis dengan AI
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
                    <p className="text-blue-600">Drop the file here...</p>
                  ) : (
                    <div>
                      <p className="text-gray-600 mb-2">
                        Drag & drop a spreadsheet here, or click to select
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports: .xlsx, .xls, .csv (max 10MB)
                      </p>
                    </div>
                  )}
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Uploading...</span>
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

      {/* Filters and Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search spreadsheets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fileTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusTypes.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uploaded">Latest</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                  <SelectItem value="queries">Queries</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spreadsheets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedSpreadsheets.map((sheet) => (
          <Card key={sheet.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getFileIcon(sheet.type)}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {sheet.originalName}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {sheet.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {sheet.favorite && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                  {sheet.shared && <Users className="h-4 w-4 text-blue-500" />}
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
                    {formatFileSize(sheet.size)}
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
                        {sheet.rows.toLocaleString()}
                      </p>
                      <p className="text-gray-500">Rows</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{sheet.columns}</p>
                      <p className="text-gray-500">Columns</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{sheet.sheets}</p>
                      <p className="text-gray-500">Sheets</p>
                    </div>
                  </div>
                )}

                {sheet.tags && sheet.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {sheet.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
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
                ? "No spreadsheets found"
                : "No spreadsheets yet"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters or search terms"
                : "Upload your first spreadsheet to get started"}
            </p>
            <Button onClick={() => setShowUploadDialog(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Spreadsheet
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
                    {formatFileSize(selectedSpreadsheet.size)}
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
                            (header: string, index: number) => (
                              <th
                                key={index}
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
                          (row: string[], index: number) => (
                            <tr
                              key={index}
                              className="border-b hover:bg-gray-50"
                            >
                              {row.map((cell: string, cellIndex: number) => (
                                <td key={cellIndex} className="p-3">
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
                  Close
                </Button>
                <Button>
                  <Zap className="h-4 w-4 mr-2" />
                  Create AI Query
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
