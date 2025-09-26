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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
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
  CreditCard,
  Crown,
  Star,
  Zap,
  Calendar,
  Download,
  Receipt,
  AlertTriangle,
  Check,
  X,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  Users,
  BarChart3,
  FileText,
  Headphones,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

// Types
interface Subscription {
  id: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
}

interface Usage {
  current: number;
  limit: number;
  resetDate: string;
}

interface Invoice {
  id: string;
  number: string;
  status: 'paid' | 'pending' | 'failed';
  amount: number;
  currency: string;
  date: string;
  dueDate?: string;
  description: string;
  downloadUrl?: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string;
}

interface Plan {
  id: 'free' | 'pro' | 'enterprise';
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  badge?: string;
}

export default function BillingPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data
  const [subscription] = useState<Subscription>({
    id: 'sub_1234567890',
    plan: 'pro',
    status: 'active',
    currentPeriodStart: '2024-01-01T00:00:00Z',
    currentPeriodEnd: '2024-02-01T00:00:00Z',
    cancelAtPeriodEnd: false
  });
  
  const [usage] = useState<{
    apiCalls: Usage;
    storage: Usage;
    exports: Usage;
  }>({
    apiCalls: {
      current: 8750,
      limit: 10000,
      resetDate: '2024-02-01T00:00:00Z'
    },
    storage: {
      current: 2.3,
      limit: 10,
      resetDate: '2024-02-01T00:00:00Z'
    },
    exports: {
      current: 45,
      limit: 100,
      resetDate: '2024-02-01T00:00:00Z'
    }
  });
  
  const [invoices] = useState<Invoice[]>([
    {
      id: 'inv_001',
      number: 'INV-2024-001',
      status: 'paid',
      amount: 299000,
      currency: 'IDR',
      date: '2024-01-01T00:00:00Z',
      description: 'SpreadsheetAI Pro - Januari 2024',
      downloadUrl: '#'
    },
    {
      id: 'inv_002',
      number: 'INV-2023-012',
      status: 'paid',
      amount: 299000,
      currency: 'IDR',
      date: '2023-12-01T00:00:00Z',
      description: 'SpreadsheetAI Pro - Desember 2023',
      downloadUrl: '#'
    },
    {
      id: 'inv_003',
      number: 'INV-2023-011',
      status: 'paid',
      amount: 299000,
      currency: 'IDR',
      date: '2023-11-01T00:00:00Z',
      description: 'SpreadsheetAI Pro - November 2023',
      downloadUrl: '#'
    }
  ]);
  
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm_001',
      type: 'card',
      last4: '4242',
      brand: 'visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    }
  ]);
  
  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: 'IDR',
      interval: 'month',
      description: 'Untuk penggunaan personal dan eksplorasi',
      features: [
        { name: 'API Calls per bulan', included: true, limit: '1,000' },
        { name: 'Storage', included: true, limit: '100 MB' },
        { name: 'Export per bulan', included: true, limit: '10' },
        { name: 'Email Support', included: true },
        { name: 'Basic Analytics', included: true },
        { name: 'Advanced Features', included: false },
        { name: 'Priority Support', included: false },
        { name: 'Custom Integrations', included: false }
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 299000,
      currency: 'IDR',
      interval: 'month',
      description: 'Untuk profesional dan tim kecil',
      popular: true,
      badge: 'Paling Populer',
      features: [
        { name: 'API Calls per bulan', included: true, limit: '10,000' },
        { name: 'Storage', included: true, limit: '10 GB' },
        { name: 'Export per bulan', included: true, limit: '100' },
        { name: 'Email Support', included: true },
        { name: 'Basic Analytics', included: true },
        { name: 'Advanced Features', included: true },
        { name: 'Priority Support', included: true },
        { name: 'Custom Integrations', included: false }
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 999000,
      currency: 'IDR',
      interval: 'month',
      description: 'Untuk perusahaan dan tim besar',
      badge: 'Terlengkap',
      features: [
        { name: 'API Calls per bulan', included: true, limit: 'Unlimited' },
        { name: 'Storage', included: true, limit: '100 GB' },
        { name: 'Export per bulan', included: true, limit: 'Unlimited' },
        { name: 'Email Support', included: true },
        { name: 'Basic Analytics', included: true },
        { name: 'Advanced Features', included: true },
        { name: 'Priority Support', included: true },
        { name: 'Custom Integrations', included: true }
      ]
    }
  ];
  
  // Helper functions
  const formatCurrency = (amount: number, currency: string = 'IDR') => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'canceled':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'past_due':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'trialing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'canceled': return 'Dibatalkan';
      case 'past_due': return 'Terlambat';
      case 'trialing': return 'Trial';
      case 'paid': return 'Lunas';
      case 'pending': return 'Pending';
      case 'failed': return 'Gagal';
      default: return status;
    }
  };
  
  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return Star;
      case 'pro': return Crown;
      case 'enterprise': return Sparkles;
      default: return Star;
    }
  };
  
  // Event handlers
  const handleUpgradePlan = async (planId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Berhasil upgrade ke plan ${planId}`);
    } catch (error) {
      toast.error('Gagal melakukan upgrade');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancelSubscription = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Langganan berhasil dibatalkan');
    } catch (error) {
      toast.error('Gagal membatalkan langganan');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      // Simulate download
      toast.success('Invoice berhasil didownload');
    } catch (error) {
      toast.error('Gagal mendownload invoice');
    }
  };
  
  const currentPlan = plans.find(plan => plan.id === subscription.plan);
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Langganan</h1>
          <p className="text-gray-600 mt-2">
            Kelola langganan, pembayaran, dan penggunaan Anda
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Plans
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Current Subscription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {currentPlan && (
                  <>
                    {(() => {
                      const Icon = getPlanIcon(currentPlan.id);
                      return <Icon className="h-5 w-5" />;
                    })()}
                    Langganan Saat Ini
                  </>
                )}
              </CardTitle>
              <CardDescription>
                Informasi langganan dan status pembayaran
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {currentPlan?.name}
                    </h3>
                    <Badge className={getStatusColor(subscription.status)}>
                      {getStatusText(subscription.status)}
                    </Badge>
                    {currentPlan?.popular && (
                      <Badge variant="secondary">{currentPlan.badge}</Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4">{currentPlan?.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Harga:</span>
                      <p className="font-semibold">
                        {currentPlan ? formatCurrency(currentPlan.price) : '-'}/bulan
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-gray-500">Periode Saat Ini:</span>
                      <p className="font-semibold">
                        {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-gray-500">Perpanjangan Otomatis:</span>
                      <p className="font-semibold">
                        {subscription.cancelAtPeriodEnd ? 'Nonaktif' : 'Aktif'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline">
                    Ubah Plan
                  </Button>
                  
                  {!subscription.cancelAtPeriodEnd && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="text-red-600">
                          Batalkan
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Batalkan Langganan
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Langganan akan dibatalkan pada akhir periode billing saat ini. 
                            Anda masih dapat menggunakan fitur Pro hingga {formatDate(subscription.currentPeriodEnd)}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleCancelSubscription}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Ya, Batalkan
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Usage Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  API Calls
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {usage.apiCalls.current.toLocaleString('id-ID')}
                    </span>
                    <span className="text-sm text-gray-500">
                      / {usage.apiCalls.limit.toLocaleString('id-ID')}
                    </span>
                  </div>
                  
                  <Progress 
                    value={(usage.apiCalls.current / usage.apiCalls.limit) * 100} 
                    className="h-2"
                  />
                  
                  <p className="text-xs text-gray-500">
                    Reset pada {formatDate(usage.apiCalls.resetDate)}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Storage
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {usage.storage.current} GB
                    </span>
                    <span className="text-sm text-gray-500">
                      / {usage.storage.limit} GB
                    </span>
                  </div>
                  
                  <Progress 
                    value={(usage.storage.current / usage.storage.limit) * 100} 
                    className="h-2"
                  />
                  
                  <p className="text-xs text-gray-500">
                    Reset pada {formatDate(usage.storage.resetDate)}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Exports
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {usage.exports.current}
                    </span>
                    <span className="text-sm text-gray-500">
                      / {usage.exports.limit}
                    </span>
                  </div>
                  
                  <Progress 
                    value={(usage.exports.current / usage.exports.limit) * 100} 
                    className="h-2"
                  />
                  
                  <p className="text-xs text-gray-500">
                    Reset pada {formatDate(usage.exports.resetDate)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const Icon = getPlanIcon(plan.id);
              const isCurrentPlan = plan.id === subscription.plan;
              
              return (
                <Card 
                  key={plan.id} 
                  className={`relative ${plan.popular ? 'border-blue-500 shadow-lg' : ''} ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}
                  
                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4">
                      <Badge className="bg-green-500 text-white">
                        Plan Saat Ini
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <div className={`p-3 rounded-full ${
                        plan.id === 'free' ? 'bg-gray-100' :
                        plan.id === 'pro' ? 'bg-blue-100' :
                        'bg-purple-100'
                      }`}>
                        <Icon className={`h-8 w-8 ${
                          plan.id === 'free' ? 'text-gray-600' :
                          plan.id === 'pro' ? 'text-blue-600' :
                          'text-purple-600'
                        }`} />
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    
                    <div className="text-3xl font-bold text-gray-900">
                      {formatCurrency(plan.price)}
                      <span className="text-base font-normal text-gray-500">/{plan.interval}</span>
                    </div>
                    
                    <CardDescription className="mt-2">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          )}
                          
                          <div className="flex-1">
                            <span className={feature.included ? 'text-gray-900' : 'text-gray-400'}>
                              {feature.name}
                            </span>
                            {feature.limit && (
                              <span className="text-sm text-gray-500 ml-1">
                                ({feature.limit})
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4">
                      {isCurrentPlan ? (
                        <Button className="w-full" disabled>
                          Plan Saat Ini
                        </Button>
                      ) : (
                        <Button 
                          className="w-full" 
                          variant={plan.popular ? 'default' : 'outline'}
                          onClick={() => handleUpgradePlan(plan.id)}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <ArrowRight className="h-4 w-4 mr-2" />
                          )}
                          {plan.id === 'free' ? 'Downgrade' : 'Upgrade'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Riwayat Invoice
              </CardTitle>
              <CardDescription>
                Lihat dan download invoice pembayaran Anda
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium text-gray-900">{invoice.number}</h3>
                        <Badge className={getStatusColor(invoice.status)}>
                          {getStatusText(invoice.status)}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-1">{invoice.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Tanggal: {formatDate(invoice.date)}</span>
                        <span>Jumlah: {formatCurrency(invoice.amount, invoice.currency)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {invoice.status === 'paid' && invoice.downloadUrl && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {invoices.length === 0 && (
                  <div className="text-center py-8">
                    <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Belum ada invoice</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Invoice akan muncul setelah pembayaran pertama
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Metode Pembayaran
              </CardTitle>
              <CardDescription>
                Kelola metode pembayaran untuk langganan Anda
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Payment Methods */}
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 rounded">
                        <CreditCard className="h-6 w-6 text-gray-600" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900 capitalize">
                            {method.brand} •••• {method.last4}
                          </span>
                          {method.isDefault && (
                            <Badge variant="secondary">Default</Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600">
                          Expires {method.expiryMonth?.toString().padStart(2, '0')}/{method.expiryYear}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!method.isDefault && (
                        <Button size="sm" variant="outline">
                          Set Default
                        </Button>
                      )}
                      
                      <Button size="sm" variant="outline" className="text-red-600">
                        Hapus
                      </Button>
                    </div>
                  </div>
                ))}
                
                {paymentMethods.length === 0 && (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Belum ada metode pembayaran</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Tambahkan kartu kredit atau metode pembayaran lainnya
                    </p>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <Button className="w-full md:w-auto">
                <CreditCard className="h-4 w-4 mr-2" />
                Tambah Metode Pembayaran
              </Button>
            </CardContent>
          </Card>
          
          {/* Billing Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Billing</CardTitle>
              <CardDescription>
                Informasi yang akan muncul di invoice Anda
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Nama:</span>
                  <p className="font-medium">John Doe</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500">Email:</span>
                  <p className="font-medium">john.doe@example.com</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500">Perusahaan:</span>
                  <p className="font-medium">Tech Corp</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500">Alamat:</span>
                  <p className="font-medium">Jakarta, Indonesia</p>
                </div>
              </div>
              
              <Button variant="outline">
                Edit Informasi Billing
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}