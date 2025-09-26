'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  Plus,
  Play,
  Pause,
  Square,
  Download,
  Upload,
  Copy,
  Edit,
  Trash2,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Brain,
  FileSpreadsheet,
  BarChart3,
  PieChart,
  TrendingUp,
  Calculator,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
  Share,
  BookOpen,
  Lightbulb,
  Target,
  Layers,
  Code,
  Database,
  FileText,
  Image,
  MoreHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

interface AIQuery {
  id: string;
  title: string;
  description: string;
  query: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  type: 'analysis' | 'formula' | 'visualization' | 'summary' | 'prediction';
  createdAt: Date;
  updatedAt: Date;
  executionTime?: number;
  result?: {
    data: any;
    insights: string[];
    recommendations: string[];
    confidence: number;
  };
  tags: string[];
  isFavorite: boolean;
  isPublic: boolean;
}

interface QueryTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  template: string;
  parameters: {
    name: string;
    type: 'text' | 'number' | 'select' | 'boolean';
    required: boolean;
    options?: string[];
    placeholder?: string;
  }[];
  usageCount: number;
  rating: number;
  tags: string[];
  author: string;
  isOfficial: boolean;
}

const mockQueries: AIQuery[] = [
  {
    id: 'q1',
    title: 'Sales Performance Analysis',
    description: 'Analyze quarterly sales data to identify trends and patterns',
    query: 'Analyze the sales data from Q1-Q4 2024 and provide insights on performance trends, top-performing products, and seasonal patterns.',
    status: 'completed',
    type: 'analysis',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
    executionTime: 45,
    result: {
      data: {},
      insights: [
        'Q4 showed 23% increase in sales compared to Q3',
        'Product category "Electronics" performed best with 45% of total revenue',
        'December had the highest sales volume due to holiday season'
      ],
      recommendations: [
        'Increase inventory for electronics in Q4',
        'Focus marketing efforts on underperforming categories',
        'Prepare for seasonal demand fluctuations'
      ],
      confidence: 0.92
    },
    tags: ['sales', 'quarterly', 'trends'],
    isFavorite: true,
    isPublic: false
  },
  {
    id: 'q2',
    title: 'Customer Segmentation',
    description: 'Segment customers based on purchasing behavior and demographics',
    query: 'Create customer segments based on purchase history, frequency, and demographic data. Identify high-value customer groups.',
    status: 'running',
    type: 'analysis',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5),
    tags: ['customers', 'segmentation', 'behavior'],
    isFavorite: false,
    isPublic: true
  },
  {
    id: 'q3',
    title: 'Revenue Prediction Model',
    description: 'Predict next quarter revenue based on historical data',
    query: 'Build a predictive model for Q1 2025 revenue using historical sales data, market trends, and seasonal factors.',
    status: 'pending',
    type: 'prediction',
    createdAt: new Date(Date.now() - 1000 * 60 * 10),
    updatedAt: new Date(Date.now() - 1000 * 60 * 10),
    tags: ['prediction', 'revenue', 'forecasting'],
    isFavorite: false,
    isPublic: false
  },
  {
    id: 'q4',
    title: 'Expense Optimization',
    description: 'Identify areas for cost reduction in operational expenses',
    query: 'Analyze operational expenses and identify opportunities for cost optimization without impacting service quality.',
    status: 'failed',
    type: 'analysis',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 23),
    tags: ['expenses', 'optimization', 'cost-reduction'],
    isFavorite: false,
    isPublic: false
  }
];

