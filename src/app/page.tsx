"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Brain,
  Zap,
  BarChart3,
  Shield,
  Users,
  Star,
  Check,
  TrendingUp,
  Database,
  Sparkles,
  Globe,
  Award,
  Play,
  MessageSquare,
  Rocket,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Analisis data spreadsheet dengan kecerdasan buatan canggih untuk insight yang mendalam.",
    color: "text-blue-600",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Proses data dalam hitungan detik, tidak perlu menunggu lama untuk hasil analisis.",
    color: "text-yellow-600",
  },
  {
    icon: BarChart3,
    title: "Smart Visualization",
    description:
      "Visualisasi data otomatis dengan chart dan grafik yang mudah dipahami.",
    color: "text-green-600",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Data Anda aman dengan enkripsi end-to-end dan privacy yang terjamin.",
    color: "text-purple-600",
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description:
      "Mendukung berbagai bahasa termasuk Bahasa Indonesia untuk kemudahan penggunaan.",
    color: "text-indigo-600",
  },
  {
    icon: Rocket,
    title: "Easy Integration",
    description:
      "Integrasi mudah dengan tools favorit Anda melalui API yang powerful.",
    color: "text-red-600",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Gratis",
    period: "",
    description: "Sempurna untuk individual dan proyek kecil",
    features: [
      "10 AI queries per bulan",
      "5 spreadsheet uploads",
      "Basic analytics",
      "Email support",
      "Export ke PDF/Excel",
    ],
    popular: false,
    cta: "Mulai Gratis",
    href: "/register",
  },
  {
    name: "Professional",
    price: "Rp 299.000",
    period: "/bulan",
    description: "Ideal untuk bisnis dan tim kecil",
    features: [
      "500 AI queries per bulan",
      "Unlimited spreadsheet uploads",
      "Advanced analytics & insights",
      "Priority support",
      "Custom visualizations",
      "API access",
      "Team collaboration",
    ],
    popular: true,
    cta: "Mulai Trial 14 Hari",
    href: "/register?plan=professional",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Untuk organisasi besar dengan kebutuhan khusus",
    features: [
      "Unlimited AI queries",
      "Unlimited storage",
      "Custom AI models",
      "Dedicated support",
      "On-premise deployment",
      "Advanced security",
      "Custom integrations",
      "SLA guarantee",
    ],
    popular: false,
    cta: "Hubungi Sales",
    href: "/contact",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Data Analyst",
    company: "TechCorp Indonesia",
    content:
      "SpreadsheetAI mengubah cara kami menganalisis data. Yang biasanya butuh berhari-hari, sekarang selesai dalam hitungan menit!",
    rating: 5,
    avatar:
      "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20woman%20data%20analyst%20headshot%20photo%20realistic&image_size=square",
  },
  {
    name: "Ahmad Rizki",
    role: "Business Owner",
    company: "Rizki Trading",
    content:
      "Sebagai pemilik bisnis, saya butuh insight cepat dari data penjualan. SpreadsheetAI memberikan analisis yang akurat dan mudah dipahami.",
    rating: 5,
    avatar:
      "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20indonesian%20businessman%20headshot%20photo%20realistic&image_size=square",
  },
  {
    name: "Dr. Maya Sari",
    role: "Research Director",
    company: "University Research Lab",
    content:
      "Tool yang luar biasa untuk penelitian. AI-nya mampu menemukan pola dalam data yang tidak pernah kami sadari sebelumnya.",
    rating: 5,
    avatar:
      "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20female%20researcher%20scientist%20headshot%20photo%20realistic&image_size=square",
  },
];

const stats = [
  { label: "Active Users", value: "50,000+", icon: Users },
  { label: "Data Processed", value: "10M+", icon: Database },
  { label: "AI Queries", value: "2M+", icon: Brain },
  { label: "Success Rate", value: "99.9%", icon: Award },
];

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(
        "Terima kasih! Kami akan mengirimkan update terbaru ke email Anda.",
      );
      setEmail("");
    } catch (error) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                SpreadsheetAI
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Testimonials
              </a>
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Login
              </Link>
              <Link href="/register">
                <Button>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="md:hidden">
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
              <Sparkles className="w-3 h-3 mr-1" />
              Powered by Advanced AI
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Analisis Spreadsheet dengan
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Kecerdasan Buatan
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Ubah data spreadsheet Anda menjadi insight yang actionable dengan
              AI canggih. Analisis otomatis, visualisasi smart, dan rekomendasi
              bisnis dalam hitungan detik.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  <Play className="mr-2 h-5 w-5" />
                  Coba Gratis Sekarang
                </Button>
              </Link>

              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <MessageSquare className="mr-2 h-5 w-5" />
                Lihat Demo
              </Button>
            </div>

            {/* Hero Image/Demo */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="ml-4 text-sm text-gray-600">
                      SpreadsheetAI Dashboard
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <img
                    src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20dashboard%20interface%20with%20charts%20graphs%20data%20analytics%20clean%20design%20blue%20purple%20gradient&image_size=landscape_16_9"
                    alt="SpreadsheetAI Dashboard"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fitur Unggulan SpreadsheetAI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dilengkapi dengan teknologi AI terdepan untuk memberikan
              pengalaman analisis data terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4`}
                    >
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cara Kerja SpreadsheetAI
            </h2>
            <p className="text-xl text-gray-600">
              Tiga langkah sederhana untuk mendapatkan insight dari data Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                1. Upload Spreadsheet
              </h3>
              <p className="text-gray-600">
                Upload file Excel atau CSV Anda dengan mudah melalui drag & drop
                atau file picker
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. AI Analysis</h3>
              <p className="text-gray-600">
                AI kami menganalisis data Anda dan memberikan insight, tren, dan
                rekomendasi otomatis
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Get Insights</h3>
              <p className="text-gray-600">
                Dapatkan visualisasi yang mudah dipahami dan actionable insights
                untuk bisnis Anda
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pilih Paket yang Tepat
            </h2>
            <p className="text-xl text-gray-600">
              Mulai gratis, upgrade kapan saja sesuai kebutuhan bisnis Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.popular ? "ring-2 ring-blue-500 shadow-lg" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.href}>
                    <Button
                      className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Apa Kata Pengguna Kami
            </h2>
            <p className="text-xl text-gray-600">
              Ribuan profesional telah mempercayai SpreadsheetAI untuk analisis
              data mereka
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  <p className="text-gray-600 mb-6 italic">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Siap Mengubah Cara Anda Menganalisis Data?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Bergabunglah dengan ribuan profesional yang sudah merasakan kekuatan
            AI untuk analisis spreadsheet
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Mulai Gratis Hari Ini
              </Button>
            </Link>

            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600 bg-transparent "
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Hubungi Sales
            </Button>
          </div>

          <p className="text-blue-100 text-sm">
            Tidak perlu kartu kredit • Setup dalam 2 menit • Cancel kapan saja
          </p>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Dapatkan Tips & Update Terbaru
          </h3>
          <p className="text-gray-600 mb-8">
            Subscribe newsletter kami untuk mendapatkan tips analisis data dan
            update fitur terbaru
          </p>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">SpreadsheetAI</span>
              </div>
              <p className="text-gray-400 mb-4">
                Platform analisis spreadsheet dengan AI terdepan untuk bisnis
                modern.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Twitter
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="/documentation"
                    className="hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="/api" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
                    className="hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/careers"
                    className="hover:text-white transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/support"
                    className="hover:text-white transition-colors"
                  >
                    Support
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SpreadsheetAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
