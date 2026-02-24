import { useEffect, useRef } from 'react';
import { Briefcase, Users, Headphones, Clock, Award, Globe } from 'lucide-react';
import { useScrollReveal, useCountUp } from '@/hooks/useScrollReveal';

const stats = [
  { id: '1', value: 500, suffix: '+', label: 'مورد موفق', icon: Briefcase },
  { id: '2', value: 98, suffix: '%', label: 'رضایت مشتری', icon: Users },
  { id: '3', value: 50, suffix: '+', label: 'مشاور متخصص', icon: Headphones },
  { id: '4', value: 24, suffix: '/7', label: 'پشتیبانی', icon: Clock },
  { id: '5', value: 15, suffix: '+', label: 'سال تجربه', icon: Award },
  { id: '6', value: 30, suffix: '+', label: 'کشور تحت پوشش', icon: Globe },
];

function StatCard({ 
  value, 
  suffix, 
  label, 
  icon: Icon, 
  delay,
  isVisible 
}: { 
  value: number; 
  suffix: string; 
  label: string; 
  icon: React.ElementType;
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

export default function Statistics() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section className="relative py-24 bg-navy-dark overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Radial Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-navy via-navy-dark to-black" />
        
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div 
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4">
            آمار و ارقام
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            در اعداد، اعتماد ما را ببینید
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            سال‌ها تجربه و هزاران مورد موفق، سند اعتبار ماست
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
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

        {/* Connecting Lines (SVG) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-10"
          style={{ zIndex: 0 }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1B8BFF" stopOpacity="0" />
              <stop offset="50%" stopColor="#1B8BFF" stopOpacity="1" />
              <stop offset="100%" stopColor="#1B8BFF" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[...Array(5)].map((_, i) => (
            <line
              key={i}
              x1={`${10 + i * 20}%`}
              y1="30%"
              x2={`${20 + i * 15}%`}
              y2="70%"
              stroke="url(#lineGradient)"
              strokeWidth="1"
              className={`transition-all duration-1000 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionDelay: `${500 + i * 100}ms` }}
            />
          ))}
        </svg>
      </div>
    </section>
  );
}
