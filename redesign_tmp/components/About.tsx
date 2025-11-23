import React from 'react';

const stats = [
  { value: "5+", label: "Years Experience" },
  { value: "50+", label: "Projects Completed" },
  { value: "100%", label: "Client Satisfaction" },
  { value: "12", label: "Design Awards" }
];

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
        {/* Marquee Background */}
        <div className="absolute top-0 w-full overflow-hidden opacity-5 pointer-events-none">
            <div className="whitespace-nowrap animate-marquee py-4">
                <span className="text-9xl font-display font-bold text-white mx-4">UI DESIGN • UX RESEARCH • PROTOTYPING • STRATEGY •</span>
                <span className="text-9xl font-display font-bold text-white mx-4">UI DESIGN • UX RESEARCH • PROTOTYPING • STRATEGY •</span>
            </div>
        </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-8 text-center">
            Designing with Purpose
          </h2>
          <div className="glass-card p-8 md:p-12 rounded-3xl border border-white/10 mb-12">
            <p className="text-xl md:text-2xl text-neutral-300 leading-relaxed font-light">
              I believe that great design is invisible. It's about creating experiences that feel natural, intuitive, and delightful. My approach combines data-driven insights with creative exploration to build products that not only look good but solve real problems.
            </p>
            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-8">
                <div>
                    <h4 className="text-white font-bold mb-2">My Toolstack</h4>
                    <p className="text-neutral-400">Figma, Adobe XD, Spline, React, Webflow, Framer</p>
                </div>
                <div>
                     <h4 className="text-white font-bold mb-2">My Focus</h4>
                    <p className="text-neutral-400">SaaS, E-Commerce, Fintech, Web3</p>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-neutral-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};