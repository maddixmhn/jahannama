import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
import { fetchRssNews, rssSources, type RssNewsItem } from '@/lib/rss';

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
    brand: 'وب‌ساخت دارک',
    nav: [
      { label: 'خانه', href: '#home' },
      { label: 'ویژگی‌ها', href: '#features' },
      { label: 'راهنما', href: '#process' },
      { label: 'مستندات', href: '#insights' },
      { label: 'تماس', href: '#contact' },
    ],
    heroLabel: 'قالب ریسپانسیو حرفه‌ای',
    heroTitleA: 'طراحی مدرن و',
    heroTitleB: 'تجربه کاربری عالی',
    heroText: 'یک قالب React متن‌باز با تم دارک، انیمیشن‌های GSAP، پشتیبانی کامل از راست‌چین و چپ‌چین و کامپوننت‌های shadcn/ui.',
    heroPrimary: 'شروع کنید',
    heroSecondary: 'مشاهده Demo',
    kpi1: 'کامپوننت',
    kpi2: 'تم دارک/لایت',
    kpi3: 'پشتیبانی',
    featureTitle: 'ویژگی‌های حرفه‌ای',
    featureText: 'هر آنچه برای ساخت یک وب‌سایت مدرن نیاز دارید، در این قالب فراهم است.',
    features: [
      ['طراحی ریسپانسیو', 'نمایش عالی در تمام دستگاه‌ها با Tailwind CSS'],
      ['پشتیبانی RTL/LTR', 'سازگاری کامل با زبان‌های راست‌چین و چپ‌چین'],
      ['حالت دارک/لایت', 'تغییر خودکار و دستی بین تم تاریک و روشن'],
    ],
    timelineTitle: 'مراحل استفاده',
    timeline: [
      ['1', 'نصب آسان', 'نصب با یک دستور npm و آماده اجرا'],
      ['2', 'شخصی‌سازی', 'تغییر رنگ‌ها، فونت‌ها و محتوا'],
      ['3', 'ریسپانسیو', 'سازگار با موبایل، تبلت و دسکتاپ'],
      ['4', 'متن‌باز', 'کاملاً رایگان و متن‌باز تحت مجوز MIT'],
    ],
    ctaTitle: 'آماده شروع هستید؟',
    ctaText: 'این قالب را روی Vercel مستقر کنید و پروژه خود را شروع کنید.',
    ctaButton: 'شروع کنید',
    watch: 'مشاهده Demo',
    login: 'ورود',
    dashboard: 'داشبورد',
    dark: 'دارک',
    light: 'لایت',
  },
  en: {
    brand: 'WebStruct Dark',
    nav: [
      { label: 'Home', href: '#home' },
      { label: 'Features', href: '#features' },
      { label: 'Guide', href: '#process' },
      { label: 'Docs', href: '#insights' },
      { label: 'Contact', href: '#contact' },
    ],
    heroLabel: 'Professional Responsive Template',
    heroTitleA: 'Modern Design &',
    heroTitleB: 'Great User Experience',
    heroText: 'An open-source React template with dark theme, GSAP animations, full RTL/LTR support, and shadcn/ui components.',
    heroPrimary: 'Get Started',
    heroSecondary: 'View Demo',
    kpi1: 'Components',
    kpi2: 'Dark/Light',
    kpi3: 'Support',
    featureTitle: 'Professional Features',
    featureText: 'Everything you need to build a modern website is included in this template.',
    features: [
      ['Responsive Design', 'Perfect display on all devices with Tailwind CSS'],
      ['RTL/LTR Support', 'Full compatibility with right-to-left and left-to-right languages'],
      ['Dark/Light Mode', 'Automatic and manual switching between dark and light themes'],
    ],
    timelineTitle: 'How to Use',
    timeline: [
      ['1', 'Easy Install', 'Install with a single npm command and start developing'],
      ['2', 'Customize', 'Change colors, fonts, and content to match your brand'],
      ['3', 'Responsive', 'Compatible with mobile, tablet, and desktop devices'],
      ['4', 'Open Source', 'Completely free and open source under the MIT license'],
    ],
    ctaTitle: 'Ready to get started?',
    ctaText: 'Deploy this template on Vercel and start your project in minutes.',
    ctaButton: 'Get Started',
    watch: 'View Demo',
    login: 'Sign in',
    dashboard: 'Dashboard',
    dark: 'Dark',
    light: 'Light',
  },
};

