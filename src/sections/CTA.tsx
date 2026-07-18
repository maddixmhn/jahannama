import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/App';

interface CTAProps {
  onCtaClick: () => void;
  locale: Locale;
}

const content = {
  fa: {
    title: 'آماده شروع هستید؟',
    subtitle: 'قالب را دانلود کنید و پروژه خود را در چند دقیقه راه‌اندازی کنید.',
    cta: 'شروع کنید',
    contactLabel: 'مستندات کامل:',
  },
  en: {
    title: 'Ready to get started?',
    subtitle: 'Download the template and launch your project in minutes.',
    cta: 'Get Started',
    contactLabel: 'Full documentation:',
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
              <ExternalLink className="w-5 h-5" />
              <span>{t.contactLabel}</span>
              <a
                href="https://github.com"
                className="font-medium text-primary hover:underline"
              >
                GitHub
              </a>
            </div>
          </div>

          <div
            className={`hidden lg:block transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-12">
                <div className="text-center">
                  <p className="text-6xl font-bold text-primary">&lt;/&gt;</p>
                  <p className="mt-4 text-xl text-slate-600">
                    {locale === 'fa' ? 'قالب React حرفه‌ای' : 'Professional React Template'}
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-navy">60+</p>
                    <p className="text-sm text-gray-500">
                      {locale === 'fa' ? 'کامپوننت آماده' : 'Ready Components'}
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