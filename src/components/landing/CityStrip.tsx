'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MapPin } from 'lucide-react';

const CITIES = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Ahmedabad', 'Kolkata', 'Jaipur', 'Surat', 'Noida', 'Gurugram'];

export function CityStrip() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!trackRef.current) return;

    tweenRef.current = gsap.to(trackRef.current, {
      xPercent: -50,
      ease: 'none',
      duration: 28,
      repeat: -1,
    });

    // Slow on hover
    const el = trackRef.current.parentElement;
    const slow = () => tweenRef.current?.timeScale(0.3);
    const fast = () => gsap.to(tweenRef.current!, { timeScale: 1, duration: 0.4 });
    el?.addEventListener('mouseenter', slow);
    el?.addEventListener('mouseleave', fast);

    return () => {
      el?.removeEventListener('mouseenter', slow);
      el?.removeEventListener('mouseleave', fast);
      tweenRef.current?.kill();
    };
  }, []);

  const allCities = [...CITIES, ...CITIES];

  return (
    <div className="border-t border-b border-brand-border py-4 overflow-hidden cursor-default select-none">
      <div ref={trackRef} className="flex gap-0 whitespace-nowrap w-max">
        {allCities.map((city, i) => (
          <div key={`${city}-${i}`} className="flex items-center flex-shrink-0">
            <div className="flex items-center gap-2 px-8 group">
              <MapPin size={10} className="text-brand-teal group-hover:text-brand-gold transition-colors duration-200" />
              <span className="font-mono text-xs text-brand-gray group-hover:text-brand-gray-light transition-colors duration-200">
                {city}
              </span>
            </div>
            {/* Separator dot */}
            <span className="text-brand-border font-mono text-lg leading-none">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
