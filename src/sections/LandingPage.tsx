import { useLayoutEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { Locale } from '@/App';
import { Button } from '@/components/ui/button';
import {
  Moon,
  Sun,
  Languages,
  Menu,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Waypoints,
  Compass,
  FileCheck2,
  Route,
  Clock3,
  MapPinned,
  BriefcaseBusiness,
  CheckCircle2,
  PlayCircle,
  X,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

const journeySnapshot = {
  progress: 68,
  profile: 'Skilled Worker',
  target: 'Canada',
  eta: '4-6 months',
  docsReady: 9,
  docsTotal: 12,
};

export default function LandingPage({
  locale,
  onLocaleChange,
  isDark,
  onToggleDark,
  onAuthClick,
  onDashboardClick,
}: LandingPageProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <a
                href="#home"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white grid place-content-center font-bold">P</span>
                <span className="font-display font-bold text-xl">{t.brand}</span>
              </a>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onToggleDark}
                className="rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label={isDark ? t.light : t.dark}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            </div>

            <nav className="hidden lg:flex items-center gap-8 text-sm text-slate-600 dark:text-slate-300">
              {t.nav.map((item) => (
                <a key={item.href} href={item.href} className="hover:text-primary transition-colors">
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onLocaleChange(locale === 'fa' ? 'en' : 'fa')}
                className="hidden sm:inline-flex rounded-xl border-primary/20 dark:bg-slate-900 dark:text-gray-100 dark:border-slate-700"
                aria-label="switch-language"
              >
                <Languages className="w-4 h-4 mr-2" />
                {locale === 'fa' ? 'EN' : 'FA'}
              </Button>
              <Button
                onClick={isAuthenticated ? onDashboardClick : onAuthClick}
                className="btn-primary hidden sm:inline-flex"
              >
                {isAuthenticated ? t.dashboard : t.login}
              </Button>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="lg:hidden h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-700 grid place-content-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="toggle-mobile-menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ${
              isMobileMenuOpen ? 'max-h-[420px] pb-4' : 'max-h-0'
            }`}
          >
            <div className="rounded-2xl border border-white/50 dark:border-slate-700 bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl p-3">
              <div className="space-y-1">
                {t.nav.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <Button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (isAuthenticated) {
                    onDashboardClick();
                  } else {
                    onAuthClick();
                  }
                }}
                className="btn-primary w-full mt-3"
              >
                {isAuthenticated ? t.dashboard : t.login}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onLocaleChange(locale === 'fa' ? 'en' : 'fa')}
                className="w-full mt-2 rounded-xl border-primary/20 dark:bg-slate-900 dark:text-gray-100 dark:border-slate-700"
              >
                <Languages className="w-4 h-4 mr-2" />
                {locale === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}
              </Button>
            </div>
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
                <div><p className="text-3xl font-bold text-slate-900 dark:text-white number-ltr">500+</p><p className="text-slate-500 dark:text-slate-400">{t.kpi1}</p></div>
                <div><p className="text-3xl font-bold text-slate-900 dark:text-white number-ltr">98%</p><p className="text-slate-500 dark:text-slate-400">{t.kpi2}</p></div>
                <div><p className="text-3xl font-bold text-slate-900 dark:text-white number-ltr">24/7</p><p className="text-slate-500 dark:text-slate-400">{t.kpi3}</p></div>
              </div>
            </div>

            <div data-hero-el className="relative">
              <div className="rounded-[2rem] p-6 border border-white/70 dark:border-slate-700/80 bg-white/72 dark:bg-slate-900/78 backdrop-blur-2xl shadow-2xl">
                <div className="rounded-2xl w-full bg-white/70 dark:bg-slate-900/70 border border-primary/10 dark:border-slate-700 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        {locale === 'fa' ? 'Migration Object' : 'Journey Object'}
                      </p>
                      <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                        {locale === 'fa' ? 'Migration Readiness Snapshot' : 'Migration Readiness Snapshot'}
                      </p>
                    </div>
                    <div className="h-11 w-11 rounded-xl bg-primary/15 grid place-content-center">
                      <Route className="w-5 h-5 text-primary" />
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary"
                        style={{ width: `${journeySnapshot.progress}%` }}
                      />
                    </div>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300 number-ltr">
                      {journeySnapshot.progress}% {locale === 'fa' ? 'Progress' : 'Progress'}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
                      <p className="text-slate-500 dark:text-slate-400">{locale === 'fa' ? 'Route' : 'Route'}</p>
                      <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <BriefcaseBusiness className="w-4 h-4 text-primary" />
                        {journeySnapshot.profile}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
                      <p className="text-slate-500 dark:text-slate-400">{locale === 'fa' ? 'Destination' : 'Destination'}</p>
                      <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <MapPinned className="w-4 h-4 text-secondary" />
                        {journeySnapshot.target}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
                      <p className="text-slate-500 dark:text-slate-400">{locale === 'fa' ? 'Doc Readiness' : 'Doc Readiness'}</p>
                      <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100 number-ltr flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-success" />
                        {journeySnapshot.docsReady}/{journeySnapshot.docsTotal}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
                      <p className="text-slate-500 dark:text-slate-400">{locale === 'fa' ? 'ETA' : 'ETA'}</p>
                      <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100 number-ltr flex items-center gap-2">
                        <Clock3 className="w-4 h-4 text-warning" />
                        {journeySnapshot.eta}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-primary/10 dark:bg-primary/15 p-4"><p className="text-xs text-slate-500 dark:text-slate-400">Case confidence</p><p className="text-xl font-bold text-primary number-ltr">94%</p></div>
                  <div className="rounded-xl bg-secondary/10 dark:bg-secondary/15 p-4"><p className="text-xs text-slate-500 dark:text-slate-400">Process speed</p><p className="text-xl font-bold text-secondary number-ltr">+32%</p></div>
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

        <section id="contact" ref={addSection} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="rounded-[1.75rem] border border-primary/15 bg-white/80 dark:bg-slate-900/75 dark:border-slate-700 p-6 sm:p-8 lg:p-10 shadow-xl backdrop-blur-xl">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
              {locale === 'fa' ? 'تماس با ما' : 'Contact Us'}
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              {locale === 'fa'
                ? 'برای مشاوره یا پیگیری پرونده، از راه‌های زیر با ما در ارتباط باشید.'
                : 'For consultation or case follow-up, reach us through the channels below.'}
            </p>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <a href="tel:+16692476782" className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-primary/40 transition-colors">
                <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Phone</p>
                <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100 number-ltr">+16692476782</p>
              </a>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {locale === 'fa' ? 'پشتیبانی' : 'Support'}
                </p>
                <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">
                  {locale === 'fa' ? 'پاسخ‌گویی ۲۴/۷' : '24/7 Response'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/50 dark:border-slate-800 bg-white/60 dark:bg-slate-950/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-display font-bold text-slate-900 dark:text-white">Panahyar</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {locale === 'fa' ? 'پلتفرم مدیریت مسیر مهاجرت' : 'Immigration journey management platform'}
            </p>
          </div>
          <a href="tel:+16692476782" className="text-sm text-primary hover:text-primary-dark transition-colors number-ltr">
            +16692476782
          </a>
        </div>
      </footer>
    </div>
  );
}
