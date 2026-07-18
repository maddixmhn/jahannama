import { useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';
import Dashboard from '@/components/Dashboard';
import LandingPage from '@/sections/LandingPage';
import ParallaxBackground from '@/components/ParallaxBackground';
import './App.css';

export type Locale = 'fa' | 'en';

function App() {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem('webstruct-locale');
    return saved === 'en' ? 'en' : 'fa';
  });
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('webstruct-theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  
  const openDashboard = () => setIsDashboardOpen(true);
  const closeDashboard = () => setIsDashboardOpen(false);
  const goHomeFromDashboard = () => {
    setIsDashboardOpen(false);
    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'fa' ? 'rtl' : 'ltr';
    localStorage.setItem('webstruct-locale', locale);
  }, [locale]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('webstruct-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <HelmetProvider>
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground transition-colors relative">
          {/* Fixed Parallax Background */}
          <ParallaxBackground isDark={isDark} />
          
          {/* Main Content */}
          <div className="relative z-10">
            <LandingPage
              locale={locale}
              onLocaleChange={setLocale}
              isDark={isDark}
              onToggleDark={() => setIsDark((prev) => !prev)}
              onAuthClick={openAuthModal}
              onDashboardClick={openDashboard}
            />
          </div>

          {/* Auth Modal */}
          <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={closeAuthModal} 
          />

          {/* Dashboard */}
          {isDashboardOpen && (
            <Dashboard onClose={closeDashboard} onHomeClick={goHomeFromDashboard} />
          )}

          {/* Toast Notifications */}
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: isDark ? '#1e293b' : '#ffffff',
                color: isDark ? '#f1f5f9' : '#0f172a',
                border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              },
            }}
          />
        </div>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
