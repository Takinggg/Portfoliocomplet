import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InvoiceViewer from '../invoice/InvoiceViewer';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface InvoiceData {
  number: string;
  date: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  amount: number;
  notes?: string;
  freelance: {
    name: string;
    email: string;
    address: string;
    siret: string;
    tva: string;
    iban: string;
  };
}

export default function InvoiceViewPage() {
  const { token } = useParams<{ token: string }>();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Lien invalide');
      setLoading(false);
      return;
    }

    fetchInvoice();
  }, [token]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/invoices/view/${token}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Impossible de charger la facture');
      }

      setInvoice(data.invoice);
    } catch (err: any) {
      console.error('Error fetching invoice:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return <InvoiceViewer invoice={invoice} loading={loading} error={error} />;
}
