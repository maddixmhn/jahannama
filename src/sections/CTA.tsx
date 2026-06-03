import { ArrowLeft, Phone } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/App';

interface CTAProps {
  onCtaClick: () => void;
  locale: Locale;
}

const content = {
  fa: {
    title: 'آماده شروع مسیر جدید هستید؟',
    subtitle: 'همین امروز مشاوره رایگان بگیرید و با یک برنامه روشن جلو بروید.',
    cta: 'مشاوره رایگان',
    contactLabel: 'یا تماس مستقیم:',
  },
  en: {
    title: 'Ready to start your next chapter?',
    subtitle: 'Book a free consultation today and move forward with a clear plan.',
    cta: 'Get Free Consultation',
    contactLabel: 'Or call us directly:',
  },
};

export default function CTA({ onCtaClick, locale }: CTAProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const t = content[locale];

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark"
          style={{ clipPath: 'polygon(0 0, 70% 0, 55% 100%, 0 100%)' }}
        />
        <div
          className="absolute inset-0 bg-white"
          style={{ clipPath: 'polygon(70% 0, 100% 0, 100% 100%, 55% 100%)' }}
        />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div
            className={`text-navy transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
              {t.title}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 mb-8 max-w-lg">
              {t.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={onCtaClick}
                className="btn-primary text-lg px-8 py-4"
              >
                {t.cta}
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-3 text-gray-700 dark:text-gray-200">
              <Phone className="w-5 h-5" />
              <span>{t.contactLabel}</span>
              <a
                href="tel:+16692476782"
                className="font-medium text-primary hover:underline number-ltr"
              >
                +16692476782
              </a>
            </div>
          </div>

          <div
            className={`hidden lg:block transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/hero-bg.jpg"
                  alt="Team"
                  className="w-full h-[400px] object-cover"
                />
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-navy">500+</p>
                    <p className="text-sm text-gray-500">
                      {locale === 'fa' ? 'پرونده موفق' : 'Successful Cases'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
