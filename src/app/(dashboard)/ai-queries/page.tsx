"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  Upload,
  FileSpreadsheet,
  Download,
  Eye,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Copy,
  Share,
  Star,
  Calendar,
  BarChart3,
  TrendingUp,
  FileText,
  Zap,
  Target,
  Database
} from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"

interface QueryResult {
  id: string
  title: string
  query: string
  fileName: string
  fileSize: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result?: string
  insights?: string[]
  createdAt: string
  completedAt?: string
  processingTime?: number
  accuracy?: number
  confidence?: number
  tags: string[]
}

interface FileUpload {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: string
  status: 'uploading' | 'completed' | 'failed'
  progress: number
}

export default function AIQueriesPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("new-query")
  const [isProcessing, setIsProcessing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  // New query form
  const [queryForm, setQueryForm] = useState({
    title: "",
    query: "",
    analysisType: "general" // general, financial, statistical, predictive
  })

  // Mock data for query results
  const [queryResults, setQueryResults] = useState<QueryResult[]>([
    {
      id: "query-1",
      title: "Analisis Penjualan Q4 2024",
      query: "Berikan analisis tren penjualan untuk kuartal 4 2024 dan prediksi untuk Q1 2025",
      fileName: "sales_data_q4_2024.xlsx",
      fileSize: 2048000,
      status: "completed",
      result: "Berdasarkan data penjualan Q4 2024, terdapat peningkatan 15% dibanding Q3. Produk kategori A menunjukkan performa terbaik dengan growth 23%.",
      insights: [
        "Penjualan meningkat 15% dari kuartal sebelumnya",
        "Kategori A adalah top performer dengan growth 23%",
        "Prediksi Q1 2025: pertumbuhan 8-12%",
        "Rekomendasi: fokus pada kategori A dan ekspansi regional"
      ],
      createdAt: "2024-01-20T10:30:00Z",
      completedAt: "2024-01-20T10:32:15Z",
      processingTime: 135,
      accuracy: 94,
      confidence: 87,
      tags: ["sales", "analysis", "prediction"]
    },
    {
      id: "query-2",
      title: "Budget Allocation Analysis",
      query: "Analisis alokasi budget marketing dan ROI per channel",
      fileName: "marketing_budget_2024.xlsx",
      fileSize: 1536000,
      status: "processing",
      createdAt: "2024-01-20T11:15:00Z",
      tags: ["marketing", "budget", "roi"]
    },
    {
      id: "query-3",
      title: "Employee Performance Review",
      query: "Evaluasi performa karyawan berdasarkan KPI dan target achievement",
      fileName: "hr_performance_2024.xlsx",
      fileSize: 3072000,
      status: "failed",
      createdAt: "2024-01-20T09:45:00Z",
      tags: ["hr", "performance", "kpi"]
    }
  ])

  // Mock file uploads
  const [fileUploads, setFileUploads] = useState<FileUpload[]>([
    {
      id: "file-1",
      name: "sales_data_q4_2024.xlsx",
      size: 2048000,
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      uploadedAt: "2024-01-20T10:29:00Z",
      status: "completed",
      progress: 100
    },
    {
      id: "file-2",
      name: "marketing_budget_2024.xlsx",
      size: 1536000,
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      uploadedAt: "2024-01-20T11:14:00Z",
      status: "uploading",
      progress: 67
    }
  ])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Simulate file upload
      const newUpload: FileUpload = {
        id: `file-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        status: "uploading",
        progress: 0
      }
      setFileUploads(prev => [...prev, newUpload])
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setFileUploads(prev => prev.map(upload => {
          if (upload.id === newUpload.id && upload.progress < 100) {
            const newProgress = Math.min(upload.progress + Math.random() * 20, 100)
            return {
              ...upload,
              progress: newProgress,
              status: newProgress === 100 ? "completed" : "uploading"
            }
          }
          return upload
        }))
      }, 500)
      
      setTimeout(() => {
        clearInterval(interval)
        setFileUploads(prev => prev.map(upload => 
          upload.id === newUpload.id 
            ? { ...upload, status: "completed", progress: 100 }
            : upload
        ))
        toast.success("File berhasil diupload!")
      }, 3000)
    }
  }

  const handleSubmitQuery = async () => {
    if (!queryForm.title || !queryForm.query || !selectedFile) {
      toast.error("Mohon lengkapi semua field dan pilih file!")
      return
    }

    setIsProcessing(true)
    
    const newQuery: QueryResult = {
      id: `query-${Date.now()}`,
      title: queryForm.title,
      query: queryForm.query,
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      status: "processing",
      createdAt: new Date().toISOString(),
      tags: [queryForm.analysisType]
    }

    setQueryResults(prev => [newQuery, ...prev])
    
    // Simulate processing
    setTimeout(() => {
      setQueryResults(prev => prev.map(query => 
        query.id === newQuery.id 
          ? {
              ...query,
              status: "completed",
              result: "Analisis telah selesai. Berdasarkan data yang diupload, ditemukan beberapa insight menarik yang dapat membantu pengambilan keputusan bisnis.",
              insights: [
                "Tren positif teridentifikasi pada data",
                "Beberapa anomali memerlukan perhatian",
                "Rekomendasi aksi telah disiapkan"
              ],
              completedAt: new Date().toISOString(),
              processingTime: Math.floor(Math.random() * 200) + 50,
              accuracy: Math.floor(Math.random() * 20) + 80,
              confidence: Math.floor(Math.random() * 30) + 70
            }
          : query
      ))
      setIsProcessing(false)
      setQueryForm({ title: "", query: "", analysisType: "general" })
      setSelectedFile(null)
      toast.success("Query berhasil diproses!")
    }, 5000)

    toast.success("Query sedang diproses...")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'processing':
      case 'uploading':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
      case 'uploading':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const copyResult = (result: string) => {
    navigator.clipboard.writeText(result)
    toast.success("Hasil analisis berhasil disalin!")
  }

  const downloadResult = (query: QueryResult) => {
    // Simulate download
    toast.success(`Mengunduh hasil analisis: ${query.title}`)
  }

  const deleteQuery = (queryId: string) => {
    setQueryResults(prev => prev.filter(query => query.id !== queryId))
    toast.success("Query berhasil dihapus!")
  }

  const filteredResults = queryResults.filter(query => 
    query.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    query.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
    query.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Brain className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">AI Queries</h1>
          <p className="text-muted-foreground">
            Upload file Excel dan dapatkan insight AI yang powerful untuk data Anda
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Queries</p>
                <p className="text-2xl font-bold">{queryResults.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">
                  {queryResults.filter(q => q.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold">
                  {queryResults.filter(q => q.status === 'processing').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Files Uploaded</p>
                <p className="text-2xl font-bold">{fileUploads.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new-query">New Query</TabsTrigger>
          <TabsTrigger value="results">Query Results</TabsTrigger>
          <TabsTrigger value="files">File Manager</TabsTrigger>
        </TabsList>

        {/* New Query Tab */}
        <TabsContent value="new-query" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Create New AI Query
              </CardTitle>
              <CardDescription>
                Upload your Excel file and ask AI to analyze your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload */}
              <div className="space-y-4">
                <Label htmlFor="file-upload">Upload Excel File</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-semibold mb-2">
                      {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-muted-foreground">
                      {selectedFile 
                        ? `${formatFileSize(selectedFile.size)} • ${selectedFile.type}`
                        : "Excel files (.xlsx, .xls) or CSV files up to 10MB"
                      }
                    </p>
                  </label>
                </div>
              </div>
              
              {/* Query Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="query-title">Query Title</Label>
                  <Input
                    id="query-title"
                    placeholder="e.g., Sales Analysis Q4 2024"
                    value={queryForm.title}
                    onChange={(e) => setQueryForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="analysis-type">Analysis Type</Label>
                  <select
                    id="analysis-type"
                    className="w-full p-2 border border-input rounded-md bg-background"
                    value={queryForm.analysisType}
                    onChange={(e) => setQueryForm(prev => ({ ...prev, analysisType: e.target.value }))}
                  >
                    <option value="general">General Analysis</option>
                    <option value="financial">Financial Analysis</option>
                    <option value="statistical">Statistical Analysis</option>
                    <option value="predictive">Predictive Analysis</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="query-text">Your Question</Label>
                  <Textarea
                    id="query-text"
                    placeholder="Describe what you want to know about your data. Be specific about the insights you're looking for..."
                    rows={4}
                    value={queryForm.query}
                    onChange={(e) => setQueryForm(prev => ({ ...prev, query: e.target.value }))}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleSubmitQuery} 
                disabled={isProcessing || !selectedFile || !queryForm.title || !queryForm.query}
                className="w-full"
              >
                {isProcessing ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {isProcessing ? "Processing..." : "Run AI Analysis"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Query Results Tab */}
        <TabsContent value="results" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search queries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Results List */}
          <div className="space-y-4">
            {filteredResults.length > 0 ? (
              filteredResults.map((query) => (
                <Card key={query.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{query.title}</h3>
                          <Badge className={getStatusColor(query.status)}>
                            {getStatusIcon(query.status)}
                            <span className="ml-1 capitalize">{query.status}</span>
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{query.query}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileSpreadsheet className="h-4 w-4" />
                            {query.fileName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(query.createdAt)}
                          </span>
                          {query.processingTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {query.processingTime}s
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {query.status === 'completed' && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => copyResult(query.result || "")}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => downloadResult(query)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button variant="outline" size="sm" onClick={() => deleteQuery(query.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {query.status === 'completed' && query.result && (
                    <CardContent>
                      <div className="space-y-4">
                        {/* Metrics */}
                        {(query.accuracy || query.confidence) && (
                          <div className="grid grid-cols-2 gap-4">
                            {query.accuracy && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Accuracy</span>
                                  <span>{query.accuracy}%</span>
                                </div>
                                <Progress value={query.accuracy} className="h-2" />
                              </div>
                            )}
                            {query.confidence && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Confidence</span>
                                  <span>{query.confidence}%</span>
                                </div>
                                <Progress value={query.confidence} className="h-2" />
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Result */}
                        <div className="space-y-2">
                          <h4 className="font-semibold flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Analysis Result
                          </h4>
                          <div className="bg-muted p-4 rounded-lg">
                            <p>{query.result}</p>
                          </div>
                        </div>
                        
                        {/* Insights */}
                        {query.insights && query.insights.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-semibold flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              Key Insights
                            </h4>
                            <ul className="space-y-2">
                              {query.insights.map((insight, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                  <span>{insight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Tags */}
                        <div className="flex gap-2">
                          {query.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Query Results</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery 
                      ? "No results found for your search."
                      : "You haven't created any AI queries yet. Start by creating your first query."
                    }
                  </p>
                  <Button onClick={() => setActiveTab("new-query")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Query
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* File Manager Tab */}
        <TabsContent value="files" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                File Manager
              </CardTitle>
              <CardDescription>
                Manage your uploaded files and their processing status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {fileUploads.length > 0 ? (
                <div className="space-y-4">
                  {fileUploads.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="h-8 w-8 text-green-600" />
                        <div>
                          <h4 className="font-semibold">{file.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{formatFileSize(file.size)}</span>
                            <span>{formatDate(file.uploadedAt)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {file.status === 'uploading' && (
                          <div className="w-32">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Uploading...</span>
                              <span>{Math.round(file.progress)}%</span>
                            </div>
                            <Progress value={file.progress} className="h-2" />
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          {getStatusIcon(file.status)}
                          <Badge className={getStatusColor(file.status)}>
                            {file.status}
                          </Badge>
                        </div>
                        
                        {file.status === 'completed' && (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Files Uploaded</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload your first Excel file to start analyzing your data with AI.
                  </p>
                  <Button onClick={() => setActiveTab("new-query")}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}