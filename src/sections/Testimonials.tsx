import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Testimonial } from '@/types';

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'سارا محمدی',
    role: 'متقاضی پناهندگی از سوریه',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    quote: 'Panahyar به من امید داد وقتی هیچ امیدی نداشتم. تیم آنها در هر مرحله کنارم بود و اکنون با خانواده‌ام در امنیت هستم.',
    rating: 5,
  },
  {
    id: '2',
    name: 'احمد کریمی',
    role: 'پناهنده از افغانستان',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    quote: 'حرفه‌ای، دلسوز و متعهد. آنها غیرممکن را برای من و فرزندانم ممکن کردند.',
    rating: 5,
  },
  {
    id: '3',
    name: 'ماریا لopez',
    role: 'مهاجر از ونزوئلا',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    quote: 'مشاوره رایگان بود اما ارزش آن بی‌نهایت بود. بدون آنها نمی‌توانستم این فرآیند را طی کنم.',
    rating: 5,
  },
  {
    id: '4',
    name: 'جان دیوید',
    role: 'اسپانسر از آمریکا',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    quote: 'بازگرداندن بستگانم به لطف تخصص Panahyar بدون دردسر بود.',
    rating: 5,
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setActiveIndex(index);
  };

  return (
    <section id="testimonials" className="section-padding bg-gradient-to-b from-white to-primary-light/30 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div 
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            نظرات مشتریان
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-navy mb-4">
            آنچه مشتریان ما می‌گویند
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            داستان‌های واقعی از افرادی که به ما کمک کرده‌ایم
          </p>
        </div>

        {/* Carousel */}
        <div 
          className={`relative transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Main Card */}
          <div className="relative bg-white rounded-3xl shadow-xl p-8 md:p-12 overflow-hidden">
            {/* Quote Icon */}
            <div className="absolute top-8 right-8 w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Quote className="w-8 h-8 text-primary" />
            </div>

            {/* Content */}
            <div className="relative">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`transition-all duration-500 ${
                    index === activeIndex
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 absolute inset-0 translate-x-8'
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <Avatar className="w-24 h-24 border-4 border-primary/20">
                        <AvatarImage src={testimonial.image} alt={testimonial.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Quote */}
                    <div className="flex-1 text-center md:text-right">
                      {/* Rating */}
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

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t">
              {/* Dots */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? 'bg-primary w-8'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              {/* Arrows */}
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

          {/* Side Cards (3D Effect) */}
          <div className="hidden lg:block">
            {[-1, 1].map((offset) => {
              const index = (activeIndex + offset + testimonials.length) % testimonials.length;
              const testimonial = testimonials[index];
              return (
                <div
                  key={offset}
                  className={`absolute top-1/2 ${
                    offset === -1 ? 'right-full mr-8' : 'left-full ml-8'
                  } w-64 -translate-y-1/2 opacity-30 scale-75 transition-all duration-500`}
                >
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <Avatar className="w-16 h-16 mx-auto mb-4">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="text-center font-medium text-sm truncate">{testimonial.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
