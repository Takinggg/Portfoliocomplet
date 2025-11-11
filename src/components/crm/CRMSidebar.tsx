/**
 * CRM Sidebar - Navigation entre Leads, Clients, Devis, Factures
 */

import { useCRM } from '../../contexts/CRMContext';
import { Users, UserCheck, FileText, Receipt, Plus, Filter } from 'lucide-react';
import { Button } from '../ui/button';

export function CRMSidebar() {
  const { currentTab, setCurrentTab, openSlideOver } = useCRM();
  
  const tabs = [
    { id: 'leads' as const, label: 'Leads', icon: Users, count: 0 },
    { id: 'clients' as const, label: 'Clients', icon: UserCheck, count: 0 },
    { id: 'quotes' as const, label: 'Devis', icon: FileText, count: 0, divider: true },
    { id: 'invoices' as const, label: 'Factures', icon: Receipt, count: 0 },
  ];
  
  const getNewAction = () => {
    switch (currentTab) {
      case 'leads': return () => openSlideOver('edit');
      case 'clients': return () => openSlideOver('edit');
      case 'quotes': return () => openSlideOver('new-quote');
      case 'invoices': return () => openSlideOver('new-invoice');
    }
  };
  
  return (
    <div className="w-64 bg-[#0A0A0A] border-r border-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">CRM</h2>
        <p className="text-sm text-gray-400">Gestion commerciale</p>
      </div>
      
      {/* Navigation Tabs */}
      <nav className="flex-1 p-2 space-y-1">
        {tabs.map((tab) => (
          <div key={tab.id}>
            {tab.divider && <div className="my-2 border-t border-gray-800" />}
            <button
              onClick={() => setCurrentTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                currentTab === tab.id
                  ? 'bg-[#00FFC2]/10 text-[#00FFC2]'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="flex-1 text-left font-medium">{tab.label}</span>
              {tab.count > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-800 text-gray-300">
                  {tab.count}
                </span>
              )}
            </button>
          </div>
        ))}
      </nav>
      
      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        <Button
          onClick={getNewAction()}
          className="w-full bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau {currentTab === 'leads' ? 'Lead' : currentTab === 'clients' ? 'Client' : currentTab === 'quotes' ? 'Devis' : 'Facture'}
        </Button>
        
        <Button
          variant="outline"
          className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtres
        </Button>
      </div>
    </div>
  );
}
