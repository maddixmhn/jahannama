import { Shield, FileCheck, Scale, Home, Users, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { ElementType } from 'react';
import type { Locale } from '@/App';

interface ServicesProps {
  locale: Locale;
}

const iconMap: Record<string, ElementType> = {
  shield: Shield,
  passport: FileCheck,
  scale: Scale,
  home: Home,
  users: Users,
  phone: Phone,
};

const items = {
  fa: ['مشاوره پناهندگی', 'مدارک سفر', 'حمایت حقوقی', 'اسکان اولیه', 'پیوستن خانواده', 'پشتیبانی اضطراری'],
  en: ['Asylum Guidance', 'Travel Documents', 'Legal Support', 'Settlement', 'Family Reunification', 'Emergency Help'],
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
