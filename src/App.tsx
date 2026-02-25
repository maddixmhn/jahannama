import { useEffect, useState } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { AuthProvider } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';
import Dashboard from '@/components/Dashboard';
import LandingPage from '@/sections/LandingPage';
import './App.css';

export type Locale = 'fa' | 'en';

function App() {
  const [locale, setLocale] = useState<Locale>('fa');
  const [isDark, setIsDark] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  
  const openDashboard = () => setIsDashboardOpen(true);
  const closeDashboard = () => setIsDashboardOpen(false);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'fa' ? 'rtl' : 'ltr';
  }, [locale]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
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
          <Dashboard onClose={closeDashboard} />
        )}
        
        <SpeedInsights />
      </div>
    </AuthProvider>
  );
}

export default App;