const journeySnapshot = {
  progress: 68,
  profile: 'shadcn/ui',
  target: 'Tailwind',
  eta: '2 min',
  docsReady: 24,
  docsTotal: 24,
};

export default function LandingPage({ locale, onLocaleChange, isDark, onToggleDark, onAuthClick, onDashboardClick }: LandingPageProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [rssItems, setRssItems] = useState<RssNewsItem[]>([]);
  const [rssLoading, setRssLoading] = useState(true);
  const [rssError, setRssError] = useState('');

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
      gsap.from('[data-hero-el]', { y: 36, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' });

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
          scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom bottom', scrub: 1.3 },
        });
      });
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((s) => s.kill());
    };
  }, [locale, isDark]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      setRssLoading(true);
      setRssError('');
      try {
        const items = await fetchRssNews(7);
        if (!active) return;
        setRssItems(items);
        if (items.length === 0) {
          setRssError(locale === 'fa' ? 'در حال حاضر خبری دریافت نشد.' : 'No RSS items were returned right now.');
        }
      } catch {
        if (!active) return;
        setRssError(locale === 'fa' ? 'دریافت RSS موقتاً در دسترس نیست.' : 'RSS fetch is temporarily unavailable.');
      } finally {
        if (active) setRssLoading(false);
      }
    };
    void run();
    return () => {
      active = false;
    };
  }, [locale]);

  return (
    <div className="min-h-screen bg-[#faf3e0] text-slate-900 dark:bg-[#0a0f1e] dark:text-slate-100 transition-colors duration-500">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(14)].map((_, i) => (
          <div
            key={i}
            ref={addBubble}
            className="absolute rounded-full bg-gradient-to-br from-primary/18 to-secondary/14 dark:from-primary/24 dark:to-secondary/20 border border-white/25 dark:border-slate-700/40 backdrop-blur-sm"
            style={{ width: `${28 + (i % 5) * 16}px`, height: `${28 + (i % 5) * 16}px`, left: `${5 + (i * 7) % 90}%`, top: `${12 + (i * 9) % 86}%` }}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:48px_48px] dark:bg-[linear-gradient(to_right,rgba(51,65,85,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(51,65,85,0.22)_1px,transparent_1px)]" />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-950/55 border-b border-white/40 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white grid place-content-center font-bold">W</span>
                <span className="font-display font-bold text-xl">{t.brand}</span>
              </a>
              <Button type="button" variant="ghost" size="icon" onClick={onToggleDark} className="rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label={isDark ? t.light : t.dark}>
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            </div>

            <nav className="hidden lg:flex items-center gap-8 text-sm text-slate-600 dark:text-slate-300">
              {t.nav.map((item) => (
                <a key={item.href} href={item.href} className="hover:text-primary transition-colors">{item.label}</a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={() => onLocaleChange(locale === 'fa' ? 'en' : 'fa')} className="hidden sm:inline-flex rounded-xl border-primary/20 dark:bg-slate-900 dark:text-gray-100 dark:border-slate-700" aria-label="switch-language">
                <Languages className="w-4 h-4 mr-2" />
                {locale === 'fa' ? 'EN' : 'FA'}
              </Button>
              <Button onClick={isAuthenticated ? onDashboardClick : onAuthClick} className="btn-primary hidden sm:inline-flex">
                {isAuthenticated ? t.dashboard : t.login}
              </Button>
              <button type="button" onClick={() => setIsMobileMenuOpen((prev) => !prev)} className="lg:hidden h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-700 grid place-content-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="toggle-mobile-menu">
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-[420px] pb-4' : 'max-h-0'}`}>
            <div className="rounded-2xl border border-white/50 dark:border-slate-700 bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl p-3">
              <div className="space-y-1">
                {t.nav.map((item) => (
                  <a key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-primary/10 hover:text-primary transition-colors">{item.label}</a>
                ))}
              </div>
              <Button onClick={() => { setIsMobileMenuOpen(false); isAuthenticated ? onDashboardClick() : onAuthClick(); }} className="btn-primary w-full mt-3">
                {isAuthenticated ? t.dashboard : t.login}
              </Button>
              <Button type="button" variant="outline" onClick={() => onLocaleChange(locale === 'fa' ? 'en' : 'fa')} className="w-full mt-2 rounded-xl border-primary/20 dark:bg-slate-900 dark:text-gray-100 dark:border-slate-700">
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
              <p data-hero-el className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-2xl">{t.heroText}</p>
              <div data-hero-el className="mt-8 flex flex-wrap gap-3">
                <Button onClick={onAuthClick} className="btn-primary px-7 py-6 text-base">{t.heroPrimary}<ArrowUpRight className="w-4 h-4" /></Button>
                <Button variant="outline" className="px-7 py-6 text-base border-primary/30 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"><PlayCircle className="w-4 h-4 mr-2" />{t.watch}</Button>
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
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{locale === 'fa' ? 'نمای کلی قالب' : 'Template Overview'}</p>
                      <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{locale === 'fa' ? 'آماده‌سازی پروژه' : 'Project Readiness Snapshot'}</p>
                    </div>
                    <div className="h-11 w-11 rounded-xl bg-primary/15 grid place-content-center"><Route className="w-5 h-5 text-primary" /></div>
                  </div>
                  <div className="mt-5">
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700"><div className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${journeySnapshot.progress}%` }} /></div>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300 number-ltr">{journeySnapshot.progress}% {locale === 'fa' ? 'آمادگی' : 'Ready'}</div>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3"><p className="text-slate-500 dark:text-slate-400">{locale === 'fa' ? 'کامپوننت' : 'Component'}</p><p className="mt-1 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2"><BriefcaseBusiness className="w-4 h-4 text-primary" />{journeySnapshot.profile}</p></div>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3"><p className="text-slate-500 dark:text-slate-400">{locale === 'fa' ? 'فریم‌ورک' : 'Framework'}</p><p className="mt-1 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2"><MapPinned className="w-4 h-4 text-secondary" />{journeySnapshot.target}</p></div>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3"><p className="text-slate-500 dark:text-slate-400">{locale === 'fa' ? 'کامپوننت‌ها' : 'Components'}</p><p className="mt-1 font-semibold text-slate-900 dark:text-slate-100 number-ltr flex items-center gap-2"><FileCheck2 className="w-4 h-4 text-success" />{journeySnapshot.docsReady}/{journeySnapshot.docsTotal}</p></div>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3"><p className="text-slate-500 dark:text-slate-400">{locale === 'fa' ? 'زمان نصب' : 'Setup'}</p><p className="mt-1 font-semibold text-slate-900 dark:text-slate-100 number-ltr flex items-center gap-2"><Clock3 className="w-4 h-4 text-warning" />{journeySnapshot.eta}</p></div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-primary/10 dark:bg-primary/15 p-4"><p className="text-xs text-slate-500 dark:text-slate-400">TypeScript</p><p className="text-xl font-bold text-primary number-ltr">100%</p></div>
                  <div className="rounded-xl bg-secondary/10 dark:bg-secondary/15 p-4"><p className="text-xs text-slate-500 dark:text-slate-400">GSAP Ready</p><p className="text-xl font-bold text-secondary number-ltr">✓</p></div>
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
                  <div className="w-11 h-11 rounded-xl bg-primary/10 dark:bg-primary/20 grid place-content-center mb-4"><Icon className="w-5 h-5 text-primary" /></div>
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{name}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="process" ref={addSection} className="py-24 bg-slate-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0d737744,transparent_40%),radial-gradient(circle_at_bottom_right,#f4a26133,transparent_40%)]" />
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
              <Button onClick={onAuthClick} className="btn-primary px-8 py-6 text-base">{t.ctaButton}</Button>
              <Button variant="outline" className="px-8 py-6 border-primary/30 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800">{t.heroSecondary}</Button>
            </div>
          </div>
        </section>

        <section id="contact" ref={addSection} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="rounded-[1.75rem] border border-primary/15 bg-white/80 dark:bg-slate-900/75 dark:border-slate-700 p-6 sm:p-8 lg:p-10 shadow-xl backdrop-blur-xl">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">{locale === 'fa' ? 'تماس با ما' : 'Contact Us'}</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">{locale === 'fa' ? 'برای سوالات و پیشنهادات با ما در ارتباط باشید.' : 'For questions and suggestions, get in touch with us.'}</p>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <a href="mailto:info@webstruct.dev" className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-primary/40 transition-colors"><p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Email</p><p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">info@webstruct.dev</p></a>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4"><p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">{locale === 'fa' ? 'پشتیبانی' : 'Support'}</p><p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{locale === 'fa' ? 'مستندات کامل' : 'Full Documentation'}</p></div>
            </div>
          </div>
        </section>

        <section id="rss" ref={addSection} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="rounded-[1.75rem] border border-primary/20 bg-white/80 dark:bg-slate-900/75 dark:border-slate-700 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">{locale === 'fa' ? 'RSS اخبار فناوری' : 'Tech & Dev RSS Hub'}</h2>
              <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{locale === 'fa' ? 'منابع فناوری + توسعه' : 'Tech + Dev Sources'}</span>
            </div>
            <p className="mt-3 text-slate-600 dark:text-slate-300">{locale === 'fa' ? 'این بخش آخرین اخبار دنیای فناوری و توسعه را از فیدهای منتخب نمایش می‌دهد.' : 'This section aggregates the latest tech and development news from selected RSS feeds.'}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {rssSources.map((source) => (
                <a key={source.id} href={source.siteUrl} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 p-4 hover:border-primary/40 transition-colors">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{source.title}</p>
                  <p className="text-xs text-slate-500 mt-1 break-all">{source.feedUrl}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section ref={addSection} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="rounded-[1.5rem] border border-primary/20 bg-white/90 dark:bg-slate-900/85 dark:border-slate-700 p-6 shadow-xl">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white">{locale === 'fa' ? 'آخرین اخبار فناوری و توسعه' : 'Latest Tech & Development News'}</h3>

            {rssLoading && <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{locale === 'fa' ? 'در حال دریافت خبرها...' : 'Loading latest RSS headlines...'}</p>}
            {!rssLoading && rssError && <p className="mt-4 text-sm text-warning">{rssError}</p>}

            {!rssLoading && rssItems.length > 0 && (
              <div className="mt-5 grid gap-3">
                {rssItems.slice(0, 6).map((item) => (
                  <a key={item.id} href={item.link} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-primary/35 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                      <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary">{item.sourceTitle}</span>
                    </div>
                    {item.summary && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.summary}</p>}
                    <p className="mt-2 text-xs text-slate-500 number-ltr">{new Date(item.isoDate).toLocaleString(locale === 'fa' ? 'fa-IR' : 'en-US')}</p>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/50 dark:border-slate-800 bg-white/60 dark:bg-slate-950/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-display font-bold text-slate-900 dark:text-white">WebStruct Dark</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{locale === 'fa' ? 'قالب ریسپانسیو React - متن‌باز' : 'Open source React template'}</p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{locale === 'fa' ? 'تحت مجوز MIT - آزاد برای استفاده شخصی و تجاری' : 'MIT License — free for personal and commercial use'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
