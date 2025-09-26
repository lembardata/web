'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Search,
  Plus,
  Send,
  FileText,
  User,
  Calendar,
  Tag,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Book,
  Video,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/api/use-auth';

// Types
interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  content: string;
  sender: 'user' | 'support';
  senderName: string;
  timestamp: string;
  attachments?: string[];
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
  tags: string[];
}

interface KnowledgeBaseArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: number;
  views: number;
  lastUpdated: string;
  tags: string[];
}

export default function SupportPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [newTicketData, setNewTicketData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as const
  });
  const [newMessage, setNewMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [faqCategory, setFaqCategory] = useState('all');

  // Mock data
  const mockTickets: SupportTicket[] = [
    {
      id: 'TKT-001',
      title: 'API Rate Limit Issue',
      description: 'I\'m experiencing rate limit errors when making API calls.',
      status: 'in-progress',
      priority: 'high',
      category: 'API',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z',
      assignedTo: 'Sarah Johnson',
      messages: [
        {
          id: 'MSG-001',
          content: 'I\'m getting rate limit errors when trying to analyze multiple files. Can you help?',
          sender: 'user',
          senderName: 'John Doe',
          timestamp: '2024-01-15T10:30:00Z'
        },
        {
          id: 'MSG-002',
          content: 'Hi John, I\'ve reviewed your account and increased your rate limits. Please try again.',
          sender: 'support',
          senderName: 'Sarah Johnson',
          timestamp: '2024-01-15T14:20:00Z'
        }
      ]
    },
    {
      id: 'TKT-002',
      title: 'Billing Question',
      description: 'Question about my subscription billing cycle.',
      status: 'resolved',
      priority: 'medium',
      category: 'Billing',
      createdAt: '2024-01-14T09:15:00Z',
      updatedAt: '2024-01-14T16:45:00Z',
      assignedTo: 'Mike Chen',
      messages: [
        {
          id: 'MSG-003',
          content: 'When will my next billing cycle start?',
          sender: 'user',
          senderName: 'John Doe',
          timestamp: '2024-01-14T09:15:00Z'
        },
        {
          id: 'MSG-004',
          content: 'Your next billing cycle starts on January 20th. You\'ll receive an email notification 3 days before.',
          sender: 'support',
          senderName: 'Mike Chen',
          timestamp: '2024-01-14T16:45:00Z'
        }
      ]
    }
  ];

  const mockFAQs: FAQItem[] = [
    {
      id: 'FAQ-001',
      question: 'How do I get started with the API?',
      answer: 'To get started with our API, first create an account and generate an API key from your dashboard. Then follow our Quick Start guide in the documentation.',
      category: 'API',
      helpful: 45,
      notHelpful: 3,
      tags: ['api', 'getting-started', 'authentication']
    },
    {
      id: 'FAQ-002',
      question: 'What file formats are supported?',
      answer: 'We support Excel files (.xlsx, .xls), CSV files (.csv), and Google Sheets. Files can be up to 50MB in size.',
      category: 'Files',
      helpful: 38,
      notHelpful: 2,
      tags: ['files', 'formats', 'upload']
    },
    {
      id: 'FAQ-003',
      question: 'How is my data processed and stored?',
      answer: 'Your data is processed securely in the cloud and automatically deleted after 24 hours. We use enterprise-grade encryption and comply with GDPR and SOC 2 standards.',
      category: 'Security',
      helpful: 52,
      notHelpful: 1,
      tags: ['security', 'privacy', 'data-processing']
    },
    {
      id: 'FAQ-004',
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time from your billing settings. You\'ll continue to have access until the end of your current billing period.',
      category: 'Billing',
      helpful: 29,
      notHelpful: 0,
      tags: ['billing', 'subscription', 'cancellation']
    }
  ];

  const mockKnowledgeBase: KnowledgeBaseArticle[] = [
    {
      id: 'KB-001',
      title: 'Getting Started Guide',
      description: 'Complete guide to get started with SpreadsheetAI',
      category: 'Getting Started',
      readTime: 5,
      views: 1250,
      lastUpdated: '2024-01-10T00:00:00Z',
      tags: ['beginner', 'setup', 'tutorial']
    },
    {
      id: 'KB-002',
      title: 'API Authentication',
      description: 'Learn how to authenticate your API requests',
      category: 'API',
      readTime: 3,
      views: 890,
      lastUpdated: '2024-01-08T00:00:00Z',
      tags: ['api', 'authentication', 'security']
    },
    {
      id: 'KB-003',
      title: 'Advanced Data Analysis',
      description: 'Advanced techniques for analyzing your spreadsheet data',
      category: 'Analysis',
      readTime: 8,
      views: 654,
      lastUpdated: '2024-01-05T00:00:00Z',
      tags: ['analysis', 'advanced', 'data']
    }
  ];

  // Helper functions
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Baru saja';
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
    return formatDate(dateString);
  };

  // Filter functions
  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || ticket.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const filteredFAQs = mockFAQs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = faqCategory === 'all' || faq.category === faqCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredKnowledgeBase = mockKnowledgeBase.filter(article => {
    return article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           article.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Event handlers
  const handleCreateTicket = () => {
    if (!newTicketData.title || !newTicketData.description || !newTicketData.category) {
      toast.error('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    // Simulate API call
    toast.success('Tiket support berhasil dibuat');
    setNewTicketData({
      title: '',
      description: '',
      category: '',
      priority: 'medium'
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      toast.error('Mohon masukkan pesan');
      return;
    }

    // Simulate API call
    toast.success('Pesan berhasil dikirim');
    setNewMessage('');
  };

  const handleTicketClick = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
  };

  const handleFAQToggle = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const handleFAQHelpful = (faqId: string, helpful: boolean) => {
    toast.success(helpful ? 'Terima kasih atas feedback Anda!' : 'Feedback Anda telah dicatat');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
          <p className="text-gray-600 mt-2">
            Dapatkan bantuan dan dukungan untuk SpreadsheetAI
          </p>
        </div>
      </div>

      <Tabs defaultValue="tickets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Tiket Support
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Kontak
          </TabsTrigger>
        </TabsList>

        {/* Support Tickets Tab */}
        <TabsContent value="tickets" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tickets List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Tiket Saya</CardTitle>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Buat Tiket
                    </Button>
                  </div>
                  
                  {/* Search and Filters */}
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Cari tiket..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Status</SelectItem>
                          <SelectItem value="open">Terbuka</SelectItem>
                          <SelectItem value="in-progress">Dalam Proses</SelectItem>
                          <SelectItem value="resolved">Selesai</SelectItem>
                          <SelectItem value="closed">Ditutup</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Kategori</SelectItem>
                          <SelectItem value="API">API</SelectItem>
                          <SelectItem value="Billing">Billing</SelectItem>
                          <SelectItem value="Technical">Technical</SelectItem>
                          <SelectItem value="General">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedTicket?.id === ticket.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleTicketClick(ticket)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(ticket.status)}>
                              {getStatusIcon(ticket.status)}
                              <span className="ml-1 capitalize">{ticket.status}</span>
                            </Badge>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">{ticket.id}</span>
                        </div>
                        
                        <h3 className="font-medium text-gray-900 mb-1">{ticket.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {ticket.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{ticket.category}</span>
                          <span>{formatRelativeTime(ticket.updatedAt)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Tidak ada tiket ditemukan</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Ticket Detail or Create Form */}
            <div className="lg:col-span-2">
              {selectedTicket ? (
                /* Ticket Detail */
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getStatusColor(selectedTicket.status)}>
                            {getStatusIcon(selectedTicket.status)}
                            <span className="ml-1 capitalize">{selectedTicket.status}</span>
                          </Badge>
                          <Badge className={getPriorityColor(selectedTicket.priority)}>
                            {selectedTicket.priority}
                          </Badge>
                          <span className="text-sm text-gray-500">{selectedTicket.id}</span>
                        </div>
                        
                        <CardTitle className="text-xl">{selectedTicket.title}</CardTitle>
                        <CardDescription className="mt-2">
                          {selectedTicket.description}
                        </CardDescription>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedTicket(null)}
                      >
                        ← Kembali
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        {selectedTicket.category}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Dibuat: {formatDate(selectedTicket.createdAt)}
                      </div>
                      {selectedTicket.assignedTo && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Ditangani: {selectedTicket.assignedTo}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Messages */}
                    <div className="space-y-4">
                      {selectedTicket.messages.map((message) => (
                        <div 
                          key={message.id}
                          className={`flex gap-3 ${
                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div className={`max-w-[70%] ${
                            message.sender === 'user' ? 'order-2' : 'order-1'
                          }`}>
                            <div className={`p-4 rounded-lg ${
                              message.sender === 'user' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-100 text-gray-900'
                            }`}>
                              <p className="text-sm">{message.content}</p>
                            </div>
                            
                            <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${
                              message.sender === 'user' ? 'justify-end' : 'justify-start'
                            }`}>
                              <span>{message.senderName}</span>
                              <span>•</span>
                              <span>{formatRelativeTime(message.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    {/* Reply Form */}
                    <div className="space-y-3">
                      <Label htmlFor="reply">Balas Pesan</Label>
                      <Textarea
                        id="reply"
                        placeholder="Tulis balasan Anda..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={4}
                      />
                      
                      <div className="flex justify-end">
                        <Button onClick={handleSendMessage}>
                          <Send className="h-4 w-4 mr-2" />
                          Kirim Pesan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* Create New Ticket */
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Buat Tiket Support Baru
                    </CardTitle>
                    <CardDescription>
                      Jelaskan masalah Anda dan kami akan membantu menyelesaikannya
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Kategori</Label>
                        <Select 
                          value={newTicketData.category} 
                          onValueChange={(value) => setNewTicketData(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="API">API</SelectItem>
                            <SelectItem value="Billing">Billing</SelectItem>
                            <SelectItem value="Technical">Technical</SelectItem>
                            <SelectItem value="General">General</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="priority">Prioritas</Label>
                        <Select 
                          value={newTicketData.priority} 
                          onValueChange={(value: any) => setNewTicketData(prev => ({ ...prev, priority: value }))}
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
                      <Label htmlFor="title">Judul</Label>
                      <Input
                        id="title"
                        placeholder="Jelaskan masalah Anda secara singkat"
                        value={newTicketData.title}
                        onChange={(e) => setNewTicketData(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Deskripsi Detail</Label>
                      <Textarea
                        id="description"
                        placeholder="Jelaskan masalah Anda secara detail, termasuk langkah-langkah yang sudah dicoba"
                        value={newTicketData.description}
                        onChange={(e) => setNewTicketData(prev => ({ ...prev, description: e.target.value }))}
                        rows={6}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-3">
                      <Button variant="outline">
                        Simpan Draft
                      </Button>
                      <Button onClick={handleCreateTicket}>
                        <Send className="h-4 w-4 mr-2" />
                        Kirim Tiket
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Temukan jawaban untuk pertanyaan yang sering diajukan
              </CardDescription>
              
              {/* Search and Filter */}
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Cari FAQ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={faqCategory} onValueChange={setFaqCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    <SelectItem value="API">API</SelectItem>
                    <SelectItem value="Files">Files</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Billing">Billing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent>
              {filteredFAQs.length > 0 ? (
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <div key={faq.id} className="border rounded-lg">
                      <button
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        onClick={() => handleFAQToggle(faq.id)}
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{faq.question}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{faq.category}</Badge>
                            <span className="text-xs text-gray-500">
                              {faq.helpful} helpful • {faq.notHelpful} not helpful
                            </span>
                          </div>
                        </div>
                        
                        {expandedFAQ === faq.id ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      
                      {expandedFAQ === faq.id && (
                        <div className="px-4 pb-4">
                          <Separator className="mb-4" />
                          <p className="text-gray-700 mb-4">{faq.answer}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {faq.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Apakah ini membantu?</span>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleFAQHelpful(faq.id, true)}
                              >
                                👍 Ya
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleFAQHelpful(faq.id, false)}
                              >
                                👎 Tidak
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Tidak ada FAQ ditemukan</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Coba ubah kata kunci pencarian atau kategori
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Knowledge Base
              </CardTitle>
              <CardDescription>
                Panduan lengkap dan artikel tutorial
              </CardDescription>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari artikel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            
            <CardContent>
              {filteredKnowledgeBase.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredKnowledgeBase.map((article) => (
                    <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline">{article.category}</Badge>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {article.readTime} min
                          </div>
                        </div>
                        
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                        <CardDescription>{article.description}</CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span>{article.views} views</span>
                          <span>Updated {formatRelativeTime(article.lastUpdated)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {article.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {article.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{article.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                          
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Baca
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Tidak ada artikel ditemukan</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Coba ubah kata kunci pencarian
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Hubungi Kami
                </CardTitle>
                <CardDescription>
                  Berbagai cara untuk menghubungi tim support kami
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Email Support */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Email Support</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Untuk pertanyaan umum dan dukungan teknis
                    </p>
                    <p className="text-blue-600 font-medium">support@spreadsheetai.com</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Respon dalam 24 jam
                    </p>
                  </div>
                </div>
                
                {/* Live Chat */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Live Chat</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Chat langsung dengan tim support
                    </p>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Mulai Chat
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">
                      Senin - Jumat, 09:00 - 18:00 WIB
                    </p>
                  </div>
                </div>
                
                {/* Phone Support */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Phone className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Phone Support</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Untuk masalah mendesak (Premium users)
                    </p>
                    <p className="text-purple-600 font-medium">+62 21 1234 5678</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Senin - Jumat, 09:00 - 17:00 WIB
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                {/* Response Times */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Target Waktu Respon</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email (General)</span>
                      <span className="font-medium">24 jam</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email (Premium)</span>
                      <span className="font-medium">4 jam</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Live Chat</span>
                      <span className="font-medium">5 menit</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone (Premium)</span>
                      <span className="font-medium">Langsung</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Sumber Daya
                </CardTitle>
                <CardDescription>
                  Dokumentasi dan panduan untuk membantu Anda
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Quick Links */}
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start h-auto p-4">
                    <div className="flex items-center gap-3">
                      <Book className="h-5 w-5 text-blue-500" />
                      <div className="text-left">
                        <div className="font-medium">Dokumentasi API</div>
                        <div className="text-sm text-gray-600">Panduan lengkap API</div>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start h-auto p-4">
                    <div className="flex items-center gap-3">
                      <Video className="h-5 w-5 text-red-500" />
                      <div className="text-left">
                        <div className="font-medium">Video Tutorials</div>
                        <div className="text-sm text-gray-600">Tutorial step-by-step</div>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start h-auto p-4">
                    <div className="flex items-center gap-3">
                      <Download className="h-5 w-5 text-green-500" />
                      <div className="text-left">
                        <div className="font-medium">Sample Files</div>
                        <div className="text-sm text-gray-600">Contoh file untuk testing</div>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </Button>
                </div>
                
                <Separator />
                
                {/* Status Page */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">Semua Sistem Normal</span>
                  </div>
                  <p className="text-sm text-green-700 mb-3">
                    Semua layanan berjalan dengan normal
                  </p>
                  <Button size="sm" variant="outline" className="text-green-700 border-green-300">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Status Page
                  </Button>
                </div>
                
                {/* Community */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Bergabung dengan Komunitas</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Diskusi dengan pengguna lain dan dapatkan tips
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                      Discord
                    </Button>
                    <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                      Forum
                    </Button>
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