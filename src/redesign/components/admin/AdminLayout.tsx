import React, { useState } from 'react';
import { LayoutDashboard, Briefcase, ShoppingBag, MessageSquare, LogOut, Menu, X, FileText, Users, Calendar, DollarSign, BookOpen } from 'lucide-react';
import { AdminView } from '../../types';

interface AdminLayoutProps {
  currentView: AdminView;
  onChangeView: (view: AdminView) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentView, onChangeView, onLogout, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'crm', label: 'CRM & clients', icon: Users },
    { id: 'calendar', label: 'Agenda', icon: Calendar },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { type: 'separator' },
    { id: 'projects', label: 'Portfolio', icon: Briefcase },
    { id: 'casestudies', label: 'Études de cas', icon: FileText },
    { id: 'blog', label: 'Blog', icon: BookOpen },
    { id: 'services', label: 'Offres & services', icon: ShoppingBag },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans">
      
      {/* Mobile Toggle */}
      <button 
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-[#111] border border-white/10 rounded text-white"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-[#080808] border-r border-white/5 transition-transform duration-300 ease-in-out md:translate-x-0 md:static flex flex-col shadow-2xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
          <div className="p-8 border-b border-white/5">
              <div className="flex items-center gap-2 mb-2">
                 <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black font-bold font-display">M.</div>
                 <h2 className="text-xl font-display font-bold text-white tracking-tight">Maxence<span className="text-neutral-600">Admin</span></h2>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full w-fit border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Système en ligne</span>
              </div>
          </div>

          <nav className="p-6 space-y-1 flex-1 overflow-y-auto">
              <div className="text-xs font-mono text-neutral-600 uppercase tracking-widest mb-4 px-4">Menu principal</div>
              {menuItems.map((item, index) => (
                  item.type === 'separator' ? (
                    <div key={index} className="h-[1px] bg-white/5 my-6 mx-4"></div>
                  ) : (
                    <button
                        key={item.id}
                        onClick={() => { if(item.id) onChangeView(item.id as AdminView); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-medium transition-all group ${
                            currentView === item.id 
                            ? 'bg-white text-black font-bold shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]' 
                            : 'text-neutral-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {/* @ts-ignore */}
                        <item.icon size={18} className={`transition-colors ${currentView === item.id ? 'text-black' : 'text-neutral-600 group-hover:text-white'}`} />
                        {item.label}
                    </button>
                  )
              ))}
          </nav>

          <div className="p-6 border-t border-white/5 bg-[#050505]">
              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-neutral-500 hover:bg-red-500/5 hover:text-red-500 transition-colors border border-transparent hover:border-red-500/10"
              >
                  <LogOut size={18} /> Déconnexion
              </button>
          </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen relative bg-[#050505]">
          <div className="p-8 md:p-12 max-w-[1600px] mx-auto">
            {children}
          </div>
      </main>

    </div>
  );
};