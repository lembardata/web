'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Book,
  Search,
  Code,
  Play,
  Copy,
  ExternalLink,
  FileText,
  Zap,
  Shield,
  Database,
  Globe,
  Smartphone,
  Terminal,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
  Download,
  Github,
  Star,
  Eye,
  Clock,
  User,
  Tag,
  Bookmark,
  Heart,
  MessageSquare,
  ThumbsUp,
  Share,
  Filter,
  SortAsc,
  Grid,
  List,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  HelpCircle,
  Video,
  Image,
  Link,
  Layers,
  Settings,
  Cpu,
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

interface DocSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  articles: DocArticle[];
}

interface DocArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number;
  lastUpdated: Date;
  author: string;
  views: number;
  likes: number;
  helpful: number;
  codeExamples?: CodeExample[];
  relatedArticles?: string[];
}

interface CodeExample {
  id: string;
  title: string;
  language: string;
  code: string;
  description?: string;
}

interface APIEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  title: string;
  description: string;
  parameters: APIParameter[];
  responses: APIResponse[];
  examples: APIExample[];
  category: string;
}

interface APIParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

interface APIResponse {
  status: number;
  description: string;
  example: string;
}

interface APIExample {
  title: string;
  request: string;
  response: string;
  language: string;
}

const mockDocSections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics of SpreadsheetAI',
    icon: <Play className="h-5 w-5" />,
    articles: [
      {
        id: 'quick-start',
        title: 'Quick Start Guide',
        description: 'Get up and running with SpreadsheetAI in 5 minutes',
        content: 'Welcome to SpreadsheetAI! This guide will help you get started...',
        category: 'getting-started',
        tags: ['beginner', 'setup', 'tutorial'],
        difficulty: 'beginner',
        readTime: 5,
        lastUpdated: new Date('2024-01-15'),
        author: 'SpreadsheetAI Team',
        views: 15420,
        likes: 234,
        helpful: 189
      },
      {
        id: 'installation',
        title: 'Installation & Setup',
        description: 'How to install and configure SpreadsheetAI',
        content: 'Follow these steps to install SpreadsheetAI...',
        category: 'getting-started',
        tags: ['installation', 'setup', 'configuration'],
        difficulty: 'beginner',
        readTime: 8,
        lastUpdated: new Date('2024-01-10'),
        author: 'John Doe',
        views: 8920,
        likes: 156,
        helpful: 142
      }
    ]
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    description: 'Complete API documentation',
    icon: <Code className="h-5 w-5" />,
    articles: [
      {
        id: 'authentication',
        title: 'Authentication',
        description: 'How to authenticate with the SpreadsheetAI API',
        content: 'SpreadsheetAI uses API keys for authentication...',
        category: 'api-reference',
        tags: ['api', 'authentication', 'security'],
        difficulty: 'intermediate',
        readTime: 10,
        lastUpdated: new Date('2024-01-12'),
        author: 'Jane Smith',
        views: 12340,
        likes: 198,
        helpful: 167
      },
      {
        id: 'rate-limits',
        title: 'Rate Limits',
        description: 'Understanding API rate limits and best practices',
        content: 'To ensure fair usage, SpreadsheetAI implements rate limits...',
        category: 'api-reference',
        tags: ['api', 'limits', 'best-practices'],
        difficulty: 'intermediate',
        readTime: 7,
        lastUpdated: new Date('2024-01-08'),
        author: 'Mike Johnson',
        views: 6780,
        likes: 89,
        helpful: 76
      }
    ]
  },
  {
    id: 'tutorials',
    title: 'Tutorials',
    description: 'Step-by-step tutorials and guides',
    icon: <Lightbulb className="h-5 w-5" />,
    articles: [
      {
        id: 'data-analysis',
        title: 'Advanced Data Analysis',
        description: 'Learn advanced techniques for analyzing spreadsheet data',
        content: 'In this tutorial, we\'ll explore advanced data analysis...',
        category: 'tutorials',
        tags: ['analysis', 'advanced', 'data'],
        difficulty: 'advanced',
        readTime: 25,
        lastUpdated: new Date('2024-01-14'),
        author: 'Sarah Wilson',
        views: 4560,
        likes: 123,
        helpful: 98
      }
    ]
  },
  {
    id: 'examples',
    title: 'Code Examples',
    description: 'Ready-to-use code examples',
    icon: <Terminal className="h-5 w-5" />,
    articles: [
      {
        id: 'javascript-examples',
        title: 'JavaScript Examples',
        description: 'Common JavaScript patterns for SpreadsheetAI',
        content: 'Here are some common JavaScript examples...',
        category: 'examples',
        tags: ['javascript', 'examples', 'code'],
        difficulty: 'intermediate',
        readTime: 15,
        lastUpdated: new Date('2024-01-11'),
        author: 'Alex Chen',
        views: 7890,
        likes: 167,
        helpful: 134
      }
    ]
  }
];

