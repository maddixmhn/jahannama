import { useEffect, useState } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import Navigation from '@/components/Navigation';
import AuthModal from '@/components/AuthModal';
import Dashboard from '@/components/Dashboard';
import Hero from '@/sections/Hero';
import Services from '@/sections/Services';
import Statistics from '@/sections/Statistics';
import Process from '@/sections/Process';
import SignalStrip from '@/sections/SignalStrip';
import Testimonials from '@/sections/Testimonials';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';
import './App.css';

export type Locale = 'fa' | 'en';

function App() {
  const [locale, setLocale] = useState<Locale>('fa');
  const [isDark, setIsDark] = useState(false);
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
      <div className="min-h-screen bg-white">
        <Navigation 
          onAuthClick={openAuthModal} 
          onDashboardClick={openDashboard}
          locale={locale}
          onLocaleChange={setLocale}
          isDark={isDark}
          onLogoClick={() => setIsDark((prev) => !prev)}
        />

        <main>
          <Hero onCtaClick={openAuthModal} locale={locale} />
          <Services locale={locale} />
          <Statistics locale={locale} />
          <Process locale={locale} />
          <SignalStrip locale={locale} />
          <Testimonials locale={locale} />
          <CTA onCtaClick={openAuthModal} locale={locale} />
        </main>

        <Footer locale={locale} />

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={closeAuthModal} 
        />

        {isDashboardOpen && (
          <Dashboard onClose={closeDashboard} />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
