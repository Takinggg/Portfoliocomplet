import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { PageView, NavItem } from '../types';

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', href: '#' },
  { id: 'services', label: 'Services', href: '#' },
  { id: 'portfolio', label: 'Portfolio', href: '#' },
  { id: 'casestudies', label: 'Case Studies', href: '#' },
  { id: 'contact', label: 'Contact', href: '#' },
];

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    onNavigate(id as PageView);
    setMobileMenuOpen(false);
  };

  return (
    <>
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
        <nav
          className={`pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            scrolled ? 'w-auto' : 'w-full max-w-5xl'
          }`}
        >
          <div className={`bg-[#0F0F0F]/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl shadow-black/20 ${scrolled ? 'gap-8' : ''}`}>
            
            {/* Logo */}
            <button onClick={() => handleNavClick('home')} className="font-display font-bold text-xl text-white tracking-tight">
               M<span className="text-primary">.</span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-sm font-medium transition-colors relative group ${
                    currentPage === item.id ? 'text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {item.label}
                  {currentPage === item.id && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
                  )}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4">
                 <button
                onClick={() => handleNavClick('admin')}
                className="hidden md:block px-5 py-2 bg-white text-black rounded-full font-semibold text-xs uppercase tracking-wide hover:bg-primary transition-colors"
                >
                Dashboard
                </button>
                
                {/* Mobile Toggle */}
                <button
                className="md:hidden text-white p-1"
                onClick={() => setMobileMenuOpen(true)}
                >
                <Menu size={20} />
                </button>
            </div>

          </div>
        </nav>
    </div>

    {/* Mobile Menu Overlay */}
    <div
        className={`fixed inset-0 bg-[#050505] z-[60] flex flex-col items-center justify-center space-y-8 transition-all duration-500 ${
        mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
    >
        <button 
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-8 right-8 text-white hover:text-primary"
        >
            <X size={32} />
        </button>

        {navItems.map((item) => (
        <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`text-5xl font-display font-bold transition-colors ${
                currentPage === item.id ? 'text-primary' : 'text-white hover:text-primary'
            }`}
        >
            {item.label}
        </button>
        ))}
        <button
            onClick={() => handleNavClick('admin')}
            className="mt-8 px-8 py-4 bg-white text-black rounded-full font-bold text-xl"
        >
            Admin Dashboard
        </button>
    </div>
    </>
  );
};