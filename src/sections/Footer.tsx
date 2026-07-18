import { useState, type FormEvent } from 'react';
import { Send, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import type { Locale } from '@/App';

interface FooterProps {
  locale: Locale;
}

const content = {
  fa: {
    about: 'یک قالب React مدرن، متن‌باز و حرفه‌ای با تم دارک.',
    features: 'ویژگی‌ها',
    company: 'شرکت',
    resources: 'منابع',
    legal: 'قانونی',
    featuresLinks: ['طراحی ریسپانسیو', 'پشتیبانی RTL/LTR', 'تم دارک/لایت', 'انیمیشن GSAP'],
    companyLinks: ['درباره پروژه', 'مشارکت', 'مستندات', 'تماس'],
    resourceLinks: ['گیت‌هاب', 'سایت رسمی', 'قالب‌های بیشتر', 'وبلاگ'],
    legalLinks: ['حریم خصوصی', 'شرایط استفاده', 'مجوز MIT'],
    newsletter: 'خبرنامه',
    subscribeText: 'برای دریافت آخرین به‌روزرسانی‌ها عضو شوید.',
    emailPlaceholder: 'ایمیل خود را وارد کنید',
    success: 'با موفقیت ثبت شد',
    follow: 'ما را دنبال کنید',
    copyright: '© 2026 WebStruct Dark. تحت مجوز MIT.',
  },
  en: {
    about: 'A modern, open-source, professional React template with dark theme.',
    features: 'Features',
    company: 'Company',
    resources: 'Resources',
    legal: 'Legal',
    featuresLinks: ['Responsive Design', 'RTL/LTR Support', 'Dark/Light Mode', 'GSAP Animation'],
    companyLinks: ['About Project', 'Contribute', 'Documentation', 'Contact'],
    resourceLinks: ['GitHub', 'Official Site', 'More Templates', 'Blog'],
    legalLinks: ['Privacy', 'Terms', 'MIT License'],
    newsletter: 'Newsletter',
    subscribeText: 'Subscribe to get the latest updates.',
    emailPlaceholder: 'Enter your email',
    success: 'Subscribed successfully',
    follow: 'Follow us',
    copyright: '© 2026 WebStruct Dark. Licensed under MIT.',
  },
};

const socialLinks = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: '#', label: 'Email' },
];

export default function Footer({ locale }: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const t = content[locale];

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-navy-dark text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
            <div
              className={`lg:col-span-4 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <span className="font-bold text-lg">W</span>
                </div>
                <span className="font-display font-bold text-xl">WebStruct Dark</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">{t.about}</p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-8">
              <div>
                <h4 className="font-bold mb-4">{t.features}</h4>
                <ul className="space-y-3">
                  {t.featuresLinks.map((item) => <li key={item}><a href="#features" className="text-gray-400 hover:text-primary transition-colors text-sm">{item}</a></li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">{t.company}</h4>
                <ul className="space-y-3">
                  {t.companyLinks.map((item) => <li key={item}><a href="#contact" className="text-gray-400 hover:text-primary transition-colors text-sm">{item}</a></li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">{t.resources}</h4>
                <ul className="space-y-3">
                  {t.resourceLinks.map((item) => <li key={item}><a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">{item}</a></li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">{t.legal}</h4>
                <ul className="space-y-3">
                  {t.legalLinks.map((item) => <li key={item}><a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">{item}</a></li>)}
                </ul>
              </div>
            </div>

            <div
              className={`lg:col-span-3 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h4 className="font-bold mb-4">{t.newsletter}</h4>
              <p className="text-gray-400 text-sm mb-4">{t.subscribeText}</p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder={t.emailPlaceholder}
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
                {isSubscribed && <p className="text-success text-sm animate-fade-in">{t.success}</p>}
              </form>

              <div className="mt-6">
                <p className="text-sm text-gray-400 mb-3">{t.follow}</p>
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
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">{t.copyright}</p>
          <div className="flex items-center gap-6">
            {t.legalLinks.map((item) => (
              <a key={item} href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}