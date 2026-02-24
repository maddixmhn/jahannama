import { useLayoutEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { Locale } from '@/App';
import { Button } from '@/components/ui/button';
import {
  Moon,
  Sun,
  Languages,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Waypoints,
  Compass,
  CheckCircle2,
  PlayCircle,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

gsap.registerPlugin(ScrollTrigger);

interface LandingPageProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  isDark: boolean;
  onToggleDark: () => void;
  onAuthClick: () => void;
  onDashboardClick: () => void;
}

const content = {
  fa: {
    brand: 'Panahyar',
    nav: [
      { label: 'خانه', href: '#home' },
      { label: 'خدمات', href: '#features' },
      { label: 'فرایند', href: '#process' },
      { label: 'نتایج', href: '#insights' },
      { label: 'تماس', href: '#contact' },
    ],
    heroLabel: 'راهبری هوشمند پرونده مهاجرت',
    heroTitleA: 'پلتفرم نسل جدید',
    heroTitleB: 'مدیریت مسیر مهاجرت',
    heroText:
      'از ارزیابی اولیه تا نتیجه نهایی، مسیر شما با داده، تجربه حقوقی و پشتیبانی انسانی مدیریت می شود.',
    heroPrimary: 'شروع مشاوره',
    heroSecondary: 'مشاهده مسیر',
    kpi1: 'پرونده فعال',
    kpi2: 'رضایت کاربران',
    kpi3: 'پشتیبانی',
    featureTitle: 'تجربه محصولی، نه فقط خدماتی',
    featureText: 'همه چیز در یک داشبورد قابل پیگیری، شفاف و مرحله ای است.',
    features: [
      ['Case Engine', 'تحلیل سریع پرونده و اولویت بندی ریسک ها'],
      ['Route Map', 'نقشه اقدام شخصی سازی شده برای هر پرونده'],
      ['Live Follow-up', 'پیگیری مرحله ای با اعلان های دقیق'],
    ],
    timelineTitle: 'فرایند چهار مرحله ای',
    timeline: [
      ['1', 'ارزیابی هوشمند', 'تحلیل کامل شرایط و مستندات اولیه'],
      ['2', 'چیدمان استراتژی', 'انتخاب مسیر کم ریسک و قابل دفاع'],
      ['3', 'اجرا و ارسال', 'آماده سازی پرونده و ثبت رسمی'],
      ['4', 'مانیتورینگ نتیجه', 'پیگیری و اقدام های تکمیلی'],
    ],
    ctaTitle: 'آماده شروع مسیر جدید هستید؟',
    ctaText: 'همین امروز جلسه رایگان بگیرید و برنامه اقدام خود را دریافت کنید.',
    ctaButton: 'رزرو جلسه',
    watch: 'دموی مسیر',
    login: 'ورود',
    dashboard: 'داشبورد',
    dark: 'دارک',
    light: 'لایت',
  },
  en: {
    brand: 'Panahyar',
    nav: [
      { label: 'Home', href: '#home' },
      { label: 'Services', href: '#features' },
      { label: 'Process', href: '#process' },
      { label: 'Results', href: '#insights' },
      { label: 'Contact', href: '#contact' },
    ],
    heroLabel: 'Smart Immigration Case Navigation',
    heroTitleA: 'A New-Gen Platform for',
    heroTitleB: 'Immigration Journey Management',
    heroText:
      'From early assessment to final outcome, your case is managed with legal expertise, data insights, and human support.',
    heroPrimary: 'Start Consultation',
    heroSecondary: 'View Journey',
    kpi1: 'active cases',
    kpi2: 'client satisfaction',
    kpi3: 'support',
    featureTitle: 'A product-like experience, not just a service',
    featureText: 'Everything is trackable, transparent, and milestone-driven in one dashboard.',
    features: [
      ['Case Engine', 'Fast case analysis and risk prioritization'],
      ['Route Map', 'Personalized action map for each profile'],
      ['Live Follow-up', 'Milestone tracking with clear notifications'],
    ],
    timelineTitle: 'Four-step execution flow',
    timeline: [
      ['1', 'Smart Assessment', 'Comprehensive eligibility and profile review'],
      ['2', 'Strategy Layer', 'Low-risk and defensible route planning'],
      ['3', 'Execution & Filing', 'Document prep and official submission'],
      ['4', 'Outcome Monitoring', 'Continuous follow-up and support actions'],
    ],
    ctaTitle: 'Ready to begin your next chapter?',
    ctaText: 'Book a free session today and get your tailored action plan.',
    ctaButton: 'Book Session',
    watch: 'Watch Journey Demo',
    login: 'Sign in',
    dashboard: 'Dashboard',
    dark: 'Dark',
    light: 'Light',
  },
};

const chartData = [
  { name: 'W1', confidence: 42, speed: 25 },
  { name: 'W2', confidence: 51, speed: 39 },
  { name: 'W3', confidence: 63, speed: 44 },
  { name: 'W4', confidence: 70, speed: 61 },
  { name: 'W5', confidence: 78, speed: 68 },
  { name: 'W6', confidence: 86, speed: 74 },
  { name: 'W7', confidence: 94, speed: 82 },
];

export default function LandingPage({
  locale,
  onLocaleChange,
  isDark,
  onToggleDark,
  onAuthClick,
  onDashboardClick,
}: LandingPageProps) {
  const [isPrefsOpen, setIsPrefsOpen] = useState(false);
  const t = content[locale];
  const { isAuthenticated } = useAuth();
  const sectionRefs = useRef<HTMLElement[]>([]);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const bubbleRefs = useRef<HTMLDivElement[]>([]);

  sectionRefs.current = [];
  cardRefs.current = [];
  bubbleRefs.current = [];

  const addSection = (el: HTMLElement | null) => {
    if (el && !sectionRefs.current.includes(el)) sectionRefs.current.push(el);
  };
  const addCard = (el: HTMLDivElement | null) => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  };
  const addBubble = (el: HTMLDivElement | null) => {
    if (el && !bubbleRefs.current.includes(el)) bubbleRefs.current.push(el);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-hero-el]', {
        y: 36,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
      });

      sectionRefs.current.forEach((section) => {
        gsap.from(section, {
          scrollTrigger: { trigger: section, start: 'top 76%' },
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
        });
      });

      cardRefs.current.forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 84%' },
          y: 40,
          opacity: 0,
          duration: 0.6,
          delay: index * 0.08,
          ease: 'power2.out',
        });
      });

      bubbleRefs.current.forEach((bubble, index) => {
        gsap.to(bubble, {
          y: -220 - index * 24,
          x: index % 2 === 0 ? 40 : -36,
          rotation: index % 2 === 0 ? 14 : -14,
          ease: 'none',
          scrollTrigger: {
            trigger: 'main',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.3,
          },
        });
      });
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((s) => s.kill());
    };
  }, [locale, isDark]);

  return (
    <div className="min-h-screen bg-[#f5f8ff] text-slate-900 dark:bg-[#060b16] dark:text-slate-100 transition-colors duration-500">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(14)].map((_, i) => (
          <div
            key={i}
            ref={addBubble}
            className="absolute rounded-full bg-gradient-to-br from-primary/18 to-secondary/14 dark:from-primary/24 dark:to-secondary/20 border border-white/25 dark:border-slate-700/40 backdrop-blur-sm"
            style={{
              width: `${28 + (i % 5) * 16}px`,
              height: `${28 + (i % 5) * 16}px`,
              left: `${5 + (i * 7) % 90}%`,
              top: `${12 + (i * 9) % 86}%`,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:48px_48px] dark:bg-[linear-gradient(to_right,rgba(51,65,85,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(51,65,85,0.22)_1px,transparent_1px)]" />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-950/55 border-b border-white/40 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white grid place-content-center font-bold">P</span>
            <span className="font-display font-bold text-xl">{t.brand}</span>
          </a>

          <nav className="hidden lg:flex items-center gap-8 text-sm text-slate-600 dark:text-slate-300">
            {t.nav.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-primary transition-colors">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button onClick={isAuthenticated ? onDashboardClick : onAuthClick} className="btn-primary">
              {isAuthenticated ? t.dashboard : t.login}
            </Button>
          </div>
        </div>
      </header>

      <main className="relative">
        <section id="home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div>
              <div data-hero-el className="inline-flex items-center gap-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 px-4 py-2 text-primary text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                {t.heroLabel}
              </div>
              <h1 data-hero-el className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight text-slate-900 dark:text-white">
                {t.heroTitleA}
                <span className="block mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{t.heroTitleB}</span>
              </h1>
              <p data-hero-el className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
                {t.heroText}
              </p>
              <div data-hero-el className="mt-8 flex flex-wrap gap-3">
                <Button onClick={onAuthClick} className="btn-primary px-7 py-6 text-base">
                  {t.heroPrimary}
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="px-7 py-6 text-base border-primary/30 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  {t.watch}
                </Button>
              </div>
              <div data-hero-el className="mt-10 flex flex-wrap gap-8 text-sm">
                <div><p className="text-3xl font-bold text-slate-900 dark:text-white">500+</p><p className="text-slate-500 dark:text-slate-400">{t.kpi1}</p></div>
                <div><p className="text-3xl font-bold text-slate-900 dark:text-white">98%</p><p className="text-slate-500 dark:text-slate-400">{t.kpi2}</p></div>
                <div><p className="text-3xl font-bold text-slate-900 dark:text-white">24/7</p><p className="text-slate-500 dark:text-slate-400">{t.kpi3}</p></div>
              </div>
            </div>

            <div data-hero-el className="relative">
              <div className="rounded-[2rem] p-6 border border-white/70 dark:border-slate-700/80 bg-white/72 dark:bg-slate-900/78 backdrop-blur-2xl shadow-2xl">
                <div className="rounded-2xl h-[340px] w-full bg-white/70 dark:bg-slate-900/70 border border-primary/10 dark:border-slate-700 p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="c1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1B8BFF" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#1B8BFF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
                      <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="confidence" stroke="#1B8BFF" fill="url(#c1)" strokeWidth={3} />
                      <Line type="monotone" dataKey="speed" stroke="#FF6B35" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-primary/10 dark:bg-primary/15 p-4"><p className="text-xs text-slate-500 dark:text-slate-400">Case confidence</p><p className="text-xl font-bold text-primary">94%</p></div>
                  <div className="rounded-xl bg-secondary/10 dark:bg-secondary/15 p-4"><p className="text-xs text-slate-500 dark:text-slate-400">Process speed</p><p className="text-xl font-bold text-secondary">+32%</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" ref={addSection} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-white">{t.featureTitle}</h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{t.featureText}</p>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {t.features.map(([name, text], i) => {
              const Icon = i === 0 ? ShieldCheck : i === 1 ? Compass : Waypoints;
              return (
                <div ref={addCard} key={name} className="rounded-2xl p-6 bg-white/82 dark:bg-slate-900/76 border border-white/75 dark:border-slate-700/90 shadow-lg backdrop-blur-xl">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 dark:bg-primary/20 grid place-content-center mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{name}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="process" ref={addSection} className="py-24 bg-slate-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#1b8bff33,transparent_40%),radial-gradient(circle_at_bottom_right,#ff6b3533,transparent_40%)]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-display font-bold">{t.timelineTitle}</h2>
            <div className="mt-10 grid lg:grid-cols-4 gap-4">
              {t.timeline.map(([step, title, desc]) => (
                <div ref={addCard} key={step} className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-5">
                  <p className="text-primary font-bold text-sm">STEP {step}</p>
                  <h3 className="mt-2 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{desc}</p>
                  <CheckCircle2 className="w-5 h-5 text-secondary mt-5" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="insights" ref={addSection} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="rounded-[2rem] border border-primary/20 bg-white dark:bg-slate-900 shadow-2xl px-8 py-14 lg:px-12 lg:py-16">
            <h2 className="text-3xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white">{t.ctaTitle}</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl">{t.ctaText}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={onAuthClick} className="btn-primary px-8 py-6 text-base">
                {t.ctaButton}
              </Button>
              <Button variant="outline" className="px-8 py-6 border-primary/30 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800">
                {t.heroSecondary}
              </Button>
            </div>
          </div>
        </section>

        <section id="contact" className="pb-12" />
      </main>

      <div className="fixed bottom-6 right-6 z-[70]">
        {isPrefsOpen && (
          <div className="mb-3 w-64 rounded-2xl border border-white/60 dark:border-slate-700 bg-white/90 dark:bg-slate-900/95 shadow-2xl backdrop-blur-xl p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400 mb-3">Preferences</p>
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={onToggleDark}
                className="w-full justify-start dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                {isDark ? t.light : t.dark}
              </Button>
              <Button
                variant="outline"
                onClick={() => onLocaleChange(locale === 'fa' ? 'en' : 'fa')}
                className="w-full justify-start dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <Languages className="w-4 h-4 mr-2" />
                {locale === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}
              </Button>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsPrefsOpen((p) => !p)}
          className="h-14 w-14 rounded-full grid place-content-center bg-primary text-white shadow-lg hover:bg-primary-dark transition-colors"
          aria-label="open-preferences"
        >
          {isPrefsOpen ? <X className="w-5 h-5" /> : <SlidersHorizontal className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
