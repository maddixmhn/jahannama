import { useEffect, useState } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';
import Dashboard from '@/components/Dashboard';
import LandingPage from '@/sections/LandingPage';
import './App.css';

export type Locale = 'fa' | 'en';

function App() {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem('pyar-locale');
    return saved === 'en' ? 'en' : 'fa';
  });
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('pyar-theme');
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
    localStorage.setItem('pyar-locale', locale);
  }, [locale]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('pyar-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors">
        <LandingPage
          locale={locale}
          onLocaleChange={setLocale}
          isDark={isDark}
          onToggleDark={() => setIsDark((prev) => !prev)}
          onAuthClick={openAuthModal}
          onDashboardClick={openDashboard}
        />

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={closeAuthModal} 
        />

        {isDashboardOpen && (
          <Dashboard onClose={closeDashboard} onHomeClick={goHomeFromDashboard} />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
