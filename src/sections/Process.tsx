import { MessageSquare, ClipboardCheck, FileText, Send, Trophy } from 'lucide-react';
import type { ElementType } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { Locale } from '@/App';

interface ProcessProps {
  locale: Locale;
}

const content = {
  fa: {
    badge: 'روند کار',
    title: 'مسیر همکاری شما با ما',
    subtitle: 'شفاف، مرحله به مرحله و قابل پیگیری',
    step: 'مرحله',
    items: [
      { icon: 'message', title: 'مشاوره اولیه', description: 'بررسی رایگان شرایط و تعیین مسیر مناسب.' },
      { icon: 'clipboard', title: 'ارزیابی پرونده', description: 'تحلیل کامل مدارک و انتخاب استراتژی اقدام.' },
      { icon: 'file', title: 'آماده سازی مدارک', description: 'تنظیم و تکمیل پرونده با استانداردهای حقوقی.' },
      { icon: 'send', title: 'ارسال و پیگیری', description: 'ثبت پرونده و پیگیری وضعیت تا نتیجه نهایی.' },
      { icon: 'trophy', title: 'موفقیت و همراهی', description: 'پس از نتیجه نیز برای شروع جدید کنار شما هستیم.' },
    ],
  },
  en: {
    badge: 'Our Process',
    title: 'How we work with you',
    subtitle: 'Transparent, structured, and trackable',
    step: 'Step',
    items: [
      { icon: 'message', title: 'Initial Consultation', description: 'Free eligibility review and goal alignment.' },
      { icon: 'clipboard', title: 'Case Evaluation', description: 'Deep assessment of your profile and documents.' },
      { icon: 'file', title: 'Document Preparation', description: 'Complete filing package assembled with precision.' },
      { icon: 'send', title: 'Submission & Follow-up', description: 'Formal submission and continuous status monitoring.' },
      { icon: 'trophy', title: 'Outcome & Support', description: 'Post-approval support for your next life stage.' },
    ],
  },
};

const iconMap: Record<string, ElementType> = {
  message: MessageSquare,
  clipboard: ClipboardCheck,
  file: FileText,
  send: Send,
  trophy: Trophy,
};

export default function Process({ locale }: ProcessProps) {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
  const t = content[locale];

  return (
    <section id="process" className="section-padding bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-light/20 to-white" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div
          ref={titleRef}
          className={`text-center mb-20 transition-all duration-700 ${
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

        <div ref={stepsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.items.map((step, index) => {
            const Icon = iconMap[step.icon];
            return (
              <div
                key={step.title}
                className={`bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-700 border border-primary/5 ${
                  stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-sm text-primary font-medium">
                      {t.step} {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-xl font-bold text-navy">{step.title}</h3>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
