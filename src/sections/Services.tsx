import {
  Shield,
  FileCheck,
  Scale,
  Home,
  Users,
  Phone,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/App';

interface ServicesProps {
  locale: Locale;
}

const content = {
  fa: {
    badge: 'خدمات ما',
    title: 'راه حل های جامع برای مسیر شما',
    subtitle: 'از مشاوره تا اجرای پرونده، در هر مرحله کنار شما هستیم.',
    more: 'اطلاعات بیشتر',
    ctaText: 'نیاز به راهنمایی دارید؟ با ما تماس بگیرید',
    ctaBtn: 'مشاوره رایگان',
    items: [
      {
        icon: 'shield',
        title: 'مشاوره پناهندگی',
        description: 'راهنمای تخصصی در تمام مراحل درخواست پناهندگی.',
        features: ['ارزیابی پرونده', 'آماده سازی مدارک', 'آمادگی مصاحبه'],
      },
      {
        icon: 'passport',
        title: 'مدارک سفر',
        description: 'بررسی و آماده سازی مدارک مورد نیاز برای سفر.',
        features: ['درخواست ویزا', 'ترجمه رسمی', 'تاییدیه قانونی'],
      },
      {
        icon: 'scale',
        title: 'حمایت حقوقی',
        description: 'پشتیبانی حقوقی برای پرونده های مهاجرتی.',
        features: ['مشاوره حقوقی', 'تنظیم لایحه', 'پیگیری تجدیدنظر'],
      },
      {
        icon: 'home',
        title: 'اسکان اولیه',
        description: 'کمک برای یافتن مسکن و شروع زندگی در کشور مقصد.',
        features: ['یافتن مسکن', 'راهنمای اجتماعی', 'معرفی خدمات شهری'],
      },
      {
        icon: 'users',
        title: 'پیوستن خانواده',
        description: 'برنامه ریزی و پیگیری پرونده های الحاق خانواده.',
        features: ['درخواست اسپانسر', 'تهیه مستندات', 'پیگیری پرونده'],
      },
      {
        icon: 'phone',
        title: 'پشتیبانی اضطراری',
        description: 'پاسخ سریع در شرایط بحرانی و زمان های حساس.',
        features: ['پاسخ 24 ساعته', 'مشاوره فوری', 'ارتباط مستقیم'],
      },
    ],
  },
  en: {
    badge: 'Our Services',
    title: 'Comprehensive support for your journey',
    subtitle: 'From strategy to submission, we guide every step of your case.',
    more: 'Learn more',
    ctaText: 'Need a tailored plan? Let us help',
    ctaBtn: 'Book Free Consultation',
    items: [
      {
        icon: 'shield',
        title: 'Asylum Guidance',
        description: 'Specialized support across all asylum application stages.',
        features: ['Case assessment', 'Document prep', 'Interview coaching'],
      },
      {
        icon: 'passport',
        title: 'Travel Documents',
        description: 'Preparation and validation of required travel paperwork.',
        features: ['Visa filing', 'Certified translation', 'Legal attestation'],
      },
      {
        icon: 'scale',
        title: 'Legal Support',
        description: 'Professional legal representation for immigration matters.',
        features: ['Legal advice', 'Case strategy', 'Appeal management'],
      },
      {
        icon: 'home',
        title: 'Settlement Support',
        description: 'Help with housing and first steps after relocation.',
        features: ['Housing search', 'Community onboarding', 'Local services'],
      },
      {
        icon: 'users',
        title: 'Family Reunification',
        description: 'Structured process for reconnecting with family members.',
        features: ['Sponsorship', 'Document package', 'Case follow-up'],
      },
      {
        icon: 'phone',
        title: 'Emergency Help',
        description: 'Rapid response for urgent immigration situations.',
        features: ['24/7 hotline', 'Crisis handling', 'Fast coordination'],
      },
    ],
  },
};

const iconMap: Record<string, React.ElementType> = {
  shield: Shield,
  passport: FileCheck,
  scale: Scale,
  home: Home,
  users: Users,
  phone: Phone,
};

export default function Services({ locale }: ServicesProps) {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollReveal<HTMLDivElement>();
  const t = content[locale];

  return (
    <section id="services" className="section-padding bg-gradient-to-b from-white to-primary-light/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            {t.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-navy mb-4">
            {t.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.items.map((service, index) => {
            const Icon = iconMap[service.icon];
            return (
              <Card
                key={service.title}
                className={`group card-3d card-hover bg-white/80 backdrop-blur-sm border-0 shadow-card transition-all duration-700 ${
                  cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-5 text-sm leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-2 mb-5">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-success flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant="ghost"
                    className="p-0 h-auto text-primary hover:text-primary-dark hover:bg-transparent group/btn"
                  >
                    <span className="text-sm font-medium">{t.more}</span>
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover/btn:-translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div
          className={`text-center mt-12 transition-all duration-700 delay-500 ${
            cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-gray-600 mb-4">{t.ctaText}</p>
          <Button className="btn-primary">
            {t.ctaBtn}
            <ArrowLeft className="w-5 h-5 mr-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
