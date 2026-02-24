import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
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
}

const navLinks = [
  { href: '#home', label: 'صفحه اصلی' },
  { href: '#services', label: 'خدمات' },
  { href: '#process', label: 'روند کار' },
  { href: '#testimonials', label: 'نظرات' },
  { href: '#contact', label: 'تماس' },
];

export default function Navigation({ onAuthClick, onDashboardClick }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            className={`flex items-center gap-2 transition-all duration-300 ${
              isScrolled ? 'scale-90' : 'scale-100'
            }`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className={`font-display font-bold text-xl ${isScrolled ? 'text-navy' : 'text-navy'}`}>
              Panahyar
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`animated-underline text-sm font-medium transition-colors ${
                  isScrolled ? 'text-gray-700 hover:text-primary' : 'text-gray-700 hover:text-primary'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
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
                    <User className="w-4 h-4 ml-2" />
                    پنل کاربری
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-error">
                    <LogOut className="w-4 h-4 ml-2" />
                    خروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={onAuthClick}
                  className="text-gray-700 hover:text-primary hover:bg-primary/10"
                >
                  ورود
                </Button>
                <Button
                  onClick={onAuthClick}
                  className="btn-primary"
                >
                  مشاوره رایگان
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ${
            isMobileMenuOpen ? 'max-h-96 mt-4' : 'max-h-0'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
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
                    className="w-full px-4 py-3 rounded-xl text-right hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    پنل کاربری
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 rounded-xl text-right text-error hover:bg-error/10 transition-colors"
                  >
                    خروج
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
                  ورود / ثبت نام
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
