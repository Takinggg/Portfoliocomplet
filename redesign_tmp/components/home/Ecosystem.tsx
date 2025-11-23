import React, { useRef, useState, useEffect } from 'react';
import { Reveal } from '../Reveal';
import { 
  Database, CreditCard, LayoutDashboard, 
  Activity, Users, Globe, Shield, Zap, Terminal, 
  Command, Cpu, Bell, Search, Check, Loader2,
  Settings, FileText, ToggleLeft, ToggleRight, Copy, Eye, Lock
} from 'lucide-react';

const USERS_DATA = [
  { name: "Alice M.", status: "Active", role: "Admin", time: "2m ago" },
  { name: "Jean P.", status: "Offline", role: "Editor", time: "1h ago" },
  { name: "Sarah L.", status: "Active", role: "Viewer", time: "Just now" },
];

const AUTOMATION_LOGS = [
  { action: "Email Sent", trigger: "Welcome Flow", status: "Success" },
  { action: "Lead Scored", trigger: "CRM Update", status: "Success" },
  { action: "Invoice Gen", trigger: "Stripe Event", status: "Pending" },
];

const CONTENT_COLLECTIONS = [
    { name: 'Blog Posts', count: 12, status: 'Published' },
    { name: 'Case Studies', count: 8, status: 'Published' },
    { name: 'Products', count: 142, status: 'Syncing' },
    { name: 'Authors', count: 4, status: 'Draft' },
];

