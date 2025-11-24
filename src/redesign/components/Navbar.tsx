import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { PageView, NavItem } from '../types';
import { useTranslation } from '../../utils/i18n/useTranslation';

type ContentMenu = {
  label: string;
  description: string;
  items: NavItem[];
};

type NavCopy = {
  primary: NavItem[];
  contentMenu: ContentMenu;
  dashboard: string;
  adminDashboard: string;
};

const NAV_COPY: Record<'fr' | 'en', NavCopy> = {
  fr: {
    primary: [
      { id: 'home', label: 'Accueil', href: '#' },
      { id: 'services', label: 'Services', href: '#' },
      { id: 'contact', label: 'Contact', href: '#' },
    ],
    contentMenu: {
      label: 'Contenus',
      description: 'Portfolio, études, blog et avis clients',
      items: [
        { id: 'portfolio', label: 'Portfolio', href: '#' },
        { id: 'casestudies', label: 'Études de cas', href: '#' },
        { id: 'blog', label: 'Blog', href: '#' },
        { id: 'reviews', label: 'Avis clients', href: '#' },
      ],
    },
    dashboard: 'Tableau de bord',
    adminDashboard: 'Espace admin',
  },
  en: {
    primary: [
      { id: 'home', label: 'Home', href: '#' },
      { id: 'services', label: 'Services', href: '#' },
      { id: 'contact', label: 'Contact', href: '#' },
    ],
    contentMenu: {
      label: 'Content',
      description: 'Portfolio, case studies, blog & reviews',
      items: [
        { id: 'portfolio', label: 'Portfolio', href: '#' },
        { id: 'casestudies', label: 'Case Studies', href: '#' },
        { id: 'blog', label: 'Blog', href: '#' },
        { id: 'reviews', label: 'Reviews', href: '#' },
      ],
    },
    dashboard: 'Dashboard',
    adminDashboard: 'Admin dashboard',
  },
};

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { language, setLanguage } = useTranslation();
  const copy = NAV_COPY[language];
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contentMenuOpen, setContentMenuOpen] = useState(false);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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
    setContentMenuOpen(false);
  };

  const isContentActive = copy.contentMenu.items.some((item) => item.id === currentPage);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setContentMenuOpen(false), 150);
  };

  const handleMouseLeaveArea = (
    event: React.MouseEvent,
    source: 'trigger' | 'dropdown'
  ) => {
    const nextTarget = event.relatedTarget as Node | null;
    if (!nextTarget) {
      scheduleClose();
      return;
    }

    if (source === 'trigger' && dropdownRef.current?.contains(nextTarget)) {
      return;
    }

    if (source === 'dropdown' && triggerRef.current?.contains(nextTarget)) {
      return;
    }

    scheduleClose();
  };

  const openContentMenu = () => {
    clearCloseTimer();
    setContentMenuOpen(true);
  };

  useEffect(() => () => clearCloseTimer(), []);

  const renderLanguageSwitch = (variant: 'desktop' | 'mobile' = 'desktop') => (
    <div className={`flex items-center gap-1 rounded-full border border-white/10 px-1 py-1 ${variant === 'desktop' ? 'bg-white/5' : 'bg-white/10 mt-8'}`}>
      {(['fr', 'en'] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => {
            setLanguage(lang);
            if (variant === 'mobile') {
              setMobileMenuOpen(false);
            }
          }}
          className={`px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] rounded-full transition-colors ${
            language === lang ? 'bg-white text-black' : 'text-white/60 hover:text-white'
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );

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
            <div className="hidden md:flex items-center gap-6">
              {copy.primary.map((item) => (
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

              <div className="relative">
                <button
                  ref={triggerRef}
                  onMouseEnter={openContentMenu}
                  onMouseLeave={(event) => handleMouseLeaveArea(event, 'trigger')}
                  onFocus={openContentMenu}
                  onBlur={scheduleClose}
                  onClick={(e) => {
                    e.preventDefault();
                    setContentMenuOpen((prev) => !prev);
                  }}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors rounded-full px-4 py-2 border border-transparent ${
                    isContentActive ? 'text-white border-white/20 bg-white/5' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {copy.contentMenu.label}
                  <ChevronDown className={`h-4 w-4 transition-transform ${contentMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {contentMenuOpen && (
                  <div
                    ref={dropdownRef}
                    onMouseEnter={openContentMenu}
                    onMouseLeave={(event) => handleMouseLeaveArea(event, 'dropdown')}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 rounded-2xl bg-[#0F0F0F]/95 border border-white/10 shadow-2xl p-3 space-y-2"
                  >
                    <p className="text-[11px] text-white/50 px-2">{copy.contentMenu.description}</p>
                    {copy.contentMenu.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                          currentPage === item.id ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

              {/* CTA & language */}
              <div className="flex items-center gap-4">
                <div className="hidden md:block">
                  {renderLanguageSwitch('desktop')}
                </div>
                 <button
                onClick={() => handleNavClick('admin')}
                className="hidden md:block px-5 py-2 bg-white text-black rounded-full font-semibold text-xs uppercase tracking-wide hover:bg-primary transition-colors"
                >
                {copy.dashboard}
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

        <div className="space-y-6 text-center">
          {copy.primary.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-5xl font-display font-bold transition-colors block w-full ${
                currentPage === item.id ? 'text-primary' : 'text-white hover:text-primary'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="space-y-4 mt-10">
            <p className="text-xs uppercase tracking-[0.5em] text-white/40">{copy.contentMenu.label}</p>
            {copy.contentMenu.items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-4xl font-display font-semibold transition-colors block w-full ${
                  currentPage === item.id ? 'text-primary' : 'text-white/80 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        {renderLanguageSwitch('mobile')}
        <button
            onClick={() => handleNavClick('admin')}
            className="mt-8 px-8 py-4 bg-white text-black rounded-full font-bold text-xl"
        >
            {copy.adminDashboard}
        </button>
    </div>
    </>
  );
};