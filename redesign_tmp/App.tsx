import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './components/home/Home';
import { ServicesPage } from './components/pages/ServicesPage';
import { PortfolioPage } from './components/pages/PortfolioPage';
import { PortfolioDetailPage } from './components/pages/PortfolioDetailPage';
import { CaseStudiesPage } from './components/pages/CaseStudiesPage';
import { CaseStudyDetailPage } from './components/pages/CaseStudyDetailPage';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { DashboardOverview } from './components/admin/DashboardOverview';
import { ProjectManager } from './components/admin/ProjectManager';
import { ServiceManager } from './components/admin/ServiceManager';
import { MessageInbox } from './components/admin/MessageInbox';
import { CRMManager } from './components/admin/CRMManager';
import { FinanceManager } from './components/admin/FinanceManager';
import { CalendarManager } from './components/admin/CalendarManager';
import { PageView, AdminView, Project, ServicePack, Message, Client, Quote, Invoice, Appointment, Notification } from './types';
import { X } from 'lucide-react';

// INITIAL DATA
const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Velvet Finance",
    title_en: "Velvet Finance",
    client: "Velvet Bank",
    category: "Fintech",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
    description: "Architecture complète d'une banque mobile nouvelle génération.",
    description_en: "Complete architecture for a next-gen mobile banking app.",
    challenge: "Velvet voulait disrupter le marché bancaire avec une approche mobile-first.",
    challenge_en: "Velvet wanted to disrupt the banking market with a mobile-first approach.",
    solution: "Une architecture headless séparant la logique bancaire de l'UI pour une sécurité maximale.",
    solution_en: "A headless architecture separating banking logic from UI for maximum security.",
    tags: ["Mobile", "React Native", "Supabase"],
    link: "#",
    stats: [{label: "Users", value: "50k+"}, {label: "App Store", value: "4.9"}],
    techStack: [{name: "React Native", category: "Mobile"}, {name: "Supabase", category: "Backend"}]
  },
  {
    id: 2,
    title: "Chronos SaaS",
    title_en: "Chronos SaaS",
    client: "Chronos Tech",
    category: "SaaS",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
    description: "Plateforme d'analytics B2B avec visualisation complexe.",
    description_en: "B2B analytics platform with complex visualization.",
    tags: ["React", "D3.js", "Node.js"],
    link: "#",
    stats: [{label: "Data", value: "1TB/j"}, {label: "Clients", value: "120"}],
    techStack: [{name: "D3.js", category: "Viz"}, {name: "Node.js", category: "Backend"}]
  },
  {
    id: 3,
    title: "Maison Noire",
    title_en: "Black House",
    client: "LVMH Group",
    category: "E-Commerce",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2670&auto=format&fit=crop",
    description: "Flagship digital immersif en WebGL.",
    description_en: "Immersive WebGL digital flagship.",
    tags: ["WebGL", "Shopify", "Motion"],
    link: "#",
    stats: [{label: "Conversion", value: "+45%"}, {label: "Awards", value: "Awwwards"}],
    techStack: [{name: "WebGL", category: "3D"}, {name: "Shopify", category: "CMS"}]
  }
];

const INITIAL_SERVICES: ServicePack[] = [
  {
    id: 'starter',
    title: 'Landing Pack',
    title_en: 'Landing Pack',
    price: 'À partir de 3k€',
    price_en: 'From 3k€',
    description: 'Idéal pour lancer un produit ou tester une idée rapidement.',
    description_en: 'Ideal for launching a product or testing an idea quickly.',
    features: ['Design UI/UX sur-mesure', 'Développement React/Next.js', 'Animations Motion', 'Optimisation SEO de base', 'Livraison en 2 semaines'],
    features_en: ['Custom UI/UX Design', 'React/Next.js Development', 'Motion Animations', 'Basic SEO', '2 Weeks Delivery'],
  },
  {
    id: 'pro',
    title: 'Ecosystem',
    title_en: 'Ecosystem',
    price: 'Sur Devis',
    price_en: 'Custom Quote',
    description: 'Une solution complète : Site vitrine + Dashboard/CRM + Intégrations.',
    description_en: 'A complete solution: Website + Dashboard/CRM + Integrations.',
    features: ['Architecture Full Stack', 'Backend Supabase', 'CMS Personnalisé', 'Auth & Rôles', 'Analytics avancées', 'Support 3 mois'],
    features_en: ['Full Stack Architecture', 'Supabase Backend', 'Custom CMS', 'Auth & Roles', 'Advanced Analytics', '3 Months Support'],
    popular: true,
  },
  {
    id: 'scale',
    title: 'Scale-Up',
    title_en: 'Scale-Up',
    price: 'TJM / Retainer',
    price_en: 'Daily Rate',
    description: 'Accompagnement long terme pour équipes produit.',
    description_en: 'Long term support for product teams.',
    features: ['Design System', 'Refonte UX continue', 'Audit de performance', 'Consulting Technique', 'Workshops équipe'],
    features_en: ['Design System', 'Continuous UX', 'Performance Audit', 'Tech Consulting', 'Team Workshops'],
  },
];

