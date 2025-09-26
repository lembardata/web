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
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Building,
  Briefcase,
  Camera,
  Edit,
  Save,
  X,
  Check,
  Shield,
  Key,
  Bell,
  Palette,
  Monitor,
  Moon,
  Sun,
  Languages,
  Clock,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Smartphone,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Settings,
  CreditCard,
  Activity,
  BarChart3,
  FileText,
  Link,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  ExternalLink,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/api/use-auth';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  company?: string;
  jobTitle?: string;
  timezone: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    weeklyReports: boolean;
    securityAlerts: boolean;
    productUpdates: boolean;
  };
  apiUsage: {
    totalRequests: number;
    thisMonth: number;
    limit: number;
  };
  subscription: {
    plan: string;
    status: string;
    renewsAt: Date;
  };
}

interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  location: string;
}

const mockProfile: UserProfile = {
  id: 'user-1',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  displayName: 'John Doe',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  bio: 'Data analyst and spreadsheet enthusiast. Love turning complex data into actionable insights.',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  website: 'https://johndoe.com',
  company: 'Tech Corp',
  jobTitle: 'Senior Data Analyst',
  timezone: 'America/Los_Angeles',
  language: 'en',
  theme: 'system',
  emailVerified: true,
  phoneVerified: false,
  twoFactorEnabled: true,
  createdAt: new Date('2024-01-15'),
  lastLoginAt: new Date(Date.now() - 1000 * 60 * 30),
  socialLinks: {
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
    twitter: 'https://twitter.com/johndoe'
  },
  preferences: {
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    weeklyReports: true,
    securityAlerts: true,
    productUpdates: true
  },
  apiUsage: {
    totalRequests: 15420,
    thisMonth: 2340,
    limit: 10000
  },
  subscription: {
    plan: 'Pro',
    status: 'active',
    renewsAt: new Date('2024-12-15')
  }
};

const mockActivityLogs: ActivityLog[] = [
  {
    id: 'log-1',
    action: 'login',
    description: 'Signed in to account',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 120.0.0.0',
    location: 'San Francisco, CA'
  },
  {
    id: 'log-2',
    action: 'profile_update',
    description: 'Updated profile information',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 120.0.0.0',
    location: 'San Francisco, CA'
  },
  {
    id: 'log-3',
    action: 'password_change',
    description: 'Changed account password',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 120.0.0.0',
    location: 'San Francisco, CA'
  },
  {
    id: 'log-4',
    action: 'api_key_generated',
    description: 'Generated new API key',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 120.0.0.0',
    location: 'San Francisco, CA'
  },
  {
    id: 'log-5',
    action: 'login',
    description: 'Signed in to account',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    ipAddress: '10.0.0.50',
    userAgent: 'Safari 17.0',
    location: 'New York, NY'
  }
];

const getActionIcon = (action: string) => {
  switch (action) {
    case 'login': return <User className="h-4 w-4 text-green-500" />;
    case 'logout': return <User className="h-4 w-4 text-gray-500" />;
    case 'profile_update': return <Edit className="h-4 w-4 text-blue-500" />;
    case 'password_change': return <Key className="h-4 w-4 text-orange-500" />;
    case 'api_key_generated': return <Key className="h-4 w-4 text-purple-500" />;
    case 'two_factor_enabled': return <Shield className="h-4 w-4 text-green-500" />;
    case 'two_factor_disabled': return <Shield className="h-4 w-4 text-red-500" />;
    default: return <Activity className="h-4 w-4 text-gray-500" />;
  }
};

