'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Search,
  Filter,
  Download,
  Upload,
  Brain,
  FileSpreadsheet,
  Trash2,
  Share2,
  Settings,
  User,
  Clock,
  Calendar,
  Activity as ActivityIcon,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  Edit,
  Copy,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

type ActivityType = 
  | 'upload'
  | 'query'
  | 'download'
  | 'share'
  | 'delete'
  | 'edit'
  | 'view'
  | 'login'
  | 'logout'
  | 'settings'
  | 'billing';

type ActivityStatus = 'success' | 'error' | 'pending' | 'warning';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  status: ActivityStatus;
  timestamp: Date;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    queryModel?: string;
    duration?: number;
    cost?: number;
    ipAddress?: string;
    userAgent?: string;
    location?: string;
  };
}

// Mock data
const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'upload',
    title: 'File Uploaded',
    description: 'sales-data-2024.xlsx berhasil diupload',
    status: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    metadata: {
      fileName: 'sales-data-2024.xlsx',
      fileSize: 2048576, // 2MB
    },
  },
  {
    id: '2',
    type: 'query',
    title: 'AI Query Completed',
    description: 'Analisis tren penjualan Q4 2024',
    status: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    metadata: {
      queryModel: 'GPT-4',
      duration: 45,
      cost: 0.05,
    },
  },
  {
    id: '3',
    type: 'query',
    title: 'AI Query Failed',
    description: 'Gagal menganalisis data customer segmentation',
    status: 'error',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    metadata: {
      queryModel: 'Claude 3',
      duration: 12,
    },
  },
  {
    id: '4',
    type: 'download',
    title: 'File Downloaded',
    description: 'report-summary.pdf berhasil didownload',
    status: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    metadata: {
      fileName: 'report-summary.pdf',
      fileSize: 1024000, // 1MB
    },
  },
  {
    id: '5',
    type: 'share',
    title: 'File Shared',
    description: 'budget-analysis.xlsx dibagikan ke tim',
    status: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    metadata: {
      fileName: 'budget-analysis.xlsx',
    },
  },
  {
    id: '6',
    type: 'login',
    title: 'Login Successful',
    description: 'Login dari Jakarta, Indonesia',
    status: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    metadata: {
      ipAddress: '103.xxx.xxx.xxx',
      location: 'Jakarta, Indonesia',
      userAgent: 'Chrome 120.0.0.0',
    },
  },
  {
    id: '7',
    type: 'settings',
    title: 'Profile Updated',
    description: 'Informasi profil berhasil diperbarui',
    status: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
  },
  {
    id: '8',
    type: 'delete',
    title: 'File Deleted',
    description: 'old-data.csv dihapus dari sistem',
    status: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    metadata: {
      fileName: 'old-data.csv',
    },
  },
];

const getActivityIcon = (type: ActivityType) => {
  const iconMap = {
    upload: Upload,
    query: Brain,
    download: Download,
    share: Share2,
    delete: Trash2,
    edit: Edit,
    view: Eye,
    login: User,
    logout: User,
    settings: Settings,
    billing: Settings,
  };
  return iconMap[type] || ActivityIcon;
};

const getStatusIcon = (status: ActivityStatus) => {
  switch (status) {
    case 'success':
      return CheckCircle;
    case 'error':
      return XCircle;
    case 'pending':
      return RefreshCw;
    case 'warning':
      return AlertCircle;
    default:
      return CheckCircle;
  }
};

const getStatusColor = (status: ActivityStatus) => {
  switch (status) {
    case 'success':
      return 'text-green-600 bg-green-100';
    case 'error':
      return 'text-red-600 bg-red-100';
    case 'pending':
      return 'text-yellow-600 bg-yellow-100';
    case 'warning':
      return 'text-orange-600 bg-orange-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function ActivityPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('all');
  const [activities] = useState<Activity[]>(mockActivities);

  // Filter activities
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || activity.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || activity.status === selectedStatus;
    
    let matchesTimeRange = true;
    if (selectedTimeRange !== 'all') {
      const now = new Date();
      const activityTime = activity.timestamp;
      
      switch (selectedTimeRange) {
        case 'today':
          matchesTimeRange = activityTime.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesTimeRange = activityTime >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesTimeRange = activityTime >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesTimeRange;
  });

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = activity.timestamp.toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, Activity[]>);

  // Activity statistics
  const stats = {
    total: activities.length,
    today: activities.filter(a => a.timestamp.toDateString() === new Date().toDateString()).length,
    success: activities.filter(a => a.status === 'success').length,
    errors: activities.filter(a => a.status === 'error').length,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
        <p className="text-gray-600 mt-2">
          Pantau semua aktivitas dan riwayat penggunaan akun Anda
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Activities</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <ActivityIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-gray-900">{stats.success}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Errors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.errors}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="upload">Upload</SelectItem>
                <SelectItem value="query">AI Query</SelectItem>
                <SelectItem value="download">Download</SelectItem>
                <SelectItem value="share">Share</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>

            {/* Time Range Filter */}
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity List */}
      <div className="space-y-6">
        {Object.keys(groupedActivities).length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ActivityIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Activities Found</h3>
              <p className="text-gray-500">
                {searchQuery || selectedType !== 'all' || selectedStatus !== 'all' || selectedTimeRange !== 'all'
                  ? 'Try adjusting your filters to see more activities.'
                  : 'Your activity log will appear here as you use the platform.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedActivities)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([date, dayActivities]) => (
              <div key={date}>
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {new Date(date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h3>
                  <div className="flex-1 h-px bg-gray-200 ml-4"></div>
                </div>

                <div className="space-y-3">
                  {dayActivities.map((activity) => {
                    const ActivityIconComponent = getActivityIcon(activity.type);
                    const StatusIconComponent = getStatusIcon(activity.status);
                    const statusColor = getStatusColor(activity.status);

                    return (
                      <Card key={activity.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            {/* Activity Icon */}
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <ActivityIconComponent className="h-5 w-5 text-gray-600" />
                              </div>
                            </div>

                            {/* Activity Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-medium text-gray-900">
                                  {activity.title}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                                    <StatusIconComponent className="h-3 w-3 mr-1" />
                                    {activity.status}
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: id })}
                                  </span>
                                </div>
                              </div>

                              <p className="text-sm text-gray-600 mb-2">
                                {activity.description}
                              </p>

                              {/* Metadata */}
                              {activity.metadata && (
                                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                  {activity.metadata.fileName && (
                                    <Badge variant="outline">
                                      <FileSpreadsheet className="h-3 w-3 mr-1" />
                                      {activity.metadata.fileName}
                                    </Badge>
                                  )}
                                  {activity.metadata.fileSize && (
                                    <Badge variant="outline">
                                      {formatFileSize(activity.metadata.fileSize)}
                                    </Badge>
                                  )}
                                  {activity.metadata.queryModel && (
                                    <Badge variant="outline">
                                      <Brain className="h-3 w-3 mr-1" />
                                      {activity.metadata.queryModel}
                                    </Badge>
                                  )}
                                  {activity.metadata.duration && (
                                    <Badge variant="outline">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {activity.metadata.duration}s
                                    </Badge>
                                  )}
                                  {activity.metadata.cost && (
                                    <Badge variant="outline">
                                      ${activity.metadata.cost.toFixed(3)}
                                    </Badge>
                                  )}
                                  {activity.metadata.location && (
                                    <Badge variant="outline">
                                      {activity.metadata.location}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))
        )}
      </div>

      {/* Load More */}
      {filteredActivities.length > 0 && (
        <div className="text-center mt-8">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Load More Activities
          </Button>
        </div>
      )}
    </div>
  );
}