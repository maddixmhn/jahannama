import { ArrowLeft, Phone } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Button } from '@/components/ui/button';

interface CTAProps {
  onCtaClick: () => void;
}

export default function CTA({ onCtaClick }: CTAProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      {/* Background with Diagonal Split */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark"
          style={{ clipPath: 'polygon(0 0, 70% 0, 55% 100%, 0 100%)' }}
        />
        <div 
          className="absolute inset-0 bg-white"
          style={{ clipPath: 'polygon(70% 0, 100% 0, 100% 100%, 55% 100%)' }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div 
            className={`text-white transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
              آماده شروع سفر خود هستید؟
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-lg">
              امروز مشاوره رایگان بگیرید. بدون هیچ تعهدی، فقط مشاوره تخصصی برای حرکت به جلو.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onCtaClick}
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 rounded-xl font-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                مشاوره رایگان
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-3 text-white/80">
              <Phone className="w-5 h-5" />
              <span>یا با ما تماس بگیرید:</span>
              <a 
                href="tel:+15551234567" 
                className="font-medium text-white hover:underline"
              >
                +1 (555) 123-4567
              </a>
            </div>
          </div>

          {/* Right Content - Image */}
          <div 
            className={`hidden lg:block transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80"
                  alt="Our team"
                  className="w-full h-[400px] object-cover"
                />
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-navy">500+</p>
                    <p className="text-sm text-gray-500">مورد موفق</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
