'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Box } from '@mui/material';
import ModernNavbar from '@/components/navigation/ModernNavbar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <LoadingSpinner fullScreen message="Loading your dashboard..." />;
  }

  return (
    <Box className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ModernNavbar />
      
      <main className="py-8">
        <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </Box>
      </main>
      
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-secondary-200 to-primary-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
    </Box>
  );
}