const getSocialIcon = (platform: string) => {
  switch (platform) {
    case 'github': return <Github className="h-4 w-4" />;
    case 'linkedin': return <Linkedin className="h-4 w-4" />;
    case 'twitter': return <Twitter className="h-4 w-4" />;
    case 'instagram': return <Instagram className="h-4 w-4" />;
    case 'facebook': return <Facebook className="h-4 w-4" />;
    default: return <Link className="h-4 w-4" />;
  }
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
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

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    displayName: profile.displayName,
    bio: profile.bio || '',
    phone: profile.phone || '',
    location: profile.location || '',
    website: profile.website || '',
    company: profile.company || '',
    jobTitle: profile.jobTitle || ''
  });
  const [socialLinks, setSocialLinks] = useState(profile.socialLinks);
  const [preferences, setPreferences] = useState(profile.preferences);
  const [showApiKey, setShowApiKey] = useState(false);
  const [newPassword, setNewPassword] = useState({ current: '', new: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  const handleSaveProfile = () => {
    setProfile({ ...profile, ...editForm });
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleCancelEdit = () => {
    setEditForm({
      firstName: profile.firstName,
      lastName: profile.lastName,
      displayName: profile.displayName,
      bio: profile.bio || '',
      phone: profile.phone || '',
      location: profile.location || '',
      website: profile.website || '',
      company: profile.company || '',
      jobTitle: profile.jobTitle || ''
    });
    setIsEditing(false);
  };

  const handleSaveSocialLinks = () => {
    setProfile({ ...profile, socialLinks });
    toast.success('Social links updated successfully');
  };

  const handleSavePreferences = () => {
    setProfile({ ...profile, preferences });
    toast.success('Preferences updated successfully');
  };

  const handleChangePassword = () => {
    if (!newPassword.current || !newPassword.new || !newPassword.confirm) {
      toast.error('Please fill in all password fields');
      return;
    }
    
    if (newPassword.new !== newPassword.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (newPassword.new.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    toast.success('Password changed successfully');
    setNewPassword({ current: '', new: '', confirm: '' });
  };

  const handleToggle2FA = () => {
    setProfile({ ...profile, twoFactorEnabled: !profile.twoFactorEnabled });
    toast.success(`Two-factor authentication ${!profile.twoFactorEnabled ? 'enabled' : 'disabled'}`);
  };

  const handleVerifyEmail = () => {
    toast.success('Verification email sent');
  };

  const handleVerifyPhone = () => {
    toast.success('Verification SMS sent');
  };

  const handleGenerateApiKey = () => {
    toast.success('New API key generated');
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion requires additional verification');
  };

  const handleExportData = () => {
    toast.success('Data export started. You will receive an email when ready.');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">
          Manage your account information, security settings, and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="data">Data & Privacy</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <div className="relative mx-auto w-24 h-24 mb-4">
                    {profile.avatar ? (
                      <img 
                        src={profile.avatar} 
                        alt={profile.displayName}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <Button 
                      size="sm" 
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle>{profile.displayName}</CardTitle>
                  <CardDescription>{profile.email}</CardDescription>
                  
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {profile.emailVerified ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Unverified
                      </Badge>
                    )}
                    
                    <Badge className={`${
                      profile.subscription.status === 'active' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {profile.subscription.plan}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {profile.bio && (
                    <p className="text-sm text-gray-600 text-center">{profile.bio}</p>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    {profile.company && (
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span>{profile.company}</span>
                      </div>
                    )}
                    
                    {profile.jobTitle && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span>{profile.jobTitle}</span>
                      </div>
                    )}
                    
                    {profile.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    
                    {profile.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <a 
                          href={profile.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {profile.website.replace('https://', '')}
                        </a>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Joined {formatDate(profile.createdAt)}</span>
                    </div>
                  </div>
                  
                  {/* Social Links */}
                  {Object.entries(profile.socialLinks).some(([_, url]) => url) && (
                    <div>
                      <Separator className="my-4" />
                      <div className="flex items-center justify-center gap-2">
                        {Object.entries(profile.socialLinks).map(([platform, url]) => 
                          url ? (
                            <Button 
                              key={platform} 
                              size="sm" 
                              variant="outline" 
                              className="w-8 h-8 p-0"
                              onClick={() => window.open(url, '_blank')}
                            >
                              {getSocialIcon(platform)}
                            </Button>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Basic Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={handleSaveProfile}>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button variant="outline" onClick={handleCancelEdit}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={editForm.displayName}
                      onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself..."
                      className="resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        disabled={!isEditing}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        disabled={!isEditing}
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={editForm.website}
                      onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                      disabled={!isEditing}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={editForm.company}
                        onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Your company"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        value={editForm.jobTitle}
                        onChange={(e) => setEditForm({ ...editForm, jobTitle: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Your job title"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                  <CardDescription>Connect your social media profiles</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {Object.entries(socialLinks).map(([platform, url]) => (
                    <div key={platform}>
                      <Label htmlFor={platform} className="flex items-center gap-2">
                        {getSocialIcon(platform)}
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </Label>
                      <Input
                        id={platform}
                        value={url || ''}
                        onChange={(e) => setSocialLinks({ ...socialLinks, [platform]: e.target.value })}
                        placeholder={`https://${platform}.com/username`}
                      />
                    </div>
                  ))}
                  
                  <Button onClick={handleSaveSocialLinks}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Social Links
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Security */}
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>Manage your account security settings</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Email Verification */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="font-medium">Email Verification</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{profile.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {profile.emailVerified ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Button size="sm" onClick={handleVerifyEmail}>
                        Verify
                      </Button>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                {/* Phone Verification */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span className="font-medium">Phone Verification</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{profile.phone || 'No phone number'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {profile.phoneVerified ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Button size="sm" onClick={handleVerifyPhone} disabled={!profile.phone}>
                        Verify
                      </Button>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">Two-Factor Authentication</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant={profile.twoFactorEnabled ? 'destructive' : 'default'}
                    onClick={handleToggle2FA}
                  >
                    {profile.twoFactorEnabled ? (
                      <>
                        <Lock className="h-3 w-3 mr-1" />
                        Disable
                      </>
                    ) : (
                      <>
                        <Unlock className="h-3 w-3 mr-1" />
                        Enable
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? 'text' : 'password'}
                      value={newPassword.current}
                      onChange={(e) => setNewPassword({ ...newPassword, current: e.target.value })}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    >
                      {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? 'text' : 'password'}
                      value={newPassword.new}
                      onChange={(e) => setNewPassword({ ...newPassword, new: e.target.value })}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={newPassword.confirm}
                      onChange={(e) => setNewPassword({ ...newPassword, confirm: e.target.value })}
                      placeholder="Confirm new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <Button onClick={handleChangePassword} className="w-full">
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                
                <div className="text-xs text-gray-500">
                  <p>Password requirements:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>At least 8 characters long</li>
                    <li>Include uppercase and lowercase letters</li>
                    <li>Include at least one number</li>
                    <li>Include at least one special character</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* API Keys */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage your API keys for programmatic access</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      <span className="font-medium">Primary API Key</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {showApiKey ? 'sk-1234567890abcdef1234567890abcdef' : '••••••••••••••••••••••••••••••••'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard('sk-1234567890abcdef1234567890abcdef')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button size="sm" onClick={handleGenerateApiKey}>
                      Regenerate
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-2">API Usage This Month:</p>
                  <div className="flex items-center justify-between mb-1">
                    <span>{profile.apiUsage.thisMonth.toLocaleString()} / {profile.apiUsage.limit.toLocaleString()} requests</span>
                    <span>{Math.round((profile.apiUsage.thisMonth / profile.apiUsage.limit) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${(profile.apiUsage.thisMonth / profile.apiUsage.limit) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {Object.entries(preferences).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <span className="font-medium">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {key === 'emailNotifications' && 'Receive notifications via email'}
                        {key === 'pushNotifications' && 'Receive push notifications in browser'}
                        {key === 'marketingEmails' && 'Receive marketing and promotional emails'}
                        {key === 'weeklyReports' && 'Receive weekly usage and analytics reports'}
                        {key === 'securityAlerts' && 'Receive security and login alerts'}
                        {key === 'productUpdates' && 'Receive product updates and feature announcements'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setPreferences({ ...preferences, [key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
                
                <Button onClick={handleSavePreferences} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>

            {/* Appearance & Language */}
            <Card>
              <CardHeader>
                <CardTitle>Appearance & Language</CardTitle>
                <CardDescription>Customize your interface preferences</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Theme */}
                <div>
                  <Label className="text-sm font-medium">Theme</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {['light', 'dark', 'system'].map((theme) => (
                      <Button
                        key={theme}
                        variant={profile.theme === theme ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setProfile({ ...profile, theme: theme as any })}
                        className="flex items-center gap-2"
                      >
                        {theme === 'light' && <Sun className="h-4 w-4" />}
                        {theme === 'dark' && <Moon className="h-4 w-4" />}
                        {theme === 'system' && <Monitor className="h-4 w-4" />}
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Language */}
                <div>
                  <Label htmlFor="language">Language</Label>
                  <select 
                    id="language"
                    value={profile.language} 
                    onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1"
                  >
                    <option value="en">English</option>
                    <option value="id">Bahasa Indonesia</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="ja">日本語</option>
                    <option value="ko">한국어</option>
                    <option value="zh">中文</option>
                  </select>
                </div>
                
                {/* Timezone */}
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <select 
                    id="timezone"
                    value={profile.timezone} 
                    onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-1"
                  >
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                    <option value="Europe/Paris">Central European Time (CET)</option>
                    <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                    <option value="Asia/Shanghai">China Standard Time (CST)</option>
                    <option value="Asia/Jakarta">Western Indonesia Time (WIB)</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>View your recent account activity and login history</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {mockActivityLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {getActionIcon(log.action)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{log.description}</p>
                        <span className="text-sm text-gray-500">{formatRelativeTime(log.timestamp)}</span>
                      </div>
                      
                      <div className="mt-1 text-sm text-gray-600">
                        <div className="flex items-center gap-4">
                          <span>IP: {log.ipAddress}</span>
                          <span>•</span>
                          <span>{log.userAgent}</span>
                          <span>•</span>
                          <span>{log.location}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(log.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-6">
                <Button variant="outline">
                  Load More Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data & Privacy Tab */}
        <TabsContent value="data" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Export */}
            <Card>
              <CardHeader>
                <CardTitle>Data Export</CardTitle>
                <CardDescription>Download a copy of your data</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  You can request a copy of all your data including profile information, 
                  queries, results, and usage statistics.
                </p>
                
                <Button onClick={handleExportData} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Request Data Export
                </Button>
                
                <p className="text-xs text-gray-500">
                  You will receive an email with download links when your data is ready. 
                  This process may take up to 24 hours.
                </p>
              </CardContent>
            </Card>

            {/* Account Deletion */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>Irreversible and destructive actions</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800">Delete Account</h4>
                      <p className="text-sm text-red-700 mt-1">
                        Once you delete your account, there is no going back. 
                        This will permanently delete your profile, queries, and all associated data.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}