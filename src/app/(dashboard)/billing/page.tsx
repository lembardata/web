"use client";

import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Crown,
  Database,
  Download,
  FileText,
  Receipt,
  RefreshCw,
  Shield,
  Star,
  Target,
  Wallet,
  Zap,
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
  limits: {
    queries: number;
    fileSize: number;
    storage: number;
    apiCalls: number;
  };
  popular?: boolean;
  current?: boolean;
}

interface Usage {
  queries: { used: number; limit: number };
  fileSize: { used: number; limit: number };
  storage: { used: number; limit: number };
  apiCalls: { used: number; limit: number };
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  plan: string;
  period: string;
  downloadUrl?: string;
}

interface PaymentMethod {
  id: string;
  type: "card" | "bank";
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);

  // Mock current plan and usage
  const currentPlan: Plan = {
    id: "pro",
    name: "Pro",
    price: 299000,
    interval: "month",
    features: [
      "500 AI Queries per bulan",
      "File upload hingga 50MB",
      "10GB Storage",
      "Priority Support",
      "Advanced Analytics",
      "API Access",
    ],
    limits: {
      queries: 500,
      fileSize: 50,
      storage: 10240,
      apiCalls: 10000,
    },
    current: true,
  };

  const usage: Usage = {
    queries: { used: 287, limit: 500 },
    fileSize: { used: 32, limit: 50 },
    storage: { used: 6.8, limit: 10 },
    apiCalls: { used: 7234, limit: 10000 },
  };

  // Available plans
  const plans: Plan[] = [
    {
      id: "starter",
      name: "Starter",
      price: 0,
      interval: "month",
      features: [
        "50 AI Queries per bulan",
        "File upload hingga 5MB",
        "1GB Storage",
        "Email Support",
        "Basic Analytics",
      ],
      limits: {
        queries: 50,
        fileSize: 5,
        storage: 1024,
        apiCalls: 1000,
      },
    },
    {
      id: "pro",
      name: "Pro",
      price: 299000,
      interval: "month",
      features: [
        "500 AI Queries per bulan",
        "File upload hingga 50MB",
        "10GB Storage",
        "Priority Support",
        "Advanced Analytics",
        "API Access",
      ],
      limits: {
        queries: 500,
        fileSize: 50,
        storage: 10240,
        apiCalls: 10000,
      },
      popular: true,
      current: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 999000,
      interval: "month",
      features: [
        "Unlimited AI Queries",
        "File upload hingga 500MB",
        "100GB Storage",
        "24/7 Phone Support",
        "Custom Analytics",
        "Full API Access",
        "White-label Solution",
        "Dedicated Account Manager",
      ],
      limits: {
        queries: -1, // unlimited
        fileSize: 500,
        storage: 102400,
        apiCalls: -1, // unlimited
      },
    },
  ];

  // Mock invoices
  const invoices: Invoice[] = [
    {
      id: "inv-2024-001",
      date: "2024-01-01T00:00:00Z",
      amount: 299000,
      status: "paid",
      plan: "Pro Plan",
      period: "Jan 2024 - Feb 2024",
      downloadUrl: "/invoices/inv-2024-001.pdf",
    },
    {
      id: "inv-2023-012",
      date: "2023-12-01T00:00:00Z",
      amount: 299000,
      status: "paid",
      plan: "Pro Plan",
      period: "Dec 2023 - Jan 2024",
      downloadUrl: "/invoices/inv-2023-012.pdf",
    },
    {
      id: "inv-2023-011",
      date: "2023-11-01T00:00:00Z",
      amount: 299000,
      status: "paid",
      plan: "Pro Plan",
      period: "Nov 2023 - Dec 2023",
      downloadUrl: "/invoices/inv-2023-011.pdf",
    },
  ];

  // Mock payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: "pm-1",
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
    {
      id: "pm-2",
      type: "card",
      last4: "5555",
      brand: "Mastercard",
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-green-600";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleUpgradePlan = async (planId: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success(
        `Berhasil upgrade ke ${plans.find((p) => p.id === planId)?.name} Plan!`,
      );
    }, 2000);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // Simulate download
    toast.success(`Mengunduh invoice ${invoice.id}`);
  };

  const handleAddPaymentMethod = () => {
    toast.success("Redirecting to payment method setup...");
  };

  const handleCancelSubscription = () => {
    toast.success("Subscription cancellation request submitted");
  };

  return (
    <div className="container mx-auto  space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Billing & Subscription</h1>
            <p className="text-muted-foreground">
              Manage your subscription, usage, and billing information
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Invoices
          </Button>
          <Button>
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Upgrade Plan
          </Button>
        </div>
      </div>

      {/* Current Plan Overview */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-xl">
                  {currentPlan.name} Plan
                </CardTitle>
                <CardDescription>
                  {formatCurrency(currentPlan.price)}/
                  {currentPlan.interval === "month" ? "bulan" : "tahun"}
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-primary text-primary-foreground">
              Current Plan
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  AI Queries
                </span>
                <span
                  className={getUsageColor(
                    getUsagePercentage(usage.queries.used, usage.queries.limit),
                  )}
                >
                  {usage.queries.used}/
                  {usage.queries.limit === -1 ? "∞" : usage.queries.limit}
                </span>
              </div>
              <Progress
                value={getUsagePercentage(
                  usage.queries.used,
                  usage.queries.limit,
                )}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  File Size
                </span>
                <span
                  className={getUsageColor(
                    getUsagePercentage(
                      usage.fileSize.used,
                      usage.fileSize.limit,
                    ),
                  )}
                >
                  {usage.fileSize.used}/{usage.fileSize.limit}MB
                </span>
              </div>
              <Progress
                value={getUsagePercentage(
                  usage.fileSize.used,
                  usage.fileSize.limit,
                )}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Database className="h-4 w-4" />
                  Storage
                </span>
                <span
                  className={getUsageColor(
                    getUsagePercentage(
                      usage.storage.used * 1024,
                      usage.storage.limit,
                    ),
                  )}
                >
                  {usage.storage.used}/{usage.storage.limit}GB
                </span>
              </div>
              <Progress
                value={getUsagePercentage(
                  usage.storage.used * 1024,
                  usage.storage.limit,
                )}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  API Calls
                </span>
                <span
                  className={getUsageColor(
                    getUsagePercentage(
                      usage.apiCalls.used,
                      usage.apiCalls.limit,
                    ),
                  )}
                >
                  {usage.apiCalls.used}/
                  {usage.apiCalls.limit === -1 ? "∞" : usage.apiCalls.limit}
                </span>
              </div>
              <Progress
                value={getUsagePercentage(
                  usage.apiCalls.used,
                  usage.apiCalls.limit,
                )}
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Usage Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Usage Statistics
              </CardTitle>
              <CardDescription>
                Your current month usage and limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">AI Queries</h4>
                    <span className="text-sm text-muted-foreground">
                      {usage.queries.used} of {usage.queries.limit} used
                    </span>
                  </div>
                  <Progress
                    value={getUsagePercentage(
                      usage.queries.used,
                      usage.queries.limit,
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Storage</h4>
                    <span className="text-sm text-muted-foreground">
                      {usage.storage.used}GB of {usage.storage.limit}GB used
                    </span>
                  </div>
                  <Progress
                    value={getUsagePercentage(
                      usage.storage.used * 1024,
                      usage.storage.limit,
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">File Upload Size</h4>
                    <span className="text-sm text-muted-foreground">
                      Max {usage.fileSize.limit}MB per file
                    </span>
                  </div>
                  <Progress
                    value={getUsagePercentage(
                      usage.fileSize.used,
                      usage.fileSize.limit,
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">API Calls</h4>
                    <span className="text-sm text-muted-foreground">
                      {usage.apiCalls.used} of{" "}
                      {usage.apiCalls.limit === -1 ? "∞" : usage.apiCalls.limit}{" "}
                      used
                    </span>
                  </div>
                  <Progress
                    value={getUsagePercentage(
                      usage.apiCalls.used,
                      usage.apiCalls.limit,
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Billing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Next Billing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    Next billing date: February 1, 2024
                  </p>
                  <p className="text-muted-foreground">
                    Amount: {formatCurrency(currentPlan.price)}
                  </p>
                </div>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Update Billing
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${plan.popular ? "border-primary shadow-lg" : ""} ${plan.current ? "bg-muted/50" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">
                      {plan.price === 0 ? "Free" : formatCurrency(plan.price)}
                    </div>
                    {plan.price > 0 && (
                      <p className="text-muted-foreground">
                        per {plan.interval === "month" ? "bulan" : "tahun"}
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li
                        key={`${plan.id}-${index}-${feature}`}
                        className="flex items-start gap-2"
                      >
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Separator />

                  {plan.current ? (
                    <Button disabled className="w-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleUpgradePlan(plan.id)}
                      disabled={isLoading}
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {isLoading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                      )}
                      {plan.price === 0 ? "Downgrade" : "Upgrade"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Plan Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Comparison</CardTitle>
              <CardDescription>
                Compare features across all plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Feature</th>
                      {plans.map((plan) => (
                        <th key={plan.id} className="text-center p-2">
                          {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium">AI Queries</td>
                      {plans.map((plan) => (
                        <td key={plan.id} className="text-center p-2">
                          {plan.limits.queries === -1
                            ? "Unlimited"
                            : plan.limits.queries}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">File Size</td>
                      {plans.map((plan) => (
                        <td key={plan.id} className="text-center p-2">
                          {plan.limits.fileSize}MB
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Storage</td>
                      {plans.map((plan) => (
                        <td key={plan.id} className="text-center p-2">
                          {plan.limits.storage / 1024}GB
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">API Calls</td>
                      {plans.map((plan) => (
                        <td key={plan.id} className="text-center p-2">
                          {plan.limits.apiCalls === -1
                            ? "Unlimited"
                            : plan.limits.apiCalls}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Billing History
              </CardTitle>
              <CardDescription>
                Download and view your past invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(invoice.status)}
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold">{invoice.id}</h4>
                        <p className="text-sm text-muted-foreground">
                          {invoice.plan} • {invoice.period}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(invoice.amount)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(invoice.date)}
                        </p>
                      </div>

                      {invoice.status === "paid" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-6">
          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Manage your payment methods and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <CreditCard className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <h4 className="font-semibold">
                        {method.brand} •••• {method.last4}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Expires {method.expiryMonth.toString().padStart(2, "0")}
                        /{method.expiryYear}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {method.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                onClick={handleAddPaymentMethod}
                className="w-full"
                variant="outline"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>

          {/* Subscription Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Subscription Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Current Subscription</h4>
                  <p className="text-muted-foreground">
                    {currentPlan.name} Plan -{" "}
                    {formatCurrency(currentPlan.price)}/month
                  </p>
                </div>
                <Button variant="outline" onClick={() => setActiveTab("plans")}>
                  Change Plan
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Auto-renewal</h4>
                  <p className="text-muted-foreground">
                    Your subscription will automatically renew on February 1,
                    2024
                  </p>
                </div>
                <Button variant="outline">Manage</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold text-red-600">Danger Zone</h4>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Cancel Subscription</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel your subscription? You
                        will lose access to Pro features at the end of your
                        current billing period.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCancelSubscription}>
                        Cancel Subscription
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