const mockTemplates: QueryTemplate[] = [
  {
    id: 't1',
    name: 'Sales Trend Analysis',
    description: 'Analyze sales trends over a specified time period',
    category: 'Sales & Marketing',
    template: 'Analyze sales trends for {product_category} from {start_date} to {end_date}. Focus on {analysis_type} and provide actionable insights.',
    parameters: [
      { name: 'product_category', type: 'text', required: true, placeholder: 'e.g., Electronics, Clothing' },
      { name: 'start_date', type: 'text', required: true, placeholder: 'YYYY-MM-DD' },
      { name: 'end_date', type: 'text', required: true, placeholder: 'YYYY-MM-DD' },
      { name: 'analysis_type', type: 'select', required: true, options: ['Revenue Growth', 'Volume Analysis', 'Seasonal Patterns', 'Customer Behavior'] }
    ],
    usageCount: 1247,
    rating: 4.8,
    tags: ['sales', 'trends', 'analysis'],
    author: 'SpreadsheetAI Team',
    isOfficial: true
  },
  {
    id: 't2',
    name: 'Financial Ratio Calculator',
    description: 'Calculate and interpret key financial ratios',
    category: 'Finance',
    template: 'Calculate financial ratios for {company_name} including {ratio_types}. Provide interpretation and benchmarking against industry standards.',
    parameters: [
      { name: 'company_name', type: 'text', required: true, placeholder: 'Company name' },
      { name: 'ratio_types', type: 'select', required: true, options: ['Liquidity Ratios', 'Profitability Ratios', 'Leverage Ratios', 'All Ratios'] },
      { name: 'include_benchmarking', type: 'boolean', required: false }
    ],
    usageCount: 892,
    rating: 4.6,
    tags: ['finance', 'ratios', 'analysis'],
    author: 'Finance Expert',
    isOfficial: false
  },
  {
    id: 't3',
    name: 'Inventory Optimization',
    description: 'Optimize inventory levels based on demand patterns',
    category: 'Operations',
    template: 'Analyze inventory data for {product_line} and recommend optimal stock levels considering {factors}. Include reorder points and safety stock calculations.',
    parameters: [
      { name: 'product_line', type: 'text', required: true, placeholder: 'Product category or SKU' },
      { name: 'factors', type: 'select', required: true, options: ['Seasonal Demand', 'Lead Times', 'Storage Costs', 'All Factors'] },
      { name: 'target_service_level', type: 'number', required: false, placeholder: '95' }
    ],
    usageCount: 634,
    rating: 4.7,
    tags: ['inventory', 'optimization', 'supply-chain'],
    author: 'Operations Team',
    isOfficial: true
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'running': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
    case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
    default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'running': return 'bg-blue-100 text-blue-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'failed': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'analysis': return <BarChart3 className="h-4 w-4" />;
    case 'formula': return <Calculator className="h-4 w-4" />;
    case 'visualization': return <PieChart className="h-4 w-4" />;
    case 'summary': return <FileText className="h-4 w-4" />;
    case 'prediction': return <TrendingUp className="h-4 w-4" />;
    default: return <Brain className="h-4 w-4" />;
  }
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

export default function AIQueriesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuery, setSelectedQuery] = useState<AIQuery | null>(null);
  const [newQuery, setNewQuery] = useState({
    title: '',
    description: '',
    query: '',
    type: 'analysis' as const,
    tags: ''
  });
  const [selectedTemplate, setSelectedTemplate] = useState<QueryTemplate | null>(null);
  const [templateParams, setTemplateParams] = useState<Record<string, any>>({});
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredQueries = mockQueries
    .filter(query => {
      const matchesSearch = query.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           query.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           query.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || query.status === filterStatus;
      const matchesType = filterType === 'all' || query.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const filteredTemplates = mockTemplates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateQuery = () => {
    if (!newQuery.title || !newQuery.query) {
      toast.error('Please fill in required fields');
      return;
    }

    toast.success('Query created successfully');
    setNewQuery({ title: '', description: '', query: '', type: 'analysis', tags: '' });
  };

  const handleRunQuery = (queryId: string) => {
    toast.success('Query started successfully');
  };

  const handleStopQuery = (queryId: string) => {
    toast.success('Query stopped');
  };

  const handleDeleteQuery = (queryId: string) => {
    toast.success('Query deleted successfully');
  };

  const handleToggleFavorite = (queryId: string) => {
    toast.success('Favorite status updated');
  };

  const handleDuplicateQuery = (queryId: string) => {
    toast.success('Query duplicated successfully');
  };

  const handleExportQuery = (queryId: string) => {
    toast.success('Query exported successfully');
  };

  const handleUseTemplate = (template: QueryTemplate) => {
    setSelectedTemplate(template);
    setTemplateParams({});
  };

  const handleApplyTemplate = () => {
    if (!selectedTemplate) return;

    let query = selectedTemplate.template;
    Object.entries(templateParams).forEach(([key, value]) => {
      query = query.replace(`{${key}}`, value);
    });

    setNewQuery({
      title: selectedTemplate.name,
      description: selectedTemplate.description,
      query,
      type: 'analysis',
      tags: selectedTemplate.tags.join(', ')
    });

    setSelectedTemplate(null);
    setTemplateParams({});
    toast.success('Template applied successfully');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Queries</h1>
        <p className="text-gray-600">
          Create, manage, and execute AI-powered spreadsheet analysis queries
        </p>
      </div>

      <Tabs defaultValue="queries" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="queries">My Queries</TabsTrigger>
          <TabsTrigger value="create">Create Query</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* My Queries Tab */}
        <TabsContent value="queries" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search queries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="running">Running</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                  
                  <select 
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="analysis">Analysis</option>
                    <option value="formula">Formula</option>
                    <option value="visualization">Visualization</option>
                    <option value="summary">Summary</option>
                    <option value="prediction">Prediction</option>
                  </select>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Queries List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Queries Grid */}
            <div className="space-y-4">
              {filteredQueries.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No queries found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchQuery ? 'Try adjusting your search criteria' : 'Create your first AI query to get started'}
                    </p>
                    <Button onClick={() => setSearchQuery('')}>
                      {searchQuery ? 'Clear Search' : 'Create Query'}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredQueries.map((query) => (
                  <Card 
                    key={query.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedQuery?.id === query.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedQuery(query)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(query.type)}
                          <CardTitle className="text-lg">{query.title}</CardTitle>
                          {query.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(query.status)}
                          <Badge className={getStatusColor(query.status)}>
                            {query.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600 line-clamp-2">{query.description}</p>
                      
                      <div className="flex flex-wrap gap-1">
                        {query.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatRelativeTime(query.updatedAt)}</span>
                        {query.executionTime && (
                          <span>{query.executionTime}s execution</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 pt-2">
                        {query.status === 'completed' && (
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); handleRunQuery(query.id); }}>
                            <Play className="h-3 w-3 mr-1" />
                            Re-run
                          </Button>
                        )}
                        {query.status === 'running' && (
                          <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleStopQuery(query.id); }}>
                            <Square className="h-3 w-3 mr-1" />
                            Stop
                          </Button>
                        )}
                        {query.status === 'pending' && (
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); handleRunQuery(query.id); }}>
                            <Play className="h-3 w-3 mr-1" />
                            Run
                          </Button>
                        )}
                        {query.status === 'failed' && (
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); handleRunQuery(query.id); }}>
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Retry
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => { e.stopPropagation(); handleToggleFavorite(query.id); }}
                        >
                          <Star className={`h-3 w-3 ${query.isFavorite ? 'fill-current text-yellow-500' : ''}`} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Query Details */}
            <div className="lg:sticky lg:top-4">
              {selectedQuery ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {getTypeIcon(selectedQuery.type)}
                          {selectedQuery.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {selectedQuery.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDuplicateQuery(selectedQuery.id)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleExportQuery(selectedQuery.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteQuery(selectedQuery.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Query Details */}
                    <div>
                      <Label className="text-sm font-medium">Query</Label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                        {selectedQuery.query}
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => copyToClipboard(selectedQuery.query)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    
                    {/* Status and Metadata */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label>Status</Label>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusIcon(selectedQuery.status)}
                          <Badge className={getStatusColor(selectedQuery.status)}>
                            {selectedQuery.status}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label>Type</Label>
                        <div className="flex items-center gap-2 mt-1">
                          {getTypeIcon(selectedQuery.type)}
                          <span className="capitalize">{selectedQuery.type}</span>
                        </div>
                      </div>
                      <div>
                        <Label>Created</Label>
                        <p className="mt-1">{formatDate(selectedQuery.createdAt)}</p>
                      </div>
                      <div>
                        <Label>Updated</Label>
                        <p className="mt-1">{formatDate(selectedQuery.updatedAt)}</p>
                      </div>
                    </div>
                    
                    {/* Results */}
                    {selectedQuery.result && (
                      <div className="space-y-4">
                        <Separator />
                        <div>
                          <Label className="text-sm font-medium">Results</Label>
                          
                          {/* Insights */}
                          {selectedQuery.result.insights.length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Key Insights</h4>
                              <ul className="space-y-1">
                                {selectedQuery.result.insights.map((insight, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                    <span>{insight}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {/* Recommendations */}
                          {selectedQuery.result.recommendations.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h4>
                              <ul className="space-y-1">
                                {selectedQuery.result.recommendations.map((rec, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {/* Confidence */}
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-gray-700">Confidence Score</span>
                              <span className="font-medium">{Math.round(selectedQuery.result.confidence * 100)}%</span>
                            </div>
                            <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full transition-all"
                                style={{ width: `${selectedQuery.result.confidence * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Tags */}
                    <div>
                      <Label className="text-sm font-medium">Tags</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedQuery.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Query</h3>
                    <p className="text-gray-600">
                      Click on a query from the list to view its details and results
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Create Query Tab */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New AI Query</CardTitle>
              <CardDescription>
                Design a custom AI query to analyze your spreadsheet data
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Query Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Sales Performance Analysis"
                      value={newQuery.title}
                      onChange={(e) => setNewQuery({ ...newQuery, title: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Brief description of what this query does"
                      value={newQuery.description}
                      onChange={(e) => setNewQuery({ ...newQuery, description: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Query Type</Label>
                    <select 
                      id="type"
                      value={newQuery.type} 
                      onChange={(e) => setNewQuery({ ...newQuery, type: e.target.value as any })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="analysis">Analysis</option>
                      <option value="formula">Formula</option>
                      <option value="visualization">Visualization</option>
                      <option value="summary">Summary</option>
                      <option value="prediction">Prediction</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="e.g., sales, quarterly, trends (comma-separated)"
                      value={newQuery.tags}
                      onChange={(e) => setNewQuery({ ...newQuery, tags: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="query">AI Query *</Label>
                  <Textarea
                    id="query"
                    placeholder="Describe what you want the AI to analyze or calculate. Be specific about the data, metrics, and insights you're looking for..."
                    value={newQuery.query}
                    onChange={(e) => setNewQuery({ ...newQuery, query: e.target.value })}
                    className="min-h-[200px] resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tip: Be specific about your data structure, desired outputs, and any constraints
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 pt-4 border-t">
                <Button onClick={handleCreateQuery}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Query
                </Button>
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          {/* Search Templates */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {template.category}
                      </CardDescription>
                    </div>
                    {template.isOfficial && (
                      <Badge className="bg-blue-100 text-blue-800">
                        Official
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{template.description}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{template.usageCount.toLocaleString()} uses</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      <span>{template.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleUseTemplate(template)}
                      className="flex-1"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Use Template
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                <p className="text-gray-600">
                  {searchQuery ? 'Try adjusting your search criteria' : 'Browse our collection of AI query templates'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Template Parameter Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedTemplate.name}</CardTitle>
                  <CardDescription>{selectedTemplate.description}</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedTemplate(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Template Preview */}
              <div>
                <Label className="text-sm font-medium">Template</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm font-mono">
                  {selectedTemplate.template}
                </div>
              </div>
              
              {/* Parameters */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Parameters</Label>
                {selectedTemplate.parameters.map((param) => (
                  <div key={param.name}>
                    <Label htmlFor={param.name}>
                      {param.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      {param.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    
                    {param.type === 'text' && (
                      <Input
                        id={param.name}
                        placeholder={param.placeholder}
                        value={templateParams[param.name] || ''}
                        onChange={(e) => setTemplateParams({ ...templateParams, [param.name]: e.target.value })}
                      />
                    )}
                    
                    {param.type === 'number' && (
                      <Input
                        id={param.name}
                        type="number"
                        placeholder={param.placeholder}
                        value={templateParams[param.name] || ''}
                        onChange={(e) => setTemplateParams({ ...templateParams, [param.name]: e.target.value })}
                      />
                    )}
                    
                    {param.type === 'select' && (
                      <select 
                        id={param.name}
                        value={templateParams[param.name] || ''} 
                        onChange={(e) => setTemplateParams({ ...templateParams, [param.name]: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      >
                        <option value="">Select an option</option>
                        {param.options?.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}
                    
                    {param.type === 'boolean' && (
                      <div className="flex items-center gap-2">
                        <input
                          id={param.name}
                          type="checkbox"
                          checked={templateParams[param.name] || false}
                          onChange={(e) => setTemplateParams({ ...templateParams, [param.name]: e.target.checked })}
                        />
                        <Label htmlFor={param.name} className="text-sm">
                          Enable this option
                        </Label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-4 pt-4 border-t">
                <Button onClick={handleApplyTemplate}>
                  Apply Template
                </Button>
                <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}