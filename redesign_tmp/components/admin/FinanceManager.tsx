import React, { useState } from 'react';
import { Quote, Invoice, Client } from '../../types';
import { FileText, CheckCircle, Plus, FileCheck, X, Save, Trash2, Download } from 'lucide-react';

interface FinanceManagerProps {
  quotes: Quote[];
  invoices: Invoice[];
  clients: Client[];
  onAddQuote: (quote: any) => void;
  onUpdateQuoteStatus: (id: string, status: Quote['status']) => void;
  onDeleteQuote?: (id: string) => void;
  onConvertToInvoice: (quote: Quote) => void;
  onUpdateInvoiceStatus: (id: string, status: Invoice['status']) => void;
  onDeleteInvoice?: (id: string) => void;
  onDownload?: (filename: string) => void;
}

export const FinanceManager: React.FC<FinanceManagerProps> = ({ 
    quotes, invoices, clients, 
    onAddQuote, onUpdateQuoteStatus, onDeleteQuote, onConvertToInvoice, onUpdateInvoiceStatus, onDeleteInvoice, onDownload 
}) => {
  const [view, setView] = useState<'quotes' | 'invoices'>('quotes');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuote, setNewQuote] = useState({ clientId: '', title: '', amount: '' });

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const client = clients.find(c => c.id === parseInt(newQuote.clientId));
      if (client) {
          onAddQuote({
              clientId: client.id,
              clientName: client.name,
              title: newQuote.title,
              amount: parseFloat(newQuote.amount),
              items: []
          });
          setIsModalOpen(false);
          setNewQuote({ clientId: '', title: '', amount: '' });
      }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Finance</h1>
            <p className="text-neutral-400">Manage quotes and invoices.</p>
          </div>
          <div className="flex bg-black border border-white/10 rounded-lg p-1">
               <button onClick={() => setView('quotes')} className={`px-4 py-2 rounded-md text-sm font-bold uppercase transition-colors ${view === 'quotes' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}>Quotes</button>
               <button onClick={() => setView('invoices')} className={`px-4 py-2 rounded-md text-sm font-bold uppercase transition-colors ${view === 'invoices' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}>Invoices</button>
          </div>
      </div>

      {view === 'quotes' && (
          <div className="space-y-4">
              <div className="flex justify-end">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-sm text-white hover:bg-white/5"
                  >
                      <Plus size={16} /> Create Quote
                  </button>
              </div>
              <div className="bg-[#0F0F0F] border border-white/5 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                      <thead className="bg-[#151515] border-b border-white/5 text-xs uppercase text-neutral-500">
                          <tr>
                              <th className="p-4 pl-6">Ref</th>
                              <th className="p-4">Client</th>
                              <th className="p-4">Title</th>
                              <th className="p-4">Amount</th>
                              <th className="p-4">Status</th>
                              <th className="p-4 text-right pr-6">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                          {quotes.map(quote => (
                              <tr key={quote.id} className="hover:bg-white/5 transition-colors">
                                  <td className="p-4 pl-6 font-mono text-neutral-400">{quote.id}</td>
                                  <td className="p-4 text-white font-bold">{quote.clientName}</td>
                                  <td className="p-4 text-neutral-300">{quote.title}</td>
                                  <td className="p-4 text-white">€{quote.amount.toLocaleString()}</td>
                                  <td className="p-4">
                                       <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                                          quote.status === 'accepted' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                          quote.status === 'sent' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                          'bg-neutral-500/10 text-neutral-500 border-white/10'
                                      }`}>{quote.status}</span>
                                  </td>
                                  <td className="p-4 text-right pr-6 flex justify-end gap-2">
                                      <button onClick={() => onDownload && onDownload(quote.id)} className="p-2 hover:bg-white/10 rounded text-neutral-500 hover:text-white" title="Download PDF"><Download size={18}/></button>
                                      
                                      {quote.status === 'draft' && (
                                           <button onClick={() => onUpdateQuoteStatus(quote.id, 'sent')} className="p-2 hover:bg-blue-500/10 text-neutral-500 hover:text-blue-500 rounded text-xs border border-transparent hover:border-blue-500/20">Send</button>
                                      )}
                                      {quote.status === 'sent' && (
                                          <button onClick={() => onUpdateQuoteStatus(quote.id, 'accepted')} className="p-2 hover:bg-green-500/10 text-neutral-500 hover:text-green-500 rounded" title="Mark Accepted"><CheckCircle size={18}/></button>
                                      )}
                                      {quote.status === 'accepted' && (
                                          <button onClick={() => onConvertToInvoice(quote)} className="p-2 hover:bg-primary/10 text-neutral-500 hover:text-primary rounded" title="Convert to Invoice"><FileCheck size={18}/></button>
                                      )}
                                      <button onClick={() => onDeleteQuote && onDeleteQuote(quote.id)} className="p-2 hover:bg-red-500/10 text-neutral-500 hover:text-red-500 rounded"><Trash2 size={18}/></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      )}

      {view === 'invoices' && (
           <div className="bg-[#0F0F0F] border border-white/5 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                      <thead className="bg-[#151515] border-b border-white/5 text-xs uppercase text-neutral-500">
                          <tr>
                              <th className="p-4 pl-6">Ref</th>
                              <th className="p-4">Client</th>
                              <th className="p-4">Due Date</th>
                              <th className="p-4">Amount</th>
                              <th className="p-4">Status</th>
                              <th className="p-4 text-right pr-6">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                          {invoices.map(inv => (
                              <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                                  <td className="p-4 pl-6 font-mono text-neutral-400">{inv.id}</td>
                                  <td className="p-4 text-white font-bold">{inv.clientName}</td>
                                  <td className="p-4 text-neutral-300">{inv.dueDate}</td>
                                  <td className="p-4 text-white">€{inv.amount.toLocaleString()}</td>
                                  <td className="p-4">
                                       <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                                          inv.status === 'paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                          inv.status === 'overdue' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                          'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                      }`}>{inv.status}</span>
                                  </td>
                                  <td className="p-4 text-right pr-6 flex justify-end gap-2">
                                       {inv.status !== 'paid' && (
                                           <button onClick={() => onUpdateInvoiceStatus(inv.id, 'paid')} className="text-xs font-bold text-green-500 hover:underline flex items-center mr-2">Mark Paid</button>
                                       )}
                                       <button onClick={() => onDownload && onDownload(inv.id)} className="p-2 hover:bg-white/10 rounded text-neutral-500 hover:text-white" title="Download PDF"><FileText size={18}/></button>
                                       <button onClick={() => onDeleteInvoice && onDeleteInvoice(inv.id)} className="p-2 hover:bg-red-500/10 text-neutral-500 hover:text-red-500 rounded"><Trash2 size={18}/></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
           </div>
      )}

       {/* CREATE QUOTE MODAL */}
       {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-white">Create Quote</h2>
                      <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white"><X size={20}/></button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                       <select
                        className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-primary outline-none" 
                        value={newQuote.clientId} onChange={e => setNewQuote({...newQuote, clientId: e.target.value})} required
                      >
                          <option value="">Select Client</option>
                          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <input 
                        placeholder="Project Title" 
                        className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-primary outline-none" 
                        value={newQuote.title} onChange={e => setNewQuote({...newQuote, title: e.target.value})} required 
                      />
                      <input 
                        placeholder="Amount (€)" 
                        type="number"
                        className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-primary outline-none" 
                        value={newQuote.amount} onChange={e => setNewQuote({...newQuote, amount: e.target.value})} required 
                      />

                      <button type="submit" className="w-full py-3 bg-primary text-black font-bold rounded hover:bg-white transition-colors flex items-center justify-center gap-2">
                          <Save size={18} /> Generate Quote
                      </button>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
};