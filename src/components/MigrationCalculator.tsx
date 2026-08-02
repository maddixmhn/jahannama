import { useMemo, useState } from 'react';
import { Calculator, GraduationCap, Languages, Briefcase, Wallet, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Locale } from '@/App';

interface MigrationCalculatorProps {
  locale: Locale;
}

const content = {
  fa: {
    title: 'ماشین‌حساب مهاجرت',
    subtitle: 'ارزیابی سریع شانس مهاجرت بر اساس مشخصات شما. بدون ذخیره اطلاعات شخصی.',
    age: 'سن',
    education: 'سطح تحصیلات',
    language: 'مهارت زبان انگلیسی',
    experience: 'سابقه کار',
    finance: 'تمکن مالی',
    destination: 'کشور مقصد',
    calculate: 'محاسبه شانس مهاجرت',
    resultTitle: 'نتیجه ارزیابی',
    chanceLabel: 'شانس مهاجرت',
    messageLow: 'شانس شما در این مسیر محدود است. با بهبود زبان یا سابقه کار می‌توانید امتیاز بالاتری کسب کنید.',
    messageMedium: 'شانس قابل قبولی دارید. تکمیل مدارک و بهبود چند عامل، نتیجه را مطلوب‌تر می‌کند.',
    messageHigh: 'شانس بالای شما نشان از پروفایل قوی است. برای شروع اقدام همین حالا مشاوره بگیرید.',
    educationOptions: {
      none: 'دیپلم',
      bachelor: 'کارشناسی',
      master: 'کارشناسی ارشد',
      phd: 'دکترا',
    },
    languageOptions: {
      beginner: 'مبتدی',
      intermediate: 'متوسط',
      good: 'خوب (آیلتس ۶+)',
      fluent: 'روان (آیلتس ۷+)',
    },
    experienceOptions: {
      none: 'کمتر از ۱ سال',
      junior: '۱ تا ۳ سال',
      mid: '۳ تا ۵ سال',
      senior: 'بیش از ۵ سال',
    },
    financeOptions: {
      low: 'کمتر از ۵ هزار دلار',
      medium: '۵ تا ۲۰ هزار دلار',
      high: 'بیش از ۲۰ هزار دلار',
    },
    destinations: [
      'کانادا',
      'آلمان',
      'استرالیا',
      'بریتانیا',
      'ترکیه',
      'هلند',
      'سوئد',
      'نروژ',
    ],
  },
  en: {
    title: 'Immigration Calculator',
    subtitle: 'A quick eligibility estimate based on your profile. No personal data is stored.',
    age: 'Age',
    education: 'Education',
    language: 'English Proficiency',
    experience: 'Work Experience',
    finance: 'Financial Proof',
    destination: 'Destination',
    calculate: 'Calculate My Chances',
    resultTitle: 'Assessment Result',
    chanceLabel: 'Immigration Chance',
    messageLow: 'Your chances in this route are limited. Improving language or experience will raise your score.',
    messageMedium: 'You have a decent profile. Strengthening a few factors will improve the outcome.',
    messageHigh: 'Your strong profile gives you a high chance. Book a consultation to get started.',
    educationOptions: {
      none: 'High School',
      bachelor: "Bachelor's",
      master: "Master's",
      phd: 'PhD',
    },
    languageOptions: {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      good: 'Good (IELTS 6+)',
      fluent: 'Fluent (IELTS 7+)',
    },
    experienceOptions: {
      none: 'Under 1 year',
      junior: '1-3 years',
      mid: '3-5 years',
      senior: '5+ years',
    },
    financeOptions: {
      low: 'Under $5k',
      medium: '$5k-$20k',
      high: 'Above $20k',
    },
    destinations: ['Canada', 'Germany', 'Australia', 'UK', 'Turkey', 'Netherlands', 'Sweden', 'Norway'],
  },
};

type EducationKey = 'none' | 'bachelor' | 'master' | 'phd';
type LanguageKey = 'beginner' | 'intermediate' | 'good' | 'fluent';
type ExperienceKey = 'none' | 'junior' | 'mid' | 'senior';
type FinanceKey = 'low' | 'medium' | 'high';

