import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'motion/react';

export function CRMSlideOver() {
  const { isSlideOverOpen, slideOverContent, closeSlideOver, showToast } = useCRM();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast('Action effectuée avec succès', 'success');
      closeSlideOver();
      setFormData({});
    } catch (error) {
      showToast("Erreur lors de l'action", 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (slideOverContent) {
      case 'convert-lead':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="company">Nom de l'entreprise</Label>
              <Input
                id="company"
                value={formData.company || ''}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Acme Corp"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="siret">SIRET</Label>
              <Input
                id="siret"
                value={formData.siret || ''}
                onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                placeholder="123 456 789 00010"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="address">Adresse</Label>
              <Textarea
                id="address"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Rue Example, 75001 Paris"
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Informations supplémentaires..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        );

      case 'new-quote':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="quote-client">Client</Label>
              <Input
                id="quote-client"
                value={formData.client || ''}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="Sélectionner un client"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="quote-title">Titre du devis</Label>
              <Input
                id="quote-title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Développement site web"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="quote-amount">Montant (€)</Label>
              <Input
                id="quote-amount"
                type="number"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="5000"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="quote-date">Date de validité</Label>
              <Input
                id="quote-date"
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="quote-description">Description</Label>
              <Textarea
                id="quote-description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Détails du devis..."
                className="mt-1"
                rows={5}
              />
            </div>
          </div>
        );

      case 'new-invoice':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="invoice-client">Client</Label>
              <Input
                id="invoice-client"
                value={formData.client || ''}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="Sélectionner un client"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="invoice-title">Titre de la facture</Label>
              <Input
                id="invoice-title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Facture développement"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="invoice-amount">Montant (€)</Label>
              <Input
                id="invoice-amount"
                type="number"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="5000"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="invoice-date">Date d'échéance</Label>
              <Input
                id="invoice-date"
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="invoice-description">Description</Label>
              <Textarea
                id="invoice-description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Détails de la facture..."
                className="mt-1"
                rows={5}
              />
            </div>
          </div>
        );

      case 'convert-quote':
        return (
          <div className="space-y-4">
            <p className="text-gray-300">
              Êtes-vous sûr de vouloir convertir ce devis en facture ?
            </p>
            <div>
              <Label htmlFor="convert-date">Date d'échéance</Label>
              <Input
                id="convert-date"
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="convert-notes">Notes</Label>
              <Textarea
                id="convert-notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notes supplémentaires..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        );

      case 'edit':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nom</Label>
              <Input
                id="edit-name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nom complet"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Téléphone</Label>
              <Input
                id="edit-phone"
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+33 6 12 34 56 78"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-company">Entreprise</Label>
              <Input
                id="edit-company"
                value={formData.company || ''}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Nom de l'entreprise"
                className="mt-1"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-400 py-12">
            <p>Contenu non disponible</p>
          </div>
        );
    }
  };

  const getTitle = () => {
    switch (slideOverContent) {
      case 'convert-lead':
        return 'Convertir en Client';
      case 'new-quote':
        return 'Nouveau Devis';
      case 'new-invoice':
        return 'Nouvelle Facture';
      case 'convert-quote':
        return 'Convertir en Facture';
      case 'edit':
        return 'Modifier';
      default:
        return 'Action';
    }
  };

  return (
    <AnimatePresence>
      {isSlideOverOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSlideOver}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Slide Over Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#0A0A0A] border-l border-white/10 z-50 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">{getTitle()}</h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={closeSlideOver}
                  className="shrink-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">{renderContent()}</div>

              {/* Footer */}
              <div className="p-6 border-t border-white/10 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeSlideOver}
                  className="flex-1"
                  disabled={loading}
                >
                  Annuler
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Chargement...' : 'Enregistrer'}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