const mockAPIEndpoints: APIEndpoint[] = [
  {
    id: 'analyze-spreadsheet',
    method: 'POST',
    endpoint: '/api/v1/analyze',
    title: 'Analyze Spreadsheet',
    description: 'Analyze a spreadsheet and get AI-powered insights',
    category: 'analysis',
    parameters: [
      {
        name: 'file',
        type: 'file',
        required: true,
        description: 'The spreadsheet file to analyze (Excel, CSV, etc.)',
        example: 'data.xlsx'
      },
      {
        name: 'analysis_type',
        type: 'string',
        required: false,
        description: 'Type of analysis to perform',
        example: 'summary'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Analysis completed successfully',
        example: '{"insights": [...], "recommendations": [...]}'
      },
      {
        status: 400,
        description: 'Invalid file format or parameters',
        example: '{"error": "Invalid file format"}'
      }
    ],
    examples: [
      {
        title: 'Basic Analysis',
        language: 'javascript',
        request: 'const formData = new FormData();\nformData.append(\'file\', file);\n\nfetch(\'/api/v1/analyze\', {\n  method: \'POST\',\n  headers: {\n    \'Authorization\': \'Bearer YOUR_API_KEY\'\n  },\n  body: formData\n});',
        response: '{\n  "insights": [\n    "Data contains 1,000 rows and 10 columns",\n    "Revenue trend shows 15% growth"\n  ],\n  "recommendations": [\n    "Consider seasonal adjustments",\n    "Focus on Q4 performance"\n  ]\n}'
      }
    ]
  },
  {
    id: 'get-analysis-history',
    method: 'GET',
    endpoint: '/api/v1/analyses',
    title: 'Get Analysis History',
    description: 'Retrieve your analysis history',
    category: 'analysis',
    parameters: [
      {
        name: 'limit',
        type: 'integer',
        required: false,
        description: 'Number of results to return (max 100)',
        example: '10'
      },
      {
        name: 'offset',
        type: 'integer',
        required: false,
        description: 'Number of results to skip',
        example: '0'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Analysis history retrieved successfully',
        example: '{"analyses": [...], "total": 25}'
      }
    ],
    examples: [
      {
        title: 'Get Recent Analyses',
        language: 'javascript',
        request: 'fetch(\'/api/v1/analyses?limit=10\', {\n  headers: {\n    \'Authorization\': \'Bearer YOUR_API_KEY\'\n  }\n});',
        response: '{\n  "analyses": [\n    {\n      "id": "analysis_123",\n      "filename": "sales_data.xlsx",\n      "created_at": "2024-01-15T10:30:00Z",\n      "status": "completed"\n    }\n  ],\n  "total": 25\n}'
      }
    ]
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-100 text-green-800';
    case 'intermediate': return 'bg-yellow-100 text-yellow-800';
    case 'advanced': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getMethodColor = (method: string) => {
  switch (method) {
    case 'GET': return 'bg-blue-100 text-blue-800';
    case 'POST': return 'bg-green-100 text-green-800';
    case 'PUT': return 'bg-yellow-100 text-yellow-800';
    case 'DELETE': return 'bg-red-100 text-red-800';
    case 'PATCH': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export default function DocumentationPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<DocArticle | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'title' | 'updated' | 'views' | 'difficulty'>('title');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const allArticles = mockDocSections.flatMap(section => section.articles);

  const filteredArticles = allArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty = filterDifficulty === 'all' || article.difficulty === filterDifficulty;
    const matchesCategory = filterCategory === 'all' || article.category === filterCategory;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case 'title': return a.title.localeCompare(b.title);
      case 'updated': return b.lastUpdated.getTime() - a.lastUpdated.getTime();
      case 'views': return b.views - a.views;
      case 'difficulty': {
        const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      }
      default: return 0;
    }
  });

  const filteredEndpoints = mockAPIEndpoints.filter(endpoint => {
    return endpoint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           endpoint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           endpoint.endpoint.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleArticleClick = (article: DocArticle) => {
    setSelectedArticle(article);
    setSelectedEndpoint(null);
  };

  const handleEndpointClick = (endpoint: APIEndpoint) => {
    setSelectedEndpoint(endpoint);
    setSelectedArticle(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleLikeArticle = (articleId: string) => {
    toast.success('Article liked!');
  };

  const handleMarkHelpful = (articleId: string) => {
    toast.success('Marked as helpful!');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Documentation</h1>
        <p className="text-gray-600">
          Everything you need to know about SpreadsheetAI
        </p>
      </div>

      <Tabs defaultValue="docs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="docs">Documentation</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        {/* Documentation Tab */}
        <TabsContent value="docs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Sections</CardTitle>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    >
                      {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search documentation..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-2">
                  {/* Filters */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Difficulty</label>
                      <select 
                        value={filterDifficulty} 
                        onChange={(e) => setFilterDifficulty(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm mt-1"
                      >
                        <option value="all">All Levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Category</label>
                      <select 
                        value={filterCategory} 
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm mt-1"
                      >
                        <option value="all">All Categories</option>
                        <option value="getting-started">Getting Started</option>
                        <option value="api-reference">API Reference</option>
                        <option value="tutorials">Tutorials</option>
                        <option value="examples">Examples</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Sort By</label>
                      <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm mt-1"
                      >
                        <option value="title">Title</option>
                        <option value="updated">Last Updated</option>
                        <option value="views">Most Viewed</option>
                        <option value="difficulty">Difficulty</option>
                      </select>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Section Navigation */}
                  {mockDocSections.map((section) => (
                    <div key={section.id}>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-2 h-auto"
                        onClick={() => toggleSection(section.id)}
                      >
                        <div className="flex items-center gap-2">
                          {section.icon}
                          <span className="text-sm font-medium">{section.title}</span>
                        </div>
                        {expandedSections.has(section.id) ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                      </Button>
                      
                      {expandedSections.has(section.id) && (
                        <div className="ml-4 mt-1 space-y-1">
                          {section.articles.map((article) => (
                            <Button
                              key={article.id}
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-xs text-gray-600 hover:text-gray-900"
                              onClick={() => handleArticleClick(article)}
                            >
                              {article.title}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {selectedArticle ? (
                /* Article Detail View */
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getDifficultyColor(selectedArticle.difficulty)}>
                            {selectedArticle.difficulty}
                          </Badge>
                          <Badge variant="outline">{selectedArticle.category}</Badge>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{selectedArticle.readTime} min read</span>
                        </div>
                        
                        <CardTitle className="text-2xl mb-2">{selectedArticle.title}</CardTitle>
                        <CardDescription className="text-base">{selectedArticle.description}</CardDescription>
                        
                        <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{selectedArticle.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Updated {formatDate(selectedArticle.lastUpdated)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{selectedArticle.views.toLocaleString()} views</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleLikeArticle(selectedArticle.id)}
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          {selectedArticle.likes}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                        <Button size="sm" variant="outline">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    {/* Article Content */}
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        {selectedArticle.content}
                      </p>
                      
                      {/* Code Examples */}
                      {selectedArticle.codeExamples && (
                        <div className="mt-8">
                          <h3 className="text-lg font-semibold mb-4">Code Examples</h3>
                          {selectedArticle.codeExamples.map((example) => (
                            <div key={example.id} className="mb-6">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{example.title}</h4>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{example.language}</Badge>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => copyToClipboard(example.code)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              {example.description && (
                                <p className="text-sm text-gray-600 mb-2">{example.description}</p>
                              )}
                              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                                <code>{example.code}</code>
                              </pre>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    {/* Article Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMarkHelpful(selectedArticle.id)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Helpful ({selectedArticle.helpful})
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Feedback
                        </Button>
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedArticle(null)}
                      >
                        ← Back to Documentation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* Articles Grid/List View */
                <div className="space-y-6">
                  {/* Quick Start Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        Quick Start
                      </CardTitle>
                      <CardDescription>
                        Get started with SpreadsheetAI in minutes
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button 
                          variant="outline" 
                          className="h-auto p-4 flex flex-col items-start gap-2"
                          onClick={() => handleArticleClick(allArticles.find(a => a.id === 'quick-start')!)}
                        >
                          <Play className="h-5 w-5 text-green-500" />
                          <div className="text-left">
                            <div className="font-medium">Quick Start Guide</div>
                            <div className="text-sm text-gray-600">5 min read</div>
                          </div>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="h-auto p-4 flex flex-col items-start gap-2"
                          onClick={() => handleArticleClick(allArticles.find(a => a.id === 'authentication')!)}
                        >
                          <Shield className="h-5 w-5 text-blue-500" />
                          <div className="text-left">
                            <div className="font-medium">Authentication</div>
                            <div className="text-sm text-gray-600">10 min read</div>
                          </div>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="h-auto p-4 flex flex-col items-start gap-2"
                          onClick={() => handleArticleClick(allArticles.find(a => a.id === 'javascript-examples')!)}
                        >
                          <Code className="h-5 w-5 text-purple-500" />
                          <div className="text-left">
                            <div className="font-medium">Code Examples</div>
                            <div className="text-sm text-gray-600">15 min read</div>
                          </div>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Articles */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>All Articles</CardTitle>
                          <CardDescription>
                            {sortedArticles.length} articles found
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {sortedArticles.length === 0 ? (
                        <div className="text-center py-12">
                          <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                          <p className="text-gray-600">Try adjusting your search or filters</p>
                        </div>
                      ) : (
                        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
                          {sortedArticles.map((article) => (
                            <div 
                              key={article.id} 
                              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => handleArticleClick(article)}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Badge className={getDifficultyColor(article.difficulty)}>
                                    {article.difficulty}
                                  </Badge>
                                  <Badge variant="outline">{article.category}</Badge>
                                </div>
                                <span className="text-sm text-gray-500">{article.readTime} min</span>
                              </div>
                              
                              <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.description}</p>
                              
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {article.views.toLocaleString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Heart className="h-3 w-3" />
                                    {article.likes}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <ThumbsUp className="h-3 w-3" />
                                    {article.helpful}
                                  </span>
                                </div>
                                <span>{formatDate(article.lastUpdated)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* API Reference Tab */}
        <TabsContent value="api" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* API Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">API Endpoints</CardTitle>
                  
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search API endpoints..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-2">
                  {filteredEndpoints.map((endpoint) => (
                    <Button
                      key={endpoint.id}
                      variant={selectedEndpoint?.id === endpoint.id ? "default" : "ghost"}
                      className="w-full justify-start p-3 h-auto flex-col items-start"
                      onClick={() => handleEndpointClick(endpoint)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <Badge className={getMethodColor(endpoint.method)}>
                          {endpoint.method}
                        </Badge>
                        <span className="text-xs font-mono text-gray-600 truncate">
                          {endpoint.endpoint}
                        </span>
                      </div>
                      <span className="text-sm font-medium mt-1">{endpoint.title}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* API Content */}
            <div className="lg:col-span-3">
              {selectedEndpoint ? (
                /* API Endpoint Detail */
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={getMethodColor(selectedEndpoint.method)}>
                        {selectedEndpoint.method}
                      </Badge>
                      <code className="text-lg font-mono bg-gray-100 px-2 py-1 rounded">
                        {selectedEndpoint.endpoint}
                      </code>
                    </div>
                    
                    <CardTitle className="text-2xl">{selectedEndpoint.title}</CardTitle>
                    <CardDescription className="text-base">
                      {selectedEndpoint.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Parameters */}
                    {selectedEndpoint.parameters.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Parameters</h3>
                        <div className="space-y-3">
                          {selectedEndpoint.parameters.map((param) => (
                            <div key={param.name} className="border rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                  {param.name}
                                </code>
                                <Badge variant="outline">{param.type}</Badge>
                                {param.required && (
                                  <Badge variant="destructive" className="text-xs">Required</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{param.description}</p>
                              {param.example && (
                                <div>
                                  <span className="text-xs font-medium text-gray-500">Example:</span>
                                  <code className="ml-2 text-xs bg-gray-100 px-1 py-0.5 rounded">
                                    {param.example}
                                  </code>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Responses */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Responses</h3>
                      <div className="space-y-3">
                        {selectedEndpoint.responses.map((response) => (
                          <div key={response.status} className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge 
                                className={response.status < 300 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                              >
                                {response.status}
                              </Badge>
                              <span className="font-medium">{response.description}</span>
                            </div>
                            <div className="mt-2">
                              <span className="text-xs font-medium text-gray-500">Example Response:</span>
                              <pre className="mt-1 bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                                <code>{response.example}</code>
                              </pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Code Examples */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Code Examples</h3>
                      {selectedEndpoint.examples.map((example, index) => (
                        <div key={index} className="mb-6">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">{example.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{example.language}</Badge>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => copyToClipboard(example.request)}
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy Request
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Request</h5>
                              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                                <code>{example.request}</code>
                              </pre>
                            </div>
                            
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Response</h5>
                              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                                <code>{example.response}</code>
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedEndpoint(null)}
                    >
                      ← Back to API Reference
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                /* API Overview */
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-blue-500" />
                        API Reference
                      </CardTitle>
                      <CardDescription>
                        Complete reference for the SpreadsheetAI API
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mockAPIEndpoints.map((endpoint) => (
                          <div 
                            key={endpoint.id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleEndpointClick(endpoint)}
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <Badge className={getMethodColor(endpoint.method)}>
                                {endpoint.method}
                              </Badge>
                              <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                {endpoint.endpoint}
                              </code>
                            </div>
                            
                            <h3 className="font-semibold text-gray-900 mb-2">{endpoint.title}</h3>
                            <p className="text-sm text-gray-600">{endpoint.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* API Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Shield className="h-5 w-5 text-green-500" />
                          Authentication
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">
                          All API requests require authentication using API keys.
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleArticleClick(allArticles.find(a => a.id === 'authentication')!)}
                        >
                          Learn More
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Clock className="h-5 w-5 text-yellow-500" />
                          Rate Limits
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">
                          API requests are limited to ensure fair usage across all users.
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleArticleClick(allArticles.find(a => a.id === 'rate-limits')!)}
                        >
                          View Limits
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <HelpCircle className="h-5 w-5 text-blue-500" />
                          Support
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">
                          Need help with the API? Contact our support team.
                        </p>
                        <Button size="sm" variant="outline">
                          Get Support
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Examples Tab */}
        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-purple-500" />
                Code Examples & Tutorials
              </CardTitle>
              <CardDescription>
                Ready-to-use code examples and step-by-step tutorials
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {/* Language Tabs */}
              <Tabs defaultValue="javascript" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="php">PHP</TabsTrigger>
                </TabsList>
                
                <TabsContent value="javascript" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Upload Example */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Basic File Upload</CardTitle>
                        <CardDescription>
                          Upload and analyze a spreadsheet file
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">JavaScript</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => copyToClipboard(`const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('/api/v1/analyze', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Analysis results:', data);
})
.catch(error => {
  console.error('Error:', error);
});`)}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                          </div>
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{`const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('/api/v1/analyze', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Analysis results:', data);
})
.catch(error => {
  console.error('Error:', error);
});`}</code>
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* React Hook Example */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">React Hook</CardTitle>
                        <CardDescription>
                          Custom React hook for file analysis
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">React</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => copyToClipboard(`import { useState } from 'react';

function useSpreadsheetAnalysis() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const analyzeFile = async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/v1/analyze', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { analyzeFile, loading, results, error };
}`})}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                          </div>
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{`import { useState } from 'react';

function useSpreadsheetAnalysis() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const analyzeFile = async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/v1/analyze', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { analyzeFile, loading, results, error };
}`}</code>
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="python" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Python Example</CardTitle>
                      <CardDescription>
                        Analyze spreadsheet using Python requests
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Python</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => copyToClipboard(`import requests

def analyze_spreadsheet(file_path, api_key):
    url = 'https://api.spreadsheetai.com/v1/analyze'
    
    headers = {
        'Authorization': f'Bearer {api_key}'
    }
    
    with open(file_path, 'rb') as file:
        files = {'file': file}
        response = requests.post(url, headers=headers, files=files)
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f'Analysis failed: {response.text}')

# Usage
api_key = 'your_api_key_here'
file_path = 'data.xlsx'

try:
    results = analyze_spreadsheet(file_path, api_key)
    print('Analysis results:', results)
except Exception as e:
    print('Error:', e)`)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{`import requests

def analyze_spreadsheet(file_path, api_key):
    url = 'https://api.spreadsheetai.com/v1/analyze'
    
    headers = {
        'Authorization': f'Bearer {api_key}'
    }
    
    with open(file_path, 'rb') as file:
        files = {'file': file}
        response = requests.post(url, headers=headers, files=files)
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f'Analysis failed: {response.text}')

# Usage
api_key = 'your_api_key_here'
file_path = 'data.xlsx'

try:
    results = analyze_spreadsheet(file_path, api_key)
    print('Analysis results:', results)
except Exception as e:
    print('Error:', e)`}</code>
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="curl" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">cURL Example</CardTitle>
                      <CardDescription>
                        Command line example using cURL
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Bash</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => copyToClipboard(`curl -X POST https://api.spreadsheetai.com/v1/analyze \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@data.xlsx" \
  -F "analysis_type=summary"`)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{`curl -X POST https://api.spreadsheetai.com/v1/analyze \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@data.xlsx" \
  -F "analysis_type=summary"`}</code>
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="php" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">PHP Example</CardTitle>
                      <CardDescription>
                        Analyze spreadsheet using PHP cURL
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">PHP</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => copyToClipboard(`<?php

function analyzeSpreadsheet($filePath, $apiKey) {
    $url = 'https://api.spreadsheetai.com/v1/analyze';
    
    $curl = curl_init();
    
    curl_setopt_array($curl, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $apiKey
        ],
        CURLOPT_POSTFIELDS => [
            'file' => new CURLFile($filePath)
        ]
    ]);
    
    $response = curl_exec($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    
    curl_close($curl);
    
    if ($httpCode === 200) {
        return json_decode($response, true);
    } else {
        throw new Exception('Analysis failed: ' . $response);
    }
}

// Usage
$apiKey = 'your_api_key_here';
$filePath = 'data.xlsx';

try {
    $results = analyzeSpreadsheet($filePath, $apiKey);
    echo 'Analysis results: ' . json_encode($results);
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}

?>`})}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{`<?php

function analyzeSpreadsheet($filePath, $apiKey) {
    $url = 'https://api.spreadsheetai.com/v1/analyze';
    
    $curl = curl_init();
    
    curl_setopt_array($curl, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $apiKey
        ],
        CURLOPT_POSTFIELDS => [
            'file' => new CURLFile($filePath)
        ]
    ]);
    
    $response = curl_exec($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    
    curl_close($curl);
    
    if ($httpCode === 200) {
        return json_decode($response, true);
    } else {
        throw new Exception('Analysis failed: ' . $response);
    }
}

// Usage
$apiKey = 'your_api_key_here';
$filePath = 'data.xlsx';

try {
    $results = analyzeSpreadsheet($filePath, $apiKey);
    echo 'Analysis results: ' . json_encode($results);
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}

?>`}</code>
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              {/* Tutorial Links */}
              <Separator className="my-8" />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Tutorials & Guides</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-start gap-2"
                    onClick={() => handleArticleClick(allArticles.find(a => a.id === 'quick-start')!)}
                  >
                    <Play className="h-5 w-5 text-green-500" />
                    <div className="text-left">
                      <div className="font-medium">Quick Start Guide</div>
                      <div className="text-sm text-gray-600">Get started in 5 minutes</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-start gap-2"
                    onClick={() => handleArticleClick(allArticles.find(a => a.id === 'data-analysis')!)}
                  >
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    <div className="text-left">
                      <div className="font-medium">Advanced Analysis</div>
                      <div className="text-sm text-gray-600">Deep dive into data analysis</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-start gap-2"
                    onClick={() => handleArticleClick(allArticles.find(a => a.id === 'javascript-examples')!)}
                  >
                    <Code className="h-5 w-5 text-purple-500" />
                    <div className="text-left">
                      <div className="font-medium">JavaScript Integration</div>
                      <div className="text-sm text-gray-600">Frontend integration examples</div>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}