export default function MigrationCalculator({ locale }: MigrationCalculatorProps) {
  const t = content[locale];
  const [age, setAge] = useState(30);
  const [education, setEducation] = useState<EducationKey>('bachelor');
  const [language, setLanguage] = useState<LanguageKey>('intermediate');
  const [experience, setExperience] = useState<ExperienceKey>('junior');
  const [finance, setFinance] = useState<FinanceKey>('medium');
  const [destination, setDestination] = useState(t.destinations[0]);
  const [result, setResult] = useState<number | null>(null);

  const score = useMemo(() => {
    let total = 0;

    if (age >= 18 && age <= 29) total += 12;
    else if (age <= 34) total += 10;
    else if (age <= 39) total += 7;
    else if (age <= 44) total += 4;
    else total += 1;

    const edu: Record<EducationKey, number> = { none: 6, bachelor: 13, master: 18, phd: 22 };
    total += edu[education];

    const lang: Record<LanguageKey, number> = { beginner: 5, intermediate: 12, good: 18, fluent: 24 };
    total += lang[language];

    const exp: Record<ExperienceKey, number> = { none: 4, junior: 10, mid: 16, senior: 22 };
    total += exp[experience];

    const fin: Record<FinanceKey, number> = { low: 4, medium: 10, high: 16 };
    total += fin[finance];

    const destBoost: Record<string, number> = {
      Canada: 8, Germany: 6, Australia: 8, UK: 6, Turkey: 14, Netherlands: 6, Sweden: 5, Norway: 5,
      کانادا: 8, آلمان: 6, استرالیا: 8, بریتانیا: 6, ترکیه: 14, هلند: 6, سوئد: 5, نروژ: 5,
    };
    total += destBoost[destination] ?? 6;

    return Math.min(98, Math.max(4, Math.round(total)));
  }, [age, education, language, experience, finance, destination]);

  const normalizedAge = Math.max(18, Math.min(65, Number(age) || 30));

  return (
    <section id="calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="rounded-[2rem] border border-primary/20 bg-white/85 dark:bg-slate-900/80 dark:border-slate-700 shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="grid lg:grid-cols-[1fr_1fr]">
          <div className="p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-200/70 dark:border-slate-700/60">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 px-4 py-2 text-primary text-sm mb-5">
              <Calculator className="w-4 h-4" />
              {t.title}
            </div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-white">{t.title}</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{t.subtitle}</p>

            <div className="mt-8 space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  <User className="w-4 h-4 text-primary" /> {t.age}
                </label>
                <Input
                  type="number"
                  min={18}
                  max={65}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="bg-white dark:bg-slate-900 dark:border-slate-700 w-full"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  <GraduationCap className="w-4 h-4 text-primary" /> {t.education}
                </label>
                <Select value={education} onValueChange={(v) => setEducation(v as EducationKey)}>
                  <SelectTrigger className="bg-white dark:bg-slate-900 dark:border-slate-700 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(t.educationOptions) as EducationKey[]).map((k) => (
                      <SelectItem key={k} value={k}>{t.educationOptions[k]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  <Languages className="w-4 h-4 text-primary" /> {t.language}
                </label>
                <Select value={language} onValueChange={(v) => setLanguage(v as LanguageKey)}>
                  <SelectTrigger className="bg-white dark:bg-slate-900 dark:border-slate-700 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(t.languageOptions) as LanguageKey[]).map((k) => (
                      <SelectItem key={k} value={k}>{t.languageOptions[k]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  <Briefcase className="w-4 h-4 text-primary" /> {t.experience}
                </label>
                <Select value={experience} onValueChange={(v) => setExperience(v as ExperienceKey)}>
                  <SelectTrigger className="bg-white dark:bg-slate-900 dark:border-slate-700 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(t.experienceOptions) as ExperienceKey[]).map((k) => (
                      <SelectItem key={k} value={k}>{t.experienceOptions[k]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  <Wallet className="w-4 h-4 text-primary" /> {t.finance}
                </label>
                <Select value={finance} onValueChange={(v) => setFinance(v as FinanceKey)}>
                  <SelectTrigger className="bg-white dark:bg-slate-900 dark:border-slate-700 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(t.financeOptions) as FinanceKey[]).map((k) => (
                      <SelectItem key={k} value={k}>{t.financeOptions[k]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  <MapPin className="w-4 h-4 text-primary" /> {t.destination}
                </label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger className="bg-white dark:bg-slate-900 dark:border-slate-700 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {t.destinations.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={() => setResult(score)} className="btn-primary w-full px-7 py-6 text-base">
                {t.calculate}
              </Button>
            </div>
          </div>

          <div className="relative p-8 lg:p-12 bg-primary/5 dark:bg-primary/10 flex flex-col justify-center">
            {result === null ? (
              <div className="text-center text-slate-500 dark:text-slate-400">
                <Calculator className="w-16 h-16 mx-auto text-primary/40 mb-4" />
                <p className="text-lg">{locale === 'fa' ? 'فرم را تکمیل کنید تا نتیجه نمایش داده شود.' : 'Fill out the form to see your result.'}</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{t.resultTitle}</p>
                <p className="mt-4 text-7xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent number-ltr">
                  {result}%
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t.chanceLabel}</p>

                <div className="mt-6 h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
                    style={{ width: `${result}%` }}
                  />
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 p-3">
                    <p className="text-slate-500 dark:text-slate-400">{t.age}</p>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white number-ltr">{normalizedAge}</p>
                  </div>
                  <div className="rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 p-3">
                    <p className="text-slate-500 dark:text-slate-400">{t.destination}</p>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white">{destination}</p>
                  </div>
                  <div className="rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 p-3">
                    <p className="text-slate-500 dark:text-slate-400">{t.education}</p>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white">{t.educationOptions[education]}</p>
                  </div>
                </div>

                <p className={`mt-6 text-sm leading-relaxed ${result >= 60 ? 'text-emerald-600 dark:text-emerald-400' : result >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {result >= 60 ? t.messageHigh : result >= 40 ? t.messageMedium : t.messageLow}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
