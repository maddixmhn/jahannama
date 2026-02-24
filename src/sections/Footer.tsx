import { useState } from 'react';
import { 
  Send, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const footerLinks = {
  services: [
    { label: 'مشاوره پناهندگی', href: '#services' },
    { label: 'مدارک سفر', href: '#services' },
    { label: 'حمایت حقوقی', href: '#services' },
    { label: 'خدمات اسکان', href: '#services' },
  ],
  company: [
    { label: 'درباره ما', href: '#' },
    { label: 'تیم ما', href: '#' },
    { label: 'فرصت‌های شغلی', href: '#' },
    { label: 'تماس با ما', href: '#contact' },
  ],
  resources: [
    { label: 'وبلاگ', href: '#' },
    { label: 'سوالات متداول', href: '#' },
    { label: 'مطالعات موردی', href: '#' },
    { label: 'نظرات', href: '#testimonials' },
  ],
  legal: [
    { label: 'حریم خصوصی', href: '#' },
    { label: 'شرایط استفاده', href: '#' },
    { label: 'سیاست کوکی', href: '#' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-navy-dark text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
            {/* Brand Column */}
            <div 
              className={`lg:col-span-4 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <span className="font-bold text-lg">P</span>
                </div>
                <span className="font-display font-bold text-xl">Panahyar</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                شریک مورد اعتماد شما در آغازهای نو. با سال‌ها تجربه، همراه شما در مسیر امنیت و موفقیت.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>تهران، خیابان ولیعصر، برج میلاد</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>info@panahyar.com</span>
                </div>
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-8">
              {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
                <div 
                  key={category}
                  className={`transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${(categoryIndex + 1) * 100}ms` }}
                >
                  <h4 className="font-bold mb-4 capitalize">
                    {category === 'services' ? 'خدمات' :
                     category === 'company' ? 'شرکت' :
                     category === 'resources' ? 'منابع' : 'قانونی'}
                  </h4>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link.label}>
                        <a 
                          href={link.href}
                          className="text-gray-400 hover:text-primary transition-colors text-sm"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Newsletter Column */}
            <div 
              className={`lg:col-span-3 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              <h4 className="font-bold mb-4">خبرنامه</h4>
              <p className="text-gray-400 text-sm mb-4">
                برای دریافت آخرین اخبار و تخفیف‌ها مشترک شوید.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="ایمیل خود را وارد کنید"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 pr-4 pl-12"
                  />
                  <Button 
                    type="submit"
                    size="icon"
                    className="absolute left-1 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-dark"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                {isSubscribed && (
                  <p className="text-success text-sm animate-fade-in">
                    با موفقیت ثبت شد!
                  </p>
                )}
              </form>

              {/* Social Links */}
              <div className="mt-6">
                <p className="text-sm text-gray-400 mb-3">ما را دنبال کنید:</p>
                <div className="flex items-center gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all hover:scale-110"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © 2024 Panahyar. تمام حقوق محفوظ است.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              حریم خصوصی
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              شرایط استفاده
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              کوکی‌ها
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
