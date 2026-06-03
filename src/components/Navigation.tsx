import { useState, useEffect, type MouseEvent } from 'react';
import { Menu, X, User, LogOut, ChevronDown, Languages } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/App';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavigationProps {
  onAuthClick: () => void;
  onDashboardClick: () => void;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  isDark: boolean;
  onLogoClick: () => void;
}

const content = {
  fa: {
    brand: 'Panahyar',
    links: [
      { href: '#home', label: 'خانه' },
      { href: '#services', label: 'خدمات' },
      { href: '#process', label: 'فرایند' },
      { href: '#testimonials', label: 'نظرات' },
      { href: '#contact', label: 'تماس' },
    ],
    dashboard: 'پنل کاربری',
    logout: 'خروج',
    login: 'ورود',
    cta: 'مشاوره رایگان',
    mobileAuth: 'ورود / ثبت نام',
    switchAria: 'تغییر زبان',
    switchLabel: 'EN',
  },
  en: {
    brand: 'Panahyar',
    links: [
      { href: '#home', label: 'Home' },
      { href: '#services', label: 'Services' },
      { href: '#process', label: 'Process' },
      { href: '#testimonials', label: 'Stories' },
      { href: '#contact', label: 'Contact' },
    ],
    dashboard: 'Dashboard',
    logout: 'Logout',
    login: 'Sign in',
    cta: 'Free Consultation',
    mobileAuth: 'Login / Register',
    switchAria: 'Switch language',
    switchLabel: 'FA',
  },
};

export default function Navigation({
  onAuthClick,
  onDashboardClick,
  locale,
  onLocaleChange,
  isDark,
  onLogoClick,
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const t = content[locale];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onLogoClick();
    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <a
            href="#home"
            onClick={handleLogoClick}
            className={`flex items-center gap-2 transition-all duration-300 ${
              isScrolled ? 'scale-95' : 'scale-100'
            }`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-display font-bold text-xl text-navy dark:text-white">{t.brand}</span>
            <span className={`hidden sm:inline-flex h-2.5 w-2.5 rounded-full ${isDark ? 'bg-secondary' : 'bg-primary/60'}`} />
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {t.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="animated-underline text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 hover:bg-primary/10"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{user?.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={onDashboardClick}>
                    <User className="w-4 h-4 mr-2" />
                    {t.dashboard}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-error">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={onAuthClick}
                  className="text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-primary/10"
                >
                  {t.login}
                </Button>
                <Button
                  onClick={onAuthClick}
                  className="btn-primary"
                >
                  {t.cta}
                </Button>
              </>
            )}
            <Button
              variant="outline"
              onClick={() => onLocaleChange(locale === 'fa' ? 'en' : 'fa')}
              className="rounded-xl border-primary/20 dark:bg-slate-900 dark:text-gray-100 dark:border-slate-700"
              aria-label={t.switchAria}
            >
              <Languages className="w-4 h-4 mr-2" />
              {t.switchLabel}
            </Button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            )}
          </button>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ${
            isMobileMenuOpen ? 'max-h-[520px] mt-4' : 'max-h-0'
          }`}
        >
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl p-4 space-y-2">
            {t.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="border-t pt-4 mt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      onDashboardClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 rounded-xl text-start hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {t.dashboard}
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 rounded-xl text-start text-error hover:bg-error/10 transition-colors"
                  >
                    {t.logout}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onAuthClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full btn-primary"
                >
                  {t.mobileAuth}
                </button>
              )}
              <button
                onClick={() => onLocaleChange(locale === 'fa' ? 'en' : 'fa')}
                className="w-full px-4 py-3 rounded-xl border border-primary/20 text-primary hover:bg-primary/5 transition-colors"
              >
                {locale === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
