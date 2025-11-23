import React, { useEffect, useRef, useState } from 'react';
import { Reveal } from './Reveal';
import { useTranslation } from '../../utils/i18n/useTranslation';

type ResultCard = {
  id: string;
  type: 'counter' | 'static';
  value?: number;
  suffix?: string;
  staticValue?: string;
  title: string;
  description: string;
};

const RESULTS_COPY: Record<'fr' | 'en', ResultCard[]> = {
  fr: [
    {
      id: 'growth',
      type: 'counter',
      value: 40,
      suffix: '%',
      title: 'Croissance CA',
      description: 'Moyenne observée chez mes clients e-commerce après refonte.',
    },
    {
      id: 'speed',
      type: 'counter',
      value: 2,
      suffix: 'x',
      title: 'Vitesse',
      description: 'Optimisation du code et du temps de chargement.',
    },
    {
      id: 'satisfaction',
      type: 'static',
      staticValue: '100',
      title: 'Satisfaction',
      description: "Je ne m'arrête pas tant que le résultat n'est pas parfait.",
    },
  ],
  en: [
    {
      id: 'growth',
      type: 'counter',
      value: 40,
      suffix: '%',
      title: 'Revenue growth',
      description: 'Average uplift observed on e-commerce clients after a redesign.',
    },
    {
      id: 'speed',
      type: 'counter',
      value: 2,
      suffix: 'x',
      title: 'Speed',
      description: 'Code and loading time optimizations.',
    },
    {
      id: 'satisfaction',
      type: 'static',
      staticValue: '100',
      title: 'Satisfaction',
      description: "I do not stop until every detail is perfect.",
    },
  ],
};

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
  const { language } = useTranslation();
  const cards = RESULTS_COPY[language];
  const alignment = ['md:pr-12', 'md:px-12', 'md:pl-12'];
  return (
    <section id="results" className="py-32">
      <div className="container mx-auto px-6">
        
        <Reveal width="100%">
             <div className="border-t border-white/10 mb-12"></div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 md:divide-x divide-white/10">
          {cards.map((card, index) => (
            <Reveal
              key={card.id}
              delay={index * 200}
              className={`flex flex-col items-center md:items-start ${alignment[index]}`.trim()}
            >
              <div className="text-[5rem] md:text-[7rem] leading-none font-display font-bold text-white mb-4 tracking-tighter">
                {card.type === 'counter' && card.value !== undefined ? (
                  <Counter end={card.value} suffix={card.suffix} />
                ) : (
                  <>
                    {card.staticValue}
                    <span className="text-primary text-6xl">.</span>
                  </>
                )}
              </div>
              <p className="text-xl font-medium text-white mb-2">{card.title}</p>
              <p className="text-neutral-500 text-sm">{card.description}</p>
            </Reveal>
          ))}
        </div>
        
        <Reveal width="100%">
             <div className="border-b border-white/10 mt-12"></div>
        </Reveal>
      </div>
    </section>
  );
};