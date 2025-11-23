import React, { useState, useMemo } from 'react';
import { Search, Filter, MoreVertical, Plus, Download, User, Users, X, Save, Edit2, Mail, Trash2, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Client, Quote, Invoice } from '../../types';

interface DashboardOverviewProps {
  clients: Client[];
  quotes: Quote[];
  invoices: Invoice[];
  onAddClient: (client: any) => void;
  onUpdateClient?: (id: number, data: any) => void;
  onDeleteClient?: (id: number) => void;
  onExport?: (data: any[], filename: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
    clients, quotes, invoices, 
    onAddClient, onUpdateClient, onDeleteClient, onExport 
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'leads' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', role: '', department: '', email: '', status: 'active', company: '' });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  // Stats
  const totalActive = clients.filter(c => c.status === 'active').length;
  const totalInactive = clients.filter(c => c.status === 'inactive').length;
  const totalOnboarding = clients.filter(c => c.status === 'onboarding').length;

  // Filter Logic
  const filteredClients = useMemo(() => {
      return clients.filter(c => {
          const matchesTab = activeTab === 'all' ? true : c.status === activeTab;
          const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                c.role.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesTab && matchesSearch;
      });
  }, [clients, activeTab, searchQuery]);

  // Handlers
  const openAddModal = () => {
      setEditId(null);
      setFormData({ name: '', role: '', department: '', email: '', status: 'active', company: '' });
      setIsModalOpen(true);
  };

  const openEditModal = (client: Client) => {
      setEditId(client.id);
      setFormData({ 
          name: client.name, 
          role: client.role, 
          department: client.department, 
          email: client.email, 
          status: client.status, 
          company: client.company 
      });
      setIsModalOpen(true);
      setActiveMenuId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editId && onUpdateClient) {
          onUpdateClient(editId, formData);
      } else {
          onAddClient(formData);
      }
      setIsModalOpen(false);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
          setSelectedIds(filteredClients.map(c => c.id));
      } else {
          setSelectedIds([]);
      }
  };

  const handleSelectOne = (id: number) => {
      if (selectedIds.includes(id)) {
          setSelectedIds(prev => prev.filter(i => i !== id));
      } else {
          setSelectedIds(prev => [...prev, id]);
      }
  };

  const handleBulkDelete = () => {
      if (onDeleteClient && confirm(`Delete ${selectedIds.length} clients?`)) {
          selectedIds.forEach(id => onDeleteClient(id));
          setSelectedIds([]);
      }
  };

  const handleDeleteOne = (id: number) => {
      if (onDeleteClient && confirm('Delete this client?')) {
          onDeleteClient(id);
      }
      setActiveMenuId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans" onClick={() => setActiveMenuId(null)}>
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-1">Client Directory</h1>
            <p className="text-neutral-500 text-sm">Manage your external clients, leads, and partners.</p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={() => onExport && onExport(clients, 'clients_export')}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#111] border border-white/10 rounded-lg text-sm text-neutral-300 hover:text-white hover:border-white/30 transition-all"
             >
                 <Download size={16} /> Export CSV
             </button>
             <button 
                onClick={openAddModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-bold rounded-lg text-sm hover:bg-white transition-colors shadow-[0_0_20px_-5px_rgba(204,255,0,0.3)]"
             >
                 <Plus size={18} /> Add Client
             </button>
          </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <StatCard icon={Users} label="Total Clients" value={clients.length} change="+12" trend="up" />
         <StatCard icon={User} label="Active Clients" value={totalActive} change="+4" trend="up" />
         <StatCard icon={User} label="Inactive Clients" value={totalInactive} change="-2" trend="down" />
         <StatCard icon={User} label="Onboarding" value={totalOnboarding} change="+5" trend="up" />
      </div>

      {/* Main Content Area */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Toolbar */}
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              
              {/* Tabs */}
              <div className="flex bg-[#050505] p-1 rounded-lg border border-white/5">
                  {['all', 'active', 'leads', 'inactive'].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${
                            activeTab === tab 
                            ? 'bg-[#1A1A1A] text-white shadow-sm border border-white/5' 
                            : 'text-neutral-500 hover:text-white'
                        }`}
                      >
                          {tab === 'active' ? 'Active' : tab}
                      </button>
                  ))}
              </div>

              {/* Search & Filter */}
              {selectedIds.length > 0 ? (
                   <div className="flex items-center gap-4 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 animate-in fade-in w-full md:w-auto justify-between">
                       <span className="text-sm text-red-500 font-bold">{selectedIds.length} selected</span>
                       <button onClick={handleBulkDelete} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded font-bold hover:bg-red-600 transition-colors">Delete Selected</button>
                   </div>
              ) : (
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search by name, role, or email..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#050505] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-700 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                    <button className="px-4 py-2.5 border border-white/10 bg-[#050505] rounded-lg text-neutral-400 hover:text-white hover:border-white/30 flex items-center gap-2 text-sm transition-colors">
                        <Filter size={16} /> Filter
                    </button>
                </div>
              )}
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead className="bg-[#080808] text-xs uppercase text-neutral-500 font-mono tracking-wider border-b border-white/5">
                      <tr>
                          <th className="p-6 w-12">
                              <input 
                                type="checkbox" 
                                className="rounded border-white/20 bg-transparent checked:bg-primary checked:border-primary" 
                                onChange={handleSelectAll}
                                checked={selectedIds.length === filteredClients.length && filteredClients.length > 0}
                              />
                          </th>
                          <th className="p-6 font-medium">Client Name</th>
                          <th className="p-6 font-medium">ID</th>
                          <th className="p-6 font-medium">Role</th>
                          <th className="p-6 font-medium">Department</th>
                          <th className="p-6 font-medium">Join Date</th>
                          <th className="p-6 font-medium">Status</th>
                          <th className="p-6 text-right font-medium">Action</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                      {filteredClients.map((client) => (
                          <tr key={client.id} className={`group transition-colors ${selectedIds.includes(client.id) ? 'bg-primary/5' : 'hover:bg-white/[0.02]'}`}>
                              <td className="p-6">
                                  <input 
                                    type="checkbox" 
                                    className="rounded border-white/20 bg-transparent checked:bg-primary checked:border-primary" 
                                    checked={selectedIds.includes(client.id)}
                                    onChange={() => handleSelectOne(client.id)}
                                  />
                              </td>
                              <td className="p-6">
                                  <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-lg bg-[#151515] flex items-center justify-center text-white font-bold text-sm border border-white/10 overflow-hidden shadow-lg">
                                          {client.avatar ? <img src={client.avatar} className="w-full h-full object-cover" /> : client.name.substring(0,2).toUpperCase()}
                                      </div>
                                      <div>
                                          <div className="font-bold text-white text-sm">{client.name}</div>
                                          <div className="text-neutral-500 text-xs mt-0.5">{client.email}</div>
                                      </div>
                                  </div>
                              </td>
                              <td className="p-6 font-mono text-xs text-neutral-600">#{client.id}</td>
                              <td className="p-6 text-sm text-neutral-300">{client.role}</td>
                              <td className="p-6 text-sm text-neutral-300">{client.department}</td>
                              <td className="p-6 text-sm text-neutral-500 font-mono">{client.joinDate}</td>
                              <td className="p-6">
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold uppercase border tracking-wide ${
                                      client.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_-3px_rgba(74,222,128,0.2)]' :
                                      client.status === 'lead' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                      client.status === 'onboarding' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                      'bg-neutral-500/10 text-neutral-500 border-white/10'
                                  }`}>
                                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                           client.status === 'active' ? 'bg-green-400' :
                                           client.status === 'lead' ? 'bg-blue-400' :
                                           client.status === 'onboarding' ? 'bg-yellow-400' :
                                           'bg-neutral-500'
                                      }`}></span>
                                      {client.status}
                                  </span>
                              </td>
                              <td className="p-6 text-right relative">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === client.id ? null : client.id); }}
                                    className="p-2 hover:bg-white/10 rounded-lg text-neutral-500 hover:text-white transition-colors"
                                  >
                                      <MoreVertical size={16} />
                                  </button>
                                  
                                  {/* Context Menu */}
                                  {activeMenuId === client.id && (
                                      <div className="absolute right-8 top-8 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl z-50 w-48 py-2 flex flex-col text-left animate-in fade-in zoom-in-95 duration-200 overflow-hidden ring-1 ring-black/50">
                                          <button onClick={() => openEditModal(client)} className="px-4 py-2.5 text-xs font-medium text-neutral-300 hover:bg-white/5 hover:text-white flex items-center gap-3 transition-colors">
                                              <Edit2 size={14} /> Edit Details
                                          </button>
                                          <button onClick={() => window.location.href = `mailto:${client.email}`} className="px-4 py-2.5 text-xs font-medium text-neutral-300 hover:bg-white/5 hover:text-white flex items-center gap-3 transition-colors">
                                              <Mail size={14} /> Send Email
                                          </button>
                                          <div className="h-[1px] bg-white/5 my-1"></div>
                                          <button onClick={() => handleDeleteOne(client.id)} className="px-4 py-2.5 text-xs font-medium text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-colors">
                                              <Trash2 size={14} /> Delete User
                                          </button>
                                      </div>
                                  )}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          
          {/* Footer / Pagination */}
          <div className="p-4 border-t border-white/5 flex justify-between items-center bg-[#080808]">
              <div className="text-xs text-neutral-500 font-mono uppercase tracking-widest">
                  Showing {filteredClients.length} of {clients.length} records
              </div>
              <div className="flex gap-2 items-center text-xs">
                  <button className="w-8 h-8 flex items-center justify-center border border-white/10 rounded hover:bg-white/5 text-neutral-400 hover:text-white transition-colors disabled:opacity-50">
                      <ChevronLeft size={14} />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center bg-white/10 text-white font-bold rounded border border-white/10">1</button>
                  <button className="w-8 h-8 flex items-center justify-center border border-white/10 rounded hover:bg-white/5 text-neutral-400 hover:text-white transition-colors disabled:opacity-50">
                      <ChevronRight size={14} />
                  </button>
              </div>
          </div>
      </div>

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
              <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
                  {/* Decorative bg */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent"></div>
                  
                  <div className="flex justify-between items-center mb-8">
                      <div>
                        <h2 className="text-2xl font-display font-bold text-white">{editId ? 'Edit Client' : 'Add New Client'}</h2>
                        <p className="text-neutral-500 text-sm">Enter the details below.</p>
                      </div>
                      <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10"><X size={20}/></button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-neutral-500 uppercase">Full Name</label>
                            <input 
                                placeholder="e.g. John Doe" 
                                className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors text-sm" 
                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-neutral-500 uppercase">Email Address</label>
                            <input 
                                placeholder="john@company.com" 
                                type="email"
                                className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors text-sm" 
                                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required 
                            />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-neutral-500 uppercase">Role / Title</label>
                            <input 
                                placeholder="e.g. Product Manager" 
                                className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors text-sm" 
                                value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-neutral-500 uppercase">Department</label>
                            <input 
                                placeholder="e.g. Marketing" 
                                className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors text-sm" 
                                value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} required 
                            />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                            <label className="text-xs font-mono text-neutral-500 uppercase">Account Status</label>
                            <select
                                className="w-full bg-[#050505] border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors text-sm appearance-none" 
                                value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="active">Active</option>
                                <option value="onboarding">Onboarding</option>
                                <option value="lead">Lead</option>
                                <option value="inactive">Inactive</option>
                            </select>
                      </div>

                      <button type="submit" className="w-full py-4 bg-primary text-black font-bold rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2 uppercase tracking-wide text-sm mt-4">
                          <Save size={18} /> {editId ? 'Update Record' : 'Create Client Record'}
                      </button>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, change, trend }: any) => (
    <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
        <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-[#111] rounded-xl text-white group-hover:text-primary transition-colors border border-white/5">
                 <Icon size={20} />
             </div>
             <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg border ${
                 trend === 'up' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
             }`}>
                 {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                 {change}
             </div>
        </div>
        <div>
            <div className="text-3xl font-display font-bold text-white mb-1">{value.toLocaleString()}</div>
            <div className="text-xs text-neutral-500 uppercase tracking-widest font-mono">{label}</div>
        </div>
    </div>
);