const INITIAL_MESSAGES: Message[] = [
    { id: 1, name: "Alice Freeman", email: "alice@tech.co", type: "Web App", message: "Hi, looking for a full redesign of our SaaS dashboard.", date: "2 hours ago", status: "new" },
    { id: 2, name: "Marc Dupont", email: "marc@agency.fr", type: "Audit", message: "Besoin d'un audit de performance sur notre site Next.js.", date: "1 day ago", status: "read" },
];

// HRIS STYLE MOCK DATA
const INITIAL_CLIENTS: Client[] = [
    { id: 101, name: "Randy Rhiel Madsen", company: "Design Team", role: "UI Designer", department: "Design", email: "randy@mail.com", status: "active", joinDate: "11 Aug 2024", totalRevenue: "€12,400" },
    { id: 102, name: "Maria Rosser", company: "Design Team", role: "UX Researcher", department: "Design", email: "maria@mail.com", status: "inactive", joinDate: "25 Jun 2024", totalRevenue: "€0" },
    { id: 103, name: "Cheyenne Bothman", company: "Dev Team", role: "iOS Developer", department: "Engineering", email: "bothman@mail.com", status: "onboarding", joinDate: "20 Feb 2025", totalRevenue: "€0" },
    { id: 104, name: "Alfredo Curtis", company: "Dev Team", role: "Android Dev", department: "Engineering", email: "alfredo@mail.com", status: "active", joinDate: "14 May 2024", totalRevenue: "€8,200" },
    { id: 105, name: "Ryan Saris Lewis", company: "Dev Team", role: "Backend Dev", department: "Engineering", email: "ryan@mail.com", status: "active", joinDate: "31 July 2024", totalRevenue: "€15,000" },
];

const INITIAL_QUOTES: Quote[] = [
    { id: "Q-2024-001", clientId: 102, clientName: "Maria Rosser", title: "Website Redesign", amount: 4500, status: "sent", date: "2024-10-01", items: [] },
    { id: "Q-2024-002", clientId: 103, clientName: "Cheyenne Bothman", title: "Mobile App MVP", amount: 12000, status: "accepted", date: "2024-10-15", items: [] },
];

