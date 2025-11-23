import React, { useEffect, useRef, useState } from 'react';
import { Reveal } from './Reveal';

const Counter = ({ end, suffix = "" }: { end: number, suffix?: string }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    }, []);
  
    useEffect(() => {
      if (!isVisible) return;
      let start = 0;
      const duration = 2000;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4); 
        
        setCount(Math.floor(ease * end));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, [isVisible, end]);
  
    return <span ref={ref}>{count}{suffix}</span>;
};

export const Results: React.FC = () => {
  return (
    <section id="results" className="py-32">
      <div className="container mx-auto px-6">
        
        <Reveal width="100%">
             <div className="border-t border-white/10 mb-12"></div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 md:divide-x divide-white/10">
            
            <Reveal delay={0} className="flex flex-col items-center md:items-start md:pr-12">
                <div className="text-[5rem] md:text-[7rem] leading-none font-display font-bold text-white mb-4 tracking-tighter">
                    <Counter end={40} suffix="%" />
                </div>
                <p className="text-xl font-medium text-white mb-2">Croissance CA</p>
                <p className="text-neutral-500 text-sm">Moyenne observée chez mes clients E-commerce après refonte.</p>
            </Reveal>

            <Reveal delay={200} className="flex flex-col items-center md:items-start md:px-12">
                 <div className="text-[5rem] md:text-[7rem] leading-none font-display font-bold text-white mb-4 tracking-tighter">
                    <Counter end={2} suffix="x" />
                </div>
                <p className="text-xl font-medium text-white mb-2">Vitesse</p>
                <p className="text-neutral-500 text-sm">Optimisation du code et du temps de chargement.</p>
            </Reveal>

            <Reveal delay={400} className="flex flex-col items-center md:items-start md:pl-12">
                 <div className="text-[5rem] md:text-[7rem] leading-none font-display font-bold text-white mb-4 tracking-tighter">
                    100<span className="text-primary text-6xl">.</span>
                </div>
                <p className="text-xl font-medium text-white mb-2">Satisfaction</p>
                <p className="text-neutral-500 text-sm">Je ne m'arrête pas tant que le résultat n'est pas parfait.</p>
            </Reveal>

        </div>
        
        <Reveal width="100%">
             <div className="border-b border-white/10 mt-12"></div>
        </Reveal>
      </div>
    </section>
  );
};