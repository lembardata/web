/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
"use client";

import {
  ActivitySquare,
  BarChart3,
  Building,
  Calendar,
  Camera,
  CheckCircle,
  Clock,
  Crown,
  Edit,
  ExternalLink,
  FileText,
  Flame,
  Globe,
  MapPin,
  RefreshCw,
  Save,
  Star,
  TrendingUp,
  Trophy,
  Upload,
  User,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";

// Types
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  company?: string;
  website?: string;
  location?: string;
  timezone: string;
  language: string;
  joinedAt: string;
  lastActive: string;
  isVerified: boolean;
  plan: "free" | "pro" | "enterprise";
}

interface UserStats {
  totalQueries: number;
  successfulQueries: number;
  filesUploaded: number;
  storageUsed: number;
  apiCalls: number;
  averageResponseTime: number;
  totalSavings: number;
  streak: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface ActivityProps {
  id: string;
  type: "query" | "upload" | "achievement" | "login";
  title: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Profile state
  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || "1",
    name: user?.name || "John Doe",
    email: user?.email || "john@example.com",
    bio: "Data analyst yang passionate dengan AI dan automation. Suka mengeksplorasi insights dari data dan membuat dashboard yang menarik.",
    company: "PT. Data Analytics Indonesia",
    website: "https://johndoe.com",
    location: "Jakarta, Indonesia",
    timezone: "Asia/Jakarta",
    language: "id",
    joinedAt: "2024-01-01T00:00:00Z",
    lastActive: "2024-01-15T10:30:00Z",
    isVerified: true,
    plan: "pro",
  });

  // User stats
  const [stats] = useState<UserStats>({
    totalQueries: 1234,
    successfulQueries: 1198,
    filesUploaded: 89,
    storageUsed: 2.3, // GB
    apiCalls: 15678,
    averageResponseTime: 2.4, // seconds
    totalSavings: 45.5, // hours
    streak: 12, // days
  });

  // Achievements
  const [achievements] = useState<Achievement[]>([
    {
      id: "first-query",
      title: "First Steps",
      description: "Menjalankan query AI pertama",
      icon: "star",
      unlockedAt: "2024-01-01T10:00:00Z",
      rarity: "common",
    },
    {
      id: "query-master",
      title: "Query Master",
      description: "Menjalankan 1000+ queries",
      icon: "trophy",
      unlockedAt: "2024-01-10T15:30:00Z",
      rarity: "rare",
    },
    {
      id: "data-wizard",
      title: "Data Wizard",
      description: "Upload 50+ files dalam sebulan",
      icon: "crown",
      unlockedAt: "2024-01-12T09:15:00Z",
      rarity: "epic",
    },
    {
      id: "streak-champion",
      title: "Streak Champion",
      description: "Aktif selama 30 hari berturut-turut",
      icon: "flame",
      unlockedAt: "2024-01-14T20:45:00Z",
      rarity: "legendary",
    },
  ]);

  // Recent activities
  const [activities] = useState<ActivityProps[]>([
    {
      id: "act-1",
      type: "query",
      title: "AI Query Completed",
      description: "Analyzed sales data for Q4 2023",
      timestamp: "2024-01-15T10:30:00Z",
    },
    {
      id: "act-2",
      type: "upload",
      title: "File Uploaded",
      description: "customer_data.xlsx (2.1 MB)",
      timestamp: "2024-01-15T09:15:00Z",
    },
    {
      id: "act-3",
      type: "achievement",
      title: "Achievement Unlocked",
      description: "Streak Champion - 30 days active",
      timestamp: "2024-01-14T20:45:00Z",
    },
    {
      id: "act-4",
      type: "query",
      title: "AI Query Completed",
      description: "Generated monthly report summary",
      timestamp: "2024-01-14T16:20:00Z",
    },
    {
      id: "act-5",
      type: "login",
      title: "Logged In",
      description: "From Chrome on macOS",
      timestamp: "2024-01-14T08:00:00Z",
    },
  ]);

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSuccessRate = () => {
    return ((stats.successfulQueries / stats.totalQueries) * 100).toFixed(1);
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "free":
        return "bg-gray-100 text-gray-800";
      case "pro":
        return "bg-blue-100 text-blue-800";
      case "enterprise":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800";
      case "rare":
        return "bg-blue-100 text-blue-800";
      case "epic":
        return "bg-purple-100 text-purple-800";
      case "legendary":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "query":
        return <Zap className="h-4 w-4" />;
      case "upload":
        return <Upload className="h-4 w-4" />;
      case "achievement":
        return <Trophy className="h-4 w-4" />;
      case "login":
        return <User className="h-4 w-4" />;
      default:
        return <ActivitySquare className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "query":
        return "bg-blue-100 text-blue-600";
      case "upload":
        return "bg-green-100 text-green-600";
      case "achievement":
        return "bg-yellow-100 text-yellow-600";
      case "login":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Event handlers
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsEditing(false);
      toast.success("Profil berhasil diperbarui!");
    } catch (error) {
      console.log(error)
      toast.error("Gagal memperbarui profil. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAvatar = () => {
    // Simulate file upload
    toast.success("Avatar berhasil diupload!");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <User className="h-8 w-8 text-blue-600" />
            Profile
          </h1>
          <p className="text-gray-600 mt-2">
            Kelola profil dan lihat aktivitas Anda
          </p>
        </div>

        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
        >
          <Edit className="h-4 w-4 mr-2" />
          {isEditing ? "Batal Edit" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="relative mx-auto">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-blue-600" />
                </div>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                    onClick={handleUploadAvatar}
                  >
                    <Camera className="h-3 w-3" />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <CardTitle className="text-xl">{profile.name}</CardTitle>
                  {profile.isVerified && (
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  )}
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Badge className={getPlanBadgeColor(profile.plan)}>
                    {profile.plan.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Flame className="h-3 w-3" />
                    {stats.streak} hari
                  </Badge>
                </div>

                <p className="text-gray-600 text-sm">{profile.email}</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {profile.bio && (
                <p className="text-sm text-gray-700 text-center">
                  {profile.bio}
                </p>
              )}

              <div className="space-y-2 text-sm">
                {profile.company && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span>{profile.company}</span>
                  </div>
                )}

                {profile.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{profile.location}</span>
                  </div>
                )}

                {profile.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {profile.website.replace("https://", "")}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Bergabung {formatDate(profile.joinedAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Aktif {formatDateTime(profile.lastActive)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="stats">Statistik</TabsTrigger>
              <TabsTrigger value="achievements">Pencapaian</TabsTrigger>
              <TabsTrigger value="activity">Aktivitas</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {isEditing ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>
                      Perbarui informasi profil Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nama Lengkap</Label>
                          <Input
                            id="name"
                            value={profile.name}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profile.bio || ""}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              bio: e.target.value,
                            }))
                          }
                          placeholder="Ceritakan sedikit tentang diri Anda..."
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
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
                            placeholder="Nama perusahaan"
                          />
                        </div>
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={profile.website || ""}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev,
                                website: e.target.value,
                              }))
                            }
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="location">Lokasi</Label>
                        <Input
                          id="location"
                          value={profile.location || ""}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          placeholder="Kota, Negara"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" disabled={loading}>
                          {loading ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          Simpan Perubahan
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Batal
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Quick Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Total Queries
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {stats.totalQueries.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600">
                        {getSuccessRate()}% berhasil
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Files Uploaded
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {stats.filesUploaded}
                      </div>
                      <p className="text-sm text-gray-600">
                        {stats.storageUsed} GB digunakan
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        API Calls
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">
                        {stats.apiCalls.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600">
                        Avg {stats.averageResponseTime}s response
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Time Saved
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        {stats.totalSavings}h
                      </div>
                      <p className="text-sm text-gray-600">
                        Waktu yang dihemat
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Success Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {getSuccessRate()}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {stats.successfulQueries} dari {stats.totalQueries}{" "}
                      queries
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Avg Response Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.averageResponseTime}s
                    </div>
                    <div className="text-xs text-gray-500">
                      Per query execution
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Storage Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                      {stats.storageUsed} GB
                    </div>
                    <div className="text-xs text-gray-500">
                      dari 10 GB limit
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Current Streak
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600 flex items-center gap-1">
                      <Flame className="h-6 w-6" />
                      {stats.streak}
                    </div>
                    <div className="text-xs text-gray-500">
                      Hari berturut-turut
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Total API Calls
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-indigo-600">
                      {stats.apiCalls.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Lifetime usage</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Time Saved
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-teal-600">
                      {stats.totalSavings}h
                    </div>
                    <div className="text-xs text-gray-500">
                      Estimated savings
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className="relative overflow-hidden"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            {achievement.icon === "star" && (
                              <Star className="h-5 w-5 text-yellow-600" />
                            )}
                            {achievement.icon === "trophy" && (
                              <Trophy className="h-5 w-5 text-yellow-600" />
                            )}
                            {achievement.icon === "crown" && (
                              <Crown className="h-5 w-5 text-yellow-600" />
                            )}
                            {achievement.icon === "flame" && (
                              <Flame className="h-5 w-5 text-yellow-600" />
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-base">
                              {achievement.title}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {achievement.description}
                            </CardDescription>
                          </div>
                        </div>

                        <Badge className={getRarityColor(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="text-xs text-gray-500">
                        Unlocked {formatDateTime(achievement.unlockedAt)}
                      </div>
                    </CardContent>

                    {/* Rarity glow effect */}
                    <div
                      className={`absolute inset-0 opacity-5 ${
                        achievement.rarity === "legendary"
                          ? "bg-gradient-to-r from-yellow-400 to-orange-400"
                          : achievement.rarity === "epic"
                            ? "bg-gradient-to-r from-purple-400 to-pink-400"
                            : achievement.rarity === "rare"
                              ? "bg-gradient-to-r from-blue-400 to-cyan-400"
                              : "bg-gray-200"
                      }`}
                    />
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Aktivitas Terbaru</CardTitle>
                  <CardDescription>
                    Riwayat aktivitas dan interaksi Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 border rounded-lg"
                      >
                        <div
                          className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}
                        >
                          {getActivityIcon(activity.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">
                              {activity.title}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {formatDateTime(activity.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
