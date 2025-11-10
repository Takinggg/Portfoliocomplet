import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function NewsletterDebugPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/test-frontend-url`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setConfig(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement de la configuration');
      console.error('Error loading config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#F4F4F4] py-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-4">
            Newsletter Debug <span className="text-[#00FFC2]">.</span>
          </h1>
          <p className="text-[#A3A3A3] text-lg">
            Vérification de la configuration FRONTEND_URL pour les emails de confirmation
          </p>
        </div>

        {/* Refresh Button */}
        <div className="mb-6">
          <Button
            onClick={loadConfig}
            disabled={loading}
            className="bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Recharger
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <Card className="bg-red-950/20 border-red-500 p-6 mb-6">
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-500 font-semibold mb-2">Erreur</h3>
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {loading && !config && (
          <Card className="bg-[#1A1A1A] border-[#2A2A2A] p-12">
            <div className="flex items-center justify-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-[#00FFC2]" />
              <p className="text-[#A3A3A3]">Chargement de la configuration...</p>
            </div>
          </Card>
        )}

        {/* Configuration Display */}
        {config && (
          <div className="space-y-6">
            
            {/* Status Card */}
            <Card className={`p-6 ${
              config.isValid 
                ? 'bg-green-950/20 border-green-500' 
                : 'bg-orange-950/20 border-orange-500'
            }`}>
              <div className="flex items-start gap-3">
                {config.isValid ? (
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3 className={`font-semibold mb-2 ${
                    config.isValid ? 'text-green-500' : 'text-orange-500'
                  }`}>
                    {config.message}
                  </h3>
                  <p className={
                    config.isValid ? 'text-green-300' : 'text-orange-300'
                  }>
                    {config.isValid 
                      ? 'Les emails de confirmation contiendront des liens valides.'
                      : 'Les emails ne pourront pas générer de liens de confirmation corrects.'
                    }
                  </p>
                </div>
              </div>
            </Card>

            {/* Configuration Details */}
            <Card className="bg-[#1A1A1A] border-[#2A2A2A] p-6">
              <h3 className="text-xl font-semibold mb-6">Détails de configuration</h3>
              
              <div className="space-y-4">
                
                {/* Raw Value */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[#A3A3A3] text-sm font-medium">Valeur brute (FRONTEND_URL)</span>
                    {config.hasProtocol ? (
                      <Badge className="bg-green-500/20 text-green-500 border-green-500">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Protocole présent
                      </Badge>
                    ) : (
                      <Badge className="bg-orange-500/20 text-orange-500 border-orange-500">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Protocole manquant
                      </Badge>
                    )}
                  </div>
                  <div className="bg-[#0C0C0C] p-3 rounded-md border border-[#2A2A2A]">
                    <code className="text-[#00FFC2] text-sm">
                      {config.raw || '(non défini)'}
                    </code>
                  </div>
                </div>

                {/* Fixed Value */}
                <div>
                  <span className="text-[#A3A3A3] text-sm font-medium mb-2 block">
                    Valeur corrigée (utilisée par le serveur)
                  </span>
                  <div className="bg-[#0C0C0C] p-3 rounded-md border border-[#2A2A2A]">
                    <code className="text-[#00FFC2] text-sm">
                      {config.fixed}
                    </code>
                  </div>
                </div>

                {/* Test URL */}
                {config.testUrl && (
                  <div>
                    <span className="text-[#A3A3A3] text-sm font-medium mb-2 block">
                      Exemple d'URL de confirmation générée
                    </span>
                    <div className="bg-[#0C0C0C] p-3 rounded-md border border-[#2A2A2A]">
                      <code className="text-[#00FFC2] text-sm break-all">
                        {config.testUrl}
                      </code>
                    </div>
                    <a 
                      href={config.testUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-2 text-sm text-[#00FFC2] hover:underline"
                    >
                      Tester ce lien →
                    </a>
                  </div>
                )}
              </div>
            </Card>

            {/* Instructions */}
            {!config.isValid && (
              <Card className="bg-[#1A1A1A] border-[#2A2A2A] p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#00FFC2]" />
                  Comment corriger ?
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-[#00FFC2] mb-2">1. Ouvre le Dashboard Supabase</h4>
                    <a 
                      href="https://supabase.com/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#A3A3A3] hover:text-[#00FFC2] underline"
                    >
                      https://supabase.com/dashboard
                    </a>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#00FFC2] mb-2">2. Va dans Edge Functions</h4>
                    <p className="text-sm text-[#A3A3A3]">
                      Menu de gauche → Edge Functions → Ta fonction "server"
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#00FFC2] mb-2">3. Configure la variable</h4>
                    <p className="text-sm text-[#A3A3A3] mb-2">
                      Onglet "Settings" ou "Secrets" → Ajoute :
                    </p>
                    <div className="bg-[#0C0C0C] p-3 rounded-md border border-[#2A2A2A]">
                      <div className="text-sm">
                        <div className="text-[#A3A3A3]">Nom :</div>
                        <code className="text-[#00FFC2]">FRONTEND_URL</code>
                      </div>
                      <div className="text-sm mt-2">
                        <div className="text-[#A3A3A3]">Valeur :</div>
                        <code className="text-[#00FFC2]">https://ton-domaine.com</code>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#00FFC2] mb-2">4. Redémarre la fonction</h4>
                    <p className="text-sm text-[#A3A3A3]">
                      Si nécessaire, redéploie la fonction Edge
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#00FFC2] mb-2">5. Vérifie</h4>
                    <p className="text-sm text-[#A3A3A3]">
                      Clique sur le bouton "Recharger" en haut de cette page
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Success State */}
            {config.isValid && (
              <Card className="bg-green-950/20 border-green-500 p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-green-500 font-semibold mb-2">Configuration OK !</h3>
                    <p className="text-green-300 mb-4">
                      Le système newsletter est prêt à fonctionner. Les emails de confirmation contiendront des liens valides et cliquables.
                    </p>
                    <a 
                      href="/"
                      className="inline-flex items-center gap-2 text-sm text-[#00FFC2] hover:underline"
                    >
                      ← Retour au site
                    </a>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
