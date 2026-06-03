import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxBackgroundProps {
  isDark?: boolean;
}

export default function ParallaxBackground({ isDark = false }: ParallaxBackgroundProps) {
  const bgRef = useRef<HTMLDivElement>(null);
  const floatingShapesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create parallax effect for background
    const ctx = gsap.context(() => {
      // Fixed background with subtle movement
      gsap.to(bgRef.current, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });

      // Floating shapes parallax
      if (floatingShapesRef.current) {
        const shapes = floatingShapesRef.current.children;
        Array.from(shapes).forEach((shape, index) => {
          const direction = index % 2 === 0 ? 1 : -1;
          const speed = 5 + Math.random() * 10;
          
          gsap.to(shape, {
            y: direction * speed * -1,
            x: direction * 3,
            rotation: direction * 5,
            ease: 'none',
            scrollTrigger: {
              trigger: 'body',
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.5,
            },
          });
        });
      }

      // Subtle scale effect on scroll
      gsap.to(bgRef.current, {
        scale: 1.02,
        ease: 'none',
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={bgRef}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      style={{
        background: isDark 
          ? 'linear-gradient(135deg, #0a0f1e 0%, #0d1525 50%, #0a0f1e 100%)'
          : 'linear-gradient(135deg, #FDFBF7 0%, #F9F5EB 50%, #FDFBF7 100%)',
      }}
    >
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${isDark ? '#ffffff' : '#000000'} 1px, transparent 1px),
            linear-gradient(to bottom, ${isDark ? '#ffffff' : '#000000'} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating organic shapes */}
      <div ref={floatingShapesRef} className="absolute inset-0">
        {/* Shape 1 - Top left */}
        <div 
          className="absolute rounded-full blur-3xl"
          style={{
            width: '400px',
            height: '400px',
            left: '-5%',
            top: '10%',
            background: isDark 
              ? 'radial-gradient(circle, rgba(13, 115, 119, 0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(13, 115, 119, 0.08) 0%, transparent 70%)',
          }}
        />

        {/* Shape 2 - Top right */}
        <div 
          className="absolute rounded-full blur-3xl"
          style={{
            width: '350px',
            height: '350px',
            right: '-3%',
            top: '20%',
            background: isDark 
              ? 'radial-gradient(circle, rgba(244, 162, 97, 0.12) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(244, 162, 97, 0.06) 0%, transparent 70%)',
          }}
        />

        {/* Shape 3 - Bottom left */}
        <div 
          className="absolute rounded-full blur-3xl"
          style={{
            width: '300px',
            height: '300px',
            left: '5%',
            bottom: '15%',
            background: isDark 
              ? 'radial-gradient(circle, rgba(13, 115, 119, 0.1) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(13, 115, 119, 0.05) 0%, transparent 70%)',
          }}
        />

        {/* Shape 4 - Bottom right */}
        <div 
          className="absolute rounded-full blur-3xl"
          style={{
            width: '450px',
            height: '450px',
            right: '10%',
            bottom: '5%',
            background: isDark 
              ? 'radial-gradient(circle, rgba(244, 162, 97, 0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(244, 162, 97, 0.04) 0%, transparent 70%)',
          }}
        />

        {/* Shape 5 - Center */}
        <div 
          className="absolute rounded-full blur-3xl"
          style={{
            width: '500px',
            height: '500px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: isDark 
              ? 'radial-gradient(circle, rgba(13, 115, 119, 0.06) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(13, 115, 119, 0.03) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Gradient overlay for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'linear-gradient(180deg, transparent 0%, rgba(10, 15, 30, 0.3) 100%)'
            : 'linear-gradient(180deg, transparent 0%, rgba(253, 251, 247, 0.2) 100%)',
        }}
      />
    </div>
  );
}