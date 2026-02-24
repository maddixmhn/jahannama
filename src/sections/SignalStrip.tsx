import type { Locale } from '@/App';

interface SignalStripProps {
  locale: Locale;
}

const content = {
  fa: {
    title: 'نمای زنده مسیر مهاجرت',
    items: [
      'تحلیل پرونده در 48 ساعت',
      'نقشه اقدام شخصی سازی شده',
      'پیگیری مرحله ای پرونده',
      'پشتیبانی انسانی 24/7',
      'گزارش شفاف پیشرفت',
      'راهنمای کامل مدارک',
    ],
  },
  en: {
    title: 'Live Journey Signal',
    items: [
      '48-hour case review',
      'Personalized action roadmap',
      'Milestone-based follow-up',
      'Human support 24/7',
      'Transparent progress reports',
      'Complete document guidance',
    ],
  },
};

export default function SignalStrip({ locale }: SignalStripProps) {
  const t = content[locale];
  const loopItems = [...t.items, ...t.items];

  return (
    <section className="py-8 bg-white dark:bg-slate-950 border-y border-primary/10 dark:border-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary dark:text-secondary">
          {t.title}
        </p>
      </div>
      <div className="signal-marquee">
        <div className="signal-track">
          {loopItems.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="inline-flex items-center gap-2 px-4 py-2 mx-2 rounded-full bg-primary/10 dark:bg-slate-800 text-navy dark:text-gray-100 text-sm whitespace-nowrap"
            >
              <span className="h-2 w-2 rounded-full bg-secondary" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