export const Ecosystem: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('overview');
  const [deploying, setDeploying] = useState(false);
  const [revenue, setRevenue] = useState(12450);
  const [notifications, setNotifications] = useState<string[]>([]);
  
  // Settings State
  const [settings, setSettings] = useState({
      maintenance: false,
      registration: true,
      mfa: true
  });

  // Mouse Parallax Logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  // Simulate Live Revenue & Notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setRevenue(prev => prev + Math.floor(Math.random() * 100));
        showNotification("New Sale: +$99.00");
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const showNotification = (msg: string) => {
    setNotifications(prev => [...prev, msg]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 3000);
  };

  const handleDeploy = () => {
    setDeploying(true);
    setTimeout(() => {
      setDeploying(false);
      showNotification("Deployment Successful 🚀");
    }, 2500);
  };

  return (
    <section className="py-32 bg-[#050505] relative overflow-hidden">
      
      {/* Background Grid Beam */}
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
             <Reveal>
                <h2 className="font-display font-semibold text-5xl md:text-7xl text-white leading-[0.9]">
                    Digital<br/>Command Center<span className="text-primary">.</span>
                </h2>
            </Reveal>
            <Reveal delay={200}>
                <p className="text-neutral-400 max-w-md font-light leading-relaxed text-lg text-right">
                    Une interface interactive. Cliquez sur le dashboard pour explorer les fonctionnalités.
                </p>
            </Reveal>
        </div>

        {/* 3D INTERACTIVE STAGE */}
        <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full min-h-[650px] perspective-1000 group"
        >
            
            {/* Main Dashboard Board */}
            <div 
                className="absolute inset-0 bg-[#0A0A0A] rounded-2xl border border-white/10 shadow-2xl overflow-hidden transition-transform duration-200 ease-out flex flex-col"
                style={{
                    transform: `rotateY(${mousePosition.x * 5}deg) rotateX(${mousePosition.y * -5}deg) translateZ(0px)`
                }}
            >
                {/* Scanner Effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/50 shadow-[0_0_30px_rgba(204,255,0,0.5)] z-50 animate-[scan_4s_ease-in-out_infinite] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                {/* TOP BAR */}
                <div className="h-16 border-b border-white/5 bg-[#0F0F0F] flex items-center justify-between px-6 shrink-0 z-20">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                    
                    {/* Fake Search Bar */}
                    <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-[#050505] border border-white/5 rounded-lg w-1/3">
                        <Search size={14} className="text-neutral-500" />
                        <span className="text-xs text-neutral-600 font-mono">Search modules... (Cmd+K)</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded bg-green-500/10 border border-green-500/20 text-[10px] font-mono text-green-400">
                            <Shield size={10} />
                            <span>SECURE</span>
                        </div>
                        <div className="relative">
                            <Bell size={16} className="text-neutral-400" />
                            {notifications.length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></span>}
                        </div>
                    </div>
                </div>

                {/* MAIN BODY */}
                <div className="flex flex-1 overflow-hidden relative">
                    
                    {/* SIDEBAR */}
                    <div className="w-64 border-r border-white/5 bg-[#0C0C0C] p-6 hidden md:flex flex-col gap-2 z-10">
                        <div className="text-xs font-mono text-neutral-600 uppercase tracking-widest mb-4">Platform</div>
                        {[
                            { id: 'overview', icon: LayoutDashboard, label: "Overview" },
                            { id: 'clients', icon: Users, label: "CRM Clients" },
                            { id: 'content', icon: Globe, label: "Content API" },
                            { id: 'automation', icon: Zap, label: "Automation" },
                            { id: 'settings', icon: Settings, label: "Settings" },
                        ].map((item) => (
                            <button 
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all text-left ${
                                    activeTab === item.id 
                                    ? 'bg-white/10 text-white border border-white/5 shadow-lg' 
                                    : 'text-neutral-500 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <item.icon size={18} className={activeTab === item.id ? 'text-primary' : ''} />
                                <span className="text-sm font-medium">{item.label}</span>
                            </button>
                        ))}

                        <div className="mt-auto p-4 rounded-xl bg-[#080808] border border-white/5">
                            <div className="flex items-center gap-2 text-neutral-300 mb-2">
                                <Activity size={14} />
                                <span className="text-xs font-bold uppercase">Status</span>
                            </div>
                            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-3/4 animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* CONTENT AREA */}
                    <div className="flex-1 bg-[#050505] relative p-8 overflow-hidden">
                        {/* Grid Pattern */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                        
                        {/* HEADER OF CONTENT */}
                        <div className="flex justify-between items-end mb-8 relative z-10">
                            <div>
                                <h3 className="text-3xl font-display font-medium text-white mb-1 capitalize">{activeTab}</h3>
                                <p className="text-neutral-500 text-sm">Real-time ecosystem overview.</p>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={handleDeploy}
                                    disabled={deploying}
                                    className="bg-white text-black px-4 py-2 rounded text-xs font-bold uppercase tracking-wide hover:bg-primary transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {deploying ? <Loader2 size={14} className="animate-spin"/> : <Zap size={14} fill="currentColor"/>}
                                    {deploying ? 'Building...' : 'Deploy App'}
                                </button>
                            </div>
                        </div>

                        {/* DYNAMIC CONTENT SWITCHER */}
                        <div className="relative z-10 h-full animate-in fade-in duration-500 key={activeTab}">
                            
                            {/* TAB: OVERVIEW */}
                            {activeTab === 'overview' && (
                                <div className="grid grid-cols-3 gap-6 h-full pb-12 overflow-y-auto">
                                    {/* Revenue Card */}
                                    <div className="col-span-2 bg-[#0F0F0F] border border-white/5 rounded-xl p-6 relative overflow-hidden group">
                                        <div className="flex justify-between items-start mb-8">
                                            <div>
                                                <p className="text-neutral-500 text-xs uppercase tracking-wider">Total Revenue</p>
                                                <h4 className="text-4xl font-display text-white mt-2">${revenue.toLocaleString()}</h4>
                                            </div>
                                            <div className="text-green-400 text-xs bg-green-500/10 px-2 py-1 rounded border border-green-500/20">+12.5%</div>
                                        </div>
                                        {/* Animated Chart Line */}
                                        <div className="absolute bottom-0 left-0 right-0 h-24 opacity-50">
                                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                <path d="M0 100 C 20 0 50 0 100 100" stroke="url(#gradient)" strokeWidth="2" fill="url(#fillGradient)" className="animate-[pulse-slow_3s_ease-in-out_infinite]" />
                                                <defs>
                                                    <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#CCFF00" stopOpacity="0.2" />
                                                        <stop offset="100%" stopColor="#CCFF00" stopOpacity="0" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Stat Card */}
                                    <div className="bg-[#0F0F0F] border border-white/5 rounded-xl p-6 flex flex-col justify-between">
                                        <div>
                                            <p className="text-neutral-500 text-xs uppercase tracking-wider">Active Sessions</p>
                                            <h4 className="text-3xl font-display text-white mt-2">842</h4>
                                        </div>
                                        <div className="flex gap-1 h-8 items-end mt-4">
                                            {[40,60,30,80,50,90,70].map((h,i) => (
                                                <div key={i} className="flex-1 bg-primary/20 rounded-sm hover:bg-primary transition-colors h-full relative group">
                                                    <div className="absolute bottom-0 w-full bg-primary rounded-sm transition-all duration-1000" style={{height: `${h}%`}}></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recent Activity */}
                                    <div className="col-span-3 bg-[#0F0F0F] border border-white/5 rounded-xl p-6">
                                        <p className="text-neutral-500 text-xs uppercase tracking-wider mb-4">System Logs</p>
                                        <div className="space-y-3">
                                            {[1,2,3].map((_, i) => (
                                                <div key={i} className="flex items-center justify-between text-sm border-b border-white/5 pb-2 last:border-0">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                        <span className="text-neutral-300">Database backup completed</span>
                                                    </div>
                                                    <span className="text-neutral-600 font-mono text-xs">00:0{i+1}:23</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: CLIENTS */}
                            {activeTab === 'clients' && (
                                <div className="bg-[#0F0F0F] border border-white/5 rounded-xl overflow-hidden h-full">
                                    <table className="w-full text-left text-sm text-neutral-400">
                                        <thead className="bg-white/5 text-xs uppercase font-mono">
                                            <tr>
                                                <th className="p-4">User</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4">Role</th>
                                                <th className="p-4 text-right">Last Active</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {USERS_DATA.map((user, i) => (
                                                <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-4 text-white font-medium">{user.name}</td>
                                                    <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] uppercase border ${user.status === 'Active' ? 'border-green-500/30 text-green-500 bg-green-500/10' : 'border-neutral-500/30 text-neutral-500'}`}>{user.status}</span></td>
                                                    <td className="p-4">{user.role}</td>
                                                    <td className="p-4 text-right font-mono text-xs">{user.time}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            
                            {/* TAB: CONTENT */}
                            {activeTab === 'content' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
                                    {/* Content List */}
                                    <div className="bg-[#0F0F0F] border border-white/5 rounded-xl overflow-hidden flex flex-col">
                                         <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#0A0A0A]">
                                            <span className="text-xs font-bold uppercase text-neutral-500 tracking-wider">Collections</span>
                                            <button className="text-[10px] bg-primary text-black px-2 py-1 rounded font-bold hover:bg-white transition-colors">NEW</button>
                                         </div>
                                         <div className="flex-1 overflow-y-auto">
                                            {CONTENT_COLLECTIONS.map((item, i) => (
                                                <div key={i} className="p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer flex justify-between items-center group transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <FileText size={16} className="text-neutral-600 group-hover:text-primary transition-colors"/>
                                                        <span className="text-sm text-neutral-300 group-hover:text-white font-medium">{item.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] text-neutral-600 group-hover:text-neutral-400">{item.status}</span>
                                                        <span className="text-[10px] bg-white/5 px-2 py-1 rounded-full text-neutral-500 border border-white/5">{item.count}</span>
                                                    </div>
                                                </div>
                                            ))}
                                         </div>
                                    </div>

                                    {/* JSON Preview */}
                                    <div className="bg-[#080808] border border-white/5 rounded-xl p-6 font-mono text-xs relative group overflow-hidden flex flex-col">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-neutral-500 text-[10px] uppercase">API Response Preview</span>
                                            <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded text-[10px] text-neutral-300 cursor-pointer hover:bg-white/10 transition-colors">
                                                <Copy size={10} /> Copy JSON
                                            </div>
                                        </div>
                                        <div className="text-neutral-600 mb-2 select-none">// GET /api/v1/posts/latest</div>
                                        <div className="text-green-400/90 overflow-y-auto custom-scrollbar">
{`{
  "status": "success",
  "data": [
    {
      "id": "ck89s-220a",
      "title": "Future of UI Design",
      "published": true,
      "author": {
         "id": 1,
         "name": "Maxence"
      },
      "views": 1204
    },
    {
      "id": "ck89s-220b",
      "title": "React Server Components",
      "published": true,
      "views": 856
    }
  ]
}`}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: AUTOMATION */}
                            {activeTab === 'automation' && (
                                <div className="grid grid-cols-1 gap-4 h-full overflow-y-auto pb-8">
                                    {AUTOMATION_LOGS.map((log, i) => (
                                        <div key={i} className="bg-[#0F0F0F] border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-primary/50 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-primary group-hover:text-black transition-colors">
                                                    <Zap size={18} />
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium text-sm">{log.action}</div>
                                                    <div className="text-xs text-neutral-500">Trigger: {log.trigger}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-green-500 text-xs uppercase font-bold">
                                                <Check size={12} /> {log.status}
                                            </div>
                                        </div>
                                    ))}
                                    <button className="w-full py-3 border border-dashed border-white/10 rounded-xl text-neutral-500 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm">
                                        <PlusIcon /> Create New Workflow
                                    </button>
                                </div>
                            )}
                            
                            {/* TAB: SETTINGS */}
                            {activeTab === 'settings' && (
                                <div className="max-w-3xl h-full overflow-y-auto pr-2 pb-8">
                                    <div className="bg-[#0F0F0F] border border-white/5 rounded-xl p-6 mb-6">
                                        <h4 className="text-white font-medium mb-6 flex items-center gap-2">
                                            <Settings size={16} /> General Settings
                                        </h4>
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between group">
                                                <div>
                                                    <div className="text-sm text-neutral-300 group-hover:text-white transition-colors">Maintenance Mode</div>
                                                    <div className="text-xs text-neutral-500">Disable public access to the application</div>
                                                </div>
                                                <button onClick={() => setSettings(s => ({...s, maintenance: !s.maintenance}))} className={`transition-colors ${settings.maintenance ? 'text-primary' : 'text-neutral-700'}`}>
                                                     {settings.maintenance ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                                </button>
                                            </div>
                                             <div className="flex items-center justify-between group">
                                                <div>
                                                    <div className="text-sm text-neutral-300 group-hover:text-white transition-colors">Public Registration</div>
                                                    <div className="text-xs text-neutral-500">Allow new users to create accounts</div>
                                                </div>
                                                <button onClick={() => setSettings(s => ({...s, registration: !s.registration}))} className={`transition-colors ${settings.registration ? 'text-primary' : 'text-neutral-700'}`}>
                                                     {settings.registration ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between group">
                                                <div>
                                                    <div className="text-sm text-neutral-300 group-hover:text-white transition-colors">Two-Factor Auth (2FA)</div>
                                                    <div className="text-xs text-neutral-500">Enforce 2FA for all admin users</div>
                                                </div>
                                                <button onClick={() => setSettings(s => ({...s, mfa: !s.mfa}))} className={`transition-colors ${settings.mfa ? 'text-primary' : 'text-neutral-700'}`}>
                                                     {settings.mfa ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#0F0F0F] border border-white/5 rounded-xl p-6 relative overflow-hidden">
                                         <div className="absolute top-0 right-0 p-4 opacity-50"><Lock size={100} className="text-white/5" strokeWidth={0.5} /></div>
                                         <h4 className="text-white font-medium mb-4 relative z-10">API Keys</h4>
                                         <div className="bg-black/50 border border-white/10 rounded-lg p-4 flex justify-between items-center font-mono text-xs text-neutral-400 relative z-10 group hover:border-white/30 transition-colors">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] uppercase text-neutral-600">Production Key</span>
                                                <span className="group-hover:text-white transition-colors">sk_live_51J9...x8s9_220a</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="p-2 hover:bg-white/10 rounded text-neutral-500 hover:text-white"><Copy size={14}/></button>
                                                <button className="p-2 hover:bg-white/10 rounded text-neutral-500 hover:text-primary"><Eye size={14}/></button>
                                            </div>
                                         </div>
                                    </div>
                                </div>
                            )}

                        </div>
                        
                        {/* TOAST NOTIFICATIONS CONTAINER */}
                        <div className="absolute bottom-6 right-6 flex flex-col gap-2 pointer-events-none z-50">
                            {notifications.map((notif, i) => (
                                <div key={i} className="bg-white text-black px-4 py-3 rounded shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-12 fade-in duration-300">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-xs font-bold uppercase tracking-wide">{notif}</span>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>

            {/* FLOATING LAYER - TERMINAL (Hidden on mobile for space) */}
            <div 
                className="absolute -bottom-10 -left-10 w-80 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl transition-transform duration-200 ease-out z-30 hidden md:block pointer-events-none"
                style={{
                    transform: `rotateY(${mousePosition.x * 8}deg) rotateX(${mousePosition.y * -8}deg) translateZ(60px) translateX(${mousePosition.x * -30}px)`
                }}
            >
                <div className="bg-[#1A1A1A] px-4 py-2 flex items-center gap-2 border-b border-white/5">
                    <Terminal size={12} className="text-neutral-500" />
                    <span className="text-[10px] font-mono text-neutral-500">build-log — node</span>
                </div>
                <div className="p-4 font-mono text-[10px] text-neutral-300 space-y-1.5">
                    <div className="flex gap-2"><span className="text-green-500">➜</span> <span>System healthy</span></div>
                    <div className="flex gap-2"><span className="text-blue-500">i</span> <span>Next.js 14 detected</span></div>
                    {deploying && (
                        <div className="text-primary animate-pulse">>> Compiling assets...</div>
                    )}
                </div>
            </div>

            {/* FLOATING LAYER - INTEGRATION ORBITS */}
            <div 
                className="absolute top-1/4 -right-4 z-40 transition-transform duration-200 ease-out pointer-events-none"
                style={{
                    transform: `translateZ(80px) translateX(${mousePosition.x * -40}px) translateY(${mousePosition.y * -40}px)`
                }}
            >
                 <div className="px-4 py-3 rounded-xl bg-[#0A0A0A] border border-white/10 flex items-center gap-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                    <div className="p-1.5 rounded bg-[#3ECF8E]/10 text-[#3ECF8E]"><Database size={16} /></div>
                    <div>
                        <div className="text-xs font-bold text-white">Supabase</div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);