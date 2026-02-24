import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Locale } from '@/App';

interface TestimonialsProps {
  locale: Locale;
}

const content = {
  fa: {
    badge: 'نظرات کاربران',
    title: 'آنچه مراجعان ما می گویند',
    subtitle: 'تجربه های واقعی از پرونده های موفق',
    items: [
      {
        id: '1',
        name: 'سارا محمدی',
        role: 'متقاضی پناهندگی',
        image: '/images/testimonial-1.jpg',
        quote: 'تیم Panahyar در تمام مسیر کنار من بود و نتیجه ای عالی گرفتم.',
        rating: 5,
      },
      {
        id: '2',
        name: 'احمد کریمی',
        role: 'پرونده مهاجرت کاری',
        image: '/images/testimonial-2.jpg',
        quote: 'پشتیبانی دقیق و مسئولانه باعث شد پرونده من سریع تر پیش برود.',
        rating: 5,
      },
      {
        id: '3',
        name: 'ماریا لوپز',
        role: 'اقامت خانوادگی',
        image: '/images/testimonial-3.jpg',
        quote: 'راهنمایی ها مرحله به مرحله بود و هیچ بخش مبهمی باقی نماند.',
        rating: 5,
      },
      {
        id: '4',
        name: 'جان دیوید',
        role: 'اسپانسر خانواده',
        image: '/images/testimonial-4.jpg',
        quote: 'از ارتباط تا پیگیری پرونده، همه چیز حرفه ای و منظم انجام شد.',
        rating: 5,
      },
    ],
  },
  en: {
    badge: 'Client Stories',
    title: 'What our clients say',
    subtitle: 'Real outcomes from real immigration journeys',
    items: [
      {
        id: '1',
        name: 'Sara Mohammadi',
        role: 'Asylum applicant',
        image: '/images/testimonial-1.jpg',
        quote: 'Panahyar stayed with me through every step and delivered a great outcome.',
        rating: 5,
      },
      {
        id: '2',
        name: 'Ahmad Karimi',
        role: 'Work immigration case',
        image: '/images/testimonial-2.jpg',
        quote: 'Their detailed support helped my case move faster and with less stress.',
        rating: 5,
      },
      {
        id: '3',
        name: 'Maria Lopez',
        role: 'Family residence path',
        image: '/images/testimonial-3.jpg',
        quote: 'Everything was explained clearly, step by step, with no confusion.',
        rating: 5,
      },
      {
        id: '4',
        name: 'John David',
        role: 'Family sponsor',
        image: '/images/testimonial-4.jpg',
        quote: 'Communication and follow-up were excellent from start to finish.',
        rating: 5,
      },
    ],
  },
};

export default function Testimonials({ locale }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const t = content[locale];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % t.items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, t.items.length]);

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + t.items.length) % t.items.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % t.items.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setActiveIndex(index);
  };

  return (
    <section id="testimonials" className="section-padding bg-gradient-to-b from-white to-primary-light/30 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            {t.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-navy mb-4">
            {t.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <div
          className={`relative transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="relative bg-white rounded-3xl shadow-xl p-8 md:p-12 overflow-hidden">
            <div className="absolute top-8 right-8 w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Quote className="w-8 h-8 text-primary" />
            </div>

            <div className="relative">
              {t.items.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`transition-all duration-500 ${
                    index === activeIndex
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 absolute inset-0 translate-x-8'
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0">
                      <Avatar className="w-24 h-24 border-4 border-primary/20">
                        <AvatarImage src={testimonial.image} alt={testimonial.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1 text-center md:text-start">
                      <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                        ))}
                      </div>

                      <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                        "{testimonial.quote}"
                      </blockquote>

                      <div>
                        <p className="font-bold text-navy">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-8 pt-8 border-t">
              <div className="flex items-center gap-2">
                {t.items.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? 'bg-primary w-8'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`slide-${index + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrev}
                  className="rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNext}
                  className="rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
