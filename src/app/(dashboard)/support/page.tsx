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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  ChevronRight,
  Send,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
  FileText,
  Video,
  Book,
  Users,
  Zap,
  Shield,
  CreditCard,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  tags: string[];
}

interface SupportTicket {
  id: string;
  subject: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  created: string;
  updated: string;
  category: string;
}

export default function SupportPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFAQs, setOpenFAQs] = useState<string[]>([]);
  const [contactForm, setContactForm] = useState({
    subject: "",
    category: "",
    priority: "medium",
    message: "",
    email: user?.email || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data untuk FAQ
  const faqs: FAQItem[] = [
    {
      id: "faq-1",
      question: "Bagaimana cara mengupload file Excel ke SpreadsheetAI?",
      answer:
        'Anda dapat mengupload file Excel dengan beberapa cara:\n\n1. **Drag & Drop**: Seret file Excel Anda ke area upload di halaman AI Queries\n2. **Klik Upload**: Klik tombol "Upload File" dan pilih file dari komputer Anda\n3. **API**: Gunakan endpoint POST /v1/analyze dengan form-data\n\nFormat yang didukung: .xlsx, .xls, .csv (maksimal 10MB)',
      category: "upload",
      helpful: 45,
      tags: ["upload", "excel", "file"],
    },
    {
      id: "faq-2",
      question: "Berapa lama waktu yang dibutuhkan untuk analisis?",
      answer:
        "Waktu analisis bervariasi tergantung pada:\n\n• **Ukuran file**: File kecil (< 1MB) biasanya 10-30 detik\n• **Kompleksitas data**: Data sederhana lebih cepat diproses\n• **Jenis analisis**: Analisis umum lebih cepat dari analisis prediktif\n• **Beban server**: Pada jam sibuk mungkin sedikit lebih lama\n\nRata-rata waktu analisis adalah 1-3 menit.",
      category: "analysis",
      helpful: 38,
      tags: ["analisis", "waktu", "proses"],
    },
    {
      id: "faq-3",
      question: "Bagaimana cara mendapatkan API key?",
      answer:
        'Untuk mendapatkan API key:\n\n1. Login ke dashboard SpreadsheetAI\n2. Buka halaman **Settings** > **API Keys**\n3. Klik tombol **"Generate New Key"**\n4. Berikan nama untuk API key Anda\n5. Salin dan simpan API key dengan aman\n\n⚠️ **Penting**: API key hanya ditampilkan sekali. Jika hilang, Anda perlu generate key baru.',
      category: "api",
      helpful: 52,
      tags: ["api", "key", "authentication"],
    },
    {
      id: "faq-4",
      question: "Apa perbedaan antara paket Starter, Pro, dan Enterprise?",
      answer:
        "Perbedaan utama antara paket:\n\n**Starter (Gratis)**\n• 10 AI queries per bulan\n• File maksimal 5MB\n• Storage 100MB\n• Support email\n\n**Pro (Rp 99.000/bulan)**\n• 500 AI queries per bulan\n• File maksimal 25MB\n• Storage 5GB\n• Priority support\n• API access\n\n**Enterprise (Custom)**\n• Unlimited queries\n• File maksimal 100MB\n• Storage unlimited\n• Dedicated support\n• Custom integrations\n• SLA guarantee",
      category: "billing",
      helpful: 67,
      tags: ["paket", "harga", "fitur"],
    },
    {
      id: "faq-5",
      question: "Apakah data saya aman di SpreadsheetAI?",
      answer:
        "Ya, keamanan data adalah prioritas utama kami:\n\n🔒 **Enkripsi**: Semua data dienkripsi saat transit dan saat disimpan\n🛡️ **Compliance**: Kami mematuhi standar GDPR dan ISO 27001\n🗑️ **Auto-delete**: File otomatis dihapus setelah 30 hari\n👥 **Access Control**: Hanya Anda yang dapat mengakses data Anda\n🔍 **Audit Trail**: Semua aktivitas tercatat dan dapat dilacak\n\nKami tidak pernah membagikan atau menjual data Anda kepada pihak ketiga.",
      category: "security",
      helpful: 73,
      tags: ["keamanan", "privasi", "data"],
    },
    {
      id: "faq-6",
      question: "Bagaimana cara membatalkan subscription?",
      answer:
        'Untuk membatalkan subscription:\n\n1. Login ke dashboard\n2. Buka halaman **Billing**\n3. Scroll ke bagian **"Subscription Management"**\n4. Klik **"Cancel Subscription"**\n5. Konfirmasi pembatalan\n\n📝 **Catatan**:\n• Subscription akan tetap aktif hingga akhir periode billing\n• Anda masih dapat menggunakan fitur Pro hingga tanggal berakhir\n• Data Anda akan tetap tersimpan selama 90 hari setelah pembatalan\n• Anda dapat mengaktifkan kembali kapan saja',
      category: "billing",
      helpful: 29,
      tags: ["subscription", "cancel", "billing"],
    },
  ];

  // Mock data untuk support tickets
  const supportTickets: SupportTicket[] = [
    {
      id: "TICK-001",
      subject: "Error saat upload file Excel besar",
      status: "in-progress",
      priority: "high",
      created: "2024-01-15T10:30:00Z",
      updated: "2024-01-15T14:20:00Z",
      category: "technical",
    },
    {
      id: "TICK-002",
      subject: "Pertanyaan tentang upgrade ke Enterprise",
      status: "resolved",
      priority: "medium",
      created: "2024-01-14T09:15:00Z",
      updated: "2024-01-14T16:45:00Z",
      category: "billing",
    },
  ];

  const categories = [
    { id: "all", label: "Semua", icon: HelpCircle },
    { id: "upload", label: "Upload File", icon: FileText },
    { id: "analysis", label: "Analisis", icon: Zap },
    { id: "api", label: "API", icon: Settings },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "security", label: "Keamanan", icon: Shield },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (faqId: string) => {
    setOpenFAQs((prev) =>
      prev.includes(faqId)
        ? prev.filter((id) => id !== faqId)
        : [...prev, faqId],
    );
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(
        "Pesan berhasil dikirim! Kami akan merespons dalam 24 jam.",
      );
      setContactForm({
        subject: "",
        category: "",
        priority: "medium",
        message: "",
        email: user?.email || "",
      });
    } catch (error) {
      toast.error("Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />;
      case "in-progress":
        return <Clock className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "closed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Support Center</h1>
          <p className="text-muted-foreground mt-2">
            Dapatkan bantuan dan jawaban untuk pertanyaan Anda
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center p-4">
              <MessageSquare className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold">Live Chat</h3>
                <p className="text-sm text-muted-foreground">
                  Respons dalam 5 menit
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center p-4">
              <Mail className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold">Email Support</h3>
                <p className="text-sm text-muted-foreground">
                  Respons dalam 24 jam
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center p-4">
              <Phone className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h3 className="font-semibold">Phone Support</h3>
                <p className="text-sm text-muted-foreground">
                  Senin-Jumat 9-17 WIB
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Hubungi Kami
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Tiket Saya
          </TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Cari FAQ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={
                      activeCategory === category.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setActiveCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {category.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* FAQ List */}
          {filteredFAQs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Tidak ada FAQ ditemukan
                </h3>
                <p className="text-muted-foreground text-center">
                  Coba ubah kata kunci pencarian atau kategori
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id}>
                  <Collapsible
                    open={openFAQs.includes(faq.id)}
                    onOpenChange={() => toggleFAQ(faq.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg text-left">
                              {faq.question}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                              {faq.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              <Badge variant="outline" className="text-xs">
                                {faq.helpful} helpful
                              </Badge>
                            </div>
                          </div>
                          {openFAQs.includes(faq.id) ? (
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
                          <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                            {faq.answer}
                          </pre>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Apakah jawaban ini membantu?
                          </p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              👍 Ya
                            </Button>
                            <Button variant="outline" size="sm">
                              👎 Tidak
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Kirim Pesan</CardTitle>
                <CardDescription>
                  Isi form di bawah ini dan kami akan merespons dalam 24 jam
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Kategori</Label>
                      <Select
                        value={contactForm.category}
                        onValueChange={(value) =>
                          setContactForm((prev) => ({
                            ...prev,
                            category: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">
                            Masalah Teknis
                          </SelectItem>
                          <SelectItem value="billing">
                            Billing & Pembayaran
                          </SelectItem>
                          <SelectItem value="feature">
                            Permintaan Fitur
                          </SelectItem>
                          <SelectItem value="general">
                            Pertanyaan Umum
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subjek</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            subject: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Prioritas</Label>
                      <Select
                        value={contactForm.priority}
                        onValueChange={(value) =>
                          setContactForm((prev) => ({
                            ...prev,
                            priority: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Rendah</SelectItem>
                          <SelectItem value="medium">Sedang</SelectItem>
                          <SelectItem value="high">Tinggi</SelectItem>
                          <SelectItem value="urgent">Mendesak</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Pesan</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      placeholder="Jelaskan masalah atau pertanyaan Anda dengan detail..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Kirim Pesan
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Kontak</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        support@spreadsheetai.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Telepon</p>
                      <p className="text-sm text-muted-foreground">
                        +62 21 1234 5678
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Jam Operasional</p>
                      <p className="text-sm text-muted-foreground">
                        Senin - Jumat: 09:00 - 17:00 WIB
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sumber Daya Lainnya</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Book className="mr-2 h-4 w-4" />
                    Dokumentasi API
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Video className="mr-2 h-4 w-4" />
                    Video Tutorial
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Community Forum
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Status Page
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Support Tickets Tab */}
        <TabsContent value="tickets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tiket Support Saya</CardTitle>
              <CardDescription>
                Lacak status dan riwayat tiket support Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              {supportTickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Belum ada tiket support
                  </h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Anda belum pernah mengirim tiket support
                  </p>
                  <Button>Buat Tiket Baru</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {supportTickets.map((ticket) => (
                    <Card key={ticket.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{ticket.id}</Badge>
                            <Badge className={getStatusColor(ticket.status)}>
                              {getStatusIcon(ticket.status)}
                              <span className="ml-1 capitalize">
                                {ticket.status}
                              </span>
                            </Badge>
                            <Badge
                              className={getPriorityColor(ticket.priority)}
                            >
                              {ticket.priority}
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm">
                            Lihat Detail
                          </Button>
                        </div>
                        <h4 className="font-semibold mb-2">{ticket.subject}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Dibuat: {formatDate(ticket.created)}</span>
                          <span>•</span>
                          <span>Diperbarui: {formatDate(ticket.updated)}</span>
                          <span>•</span>
                          <span className="capitalize">{ticket.category}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
