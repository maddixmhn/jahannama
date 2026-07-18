import { Layout, Globe, Moon, Code, Smartphone, Palette } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { ElementType } from 'react';
import type { Locale } from '@/App';

interface ServicesProps {
  locale: Locale;
}

const iconMap: Record<string, ElementType> = {
  layout: Layout,
  globe: Globe,
  moon: Moon,
  code: Code,
  smartphone: Smartphone,
  palette: Palette,
};

const items = {
  fa: ['طراحی ریسپانسیو', 'پشتیبانی RTL/LTR', 'تم دارک/لایت', 'کامپوننت‌های مدرن', 'Mobile-First', 'شخصی‌سازی آسان'],
  en: ['Responsive Design', 'RTL/LTR Support', 'Dark/Light Theme', 'Modern Components', 'Mobile-First', 'Easy Customization'],
};

export default function Services({ locale }: ServicesProps) {
  return (
    <section id="services" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items[locale].map((title, index) => {
          const keys = Object.keys(iconMap);
          const Icon = iconMap[keys[index % keys.length]];
          return (
            <Card key={title}>
              <CardContent className="p-6">
                <Icon className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-semibold">{title}</h3>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}