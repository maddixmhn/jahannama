import { useEffect, useRef, type ElementType } from 'react';
import { Code, Users, Headphones, Clock, Award, Box } from 'lucide-react';
import { useScrollReveal, useCountUp } from '@/hooks/useScrollReveal';
import type { Locale } from '@/App';

interface StatisticsProps {
  locale: Locale;
}

const content = {
  fa: {
    badge: 'آمار قالب',
    title: 'آمار و ویژگی‌های قالب',
    subtitle: 'یک قالب کامل با تمام آنچه نیاز دارید.',
    stats: [
      { id: '1', value: 60, suffix: '+', label: 'کامپوننت', icon: Box },
      { id: '2', value: 100, suffix: '%', label: 'TypeScript', icon: Code },
      { id: '3', value: 50, suffix: '+', label: 'فایل منبع', icon: Users },
      { id: '4', value: 24, suffix: '/7', label: 'پشتیبانی', icon: Clock },
      { id: '5', value: 3, suffix: '', label: 'تم رنگی', icon: Award },
      { id: '6', value: 2, suffix: '', label: 'زبان', icon: Headphones },
    ],
  },
  en: {
    badge: 'Template Stats',
    title: 'Template statistics & features',
    subtitle: 'A complete template with everything you need.',
    stats: [
      { id: '1', value: 60, suffix: '+', label: 'Components', icon: Box },
      { id: '2', value: 100, suffix: '%', label: 'TypeScript', icon: Code },
      { id: '3', value: 50, suffix: '+', label: 'Source files', icon: Users },
      { id: '4', value: 24, suffix: '/7', label: 'Support', icon: Clock },
      { id: '5', value: 3, suffix: '', label: 'Color themes', icon: Award },
      { id: '6', value: 2, suffix: '', label: 'Languages', icon: Headphones },
    ],
  },
};

function StatCard({
  value,
  suffix,
  label,
  icon: Icon,
  delay,
  isVisible,
}: {
  value: number;
  suffix: string;
  label: string;
  icon: ElementType;
  delay: number;
  isVisible: boolean;
}) {
  const { count, startAnimation, isAnimating } = useCountUp(value, 2000);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (isVisible && !hasStarted.current) {
      hasStarted.current = true;
      const timer = setTimeout(() => {
        startAnimation();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, delay, startAnimation]);

  return (
    <div
      className={`text-center transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <div className="text-4xl sm:text-5xl font-display font-bold text-white mb-2">
        {isAnimating || count > 0 ? count : 0}
        <span className="text-primary">{suffix}</span>
      </div>
      <p className="text-gray-400">{label}</p>
    </div>
  );
}

export default function Statistics({ locale }: StatisticsProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.3 });
  const t = content[locale];

  return (
    <section className="relative py-24 bg-navy-dark overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-navy via-navy-dark to-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4">
            {t.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            {t.title}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {t.stats.map((stat, index) => (
            <StatCard
              key={stat.id}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              icon={stat.icon}
              delay={index * 100}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}