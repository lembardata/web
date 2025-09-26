"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Book,
  Code,
  FileText,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Download,
  Play,
  Zap,
  Shield,
  Globe,
  Database
} from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"

interface DocSection {
  id: string
  title: string
  description: string
  category: string
  content: string
  codeExample?: string
  method?: string
  endpoint?: string
  parameters?: Array<{
    name: string
    type: string
    required: boolean
    description: string
  }>
  response?: string
}

interface GuideItem {
  id: string
  title: string
  description: string
  category: string
  readTime: string
  difficulty: 'Pemula' | 'Menengah' | 'Lanjutan'
  content: string
}

export default function DocumentationPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [openSections, setOpenSections] = useState<string[]>(['getting-started'])

  // Mock data untuk dokumentasi API
  const apiDocs: DocSection[] = [
    {
      id: 'authentication',
      title: 'Autentikasi',
      description: 'Cara mengautentikasi permintaan API Anda',
      category: 'auth',
      content: 'Semua permintaan API memerlukan autentikasi menggunakan API key. Sertakan API key Anda di header Authorization.',
      codeExample: `curl -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  https://api.spreadsheetai.com/v1/analyze`,
      method: 'GET',
      endpoint: '/v1/auth/verify',
      parameters: [
        { name: 'Authorization', type: 'string', required: true, description: 'Bearer token dengan API key Anda' }
      ],
      response: `{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "plan": "pro"
  }
}`
    },
    {
      id: 'analyze-file',
      title: 'Analisis File',
      description: 'Upload dan analisis file spreadsheet',
      category: 'analysis',
      content: 'Endpoint ini memungkinkan Anda mengupload file Excel atau CSV dan mendapatkan analisis AI.',
      codeExample: `const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('analysis_type', 'general');

fetch('https://api.spreadsheetai.com/v1/analyze', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: formData
});`,
      method: 'POST',
      endpoint: '/v1/analyze',
      parameters: [
        { name: 'file', type: 'file', required: true, description: 'File Excel atau CSV (max 10MB)' },
        { name: 'analysis_type', type: 'string', required: false, description: 'Jenis analisis: general, financial, statistical' },
        { name: 'query', type: 'string', required: false, description: 'Pertanyaan spesifik tentang data' }
      ],
      response: `{
  "success": true,
  "analysis_id": "analysis_123",
  "status": "processing",
  "estimated_time": 30
}`
    },
    {
      id: 'get-analysis',
      title: 'Ambil Hasil Analisis',
      description: 'Mendapatkan hasil analisis yang telah selesai',
      category: 'analysis',
      content: 'Gunakan endpoint ini untuk mengambil hasil analisis berdasarkan ID.',
      codeExample: `fetch('https://api.spreadsheetai.com/v1/analysis/analysis_123', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});`,
      method: 'GET',
      endpoint: '/v1/analysis/{id}',
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'ID analisis yang ingin diambil' }
      ],
      response: `{
  "success": true,
  "analysis": {
    "id": "analysis_123",
    "status": "completed",
    "result": "Data menunjukkan tren positif...",
    "insights": ["Penjualan meningkat 15%", "Produk A paling laris"],
    "confidence": 0.95,
    "processing_time": 28
  }
}`
    }
  ]

  // Mock data untuk panduan
  const guides: GuideItem[] = [
    {
      id: 'getting-started',
      title: 'Memulai dengan SpreadsheetAI',
      description: 'Panduan lengkap untuk memulai menggunakan SpreadsheetAI',
      category: 'getting-started',
      readTime: '5 menit',
      difficulty: 'Pemula',
      content: `# Memulai dengan SpreadsheetAI

## Langkah 1: Daftar Akun
Daftar akun gratis di SpreadsheetAI untuk mendapatkan akses ke semua fitur dasar.

## Langkah 2: Dapatkan API Key
1. Masuk ke dashboard
2. Buka halaman Settings > API Keys
3. Klik "Generate New Key"
4. Simpan API key dengan aman

## Langkah 3: Upload File Pertama
1. Buka halaman AI Queries
2. Klik "Upload File" atau drag & drop file Excel/CSV
3. Tunggu proses upload selesai

## Langkah 4: Jalankan Analisis
1. Pilih jenis analisis yang diinginkan
2. Tulis pertanyaan atau biarkan kosong untuk analisis umum
3. Klik "Run AI Analysis"
4. Tunggu hasil analisis`
    },
    {
      id: 'api-integration',
      title: 'Integrasi API',
      description: 'Cara mengintegrasikan SpreadsheetAI API ke aplikasi Anda',
      category: 'integration',
      readTime: '10 menit',
      difficulty: 'Menengah',
      content: `# Integrasi API SpreadsheetAI

## Persiapan
Pastikan Anda sudah memiliki API key yang valid.

## Base URL
\`\`\`
https://api.spreadsheetai.com/v1
\`\`\`

## Headers Wajib
\`\`\`
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
\`\`\`

## Contoh Implementasi JavaScript
\`\`\`javascript
class SpreadsheetAI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.spreadsheetai.com/v1';
  }

  async analyzeFile(file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options.analysisType) {
      formData.append('analysis_type', options.analysisType);
    }
    
    if (options.query) {
      formData.append('query', options.query);
    }

    const response = await fetch(\`\${this.baseURL}/analyze\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`
      },
      body: formData
    });

    return response.json();
  }

  async getAnalysis(analysisId) {
    const response = await fetch(\`\${this.baseURL}/analysis/\${analysisId}\`, {
      method: 'GET',
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`,
        'Content-Type': 'application/json'
      }
    });

    return response.json();
  }
}
\`\`\`

## Penggunaan
\`\`\`javascript
const ai = new SpreadsheetAI('your-api-key');

// Analisis file
const result = await ai.analyzeFile(file, {
  analysisType: 'financial',
  query: 'Berapa total penjualan bulan ini?'
});

// Ambil hasil
const analysis = await ai.getAnalysis(result.analysis_id);
\`\`\``
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      description: 'Tips dan trik untuk mengoptimalkan penggunaan SpreadsheetAI',
      category: 'tips',
      readTime: '8 menit',
      difficulty: 'Lanjutan',
      content: `# Best Practices SpreadsheetAI

## Format File
- Gunakan format Excel (.xlsx) atau CSV (.csv)
- Pastikan data terstruktur dengan header yang jelas
- Hindari sel yang merged atau format yang kompleks
- Maksimal ukuran file 10MB

## Optimasi Query
- Buat pertanyaan yang spesifik dan jelas
- Gunakan bahasa Indonesia atau Inggris
- Sertakan konteks yang relevan
- Hindari pertanyaan yang terlalu umum

## Keamanan
- Jangan pernah share API key Anda
- Gunakan HTTPS untuk semua request
- Rotate API key secara berkala
- Monitor penggunaan API di dashboard

## Performance
- Cache hasil analisis jika memungkinkan
- Gunakan webhook untuk notifikasi hasil
- Batch multiple files jika diperlukan
- Monitor rate limits

## Error Handling
\`\`\`javascript
try {
  const result = await ai.analyzeFile(file);
  // Handle success
} catch (error) {
  if (error.status === 429) {
    // Rate limit exceeded
    console.log('Rate limit exceeded, retry after:', error.retryAfter);
  } else if (error.status === 413) {
    // File too large
    console.log('File size exceeds limit');
  } else {
    // Other errors
    console.log('Analysis failed:', error.message);
  }
}
\`\`\``
    }
  ]

  const categories = [
    { id: 'all', label: 'Semua', icon: Book },
    { id: 'getting-started', label: 'Memulai', icon: Play },
    { id: 'auth', label: 'Autentikasi', icon: Shield },
    { id: 'analysis', label: 'Analisis', icon: Zap },
    { id: 'integration', label: 'Integrasi', icon: Globe },
    { id: 'tips', label: 'Tips & Trik', icon: Database }
  ]

  const filteredApiDocs = apiDocs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'all' || doc.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'all' || guide.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success('Kode berhasil disalin!')
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Pemula': return 'bg-green-100 text-green-800'
      case 'Menengah': return 'bg-yellow-100 text-yellow-800'
      case 'Lanjutan': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Dokumentasi</h1>
          <p className="text-muted-foreground mt-2">
            Panduan lengkap dan referensi API untuk SpreadsheetAI
          </p>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari dokumentasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      <Tabs defaultValue="guides" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            Panduan
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            API Reference
          </TabsTrigger>
        </TabsList>

        {/* Panduan Tab */}
        <TabsContent value="guides" className="space-y-6">
          {filteredGuides.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tidak ada panduan ditemukan</h3>
                <p className="text-muted-foreground text-center">
                  Coba ubah kata kunci pencarian atau kategori
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredGuides.map((guide) => (
                <Card key={guide.id}>
                  <Collapsible 
                    open={openSections.includes(guide.id)}
                    onOpenChange={() => toggleSection(guide.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-xl">{guide.title}</CardTitle>
                              <Badge className={getDifficultyColor(guide.difficulty)}>
                                {guide.difficulty}
                              </Badge>
                              <Badge variant="outline">{guide.readTime}</Badge>
                            </div>
                            <CardDescription>{guide.description}</CardDescription>
                          </div>
                          {openSections.includes(guide.id) ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent>
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                            {guide.content}
                          </pre>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* API Reference Tab */}
        <TabsContent value="api" className="space-y-6">
          {filteredApiDocs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Code className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tidak ada dokumentasi API ditemukan</h3>
                <p className="text-muted-foreground text-center">
                  Coba ubah kata kunci pencarian atau kategori
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredApiDocs.map((doc) => (
                <Card key={doc.id}>
                  <Collapsible 
                    open={openSections.includes(doc.id)}
                    onOpenChange={() => toggleSection(doc.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-xl">{doc.title}</CardTitle>
                              {doc.method && (
                                <Badge variant={doc.method === 'GET' ? 'secondary' : 'default'}>
                                  {doc.method}
                                </Badge>
                              )}
                            </div>
                            <CardDescription>{doc.description}</CardDescription>
                            {doc.endpoint && (
                              <code className="text-sm bg-muted px-2 py-1 rounded mt-2 inline-block">
                                {doc.endpoint}
                              </code>
                            )}
                          </div>
                          {openSections.includes(doc.id) ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="space-y-6">
                        <p className="text-sm leading-relaxed">{doc.content}</p>

                        {/* Parameters */}
                        {doc.parameters && doc.parameters.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-3">Parameter</h4>
                            <div className="space-y-2">
                              {doc.parameters.map((param, index) => (
                                <div key={index} className="border rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                      {param.name}
                                    </code>
                                    <Badge variant="outline" className="text-xs">
                                      {param.type}
                                    </Badge>
                                    {param.required && (
                                      <Badge variant="destructive" className="text-xs">
                                        Required
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{param.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Code Example */}
                        {doc.codeExample && (
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold">Contoh Kode</h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyCode(doc.codeExample!)}
                                className="flex items-center gap-2"
                              >
                                <Copy className="h-4 w-4" />
                                Salin
                              </Button>
                            </div>
                            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                              <code>{doc.codeExample}</code>
                            </pre>
                          </div>
                        )}

                        {/* Response */}
                        {doc.response && (
                          <div>
                            <h4 className="font-semibold mb-3">Response</h4>
                            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                              <code>{doc.response}</code>
                            </pre>
                          </div>
                        )}
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Link Berguna
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-semibold">Postman Collection</div>
                <div className="text-sm text-muted-foreground">Import koleksi API ke Postman</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-semibold">SDK JavaScript</div>
                <div className="text-sm text-muted-foreground">Library resmi untuk JavaScript</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-semibold">Status Page</div>
                <div className="text-sm text-muted-foreground">Cek status layanan real-time</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}