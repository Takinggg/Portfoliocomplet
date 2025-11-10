import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function ServerStatusAlert() {
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [showAlert, setShowAlert] = useState(false); // Disabled by default - less intrusive

  useEffect(() => {
    checkServerStatus();
    
    // Make it available globally so users can show it from console
    (window as any).showServerStatus = () => setShowAlert(true);
  }, []);

  const checkServerStatus = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setServerStatus('online');
          console.log('✅ Server is online:', data.version);
        } else {
          setServerStatus('offline');
        }
      } else {
        setServerStatus('offline');
      }
    } catch (error) {
      // Silent error - server might not be deployed yet
      setServerStatus('offline');
    }
  };

  if (!showAlert || serverStatus === 'checking') {
    return null;
  }

  if (serverStatus === 'online') {
    return (
      <Alert className="fixed top-4 right-4 w-auto max-w-md z-50 bg-[#00FFC2]/10 border-[#00FFC2]/30">
        <CheckCircle2 className="h-4 w-4 text-[#00FFC2]" />
        <AlertTitle className="text-[#00FFC2]">Serveur connecté</AlertTitle>
        <AlertDescription className="text-[#00FFC2]/80">
          Toutes les fonctionnalités sont disponibles.
        </AlertDescription>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0 text-[#00FFC2]/60 hover:text-[#00FFC2]"
          onClick={() => setShowAlert(false)}
        >
          ✕
        </Button>
      </Alert>
    );
  }

  return (
    <Alert className="fixed top-4 right-4 w-auto max-w-md z-50 bg-red-500/10 border-red-500/30 shadow-lg">
      <AlertTriangle className="h-4 w-4 text-red-500" />
      <AlertTitle className="text-red-500">⚠️ Serveur non déployé</AlertTitle>
      <AlertDescription className="text-red-400 space-y-2">
        <p className="text-sm">
          Le serveur Edge Function doit être déployé pour que l'application fonctionne.
        </p>
        <div className="text-xs bg-black/30 p-2 rounded border border-red-500/20 font-mono">
          <div>1. Ouvrir la console (F12)</div>
          <div>2. Exécuter: <span className="text-[#00FFC2]">deployServer()</span></div>
          <div>3. Suivre les instructions</div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
            onClick={() => {
              window.open(`https://supabase.com/dashboard/project/${projectId}/functions`, '_blank');
            }}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Dashboard
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
            onClick={() => {
              console.log('%c📋 Guide de déploiement', 'font-size: 16px; font-weight: bold; color: #00FFC2;');
              console.log('Exécutez: deployServer()');
              checkServerStatus();
            }}
          >
            Réessayer
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400/60 hover:text-red-400"
            onClick={() => setShowAlert(false)}
          >
            Masquer
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
