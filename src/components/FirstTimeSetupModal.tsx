import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { AlertTriangle, CheckCircle2, Terminal, ExternalLink } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

export function FirstTimeSetupModal() {
  const [showModal, setShowModal] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    // Disabled for now - the ServerStatusAlert is less intrusive
    // Users can check the console for deployment instructions
    return;
    
    // Check if this is the first time (or if we should show the setup)
    const hasSeenSetup = localStorage.getItem('hasSeenServerSetup');
    
    if (!hasSeenSetup) {
      checkServer();
    }
  }, []);

  const checkServer = async () => {
    try {
      const { publicAnonKey } = await import('../utils/supabase/info');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        setServerStatus('online');
        // Don't show modal if server is already online
        localStorage.setItem('hasSeenServerSetup', 'true');
      } else {
        setServerStatus('offline');
        setShowModal(true);
      }
    } catch (error) {
      setServerStatus('offline');
      setShowModal(true);
    }
  };

  const handleDismiss = () => {
    setShowModal(false);
    localStorage.setItem('hasSeenServerSetup', 'true');
  };

  const openConsole = () => {
    console.clear();
    console.log('%cðŸš€ GUIDE DE DÃ‰PLOIEMENT', 'font-size: 18px; font-weight: bold; color: #CCFF00;');
    console.log('');
    console.log('ExÃ©cutez cette commande dans votre terminal:');
    console.log('%csupabase functions deploy server', 'font-size: 14px; background: #1a1a1a; padding: 8px; color: #CCFF00;');
    console.log('');
    console.log('Ou tapez dans cette console:');
    console.log('%cdeployServer()', 'font-size: 14px; background: #1a1a1a; padding: 8px; color: #CCFF00;');
    alert('âœ… Instructions affichÃ©es dans la console (F12)');
  };

  if (!showModal || serverStatus === 'checking') {
    return null;
  }

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-md bg-[#0C0C0C] border-[#CCFF00]/20">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[#CCFF00]" />
            <DialogTitle className="text-[#F4F4F4]">Configuration initiale requise</DialogTitle>
          </div>
          <DialogDescription asChild>
            <div className="text-[#F4F4F4]/60 space-y-3 pt-4">
              <p>
                Bienvenue ! Pour que l'application fonctionne, vous devez dÃ©ployer le serveur Edge Function sur Supabase.
              </p>
              
              <div className="bg-black/40 border border-[#CCFF00]/10 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-[#CCFF00]">
                  <Terminal className="h-4 w-4" />
                  <span className="font-medium">Commande rapide</span>
                </div>
                <code className="block text-sm text-[#F4F4F4]/80 font-mono bg-black/40 p-2 rounded">
                  supabase functions deploy server
                </code>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-[#F4F4F4]/80">Ou suivez ces Ã©tapes :</p>
                <ol className="list-decimal list-inside space-y-1 text-[#F4F4F4]/60">
                  <li>Ouvrir la console (F12)</li>
                  <li>ExÃ©cuter : <code className="text-[#CCFF00]">deployServer()</code></li>
                  <li>Suivre les instructions affichÃ©es</li>
                </ol>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button
                  onClick={openConsole}
                  className="w-full bg-[#CCFF00] text-[#0C0C0C] hover:bg-[#CCFF00]/90"
                >
                  <Terminal className="h-4 w-4 mr-2" />
                  Voir les instructions
                </Button>
                
                <Button
                  onClick={() => window.open(`https://supabase.com/dashboard/project/${projectId}/functions`, '_blank')}
                  variant="outline"
                  className="w-full border-[#CCFF00]/20 text-[#CCFF00] hover:bg-[#CCFF00]/10"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ouvrir Dashboard Supabase
                </Button>

                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  className="w-full text-[#F4F4F4]/60 hover:text-[#F4F4F4]"
                >
                  Je le ferai plus tard
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
