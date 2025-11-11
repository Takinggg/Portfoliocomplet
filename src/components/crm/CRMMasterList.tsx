import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Circle } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/utils/supabase/client';
import { publicAnonKey, API_BASE_URL } from '@/utils/supabase/info';

interface Entity {
  id: string;
  name?: string;
  company?: string;
  email?: string;
  status?: string;
  amount?: number;
  date?: string;
  dueDate?: string;
  number?: string; // For quotes and invoices
  invoice_number?: string;
  quote_number?: string;
  clientName?: string; // For quotes and invoices
  clientId?: string;
}

export function CRMMasterList() {
  const { currentTab, selectedId, setSelectedId, showToast } = useCRM();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch entities based on current tab
  useEffect(() => {
    const fetchEntities = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        const response = await fetch(`${API_BASE_URL}/${currentTab}`, {
          headers: {
            'Authorization': `Bearer ${session?.access_token || publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        
        console.log(`📦 API Response for ${currentTab}:`, data);
        
        // Extract the array from the API response
        // API returns: { success: true, leads: [...] } or { success: true, clients: [...] }
        let items = [];
        if (data.success) {
          // Try different possible keys
          console.log(`🔑 Looking for key: "${currentTab}" in data:`, Object.keys(data));
          items = data[currentTab] || data.data || [];
          console.log(`📊 Found items:`, items);
        } else {
          items = Array.isArray(data) ? data : [];
        }
        
        console.log(`✅ Extracted ${items.length} items for ${currentTab}`);
        console.log(`🎯 Setting entities to:`, items);
        if (items.length > 0) {
          console.log(`🔬 First item structure:`, items[0]);
        }
        setEntities(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error(`❌ Erreur de chargement des ${currentTab}:`, error);
        showToast(`Erreur de chargement des ${currentTab}`, 'error');
        setEntities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  }, [currentTab, showToast]);

  // Filter entities based on search
  const filteredEntities = entities.filter((entity) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      entity.name?.toLowerCase().includes(searchLower) ||
      entity.company?.toLowerCase().includes(searchLower) ||
      entity.email?.toLowerCase().includes(searchLower) ||
      entity.invoice_number?.toLowerCase().includes(searchLower) ||
      entity.quote_number?.toLowerCase().includes(searchLower)
    );
  });

  // Get status color
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'new':
      case 'draft':
        return 'bg-blue-500/20 text-blue-400';
      case 'contacted':
      case 'sent':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'qualified':
      case 'accepted':
      case 'paid':
        return 'bg-green-500/20 text-green-400';
      case 'lost':
      case 'rejected':
      case 'overdue':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  // Get entity display name
  const getEntityName = (entity: Entity) => {
    // For quotes and invoices, use the 'number' field
    if (currentTab === 'invoices' && entity.number) {
      return `Facture ${entity.number}`;
    }
    if (currentTab === 'quotes' && entity.number) {
      return `Devis ${entity.number}`;
    }
    // For leads and clients
    if (entity.name) return entity.name;
    if (entity.company) return entity.company;
    if (entity.invoice_number) return `Facture ${entity.invoice_number}`;
    if (entity.quote_number) return `Devis ${entity.quote_number}`;
    return entity.email || 'Sans nom';
  };

  // Get entity subtitle
  const getEntitySubtitle = (entity: Entity) => {
    if (currentTab === 'leads' || currentTab === 'clients') {
      return entity.email || entity.company;
    }
    if (currentTab === 'quotes' || currentTab === 'invoices') {
      // Show client name for quotes/invoices
      return (entity as any).clientName || entity.company || entity.name || 'Client';
    }
    return '';
  };

  return (
    <div className="h-full flex flex-col bg-[#0C0C0C]">
      {/* Search bar */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 focus:border-[#00FFC2]"
          />
        </div>
      </div>

      {/* Entity list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FFC2]"></div>
          </div>
        ) : filteredEntities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
            <p>Aucun résultat</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredEntities.map((entity) => (
              <div
                key={entity.id}
                onClick={() => setSelectedId(entity.id)}
                className={`p-4 cursor-pointer transition-colors hover:bg-white/5 ${
                  selectedId === entity.id ? 'bg-[#00FFC2]/10 border-l-2 border-[#00FFC2]' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-white truncate">
                        {getEntityName(entity)}
                      </h3>
                      {entity.status && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            entity.status
                          )}`}
                        >
                          {entity.status}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {getEntitySubtitle(entity)}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      {entity.amount && (
                        <span className="text-[#00FFC2]">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR',
                          }).format(entity.amount)}
                        </span>
                      )}
                      {(entity.date || entity.dueDate) && (
                        <span>
                          {new Date(entity.date || entity.dueDate!).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 w-8 h-8 p-0 hover:bg-white/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Open context menu
                    }}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="p-4 border-t border-white/10 text-sm text-gray-400">
        {filteredEntities.length} {currentTab}
      </div>
    </div>
  );
}
