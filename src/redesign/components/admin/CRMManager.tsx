import React, { useState } from 'react';
import { Client } from '../../types';
import { UserPlus, Phone, Mail, MoreHorizontal, ArrowRight, X, Save, Edit2, Trash2 } from 'lucide-react';

interface CRMManagerProps {
    clients: Client[];
    onAddClient: (client: any) => void;
    onUpdateClient?: (id: Client["id"], data: any) => void;
    onDeleteClient?: (id: Client["id"]) => void;
    onConvertLead: (id: Client["id"]) => void;
}

export const CRMManager: React.FC<CRMManagerProps> = ({ clients, onAddClient, onUpdateClient, onDeleteClient, onConvertLead }) => {
  const [filter, setFilter] = useState<'all' | 'lead' | 'active'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState<Client["id"] | null>(null);
  const [formData, setFormData] = useState({ name: '', company: '', email: '', status: 'lead', role: 'Lead', department: 'Sales' });
  
    const [activeMenuId, setActiveMenuId] = useState<Client["id"] | null>(null);

  const filtered = filter === 'all' ? clients : clients.filter(c => c.status === filter);

  const openAddModal = () => {
    setEditId(null);
    setFormData({ name: '', company: '', email: '', status: 'lead', role: 'Lead', department: 'Sales' });
    setIsModalOpen(true);
  };

  const openEditModal = (client: Client) => {
      setEditId(client.id);
      setFormData({ 
          name: client.name, 
          company: client.company, 
          email: client.email, 
          status: client.status, 
          role: client.role, 
          department: client.department 
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

    const handleDelete = (id: Client["id"]) => {
            if (onDeleteClient && confirm('Supprimer ce contact ?')) {
          onDeleteClient(id);
      }
  };

    const STATUS_LABELS: Record<string, string> = {
        lead: 'Prospect',
        active: 'Client',
    };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" onClick={() => setActiveMenuId(null)}>
      <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">CRM</h1>
                        <p className="text-neutral-400">Gérez vos leads et relations clients.</p>
          </div>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold rounded-lg text-sm hover:bg-white transition-colors"
          >
                            <UserPlus size={18} /> Ajouter un contact
          </button>
      </div>

      <div className="flex gap-4 border-b border-white/10 pb-4">
          {['all', 'lead', 'active'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f as any)}
                className={`text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-colors ${filter === f ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
              >
                  {f === 'active' ? 'Clients' : f === 'all' ? 'Tous' : 'Leads'} <span className="text-xs opacity-50 ml-1">{clients.filter(c => f === 'all' ? true : c.status === f).length}</span>
              </button>
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(client => (
              <div key={client.id} className="bg-[#0F0F0F] border border-white/5 rounded-xl p-6 group hover:border-white/20 transition-all flex flex-col h-full relative">
                  <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold border border-white/10 overflow-hidden">
                                {client.avatar ? <img src={client.avatar} className="w-full h-full object-cover" /> : client.name.substring(0,2).toUpperCase()}
                           </div>
                           <div>
                               <h3 className="font-bold text-white">{client.name}</h3>
                               <div className="text-xs text-neutral-500 uppercase tracking-wider">{client.company}</div>
                           </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === client.id ? null : client.id); }}
                        className="text-neutral-600 hover:text-white"
                      >
                          <MoreHorizontal size={20}/>
                      </button>

                      {/* Context Menu */}
                      {activeMenuId === client.id && (
                            <div className="absolute right-6 top-12 bg-[#111] border border-white/10 rounded-lg shadow-xl z-50 w-32 py-1 flex flex-col text-left animate-in fade-in zoom-in-95 duration-200">
                                <button onClick={() => openEditModal(client)} className="px-4 py-2 text-sm text-neutral-300 hover:bg-white/10 hover:text-white flex items-center gap-2">
                                    <Edit2 size={14} /> Modifier
                                </button>
                                <button onClick={() => handleDelete(client.id)} className="px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2">
                                    <Trash2 size={14} /> Supprimer
                                </button>
                            </div>
                      )}
                  </div>
                  
                  <div className="space-y-3 mb-6 flex-grow">
                      <a href={`mailto:${client.email}`} className="flex items-center gap-3 text-sm text-neutral-400 hover:text-white transition-colors">
                          <Mail size={14} /> {client.email}
                      </a>
                      <a href="tel:+33612345678" className="flex items-center gap-3 text-sm text-neutral-400 hover:text-white transition-colors">
                          <Phone size={14} /> +33 6 12 34 56 78
                      </a>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-auto">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                          client.status === 'lead' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                          client.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                          'bg-neutral-500/10 text-neutral-500'
                      }`}>
                          {STATUS_LABELS[client.status] ?? client.status}
                      </span>

                      {client.status === 'lead' && (
                          <button 
                            onClick={() => onConvertLead(client.id)}
                            className="text-xs font-bold uppercase flex items-center gap-2 text-white hover:text-primary transition-colors"
                          >
                              Convertir en client <ArrowRight size={14} />
                          </button>
                      )}
                  </div>
              </div>
          ))}
      </div>

       {/* ADD/EDIT MODAL */}
       {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-white">{editId ? 'Modifier le lead' : 'Ajouter un lead'}</h2>
                      <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white"><X size={20}/></button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                                            <input 
                                                placeholder="Nom complet" 
                        className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-primary outline-none" 
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required 
                      />
                       <input 
                                                placeholder="Entreprise" 
                        className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-primary outline-none" 
                        value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required 
                      />
                       <input 
                                                placeholder="Email" 
                        type="email"
                        className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-primary outline-none" 
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required 
                      />

                                            <button type="submit" className="w-full py-3 bg-primary text-black font-bold rounded hover:bg-white transition-colors flex items-center justify-center gap-2">
                                                    <Save size={18} /> {editId ? 'Mettre à jour' : 'Enregistrer le lead'}
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};