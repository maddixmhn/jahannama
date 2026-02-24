import { useRef, useEffect, useState } from 'react';
import { MessageSquare, ClipboardCheck, FileText, Send, Trophy } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { ProcessStep } from '@/types';

const steps: ProcessStep[] = [
  {
    id: 1,
    icon: 'message',
    title: 'مشاوره اولیه',
    description: 'ارزیابی رایگان پرونده شما توسط مشاوران متخصص ما برای درک موقعیت منحصر به فردتان.',
  },
  {
    id: 2,
    icon: 'clipboard',
    title: 'ارزیابی پرونده',
    description: 'تحلیل جامع مدارک و شرایط شما برای تعیین بهترین رویکرد ممکن.',
  },
  {
    id: 3,
    icon: 'file',
    title: 'تهیه درخواست',
    description: 'تکمیل دقیق و جامع تمام مدارک مورد نیاز با نظارت کارشناسان.',
  },
  {
    id: 4,
    icon: 'send',
    title: 'ارسال و پیگیری',
    description: 'ارسال به موقع و نظارت مداوم بر وضعیت درخواست شما.',
  },
  {
    id: 5,
    icon: 'trophy',
    title: 'موفقیت و حمایت',
    description: 'جشن موفقیت شما و ارائه حمایت مداوم برای آغاز جدید.',
  },
];

const iconMap: Record<string, React.ElementType> = {
  message: MessageSquare,
  clipboard: ClipboardCheck,
  file: FileText,
  send: Send,
  trophy: Trophy,
};

export default function Process() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
  const pathRef = useRef<SVGPathElement>(null);
  const [pathProgress, setPathProgress] = useState(0);

  useEffect(() => {
    if (stepsVisible && pathRef.current) {
      const length = pathRef.current.getTotalLength();
      pathRef.current.style.strokeDasharray = `${length}`;
      pathRef.current.style.strokeDashoffset = `${length * (1 - pathProgress)}`;
    }
  }, [pathProgress, stepsVisible]);

  useEffect(() => {
    if (stepsVisible) {
      const timer = setTimeout(() => {
        setPathProgress(1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stepsVisible]);

  return (
    <section id="process" className="section-padding bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-light/20 to-white" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div 
          ref={titleRef}
          className={`text-center mb-20 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            روند کار
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-navy mb-4">
            مسیر شما با ما
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            فرآیندی ساده و شفاف طراحی شده برای موفقیت شما
          </p>
        </div>

        {/* Timeline */}
        <div ref={stepsRef} className="relative">
          {/* SVG Path */}
          <svg
            className="absolute left-1/2 top-0 h-full w-4 -translate-x-1/2 hidden lg:block"
            style={{ height: '100%', overflow: 'visible' }}
          >
            <path
              ref={pathRef}
              d="M 8 0 L 8 100%"
              stroke="url(#gradient)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              className="transition-all duration-[2000ms] ease-out"
              style={{
                strokeDasharray: 1000,
                strokeDashoffset: stepsVisible ? 0 : 1000,
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1B8BFF" />
                <stop offset="100%" stopColor="#0A6DD6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Steps */}
          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => {
              const Icon = iconMap[step.icon];
              const isEven = index % 2 === 0;

              return (
                <div
                  key={step.id}
                  className={`relative lg:grid lg:grid-cols-2 lg:gap-16 transition-all duration-700 ${
                    stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  {/* Content */}
                  <div
                    className={`${
                      isEven ? 'lg:col-start-1 lg:text-right' : 'lg:col-start-2 lg:text-right'
                    }`}
                  >
                    <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className="text-sm text-primary font-medium">
                            مرحله {String(step.id).padStart(2, '0')}
                          </span>
                          <h3 className="text-xl font-bold text-navy">{step.title}</h3>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>

                  {/* Center Node */}
                  <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div 
                      className={`w-8 h-8 bg-primary rounded-full border-4 border-white shadow-lg transition-all duration-500 ${
                        stepsVisible ? 'scale-100' : 'scale-0'
                      }`}
                      style={{ transitionDelay: `${index * 200 + 300}ms` }}
                    />
                  </div>

                  {/* Empty Space for Alternating Layout */}
                  <div className={isEven ? 'lg:col-start-2' : 'lg:col-start-1 lg:row-start-1'} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Timeline Line */}
        <div className="lg:hidden absolute right-8 top-40 bottom-20 w-1 bg-gradient-to-b from-primary to-primary-dark rounded-full" />
      </div>
    </section>
  );
}
