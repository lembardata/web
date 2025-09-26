import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - SpreadsheetAI',
  description: 'Login atau daftar untuk mengakses SpreadsheetAI - Platform analisis spreadsheet dengan AI',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {children}
    </div>
  );
}