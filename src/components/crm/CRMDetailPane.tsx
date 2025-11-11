import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Euro,
  FileText,
  MessageSquare,
  Clock,
  Send,
  Check,
  Download,
  ArrowRight,
} from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { createClient } from '@/utils/supabase/client';
import { publicAnonKey, API_BASE_URL } from '@/utils/supabase/info';

interface EntityDetail {
  id: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: string;
  amount?: number;
  date?: string;
  invoice_number?: string;
  quote_number?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

type TabType = 'overview' | 'documents' | 'notes' | 'activity';

export function CRMDetailPane() {
  const { currentTab, selectedId, setSelectedId, openSlideOver, showToast } = useCRM();
  const [entity, setEntity] = useState<EntityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Fetch entity details
  useEffect(() => {
    if (!selectedId) return;

    const fetchEntity = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        const response = await fetch(`${API_BASE_URL}/${currentTab}/${selectedId}`, {
          headers: {
            'Authorization': `Bearer ${session?.access_token || publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setEntity(data);
      } catch (error) {
        console.error('Erreur de chargement des détails:', error);
        showToast('Erreur de chargement des détails', 'error');
        setEntity(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEntity();
  }, [selectedId, currentTab, showToast]);

  // Get contextual actions based on entity type
  const getActions = () => {
    switch (currentTab) {
      case 'leads':
        return [
          {
            label: 'Convertir en Client',
            icon: ArrowRight,
            onClick: () => openSlideOver('convert-lead'),
            variant: 'default' as const,
          },
          {
            label: 'Envoyer Email',
            icon: Send,
            onClick: () => showToast('Fonctionnalité à venir', 'info'),
            variant: 'outline' as const,
          },
        ];
      case 'clients':
        return [
          {
            label: 'Nouveau Devis',
            icon: FileText,
            onClick: () => openSlideOver('new-quote'),
            variant: 'default' as const,
          },
          {
            label: 'Nouvelle Facture',
            icon: FileText,
            onClick: () => openSlideOver('new-invoice'),
            variant: 'outline' as const,
          },
        ];
      case 'quotes':
        return [
          {
            label: 'Convertir en Facture',
            icon: ArrowRight,
            onClick: () => openSlideOver('convert-quote'),
            variant: 'default' as const,
          },
          {
            label: 'Envoyer',
            icon: Send,
            onClick: () => showToast('Fonctionnalité à venir', 'info'),
            variant: 'outline' as const,
          },
          {
            label: 'Marquer Accepté',
            icon: Check,
            onClick: () => showToast('Fonctionnalité à venir', 'info'),
            variant: 'outline' as const,
          },
        ];
      case 'invoices':
        return [
          {
            label: 'Envoyer',
            icon: Send,
            onClick: () => showToast('Fonctionnalité à venir', 'info'),
            variant: 'default' as const,
          },
          {
            label: 'Marquer Payée',
            icon: Check,
            onClick: () => showToast('Fonctionnalité à venir', 'info'),
            variant: 'outline' as const,
          },
          {
            label: 'Télécharger PDF',
            icon: Download,
            onClick: () => showToast('Fonctionnalité à venir', 'info'),
            variant: 'outline' as const,
          },
        ];
      default:
        return [];
    }
  };

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'overview', label: 'Aperçu', icon: FileText },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'notes', label: 'Notes', icon: MessageSquare },
    { id: 'activity', label: 'Activité', icon: Clock },
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0C0C0C]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FFC2]"></div>
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0C0C0C] text-gray-400">
        <p>Impossible de charger les détails</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#0C0C0C]">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {entity.name || entity.company || entity.invoice_number || entity.quote_number}
            </h2>
            {entity.status && (
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-[#00FFC2]/10 text-[#00FFC2]">
                {entity.status}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedId(null)}
            className="shrink-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {getActions().map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant}
                onClick={action.onClick}
                className="gap-2"
              >
                <Icon className="w-4 h-4" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="flex gap-1 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#00FFC2] text-[#00FFC2]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Contact info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Informations</h3>
              <div className="space-y-3">
                {entity.email && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{entity.email}</span>
                  </div>
                )}
                {entity.phone && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{entity.phone}</span>
                  </div>
                )}
                {entity.company && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span>{entity.company}</span>
                  </div>
                )}
                {entity.address && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{entity.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Financial info */}
            {entity.amount && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Montant</h3>
                <div className="flex items-center gap-3">
                  <Euro className="w-5 h-5 text-[#00FFC2]" />
                  <span className="text-2xl font-bold text-[#00FFC2]">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(entity.amount)}
                  </span>
                </div>
              </div>
            )}

            {/* Dates */}
            {(entity.date || entity.created_at) && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Dates</h3>
                <div className="space-y-2">
                  {entity.date && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        Date:{' '}
                        {new Date(entity.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                  {entity.created_at && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>
                        Créé le:{' '}
                        {new Date(entity.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {entity.notes && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Notes</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{entity.notes}</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'documents' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-400 py-12"
          >
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p>Aucun document pour le moment</p>
          </motion.div>
        )}

        {activeTab === 'notes' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-400 py-12"
          >
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p>Aucune note pour le moment</p>
          </motion.div>
        )}

        {activeTab === 'activity' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-400 py-12"
          >
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p>Aucune activité pour le moment</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
