"use client";

import {
  Calendar,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Shield,
  Trash2,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  environment: "live" | "test";
  created_at: string;
  last_used?: string;
  permissions: string[];
  status: "active" | "revoked";
}

// Mock data untuk development
const mockApiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Production API",
    key: "api_live_1234567890abcdef1234567890abcdef",
    environment: "live",
    created_at: "2024-01-15T10:30:00Z",
    last_used: "2024-01-20T14:22:00Z",
    permissions: ["read", "write", "delete"],
    status: "active",
  },
  {
    id: "2",
    name: "Development API",
    key: "api_test_abcdef1234567890abcdef1234567890",
    environment: "test",
    created_at: "2024-01-10T09:15:00Z",
    last_used: "2024-01-19T16:45:00Z",
    permissions: ["read", "write"],
    status: "active",
  },
  {
    id: "3",
    name: "Backup API",
    key: "api_live_fedcba0987654321fedcba0987654321",
    environment: "live",
    created_at: "2024-01-05T11:20:00Z",
    permissions: ["read"],
    status: "revoked",
  },
];

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyEnvironment, setNewKeyEnvironment] = useState<"live" | "test">(
    "test",
  );
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    "read",
  ]);

  // Uncomment when API is ready
  // const { data: apiKeysData, isLoading } = useApiKeys.getAll()
  // const createApiKeyMutation = useApiKeys.create()
  // const revokeApiKeyMutation = useApiKeys.revoke()

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("API key berhasil disalin ke clipboard");
    } catch (err) {
      console.log(err);
      toast.error("Gagal menyalin API key");
    }
  };

  const handleCreateApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error("Nama API key harus diisi");
      return;
    }

    // Mock implementation
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `api_${newKeyEnvironment}_${Math.random().toString(36).substring(2, 34)}`,
      environment: newKeyEnvironment,
      created_at: new Date().toISOString(),
      permissions: selectedPermissions,
      status: "active",
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
    setSelectedPermissions(["read"]);
    toast.success("API key berhasil dibuat");

    // Uncomment when API is ready
    // try {
    //   await createApiKeyMutation.mutateAsync({
    //     name: newKeyName,
    //     environment: newKeyEnvironment,
    //     permissions: selectedPermissions
    //   })
    //   toast.success('API key berhasil dibuat')
    //   setNewKeyName('')
    //   setSelectedPermissions(['read'])
    // } catch (error) {
    //   toast.error('Gagal membuat API key')
    // }
  };

  const handleRevokeApiKey = async (keyId: string) => {
    // Mock implementation
    setApiKeys(
      apiKeys.map((key) =>
        key.id === keyId ? { ...key, status: "revoked" as const } : key,
      ),
    );
    toast.success("API key berhasil dicabut");

    // Uncomment when API is ready
    // try {
    //   await revokeApiKeyMutation.mutateAsync(keyId)
    //   toast.success('API key berhasil dicabut')
    // } catch (error) {
    //   toast.error('Gagal mencabut API key')
    // }
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

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return `${key.substring(0, 8)}${"*".repeat(key.length - 12)}${key.substring(key.length - 4)}`;
  };

  const availablePermissions = [
    { value: "read", label: "Read", description: "Membaca data" },
    { value: "write", label: "Write", description: "Menulis data" },
    { value: "delete", label: "Delete", description: "Menghapus data" },
  ];

  const activeKeys = apiKeys.filter((key) => key.status === "active");
  const revokedKeys = apiKeys.filter((key) => key.status === "revoked");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">API Keys</h1>
          <p className="text-muted-foreground mt-2">
            Kelola API keys untuk mengakses layanan ExcelAI
          </p>
        </div>
      </div>

      {/* Create New API Key */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Buat API Key Baru
          </CardTitle>
          <CardDescription>
            Buat API key baru untuk mengakses layanan ExcelAI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="keyName">Nama API Key</Label>
              <Input
                id="keyName"
                placeholder="Masukkan nama API key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="environment">Environment</Label>
              <select
                id="environment"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newKeyEnvironment}
                onChange={(e) =>
                  setNewKeyEnvironment(e.target.value as "live" | "test")
                }
              >
                <option value="test">Test</option>
                <option value="live">Live</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="flex flex-wrap gap-2">
              {availablePermissions.map((permission) => (
                <div
                  key={permission.value}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    id={permission.value}
                    checked={selectedPermissions.includes(permission.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPermissions([
                          ...selectedPermissions,
                          permission.value,
                        ]);
                      } else {
                        setSelectedPermissions(
                          selectedPermissions.filter(
                            (p) => p !== permission.value,
                          ),
                        );
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <label
                    htmlFor={permission.value}
                    className="text-sm font-medium"
                  >
                    {permission.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleCreateApiKey} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Buat API Key
          </Button>
        </CardContent>
      </Card>

      {/* API Keys List */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active ({activeKeys.length})</TabsTrigger>
          <TabsTrigger value="revoked">
            Revoked ({revokedKeys.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeKeys.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Belum ada API key aktif</p>
              </CardContent>
            </Card>
          ) : (
            activeKeys.map((apiKey) => (
              <Card key={apiKey.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{apiKey.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            apiKey.environment === "live"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {apiKey.environment === "live" ? "Live" : "Test"}
                        </Badge>
                        <Badge variant="outline">
                          {apiKey.permissions.join(", ")}
                        </Badge>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cabut API Key</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin mencabut API key "
                            {apiKey.name}"? Tindakan ini tidak dapat dibatalkan
                            dan akan menghentikan semua akses menggunakan key
                            ini.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRevokeApiKey(apiKey.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Cabut API Key
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono">
                        {visibleKeys.has(apiKey.id)
                          ? apiKey.key
                          : maskApiKey(apiKey.key)}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {visibleKeys.has(apiKey.id) ? (
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
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Dibuat: {formatDate(apiKey.created_at)}
                      </div>
                      {apiKey.last_used && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Terakhir digunakan: {formatDate(apiKey.last_used)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="revoked" className="space-y-4">
          {revokedKeys.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Belum ada API key yang dicabut
                </p>
              </CardContent>
            </Card>
          ) : (
            revokedKeys.map((apiKey) => (
              <Card key={apiKey.id} className="opacity-60">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{apiKey.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            apiKey.environment === "live"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {apiKey.environment === "live" ? "Live" : "Test"}
                        </Badge>
                        <Badge variant="outline">
                          {apiKey.permissions.join(", ")}
                        </Badge>
                        <Badge variant="destructive">Revoked</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono">
                        {maskApiKey(apiKey.key)}
                      </code>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Dibuat: {formatDate(apiKey.created_at)}
                      </div>
                      {apiKey.last_used && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Terakhir digunakan: {formatDate(apiKey.last_used)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
