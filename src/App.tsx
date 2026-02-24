import { useState } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import Navigation from '@/components/Navigation';
import AuthModal from '@/components/AuthModal';
import Dashboard from '@/components/Dashboard';
import Hero from '@/sections/Hero';
import Services from '@/sections/Services';
import Statistics from '@/sections/Statistics';
import Process from '@/sections/Process';
import Testimonials from '@/sections/Testimonials';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';
import './App.css';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  
  const openDashboard = () => setIsDashboardOpen(true);
  const closeDashboard = () => setIsDashboardOpen(false);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <Navigation 
          onAuthClick={openAuthModal} 
          onDashboardClick={openDashboard}
        />

        {/* Main Content */}
        <main>
          <Hero onCtaClick={openAuthModal} />
          <Services />
          <Statistics />
          <Process />
          <Testimonials />
          <CTA onCtaClick={openAuthModal} />
        </main>

        {/* Footer */}
        <Footer />

        {/* Auth Modal */}
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={closeAuthModal} 
        />

        {/* Dashboard */}
        {isDashboardOpen && (
          <Dashboard onClose={closeDashboard} />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
