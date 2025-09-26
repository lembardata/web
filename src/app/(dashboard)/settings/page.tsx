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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
} from '@/components/ui/alert-dialog';
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  Check,
  X,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

// Types
interface UserSettings {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    jobTitle: string;
    bio: string;
    avatar: string;
  };
  preferences: {
    language: string;
    timezone: string;
    theme: 'light' | 'dark' | 'system';
    dateFormat: string;
    currency: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
    security: boolean;
    updates: boolean;
    weeklyReport: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    dataSharing: boolean;
    analytics: boolean;
    cookies: boolean;
  };
  api: {
    keys: APIKey[];
    webhooks: Webhook[];
  };
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  createdAt: string;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({});
  const [newApiKeyName, setNewApiKeyName] = useState('');
  const [newWebhookData, setNewWebhookData] = useState({
    name: '',
    url: '',
    events: [] as string[]
  });
  
  // Mock settings data
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+62 812 3456 7890',
      company: 'Tech Corp',
      jobTitle: 'Data Analyst',
      bio: 'Passionate about data analysis and automation',
      avatar: ''
    },
    preferences: {
      language: 'id',
      timezone: 'Asia/Jakarta',
      theme: 'system',
      dateFormat: 'DD/MM/YYYY',
      currency: 'IDR'
    },
    notifications: {
      email: true,
      push: true,
      marketing: false,
      security: true,
      updates: true,
      weeklyReport: true
    },
    privacy: {
      profileVisibility: 'private',
      dataSharing: false,
      analytics: true,
      cookies: true
    },
    api: {
      keys: [
        {
          id: 'key-1',
          name: 'Production API',
          key: 'sk-1234567890abcdef1234567890abcdef',
          permissions: ['read', 'write'],
          createdAt: '2024-01-15T10:30:00Z',
          lastUsed: '2024-01-20T14:20:00Z',
          isActive: true
        },
        {
          id: 'key-2',
          name: 'Development API',
          key: 'sk-abcdef1234567890abcdef1234567890',
          permissions: ['read'],
          createdAt: '2024-01-10T09:15:00Z',
          lastUsed: '2024-01-19T11:30:00Z',
          isActive: true
        }
      ],
      webhooks: [
        {
          id: 'webhook-1',
          name: 'Analysis Complete',
          url: 'https://api.example.com/webhooks/analysis',
          events: ['analysis.completed', 'analysis.failed'],
          isActive: true,
          createdAt: '2024-01-12T16:45:00Z'
        }
      ]
    }
  });

  // Helper functions
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

  const maskApiKey = (key: string) => {
    return `${key.substring(0, 8)}...${key.substring(key.length - 8)}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Disalin ke clipboard');
    } catch (error) {
      toast.error('Gagal menyalin ke clipboard');
    }
  };

  // Event handlers
  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profil berhasil disimpan');
    } catch (error) {
      toast.error('Gagal menyimpan profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Preferensi berhasil disimpan');
    } catch (error) {
      toast.error('Gagal menyimpan preferensi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Pengaturan notifikasi berhasil disimpan');
    } catch (error) {
      toast.error('Gagal menyimpan pengaturan notifikasi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePrivacy = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Pengaturan privasi berhasil disimpan');
    } catch (error) {
      toast.error('Gagal menyimpan pengaturan privasi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateApiKey = async () => {
    if (!newApiKeyName.trim()) {
      toast.error('Mohon masukkan nama API key');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newKey: APIKey = {
        id: `key-${Date.now()}`,
        name: newApiKeyName,
        key: `sk-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        permissions: ['read'],
        createdAt: new Date().toISOString(),
        isActive: true
      };
      
      setSettings(prev => ({
        ...prev,
        api: {
          ...prev.api,
          keys: [...prev.api.keys, newKey]
        }
      }));
      
      setNewApiKeyName('');
      toast.success('API key berhasil dibuat');
    } catch (error) {
      toast.error('Gagal membuat API key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSettings(prev => ({
        ...prev,
        api: {
          ...prev.api,
          keys: prev.api.keys.filter(key => key.id !== keyId)
        }
      }));
      
      toast.success('API key berhasil dihapus');
    } catch (error) {
      toast.error('Gagal menghapus API key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleApiKey = async (keyId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSettings(prev => ({
        ...prev,
        api: {
          ...prev.api,
          keys: prev.api.keys.map(key => 
            key.id === keyId ? { ...key, isActive: !key.isActive } : key
          )
        }
      }));
      
      toast.success('Status API key berhasil diubah');
    } catch (error) {
      toast.error('Gagal mengubah status API key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Data berhasil diekspor. Link download akan dikirim ke email Anda.');
    } catch (error) {
      toast.error('Gagal mengekspor data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Permintaan penghapusan akun telah diproses');
    } catch (error) {
      toast.error('Gagal memproses penghapusan akun');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan</h1>
          <p className="text-gray-600 mt-2">
            Kelola akun, preferensi, dan konfigurasi aplikasi Anda
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Preferensi
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifikasi
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privasi
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API & Integrasi
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informasi Profil
              </CardTitle>
              <CardDescription>
                Kelola informasi dasar profil Anda
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {settings.profile.firstName.charAt(0)}{settings.profile.lastName.charAt(0)}
                  </div>
                  <Button 
                    size="sm" 
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {settings.profile.firstName} {settings.profile.lastName}
                  </h3>
                  <p className="text-gray-600">{settings.profile.email}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Ubah Avatar
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nama Depan</Label>
                  <Input
                    id="firstName"
                    value={settings.profile.firstName}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, firstName: e.target.value }
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nama Belakang</Label>
                  <Input
                    id="lastName"
                    value={settings.profile.lastName}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, lastName: e.target.value }
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, email: e.target.value }
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    value={settings.profile.phone}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, phone: e.target.value }
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Perusahaan</Label>
                  <Input
                    id="company"
                    value={settings.profile.company}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, company: e.target.value }
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Jabatan</Label>
                  <Input
                    id="jobTitle"
                    value={settings.profile.jobTitle}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, jobTitle: e.target.value }
                    }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Ceritakan sedikit tentang diri Anda..."
                  value={settings.profile.bio}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    profile: { ...prev.profile, bio: e.target.value }
                  }))}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={isLoading}>
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Simpan Perubahan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Preferensi Aplikasi
              </CardTitle>
              <CardDescription>
                Sesuaikan tampilan dan perilaku aplikasi
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <Label>Tema</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Terang', icon: Sun },
                    { value: 'dark', label: 'Gelap', icon: Moon },
                    { value: 'system', label: 'Sistem', icon: Monitor }
                  ].map(({ value, label, icon: Icon }) => (
                    <Button
                      key={value}
                      variant={settings.preferences.theme === value ? 'default' : 'outline'}
                      className="h-auto p-4 flex flex-col gap-2"
                      onClick={() => setSettings(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, theme: value as any }
                      }))}
                    >
                      <Icon className="h-6 w-6" />
                      <span>{label}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              {/* Other Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Bahasa</Label>
                  <Select 
                    value={settings.preferences.language} 
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, language: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">Bahasa Indonesia</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona Waktu</Label>
                  <Select 
                    value={settings.preferences.timezone} 
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, timezone: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Jakarta">WIB (UTC+7)</SelectItem>
                      <SelectItem value="Asia/Makassar">WITA (UTC+8)</SelectItem>
                      <SelectItem value="Asia/Jayapura">WIT (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Format Tanggal</Label>
                  <Select 
                    value={settings.preferences.dateFormat} 
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, dateFormat: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Mata Uang</Label>
                  <Select 
                    value={settings.preferences.currency} 
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, currency: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDR">IDR (Rupiah)</SelectItem>
                      <SelectItem value="USD">USD (Dollar)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSavePreferences} disabled={isLoading}>
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Simpan Preferensi
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Pengaturan Notifikasi
              </CardTitle>
              <CardDescription>
                Pilih jenis notifikasi yang ingin Anda terima
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {[
                {
                  key: 'email' as keyof typeof settings.notifications,
                  title: 'Notifikasi Email',
                  description: 'Terima notifikasi melalui email'
                },
                {
                  key: 'push' as keyof typeof settings.notifications,
                  title: 'Notifikasi Push',
                  description: 'Terima notifikasi push di browser'
                },
                {
                  key: 'marketing' as keyof typeof settings.notifications,
                  title: 'Email Marketing',
                  description: 'Terima email tentang fitur baru dan promosi'
                },
                {
                  key: 'security' as keyof typeof settings.notifications,
                  title: 'Notifikasi Keamanan',
                  description: 'Terima notifikasi tentang aktivitas keamanan'
                },
                {
                  key: 'updates' as keyof typeof settings.notifications,
                  title: 'Update Produk',
                  description: 'Terima notifikasi tentang update dan fitur baru'
                },
                {
                  key: 'weeklyReport' as keyof typeof settings.notifications,
                  title: 'Laporan Mingguan',
                  description: 'Terima ringkasan aktivitas mingguan'
                }
              ].map(({ key, title, description }) => (
                <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                  
                  <Switch
                    checked={settings.notifications[key]}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, [key]: checked }
                    }))}
                  />
                </div>
              ))}
              
              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications} disabled={isLoading}>
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Simpan Pengaturan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Pengaturan Privasi
              </CardTitle>
              <CardDescription>
                Kontrol bagaimana data Anda digunakan dan dibagikan
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Profile Visibility */}
              <div className="space-y-3">
                <Label>Visibilitas Profil</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'public', label: 'Publik', description: 'Profil dapat dilihat semua orang' },
                    { value: 'private', label: 'Privat', description: 'Profil hanya dapat dilihat Anda' }
                  ].map(({ value, label, description }) => (
                    <Button
                      key={value}
                      variant={settings.privacy.profileVisibility === value ? 'default' : 'outline'}
                      className="h-auto p-4 flex flex-col gap-1 text-left"
                      onClick={() => setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, profileVisibility: value as any }
                      }))}
                    >
                      <span className="font-medium">{label}</span>
                      <span className="text-xs opacity-70">{description}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              {/* Privacy Toggles */}
              {[
                {
                  key: 'dataSharing' as keyof typeof settings.privacy,
                  title: 'Berbagi Data',
                  description: 'Izinkan berbagi data anonim untuk meningkatkan layanan'
                },
                {
                  key: 'analytics' as keyof typeof settings.privacy,
                  title: 'Analytics',
                  description: 'Izinkan pengumpulan data analytics untuk meningkatkan pengalaman'
                },
                {
                  key: 'cookies' as keyof typeof settings.privacy,
                  title: 'Cookies',
                  description: 'Izinkan penggunaan cookies untuk personalisasi'
                }
              ].map(({ key, title, description }) => (
                <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                  
                  <Switch
                    checked={settings.privacy[key] as boolean}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, [key]: checked }
                    }))}
                  />
                </div>
              ))}
              
              <Separator />
              
              {/* Data Management */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Manajemen Data</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col gap-2"
                    onClick={handleExportData}
                    disabled={isLoading}
                  >
                    <Download className="h-6 w-6" />
                    <span className="font-medium">Ekspor Data</span>
                    <span className="text-xs text-gray-600">Download semua data Anda</span>
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="h-auto p-4 flex flex-col gap-2 border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-6 w-6" />
                        <span className="font-medium">Hapus Akun</span>
                        <span className="text-xs">Hapus akun secara permanen</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          Hapus Akun
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Tindakan ini tidak dapat dibatalkan. Semua data Anda akan dihapus secara permanen.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDeleteAccount}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Ya, Hapus Akun
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSavePrivacy} disabled={isLoading}>
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Simpan Pengaturan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API & Integration Tab */}
        <TabsContent value="api" className="space-y-6">
          {/* API Keys */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
              <CardDescription>
                Kelola API keys untuk mengakses layanan SpreadsheetAI
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Create New API Key */}
              <div className="flex gap-3">
                <Input
                  placeholder="Nama API key (contoh: Production API)"
                  value={newApiKeyName}
                  onChange={(e) => setNewApiKeyName(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleCreateApiKey} disabled={isLoading}>
                  Buat API Key
                </Button>
              </div>
              
              <Separator />
              
              {/* API Keys List */}
              <div className="space-y-4">
                {settings.api.keys.map((apiKey) => (
                  <div key={apiKey.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{apiKey.name}</h3>
                          <Badge variant={apiKey.isActive ? 'default' : 'secondary'}>
                            {apiKey.isActive ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                            {showApiKey[apiKey.id] ? apiKey.key : maskApiKey(apiKey.key)}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowApiKey(prev => ({
                              ...prev,
                              [apiKey.id]: !prev[apiKey.id]
                            }))}
                          >
                            {showApiKey[apiKey.id] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(apiKey.key)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Permissions: {apiKey.permissions.join(', ')}</span>
                          <span>Created: {formatRelativeTime(apiKey.createdAt)}</span>
                          {apiKey.lastUsed && (
                            <span>Last used: {formatRelativeTime(apiKey.lastUsed)}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={apiKey.isActive}
                          onCheckedChange={() => handleToggleApiKey(apiKey.id)}
                          disabled={isLoading}
                        />
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus API Key</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus API key "{apiKey.name}"? 
                                Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteApiKey(apiKey.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
                
                {settings.api.keys.length === 0 && (
                  <div className="text-center py-8">
                    <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Belum ada API key</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Buat API key pertama Anda untuk mulai menggunakan layanan
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Webhooks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Webhooks
              </CardTitle>
              <CardDescription>
                Konfigurasi webhook untuk menerima notifikasi real-time
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Webhook Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Nama webhook"
                  value={newWebhookData.name}
                  onChange={(e) => setNewWebhookData(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="URL webhook"
                  value={newWebhookData.url}
                  onChange={(e) => setNewWebhookData(prev => ({ ...prev, url: e.target.value }))}
                />
              </div>
              
              <Button className="w-full md:w-auto">
                Tambah Webhook
              </Button>
              
              <Separator />
              
              {/* Webhooks List */}
              <div className="space-y-4">
                {settings.api.webhooks.map((webhook) => (
                  <div key={webhook.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{webhook.name}</h3>
                          <Badge variant={webhook.isActive ? 'default' : 'secondary'}>
                            {webhook.isActive ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{webhook.url}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Events: {webhook.events.join(', ')}</span>
                          <span>Created: {formatRelativeTime(webhook.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={webhook.isActive}
                          onCheckedChange={() => {}}
                        />
                        
                        <Button size="sm" variant="ghost" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {settings.api.webhooks.length === 0 && (
                  <div className="text-center py-8">
                    <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Belum ada webhook</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Tambahkan webhook untuk menerima notifikasi real-time
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}