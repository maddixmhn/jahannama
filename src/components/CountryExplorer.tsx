import { useState } from 'react';
import { Globe2, X, ShieldCheck, FileCheck2, ScrollText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/App';

interface CountryExplorerProps {
  locale: Locale;
}

interface CountryInfo {
  code: string;
  flag: string;
  nameFa: string;
  nameEn: string;
  conditions: string;
  conditionsEn: string;
  refugee: boolean;
  humanitarian: boolean;
  officialForm: string;
  officialFormEn: string;
  source: string;
}

const countries: CountryInfo[] = [
  {
    code: 'CA', flag: '🇨🇦', nameFa: 'کانادا', nameEn: 'Canada',
    conditions: 'برنامه پناهندگی کانادا شامل Refugee Claim در مرز یا داخل کشور و برنامه‌های اسپانسری مانند GAR است.',
    conditionsEn: 'Canada offers asylum claims at the border/inland, plus sponsorship programs like GAR.',
    refugee: true, humanitarian: true,
    officialForm: 'IMM 0008', officialFormEn: 'IMM 0008',
    source: 'https://www.canada.ca/en/immigration-refugees-citizenship.html',
  },
  {
    code: 'DE', flag: '🇩🇪', nameFa: 'آلمان', nameEn: 'Germany',
    conditions: 'درخواست پناهندگی در BAMF ثبت می‌شود؛ ویزای بشردوستانه برای موارد خاص از طریق سفارت قابل بررسی است.',
    conditionsEn: 'Asylum claims are filed with BAMF; humanitarian visas may be reviewed by embassies in specific cases.',
    refugee: true, humanitarian: true,
    officialForm: 'Asylantrag', officialFormEn: 'Asylum application',
    source: 'https://www.bamf.de/',
  },
  {
    code: 'AU', flag: '🇦🇺', nameFa: 'استرالیا', nameEn: 'Australia',
    conditions: 'ویزای حفاظتی موقت (Temporary Protection) و برنامه‌های بشردوستانه با سهمیه سالانه مشخص.',
    conditionsEn: 'Temporary Protection Visas and humanitarian programs with an annual quota.',
    refugee: true, humanitarian: true,
    officialForm: 'Form 866', officialFormEn: 'Form 866',
    source: 'https://immi.homeaffairs.gov.au/',
  },
  {
    code: 'US', flag: '🇺🇸', nameFa: 'ایالات متحده', nameEn: 'United States',
    conditions: 'درخواست پناهندگی از طریق USCIS یا دادگاه مهاجرت؛ ویزای بشردوستانه مانند Priority-3 برای موارد مشخص.',
    conditionsEn: 'Asylum is filed via USCIS or immigration court; humanitarian parole covers specific cases.',
    refugee: true, humanitarian: true,
    officialForm: 'I-589', officialFormEn: 'I-589',
    source: 'https://www.uscis.gov/humanitarian/refugees-and-asylum',
  },
  {
    code: 'GB', flag: '🇬🇧', nameFa: 'بریتانیا', nameEn: 'United Kingdom',
    conditions: 'ثبت درخواست در UKVI؛ برنامه‌های بشردوستانه مانند UKRS برای افغانستان و اوکراین.',
    conditionsEn: 'Claims are filed with UKVI; humanitarian routes like UKRS cover Afghanistan and Ukraine.',
    refugee: true, humanitarian: true,
    officialForm: 'ASF.1', officialFormEn: 'ASF.1',
    source: 'https://www.gov.uk/asylum',
  },
  {
    code: 'SE', flag: '🇸🇪', nameFa: 'سوئد', nameEn: 'Sweden',
    conditions: 'درخواست پناهندگی از طریق Migrationsverket؛ بررسی فردی بر اساس قوانین اتحادیه اروپا.',
    conditionsEn: 'Claims go through Migrationsverket with individual assessment under EU rules.',
    refugee: true, humanitarian: true,
    officialForm: 'Application asylum', officialFormEn: 'Asylum application',
    source: 'https://www.migrationsverket.se/',
  },
  {
    code: 'TR', flag: '🇹🇷', nameFa: 'ترکیه', nameEn: 'Turkey',
    conditions: 'حفاظت موقت برای سوری‌ها و ثبت اتباع سایر کشورها تحت مقررات حفاظت بین‌المللی.',
    conditionsEn: 'Temporary protection for Syrians; other nationals register under international protection regulations.',
    refugee: true, humanitarian: true,
    officialForm: 'Kayıt Formu', officialFormEn: 'Registration form',
    source: 'https://en.goc.gov.tr/',
  },
  {
    code: 'NL', flag: '🇳🇱', nameFa: 'هلند', nameEn: 'Netherlands',
    conditions: 'درخواست از طریق IND؛ برنامه‌های بشردوستانه و اسپانسری با قوانین مشخص اتحادیه اروپا.',
    conditionsEn: 'Claims are filed via IND; EU-wide humanitarian and sponsorship rules apply.',
    refugee: true, humanitarian: true,
    officialForm: 'Application IND', officialFormEn: 'IND application',
    source: 'https://ind.nl/en',
  },
  {
    code: 'NO', flag: '🇳🇴', nameFa: 'نروژ', nameEn: 'Norway',
    conditions: 'UDI مسئول بررسی درخواست‌هاست؛ ویزای بشردوستانه برای موارد اضطراری بررسی می‌شود.',
    conditionsEn: 'UDI processes claims; humanitarian visas are considered in urgent cases.',
    refugee: true, humanitarian: true,
    officialForm: 'Application UDI', officialFormEn: 'UDI application',
    source: 'https://www.udi.no/en/',
  },
  {
    code: 'FR', flag: '🇫🇷', nameFa: 'فرانسه', nameEn: 'France',
    conditions: 'درخواست از طریق OFPRA؛ ویزای بشردوستانه برای موارد مشخص از طریق کنسولگری بررسی می‌شود.',
    conditionsEn: 'Claims are filed via OFPRA; humanitarian visas are reviewed through consulates for specific cases.',
    refugee: true, humanitarian: true,
    officialForm: 'Demande asile', officialFormEn: 'Asylum request',
    source: 'https://www.ofpra.gouv.fr/',
  },
  {
    code: 'IT', flag: '🇮🇹', nameFa: 'ایتالیا', nameEn: 'Italy',
    conditions: 'درخواست از طریق Questura؛ حفاظت بین‌المللی بر اساس قوانین اتحادیه اروپا بررسی می‌شود.',
    conditionsEn: 'Claims are filed via Questura; international protection follows EU legislation.',
    refugee: true, humanitarian: true,
    officialForm: 'Domanda asilo', officialFormEn: 'Asylum request',
    source: 'https://www.interno.gov.it/',
  },
  {
    code: 'BR', flag: '🇧🇷', nameFa: 'برزیل', nameEn: 'Brazil',
    conditions: 'درخواست پناهندگی از طریق CONARE؛ ویزای بشردوستانه برای موارد خاص صادر می‌شود.',
    conditionsEn: 'Claims are filed via CONARE; humanitarian visas are issued for specific cases.',
    refugee: true, humanitarian: true,
    officialForm: 'Solicitação', officialFormEn: 'Request',
    source: 'https://www.gov.br/mj/pt-br/assuntos/seus-direitos/refugio',
  },
  {
    code: 'AR', flag: '🇦🇷', nameFa: 'آرژانتین', nameEn: 'Argentina',
    conditions: 'پناهندگی از طریق CONARE؛ ویزای بشردوستانه برای موارد بشردوستانه صادر می‌شود.',
    conditionsEn: 'Refugee status via CONARE; humanitarian visas issued for humanitarian cases.',
    refugee: true, humanitarian: true,
    officialForm: 'Solicitud', officialFormEn: 'Request',
    source: 'https://www.argentina.gob.ar/interior/migraciones',
  },
  {
    code: 'ZA', flag: '🇿🇦', nameFa: 'آفریقای جنوبی', nameEn: 'South Africa',
    conditions: 'ثبت درخواست پناهندگی در DHA؛ امکان دریافت مجوز اقامت بشردوستانه.',
    conditionsEn: 'Asylum claims registered at DHA; humanitarian residence permits may be issued.',
    refugee: true, humanitarian: true,
    officialForm: 'BI-1590', officialFormEn: 'BI-1590',
    source: 'https://www.dha.gov.za/',
  },
];

const regionGroups = [
  { labelFa: 'همه', labelEn: 'All', values: [] as string[] },
  { labelFa: 'اروپا', labelEn: 'Europe', values: ['DE', 'GB', 'SE', 'NL', 'NO', 'FR', 'IT'] },
  { labelFa: 'آمریکای شمالی', labelEn: 'North America', values: ['CA', 'US'] },
  { labelFa: 'آسیا', labelEn: 'Asia', values: ['TR'] },
  { labelFa: 'آمریکای جنوبی', labelEn: 'South America', values: ['BR', 'AR'] },
  { labelFa: 'آفریقا', labelEn: 'Africa', values: ['ZA'] },
];

const content = {
  fa: {
    badge: 'نقشه تعاملی کشورها',
    title: 'شرایط پناهندگی و ویزای بشردوستانه',
    subtitle: 'روی پرچم هر کشور کلیک کنید تا شرایط، فرم رسمی و منبع را ببینید.',
    asylum: 'پناهندگی',
    humanitarian: 'ویزای بشردوستانه',
    conditionsTitle: 'شرایط کلی',
    officialFormTitle: 'فرم رسمی',
    sourceTitle: 'منبع رسمی',
    close: 'بستن',
  },
  en: {
    badge: 'Interactive Country Map',
    title: 'Asylum & Humanitarian Visa Conditions',
    subtitle: 'Click a flag to see conditions, official form, and source.',
    asylum: 'Asylum',
    humanitarian: 'Humanitarian visa',
    conditionsTitle: 'Conditions',
    officialFormTitle: 'Official form',
    sourceTitle: 'Official source',
    close: 'Close',
  },
};

export default function CountryExplorer({ locale }: CountryExplorerProps) {
  const t = content[locale];
  const [selected, setSelected] = useState<CountryInfo | null>(null);
  const [region, setRegion] = useState('all');

  const filtered = region === 'all'
    ? countries
    : countries.filter((c) => regionGroups.find((g) => g.values.includes(c.code))?.values.includes(c.code));

  return (
    <section id="countries" className="py-24 bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0d737744,transparent_45%),radial-gradient(circle_at_bottom_right,#f4a26133,transparent_45%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-primary text-sm mb-5">
          <Globe2 className="w-4 h-4" />
          {t.badge}
        </div>
        <h2 className="text-3xl lg:text-4xl font-display font-bold">{t.title}</h2>
        <p className="mt-4 text-lg text-slate-300">{t.subtitle}</p>

        <div className="mt-8 flex flex-wrap gap-2">
          {regionGroups.map((g) => (
            <button
              key={g.labelFa}
              onClick={() => setRegion(g.values[0] ? g.values.join(',') : 'all')}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${region === (g.values[0] ? g.values.join(',') : 'all') ? 'bg-primary text-white border-primary' : 'border-white/20 text-slate-300 hover:border-primary/50'}`}
            >
              {locale === 'fa' ? g.labelFa : g.labelEn}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {filtered.map((country) => (
            <button
              key={country.code}
              onClick={() => setSelected(country)}
              className="group rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-6 text-center hover:border-primary/50 hover:bg-primary/10 transition-all"
            >
              <span className="text-5xl block transition-transform group-hover:scale-110">{country.flag}</span>
              <p className="mt-3 font-semibold text-lg">{locale === 'fa' ? country.nameFa : country.nameEn}</p>
              <p className="mt-1 text-xs text-slate-400 uppercase tracking-wider">{country.code}</p>
            </button>
          ))}
        </div>

        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <div className="relative w-full max-w-lg rounded-[1.75rem] bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 grid place-content-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label={t.close}
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-4">
                <span className="text-5xl">{selected.flag}</span>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {locale === 'fa' ? selected.nameFa : selected.nameEn}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selected.refugee && (
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        <ShieldCheck className="w-3 h-3" /> {t.asylum}
                      </span>
                    )}
                    {selected.humanitarian && (
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-secondary/10 text-amber-600 border border-secondary/30">
                        <FileCheck2 className="w-3 h-3" /> {t.humanitarian}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.conditionsTitle}</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {locale === 'fa' ? selected.conditions : selected.conditionsEn}
                </p>
              </div>

              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.officialFormTitle}</p>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">
                    {locale === 'fa' ? selected.officialForm : selected.officialFormEn}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.sourceTitle}</p>
                  <a
                    href={selected.source}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 font-semibold text-primary text-sm hover:underline break-all"
                  >
                    <ScrollText className="w-3 h-3 shrink-0" />
                    {selected.source.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>

              <div className="mt-6">
                <Button onClick={() => setSelected(null)} className="btn-primary w-full">
                  {t.close}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
