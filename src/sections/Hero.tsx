import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Clock, Users, Globe, Shield, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/App';

interface HeroProps {
  onCtaClick: () => void;
  locale: Locale;
}

const content = {
  fa: {
    badge: 'مورد اعتماد هزاران نفر',
    title1: 'سفر شما به سوی',
    title2: 'آغازی نو',
    title3: 'اینجا شروع می شود',
    subtitle:
      'راهنمای حرفه ای برای متقاضیان پناهندگی و مهاجرت. همراه شما از ارزیابی پرونده تا اقدام نهایی.',
    cta: 'مشاوره رایگان',
    services: 'مشاهده خدمات',
    scroll: 'اسکرول کنید',
    cards: ['پردازش سریع', 'تیم متخصص', 'شبکه جهانی'],
    stats: [
      { value: '500+', label: 'پرونده موفق' },
      { value: '98%', label: 'رضایت کاربران' },
      { value: '24/7', label: 'پشتیبانی' },
    ],
  },
  en: {
    badge: 'Trusted by thousands of clients',
    title1: 'Your path toward',
    title2: 'a new beginning',
    title3: 'starts right here',
    subtitle:
      'Professional guidance for asylum and immigration applicants, from early assessment to final submission.',
    cta: 'Free Consultation',
    services: 'Explore Services',
    scroll: 'Scroll down',
    cards: ['Fast Processing', 'Expert Team', 'Global Network'],
    stats: [
      { value: '500+', label: 'Successful cases' },
      { value: '98%', label: 'Client satisfaction' },
      { value: '24/7', label: 'Support' },
    ],
  },
};

export default function Hero({ onCtaClick, locale }: HeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const t = content[locale];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        if (rect.bottom > 0) {
          setScrollY(window.scrollY);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary-light via-white to-[#f7fafe]"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div
          className="absolute top-1/2 -left-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-float-slow"
          style={{ transform: `translateY(${scrollY * -0.15}px)`, animationDelay: '2s' }}
        />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="text-center lg:text-start order-2 lg:order-1">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t.badge}</span>
            </div>

            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-navy leading-tight mb-6 transition-all duration-700 delay-100 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {t.title1}
              <span className="block gradient-text mt-2">{t.title2}</span>
              {t.title3}
            </h1>

            <p
              className={`text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 transition-all duration-700 delay-200 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {t.subtitle}
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10 transition-all duration-700 delay-300 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <Button
                onClick={onCtaClick}
                className="btn-primary text-lg px-8 py-4 animate-scale-pulse"
              >
                {t.cta}
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
              <Button
                variant="outline"
                className="btn-outline text-lg px-8 py-4"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t.services}
              </Button>
            </div>

            <div
              className={`flex flex-wrap justify-center lg:justify-start gap-8 transition-all duration-700 delay-400 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {t.stats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-start">
                  <p className="text-2xl font-bold text-navy">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div
              className={`relative transition-all duration-1000 delay-200 ${
                isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
              }`}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/hero-bg.jpg"
                  alt="Hero"
                  className="w-full h-[400px] lg:h-[520px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/35 to-transparent" />
              </div>

              {t.cards.map((label, index) => {
                const Icon = index === 0 ? Clock : index === 1 ? Users : Globe;
                const positionClass =
                  index === 0
                    ? '-top-5 -right-6'
                    : index === 1
                      ? '-bottom-5 -left-6'
                      : 'top-1/2 -left-8 -translate-y-1/2';
                return (
                  <div
                    key={label}
                    className={`absolute ${positionClass} glass rounded-2xl p-4 shadow-xl floating transition-all duration-700 ${
                      isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                    }`}
                    style={{ animationDelay: `${index * 0.5}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium text-sm whitespace-nowrap">{label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400">
        <span className="text-sm">{t.scroll}</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </div>
    </section>
  );
}
