"use client";

import {
  AlertTriangle,
  Bell,
  Copy,
  Download,
  Edit,
  Eye,
  EyeOff,
  Key,
  Palette,
  Plus,
  RefreshCw,
  Save,
  Shield,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";

interface APIKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string | null;
  permissions: string[];
  isActive: boolean;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  company?: string;
  phone?: string;
  timezone: string;
  language: string;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showAPIKey, setShowAPIKey] = useState<string | null>(null);
  const [newAPIKeyName, setNewAPIKeyName] = useState("");
  const [isCreatingAPIKey, setIsCreatingAPIKey] = useState(false);

  // Mock user profile data
  const [profile, setProfile] = useState<UserProfile>({
    id: "user-1",
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    company: "PT. Teknologi Maju",
    phone: "+62 812 3456 7890",
    timezone: "Asia/Jakarta",
    language: "id",
  });

  // Mock API keys data
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: "key-1",
      name: "Production API",
      key: "sk-1234567890abcdef1234567890abcdef",
      created: "2024-01-10T10:00:00Z",
      lastUsed: "2024-01-15T14:30:00Z",
      permissions: ["read", "write", "analyze"],
      isActive: true,
    },
    {
      id: "key-2",
      name: "Development API",
      key: "sk-abcdef1234567890abcdef1234567890",
      created: "2024-01-05T09:15:00Z",
      lastUsed: null,
      permissions: ["read", "analyze"],
      isActive: true,
    },
  ]);

  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      marketing: false,
      security: true,
    },
    privacy: {
      profileVisible: true,
      activityTracking: true,
      dataCollection: false,
    },
    appearance: {
      theme: "system",
      language: "id",
      timezone: "Asia/Jakarta",
    },
  });

  const handleProfileSave = () => {
    // Simulate API call
    toast.success("Profil berhasil diperbarui");
    setIsEditing(false);
  };

  const handleCreateAPIKey = async () => {
    if (!newAPIKeyName.trim()) {
      toast.error("Nama API key tidak boleh kosong");
      return;
    }

    setIsCreatingAPIKey(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newKey: APIKey = {
        id: `key-${Date.now()}`,
        name: newAPIKeyName,
        key: `sk-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        created: new Date().toISOString(),
        lastUsed: null,
        permissions: ["read", "analyze"],
        isActive: true,
      };

      setApiKeys((prev) => [...prev, newKey]);
      setNewAPIKeyName("");
      toast.success("API key berhasil dibuat");
    } catch (error) {
      console.log(error)
      toast.error("Gagal membuat API key");
    } finally {
      setIsCreatingAPIKey(false);
    }
  };

  const handleDeleteAPIKey = (keyId: string) => {
    setApiKeys((prev) => prev.filter((key) => key.id !== keyId));
    toast.success("API key berhasil dihapus");
  };

  const handleToggleAPIKey = (keyId: string) => {
    setApiKeys((prev) =>
      prev.map((key) =>
        key.id === keyId ? { ...key, isActive: !key.isActive } : key,
      ),
    );
    toast.success("Status API key berhasil diubah");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Disalin ke clipboard");
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

  const maskAPIKey = (key: string) => {
    return `${key.substring(0, 8)}...${key.substring(key.length - 8)}`;
  };

  const handleSettingChange = (
    category: string,
    setting: string,
    value: boolean | string,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }));
    toast.success("Pengaturan berhasil disimpan");
  };

  const handleExportData = () => {
    toast.success("Data berhasil diekspor");
  };

  const handleDeleteAccount = () => {
    toast.success("Permintaan penghapusan akun telah dikirim");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Pengaturan</h1>
        <p className="text-muted-foreground mt-2">
          Kelola profil, keamanan, dan preferensi akun Anda
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            Notifikasi
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Keamanan
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Preferensi
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Informasi Profil</CardTitle>
                  <CardDescription>
                    Kelola informasi profil dan kontak Anda
                  </CardDescription>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() =>
                    isEditing ? setIsEditing(false) : setIsEditing(true)
                  }
                >
                  {isEditing ? (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Batal
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, name: e.target.value }))
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, email: e.target.value }))
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Perusahaan</Label>
                  <Input
                    id="company"
                    value={profile.company || ""}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        company: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    value={profile.phone || ""}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona Waktu</Label>
                  <Select
                    value={profile.timezone}
                    onValueChange={(value) =>
                      setProfile((prev) => ({ ...prev, timezone: value }))
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Jakarta">
                        Asia/Jakarta (WIB)
                      </SelectItem>
                      <SelectItem value="Asia/Makassar">
                        Asia/Makassar (WITA)
                      </SelectItem>
                      <SelectItem value="Asia/Jayapura">
                        Asia/Jayapura (WIT)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Bahasa</Label>
                  <Select
                    value={profile.language}
                    onValueChange={(value) =>
                      setProfile((prev) => ({ ...prev, language: value }))
                    }
                    disabled={!isEditing}
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
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleProfileSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api" className="space-y-6">
          {/* Create New API Key */}
          <Card>
            <CardHeader>
              <CardTitle>Buat API Key Baru</CardTitle>
              <CardDescription>
                API key digunakan untuk mengakses SpreadsheetAI API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Nama API key (contoh: Production API)"
                  value={newAPIKeyName}
                  onChange={(e) => setNewAPIKeyName(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleCreateAPIKey}
                  disabled={isCreatingAPIKey || !newAPIKeyName.trim()}
                >
                  {isCreatingAPIKey ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  Buat Key
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* API Keys List */}
          <Card>
            <CardHeader>
              <CardTitle>API Keys Anda</CardTitle>
              <CardDescription>
                Kelola dan monitor penggunaan API keys
              </CardDescription>
            </CardHeader>
            <CardContent>
              {apiKeys.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Key className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Belum ada API key
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Buat API key pertama Anda untuk mulai menggunakan
                    SpreadsheetAI API
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <Card key={apiKey.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold">{apiKey.name}</h4>
                            <Badge
                              variant={
                                apiKey.isActive ? "default" : "secondary"
                              }
                            >
                              {apiKey.isActive ? "Aktif" : "Nonaktif"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={apiKey.isActive}
                              onCheckedChange={() =>
                                handleToggleAPIKey(apiKey.id)
                              }
                            />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Hapus API Key
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus API key "
                                    {apiKey.name}"? Tindakan ini tidak dapat
                                    dibatalkan.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteAPIKey(apiKey.id)
                                    }
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm font-medium">
                              API Key:
                            </Label>
                            <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                              {showAPIKey === apiKey.id
                                ? apiKey.key
                                : maskAPIKey(apiKey.key)}
                            </code>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setShowAPIKey(
                                  showAPIKey === apiKey.id ? null : apiKey.id,
                                )
                              }
                            >
                              {showAPIKey === apiKey.id ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(apiKey.key)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Dibuat: {formatDate(apiKey.created)}</span>
                            <span>•</span>
                            <span>
                              Terakhir digunakan:{" "}
                              {apiKey.lastUsed
                                ? formatDate(apiKey.lastUsed)
                                : "Belum pernah"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Label className="text-sm font-medium">
                              Permissions:
                            </Label>
                            {apiKey.permissions.map((permission) => (
                              <Badge
                                key={permission}
                                variant="outline"
                                className="text-xs"
                              >
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Notifikasi</CardTitle>
              <CardDescription>
                Pilih jenis notifikasi yang ingin Anda terima
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Terima notifikasi melalui email
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) =>
                      handleSettingChange("notifications", "email", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      Push Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Terima notifikasi push di browser
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) =>
                      handleSettingChange("notifications", "push", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      Marketing Emails
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Terima email tentang fitur baru dan promosi
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.marketing}
                    onCheckedChange={(checked) =>
                      handleSettingChange("notifications", "marketing", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      Security Alerts
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Terima notifikasi tentang aktivitas keamanan
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.security}
                    onCheckedChange={(checked) =>
                      handleSettingChange("notifications", "security", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Keamanan & Privasi</CardTitle>
              <CardDescription>
                Kelola pengaturan keamanan dan privasi akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      Profil Publik
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Izinkan orang lain melihat profil Anda
                    </p>
                  </div>
                  <Switch
                    checked={settings.privacy.profileVisible}
                    onCheckedChange={(checked) =>
                      handleSettingChange("privacy", "profileVisible", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      Activity Tracking
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Izinkan pelacakan aktivitas untuk analitik
                    </p>
                  </div>
                  <Switch
                    checked={settings.privacy.activityTracking}
                    onCheckedChange={(checked) =>
                      handleSettingChange(
                        "privacy",
                        "activityTracking",
                        checked,
                      )
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      Data Collection
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Izinkan pengumpulan data untuk peningkatan layanan
                    </p>
                  </div>
                  <Switch
                    checked={settings.privacy.dataCollection}
                    onCheckedChange={(checked) =>
                      handleSettingChange("privacy", "dataCollection", checked)
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Data Management</h4>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus Akun
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          Hapus Akun
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus akun? Semua data
                          Anda akan dihapus secara permanen dan tidak dapat
                          dipulihkan. Tindakan ini tidak dapat dibatalkan.
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferensi Aplikasi</CardTitle>
              <CardDescription>
                Sesuaikan tampilan dan pengalaman aplikasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Tema</Label>
                  <Select
                    value={settings.appearance.theme}
                    onValueChange={(value) =>
                      handleSettingChange("appearance", "theme", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">Bahasa</Label>
                  <Select
                    value={settings.appearance.language}
                    onValueChange={(value) =>
                      handleSettingChange("appearance", "language", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">Bahasa Indonesia</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">Zona Waktu</Label>
                  <Select
                    value={settings.appearance.timezone}
                    onValueChange={(value) =>
                      handleSettingChange("appearance", "timezone", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Jakarta">
                        Asia/Jakarta (WIB)
                      </SelectItem>
                      <SelectItem value="Asia/Makassar">
                        Asia/Makassar (WITA)
                      </SelectItem>
                      <SelectItem value="Asia/Jayapura">
                        Asia/Jayapura (WIT)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