const INITIAL_INVOICES: Invoice[] = [
    { id: "INV-001", clientId: 101, clientName: "Randy Rhiel Madsen", amount: 3200, status: "paid", date: "2024-09-01", dueDate: "2024-09-30" },
    { id: "INV-002", clientId: 104, clientName: "Alfredo Curtis", amount: 8200, status: "overdue", date: "2024-08-15", dueDate: "2024-09-15" },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
    { id: 1, clientId: 102, clientName: "Maria Rosser", title: "Discovery Call", date: "2024-10-22T10:00:00", duration: 45, type: "discovery" },
    { id: 2, clientId: 101, clientName: "Randy Madsen", title: "Sprint Review", date: "2024-10-23T14:00:00", duration: 60, type: "review" },
];

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  
  // Admin State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminView, setAdminView] = useState<AdminView>('overview');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Data State
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [services, setServices] = useState<ServicePack[]>(INITIAL_SERVICES);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedCaseStudyId, setSelectedCaseStudyId] = useState<number | null>(null);

  // --- EFFECTS ---
  useEffect(() => {
    window.scrollTo(0, 0);
    if (currentPage !== 'portfolio') setSelectedProjectId(null);
    if (currentPage !== 'casestudies') setSelectedCaseStudyId(null);
  }, [currentPage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 800);
          return 100;
        }
        const increment = prev < 80 ? Math.floor(Math.random() * 5) + 2 : 1;
        return Math.min(prev + increment, 100);
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // --- UTILS ---
  const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      const id = Math.random().toString(36).substring(7);
      setNotifications(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== id));
      }, 3000);
  };

  const exportToCSV = (data: any[], filename: string) => {
      if (!data || !data.length) {
          addNotification("No data to export", "error");
          return;
      }
      const headers = Object.keys(data[0]);
      const csvContent = [
          headers.join(','),
          ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName])).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addNotification(`${filename} exported successfully`, "success");
  };

  // --- DATA HANDLERS ---

  const handleAddClient = (newClient: Omit<Client, 'id' | 'joinDate' | 'totalRevenue'>) => {
    const client: Client = {
      ...newClient,
      id: Math.floor(Math.random() * 10000),
      joinDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      totalRevenue: '€0'
    };
    setClients(prev => [client, ...prev]);
    addNotification(`Client ${client.name} added successfully`);
  };

  const handleUpdateClient = (id: number, updatedData: Partial<Client>) => {
      setClients(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
      addNotification("Client updated successfully");
  };

  const handleDeleteClient = (id: number) => {
      setClients(prev => prev.filter(c => c.id !== id));
      // Cascade delete
      setQuotes(prev => prev.filter(q => q.clientId !== id));
      setInvoices(prev => prev.filter(i => i.clientId !== id));
      setAppointments(prev => prev.filter(a => a.clientId !== id));
      addNotification("Client deleted");
  };

  const handleConvertLead = (id: number) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, status: 'active' } : c));
    addNotification("Lead converted to Client");
  };

  const handleAddQuote = (newQuote: Omit<Quote, 'id' | 'status' | 'date'>) => {
    const quote: Quote = {
      ...newQuote,
      id: `Q-2024-${Math.floor(Math.random() * 1000)}`,
      status: 'draft',
      date: new Date().toISOString().split('T')[0]
    };
    setQuotes(prev => [quote, ...prev]);
    addNotification("Quote created successfully");
  };

  const handleDeleteQuote = (id: string) => {
      setQuotes(prev => prev.filter(q => q.id !== id));
      addNotification("Quote deleted");
  };

  const handleUpdateQuoteStatus = (id: string, status: Quote['status']) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q));
    addNotification(`Quote marked as ${status}`);
  };

  const handleConvertToInvoice = (quote: Quote) => {
    const newInvoice: Invoice = {
        id: `INV-${Math.floor(Math.random() * 10000)}`,
        quoteId: quote.id,
        clientId: quote.clientId,
        clientName: quote.clientName,
        amount: quote.amount,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setInvoices(prev => [newInvoice, ...prev]);
    handleUpdateQuoteStatus(quote.id, 'accepted');
    addNotification("Invoice generated from Quote");
    setAdminView('finance'); // Redirect to view invoice
  };

  const handleDeleteInvoice = (id: string) => {
      setInvoices(prev => prev.filter(i => i.id !== id));
      addNotification("Invoice deleted");
  };

  const handleUpdateInvoiceStatus = (id: string, status: Invoice['status']) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    
    if (status === 'paid') {
       const inv = invoices.find(i => i.id === id);
       if(inv) {
         setClients(prev => prev.map(c => {
            if (c.id === inv.clientId) {
                const currentRev = parseInt(c.totalRevenue.replace(/[^0-9]/g, '')) || 0;
                return { ...c, totalRevenue: `€${(currentRev + inv.amount).toLocaleString()}` };
            }
            return c;
         }));
         addNotification(`Payment recorded. Revenue updated.`, "success");
       }
    } else {
        addNotification(`Invoice marked as ${status}`);
    }
  };

  const handleAddAppointment = (newApt: Omit<Appointment, 'id'>) => {
      setAppointments(prev => [...prev, { ...newApt, id: Math.random() }]);
      addNotification("Appointment scheduled");
  };

  const handleDeleteAppointment = (id: number) => {
      setAppointments(prev => prev.filter(a => a.id !== id));
      addNotification("Appointment cancelled", "info");
  };

  const handleAdminLogin = () => {
      setIsAuthenticated(true);
      addNotification("Welcome back, Admin");
  };
  
  const handleLogout = () => { 
      setIsAuthenticated(false); 
      setCurrentPage('home');
      addNotification("Logged out successfully");
  };

  // ADMIN ROUTE
  if (currentPage === 'admin') {
      if (!isAuthenticated) {
          return <AdminLogin onLogin={handleAdminLogin} />;
      }
      return (
          <AdminLayout currentView={adminView} onChangeView={setAdminView} onLogout={handleLogout}>
              {adminView === 'overview' && (
                <DashboardOverview 
                    clients={clients} 
                    quotes={quotes} 
                    invoices={invoices} 
                    onAddClient={handleAddClient}
                    onUpdateClient={handleUpdateClient}
                    onDeleteClient={handleDeleteClient}
                    onExport={exportToCSV}
                />
              )}
              {adminView === 'crm' && (
                <CRMManager 
                    clients={clients} 
                    onAddClient={handleAddClient} 
                    onUpdateClient={handleUpdateClient}
                    onDeleteClient={handleDeleteClient}
                    onConvertLead={handleConvertLead} 
                />
              )}
              {adminView === 'finance' && (
                <FinanceManager 
                    quotes={quotes} 
                    invoices={invoices} 
                    clients={clients} 
                    onAddQuote={handleAddQuote}
                    onUpdateQuoteStatus={handleUpdateQuoteStatus}
                    onDeleteQuote={handleDeleteQuote}
                    onConvertToInvoice={handleConvertToInvoice}
                    onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
                    onDeleteInvoice={handleDeleteInvoice}
                    onDownload={fileName => addNotification(`Downloading ${fileName}...`)}
                />
              )}
              {adminView === 'calendar' && (
                <CalendarManager 
                    appointments={appointments} 
                    clients={clients}
                    onAddAppointment={handleAddAppointment}
                    onDeleteAppointment={handleDeleteAppointment}
                />
              )}
              
              {adminView === 'projects' && <ProjectManager title="Portfolio" projects={projects} setProjects={setProjects} />}
              {adminView === 'casestudies' && <ProjectManager title="Case Studies" projects={projects} setProjects={setProjects} />}
              {adminView === 'services' && <ServiceManager services={services} setServices={setServices} />}
              {adminView === 'messages' && <MessageInbox messages={messages} setMessages={setMessages} />}
              
              {/* Global Notifications */}
              <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                  {notifications.map(n => (
                      <div key={n.id} className={`px-4 py-3 rounded shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-12 fade-in duration-300 ${
                          n.type === 'error' ? 'bg-red-500 text-white' : 'bg-white text-black'
                      }`}>
                          <div className={`w-2 h-2 rounded-full ${n.type === 'error' ? 'bg-white' : 'bg-green-500'}`}></div>
                          <span className="text-xs font-bold uppercase tracking-wide">{n.message}</span>
                          <button onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))} className="ml-2 pointer-events-auto"><X size={14}/></button>
                      </div>
                  ))}
              </div>
          </AdminLayout>
      );
  }

  // PUBLIC ROUTES
  const renderPublicPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onChangePage={setCurrentPage} />;
      case 'services':
        return <ServicesPage services={services} />;
      case 'portfolio':
        if (selectedProjectId !== null) {
          return <PortfolioDetailPage id={selectedProjectId} onBack={() => setSelectedProjectId(null)} />;
        }
        return <PortfolioPage items={projects} onProjectClick={(id) => { setSelectedProjectId(id); window.scrollTo(0,0); }} />;
      case 'casestudies':
        if (selectedCaseStudyId !== null) {
            return <CaseStudyDetailPage id={selectedCaseStudyId} onBack={() => setSelectedCaseStudyId(null)} />;
        }
        return <CaseStudiesPage projects={projects} onProjectClick={(id) => { setSelectedCaseStudyId(id); window.scrollTo(0,0); }} />;
      case 'contact':
        return <Contact />;
      default:
        return <Home onChangePage={setCurrentPage} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-white font-sans selection:bg-primary selection:text-black">
      
      {/* CINEMATIC PRELOADER */}
      <div 
        className={`fixed inset-0 z-[100] bg-[#050505] flex items-end justify-end pb-12 pr-12 transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          loading ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="text-[15vw] font-display font-bold leading-none text-white tracking-tighter tabular-nums">
            {counter}%
        </div>
      </div>

      <CustomCursor />
      
      <div className="bg-noise"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
        
        <main className="flex-grow">
          {renderPublicPage()}
        </main>
        
        <Footer onNavigate={setCurrentPage} />
      </div>
    </div>
  );
};

export default App;