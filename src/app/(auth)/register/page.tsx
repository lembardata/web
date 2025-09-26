'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Building, 
  Sparkles, 
  ArrowLeft, 
  AlertCircle,
  Check,
  Crown,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';

const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Nama depan wajib diisi')
    .min(2, 'Nama depan minimal 2 karakter'),
  lastName: z
    .string()
    .min(1, 'Nama belakang wajib diisi')
    .min(2, 'Nama belakang minimal 2 karakter'),
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(1, 'Password wajib diisi')
    .min(8, 'Password minimal 8 karakter')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password harus mengandung huruf besar, huruf kecil, dan angka'),
  confirmPassword: z
    .string()
    .min(1, 'Konfirmasi password wajib diisi'),
  company: z
    .string()
    .optional(),
  jobTitle: z
    .string()
    .optional(),
  plan: z
    .enum(['starter', 'professional', 'enterprise'])
    .default('starter'),
  agreeToTerms: z
    .boolean()
    .refine(val => val === true, 'Anda harus menyetujui syarat dan ketentuan'),
  subscribeNewsletter: z
    .boolean()
    .default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password dan konfirmasi password tidak cocok',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Gratis',
    icon: User,
    features: ['10 AI queries/bulan', '5 spreadsheet uploads', 'Basic analytics'],
    popular: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 'Rp 299.000/bulan',
    icon: Crown,
    features: ['500 AI queries/bulan', 'Unlimited uploads', 'Advanced analytics', 'Priority support'],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    icon: Building,
    features: ['Unlimited queries', 'Custom AI models', 'Dedicated support', 'On-premise'],
    popular: false,
  },
];

const jobTitles = [
  'Data Analyst',
  'Business Analyst',
  'Financial Analyst',
  'Marketing Manager',
  'Operations Manager',
  'CEO/Founder',
  'CTO/CIO',
  'Product Manager',
  'Consultant',
  'Researcher',
  'Student',
  'Other',
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('starter');
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      company: '',
      jobTitle: '',
      plan: (searchParams.get('plan') as any) || 'starter',
      agreeToTerms: false,
      subscribeNewsletter: true,
    },
  });

  const watchedFields = watch(['agreeToTerms', 'subscribeNewsletter', 'plan']);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        jobTitle: data.jobTitle,
        plan: data.plan,
        subscribeNewsletter: data.subscribeNewsletter,
        isRegister: 'true',
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error === 'CredentialsSignin' 
          ? 'Email sudah terdaftar atau data tidak valid' 
          : 'Registrasi gagal. Silakan coba lagi.');
        return;
      }

      toast.success('Registrasi berhasil! Selamat datang di SpreadsheetAI.');
      
      // Redirect based on selected plan
      if (data.plan === 'professional') {
        router.push('/dashboard?welcome=true&trial=true');
      } else if (data.plan === 'enterprise') {
        router.push('/contact?type=enterprise');
      } else {
        router.push('/dashboard?welcome=true');
      }
    } catch (error: any) {
      toast.error('Registrasi gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);
    
    try {
      const result = await signIn('google', {
        callbackUrl: selectedPlan === 'professional' 
          ? '/dashboard?welcome=true&trial=true'
          : selectedPlan === 'enterprise'
          ? '/contact?type=enterprise'
          : '/dashboard?welcome=true',
        redirect: false,
      });

      if (result?.error) {
        toast.error('Google register gagal. Silakan coba lagi.');
        return;
      }

      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      toast.error('Google register gagal. Silakan coba lagi.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setValue('plan', planId as any);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back to Home */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">SpreadsheetAI</span>
          </Link>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Buat Akun Baru</CardTitle>
            <CardDescription>
              Bergabunglah dengan ribuan profesional yang menggunakan AI untuk analisis data
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Plan Selection */}
            <div className="mb-8">
              <Label className="text-base font-medium mb-4 block">Pilih Paket</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => {
                  const Icon = plan.icon;
                  const isSelected = selectedPlan === plan.id;
                  
                  return (
                    <div
                      key={plan.id}
                      onClick={() => handlePlanSelect(plan.id)}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {plan.popular && (
                        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
                          Popular
                        </Badge>
                      )}
                      
                      <div className="text-center">
                        <Icon className={`w-8 h-8 mx-auto mb-2 ${
                          isSelected ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <h3 className="font-semibold text-sm">{plan.name}</h3>
                        <p className="text-xs text-gray-600 mb-2">{plan.price}</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <Check className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nama Depan *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      className="pl-10"
                      {...register('firstName')}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Nama Belakang *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      className="pl-10"
                      {...register('lastName')}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    className="pl-10"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 karakter"
                      className="pl-10 pr-10"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Ulangi password"
                      className="pl-10 pr-10"
                      {...register('confirmPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Company & Job Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Perusahaan</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="company"
                      type="text"
                      placeholder="Nama perusahaan"
                      className="pl-10"
                      {...register('company')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Posisi/Jabatan</Label>
                  <Select onValueChange={(value) => setValue('jobTitle', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih posisi" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTitles.map((title) => (
                        <SelectItem key={title} value={title}>
                          {title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Terms and Newsletter */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={watchedFields[0]}
                    onCheckedChange={(checked) => setValue('agreeToTerms', !!checked)}
                    className="mt-1"
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm text-gray-600 leading-relaxed">
                    Saya menyetujui{' '}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-800 underline">
                      Syarat dan Ketentuan
                    </Link>
                    {' '}serta{' '}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                      Kebijakan Privasi
                    </Link>
                    {' '}SpreadsheetAI *
                  </Label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.agreeToTerms.message}
                  </p>
                )}

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="subscribeNewsletter"
                    checked={watchedFields[1]}
                    onCheckedChange={(checked) => setValue('subscribeNewsletter', !!checked)}
                    className="mt-1"
                  />
                  <Label htmlFor="subscribeNewsletter" className="text-sm text-gray-600">
                    Saya ingin menerima newsletter dan update produk terbaru
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Memproses...' : 'Buat Akun'}
                {!isLoading && <Zap className="ml-2 h-4 w-4" />}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-2 text-sm text-gray-500">atau</span>
              </div>
            </div>

            {/* Google Register */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleRegister}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <div className="w-4 h-4 mr-2 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              {isGoogleLoading ? 'Memproses...' : 'Daftar dengan Google'}
            </Button>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Sudah punya akun?{' '}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Masuk di sini
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}