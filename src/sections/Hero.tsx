import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Clock, Users, Globe, Shield, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  onCtaClick: () => void;
}

const floatingCards = [
  { icon: Clock, label: 'پردازش سریع', delay: '0s' },
  { icon: Users, label: 'تیم متخصص', delay: '0.5s' },
  { icon: Globe, label: 'شبکه جهانی', delay: '1s' },
];

const stats = [
  { value: '500+', label: 'مورد موفق' },
  { value: '98%', label: 'رضایت مشتری' },
  { value: '24/7', label: 'پشتیبانی' },
];

export default function Hero({ onCtaClick }: HeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

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
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary-light via-white to-white"
    >
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div 
          className="absolute top-1/2 -left-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-float-slow"
          style={{ transform: `translateY(${scrollY * -0.15}px)`, animationDelay: '2s' }}
        />
        <div 
          className="absolute bottom-20 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float"
          style={{ transform: `translateY(${scrollY * 0.08}px)`, animationDelay: '1s' }}
        />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#1B8BFF 1px, transparent 1px), linear-gradient(90deg, #1B8BFF 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="text-center lg:text-right order-2 lg:order-1">
            {/* Badge */}
            <div 
              className={`inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">مورد اعتماد هزاران نفر</span>
            </div>

            {/* Headline */}
            <h1 
              className={`text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-navy leading-tight mb-6 transition-all duration-700 delay-100 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              سفر شما به سوی
              <span className="block gradient-text mt-2">آغازی نو</span>
              اینجا شروع می‌شود
            </h1>

            {/* Subheadline */}
            <p 
              className={`text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 transition-all duration-700 delay-200 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              راهنمای متخصص برای متقاضیان پناهندگی و مسافران. مشاوره حرفه‌ای برای کمک به شما در مسیر امنیت و فرصت‌های جدید.
            </p>

            {/* CTA Buttons */}
            <div 
              className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10 transition-all duration-700 delay-300 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <Button 
                onClick={onCtaClick}
                className="btn-primary text-lg px-8 py-4 animate-scale-pulse"
              >
                مشاوره رایگان
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
              <Button 
                variant="outline"
                className="btn-outline text-lg px-8 py-4"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                مشاهده خدمات
              </Button>
            </div>

            {/* Stats */}
            <div 
              className={`flex flex-wrap justify-center lg:justify-start gap-8 transition-all duration-700 delay-400 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-right">
                  <p className="text-2xl font-bold text-navy">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative order-1 lg:order-2">
            {/* Main Image */}
            <div 
              className={`relative transition-all duration-1000 delay-200 ${
                isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
              }`}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
                  alt="Beautiful mountain landscape"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
              </div>

              {/* Floating Cards */}
              {floatingCards.map((card, index) => (
                <div
                  key={index}
                  className={`absolute glass rounded-2xl p-4 shadow-xl floating transition-all duration-700 ${
                    isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                  }`}
                  style={{
                    animationDelay: card.delay,
                    [index === 0 ? 'top' : index === 1 ? 'bottom' : 'top']: index === 2 ? '1/2' : '-20px',
                    [index === 0 ? 'right' : index === 1 ? 'left' : 'left']: index === 2 ? '-20px' : '-30px',
                    transform: index === 2 ? 'translateY(-50%)' : undefined,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <card.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium text-sm whitespace-nowrap">{card.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400">
        <span className="text-sm">اسکرول کنید</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </div>
    </section>
  );
}
