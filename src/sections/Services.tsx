import { 
  Shield, 
  FileCheck, 
  Scale, 
  Home, 
  Users, 
  Phone,
  ArrowLeft,
  Check
} from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Service } from '@/types';

const services: Service[] = [
  {
    id: '1',
    icon: 'shield',
    title: 'مشاوره پناهندگی',
    description: 'راهنمای تخصصی در تمام مراحل درخواست پناهندگی با حمایت شخصی در هر مرحله.',
    features: ['ارزیابی پرونده', 'تهیه مدارک', 'آمادگی مصاحبه', 'حمایت تجدیدنظر'],
  },
  {
    id: '2',
    icon: 'passport',
    title: 'مدارک سفر',
    description: 'کمک کامل در اخذ ویزا، پاسپورت و تمام مدارک لازم برای سفر.',
    features: ['درخواست ویزا', 'خدمات پاسپورت', 'ترجمه مدارک', 'تاییدیه قانونی'],
  },
  {
    id: '3',
    icon: 'scale',
    title: 'حمایت حقوقی',
    description: 'نمایندگی و مشاوره حقوقی حرفه‌ای برای امور مهاجرتی.',
    features: ['قانون مهاجرت', 'نمایندگی دادگاه', 'مشاوره حقوقی', 'تجدیدنظر پرونده'],
  },
  {
    id: '4',
    icon: 'home',
    title: 'خدمات اسکان',
    description: 'کمک در یافتن مسکن، کار و ادغام در جامعه جدید.',
    features: ['یافتن مسکن', 'کاریابی', 'آموزش زبان', 'ادغام اجتماعی'],
  },
  {
    id: '5',
    icon: 'users',
    title: 'تجدید دیدار خانواده',
    description: 'حمایت در بازگرداندن عزیزان شما از طریق کانال‌های قانونی.',
    features: ['درخواست اسپانسرشیپ', 'تهیه مدارک', 'آمادگی مصاحبه', 'پیگیری وضعیت'],
  },
  {
    id: '6',
    icon: 'phone',
    title: 'کمک اضطراری',
    description: 'پشتیبانی 24 ساعته برای موارد فوری و بحرانی مهاجرتی.',
    features: ['خطوط 24 ساعته', 'حمایت بحرانی', 'سفر اضطراری', 'پاسخ سریع'],
  },
];

const iconMap: Record<string, React.ElementType> = {
  shield: Shield,
  passport: FileCheck,
  scale: Scale,
  home: Home,
  users: Users,
  phone: Phone,
};

export default function Services() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="services" className="section-padding bg-gradient-to-b from-white to-primary-light/30 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            خدمات ما
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-navy mb-4">
            راه‌حل‌های جامع برای سفر شما
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            خدمات متنوع و تخصصی متناسب با نیازهای منحصر به فرد شما
          </p>
        </div>

        {/* Services Grid */}
        <div 
          ref={cardsRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            return (
              <Card
                key={service.id}
                className={`group card-3d card-hover bg-white/80 backdrop-blur-sm border-0 shadow-card transition-all duration-700 ${
                  cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-5 text-sm leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-5">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-success flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto text-primary hover:text-primary-dark hover:bg-transparent group/btn"
                  >
                    <span className="text-sm font-medium">اطلاعات بیشتر</span>
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover/btn:-translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div 
          className={`text-center mt-12 transition-all duration-700 delay-500 ${
            cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-gray-600 mb-4">
            نیاز به راهنمایی دارید؟ با ما تماس بگیرید
          </p>
          <Button className="btn-primary">
            مشاوره رایگان
            <ArrowLeft className="w-5 h-5 mr-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
