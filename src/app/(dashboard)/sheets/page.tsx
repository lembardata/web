"use client";

import {
  Calendar,
  Download,
  Edit,
  Eye,
  FileSpreadsheet,
  FileText,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { useState } from "react";
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSpreadsheets } from "@/hooks/api";

// Mock data for spreadsheets
const mockSpreadsheets = [
  {
    id: "1",
    name: "Sales Report Q1 2024",
    description: "Laporan penjualan kuartal pertama 2024",
    file_size: 2048576, // 2MB
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-16T14:20:00Z",
    status: "active",
    rows: 1250,
    columns: 15,
  },
  {
    id: "2",
    name: "Budget Planning 2024",
    description: "Perencanaan budget untuk tahun 2024",
    file_size: 1536000, // 1.5MB
    created_at: "2024-01-14T09:15:00Z",
    updated_at: "2024-01-15T11:30:00Z",
    status: "active",
    rows: 890,
    columns: 12,
  },
  {
    id: "3",
    name: "Inventory Management",
    description: "Manajemen inventori produk",
    file_size: 3072000, // 3MB
    created_at: "2024-01-13T16:45:00Z",
    updated_at: "2024-01-14T08:20:00Z",
    status: "active",
    rows: 2100,
    columns: 18,
  },
  {
    id: "4",
    name: "Customer Database",
    description: "Database pelanggan dan kontak",
    file_size: 4096000, // 4MB
    created_at: "2024-01-12T13:20:00Z",
    updated_at: "2024-01-13T15:10:00Z",
    status: "archived",
    rows: 3500,
    columns: 22,
  },
];

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

export default function SheetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const { data: spreadsheets, isLoading } = useSpreadsheets();

  // Use real data if available, otherwise use mock data
  const userSpreadsheets = spreadsheets || mockSpreadsheets;

  // Filter spreadsheets based on search
  const filteredSpreadsheets = userSpreadsheets.filter(
    (sheet) =>
      sheet?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sheet?.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleUpload = () => {
    // TODO: Implement file upload logic
    console.log("Upload file");
    setUploadDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete logic
    console.log("Delete spreadsheet:", id);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Spreadsheets</h1>
          <p className="mt-2 text-gray-600">
            Kelola dan analisis spreadsheet Anda dengan bantuan AI.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Spreadsheet
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Spreadsheet Baru</DialogTitle>
                <DialogDescription>
                  Upload file Excel (.xlsx) atau CSV untuk dianalisis dengan AI.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag & drop file atau klik untuk memilih
                  </p>
                  <p className="text-xs text-gray-500">
                    Mendukung .xlsx, .xls, .csv (Max 10MB)
                  </p>
                  <Button variant="outline" className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Pilih File
                  </Button>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setUploadDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button onClick={handleUpload}>Upload</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari spreadsheet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Spreadsheets Grid */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </CardContent>
          </Card>
        ) : filteredSpreadsheets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FileSpreadsheet className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm
                  ? "Tidak ada spreadsheet yang sesuai"
                  : "Belum ada spreadsheet"}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md">
                {searchTerm
                  ? "Coba ubah kata kunci pencarian atau upload spreadsheet baru"
                  : "Upload spreadsheet pertama Anda untuk mulai menggunakan fitur AI analysis"}
              </p>
              <Button
                onClick={() =>
                  searchTerm ? setSearchTerm("") : setUploadDialogOpen(true)
                }
              >
                <Upload className="mr-2 h-4 w-4" />
                {searchTerm ? "Reset Pencarian" : "Upload Spreadsheet"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpreadsheets.map((sheet) => (
              <Card
                key={sheet.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center">
                        <FileSpreadsheet className="mr-2 h-5 w-5 text-primary" />
                        {sheet.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {sheet.description}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        sheet.status === "active" ? "secondary" : "outline"
                      }
                    >
                      {sheet.status === "active" ? "Aktif" : "Arsip"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* File Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FileText className="mr-1 h-3 w-3" />
                        {formatFileSize(sheet.file_size)}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(sheet.updated_at)}
                      </div>
                    </div>

                    {/* Dimensions */}
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">
                        {sheet.rows.toLocaleString()}
                      </span>{" "}
                      baris ×
                      <span className="font-medium">{sheet.columns}</span> kolom
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 pt-2">
                      <Button size="sm" variant="outline">
                        <Eye className="mr-1 h-3 w-3" />
                        Lihat
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="mr-1 h-3 w-3" />
                        Download
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Hapus Spreadsheet
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus "{sheet.name}"?
                              Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(sheet.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {filteredSpreadsheets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {filteredSpreadsheets.length}
                </div>
                <div className="text-sm text-gray-600">Total Spreadsheets</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {
                    filteredSpreadsheets.filter((s) => s.status === "active")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">Aktif</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {formatFileSize(
                    filteredSpreadsheets.reduce(
                      (total, sheet) => total + sheet.file_size,
                      0,
                    ),
                  )}
                </div>
                <div className="text-sm text-gray-600">Total Ukuran</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {filteredSpreadsheets
                    .reduce((total, sheet) => total + sheet.rows, 0)
                    .toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Baris</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
