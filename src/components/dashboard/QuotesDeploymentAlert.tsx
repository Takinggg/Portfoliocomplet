import { AlertCircle, ExternalLink, TestTube, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { createClient } from "../../utils/supabase/client";

export function QuotesDeploymentAlert() {
  const supabase = createClient();

  const seedData = async () => {
    try {
      toast.info("ðŸŒ± Initialisation des donnÃ©es...");
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expirÃ©e");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/seed-data`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast.success(`âœ… DonnÃ©es initialisÃ©es ! ${result.counts.projects} projets, ${result.counts.blogPosts} articles, ${result.counts.caseStudies} Ã©tudes de cas`);
        console.log("âœ… Seed result:", result);
        alert(`âœ… DONNÃ‰ES INITIALISÃ‰ES !\n\n` +
          `ðŸ“¦ ${result.counts.projects} projets\n` +
          `ðŸ“ ${result.counts.blogPosts} articles de blog\n` +
          `ðŸ“Š ${result.counts.caseStudies} Ã©tudes de cas\n` +
          `â­ ${result.counts.testimonials} tÃ©moignages\n\n` +
          `RafraÃ®chissez la page pour voir les donnÃ©es !`);
      } else {
        const error = await response.text();
        toast.error("Erreur lors de l'initialisation");
        console.error("Seed error:", error);
      }
    } catch (error: any) {
      toast.error("Erreur : " + error.message);
      console.error("Seed error:", error);
    }
  };

  const testQuotesRoute = async () => {
    toast.info("ðŸ§ª Test de la route /quotes en cours...");
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("âŒ Pas de session - Connectez-vous d'abord");
        return;
      }

      const url = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/quotes`;
      console.log("ðŸ§ª Testing URL:", url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("ðŸ“Š Status:", response.status);
      console.log("ðŸ“Š Status Text:", response.statusText);
      
      const text = await response.text();
      console.log("ðŸ“„ Raw Response:", text);
      
      if (response.status === 404) {
        toast.error("âŒ Erreur 404 - Route non trouvÃ©e !");
        console.error("âŒ 404 ERROR - VÃ©rifiez les logs Supabase");
        console.log("ðŸ” Possible causes:");
        console.log("   1. Serveur n'a pas dÃ©marrÃ© correctement");
        console.log("   2. Propagation en cours (attendez 5 min)");
        console.log("   3. Erreur au dÃ©marrage du serveur");
        alert("âŒ Erreur 404 !\n\nLes routes sont dans le code mais le serveur ne les charge pas.\n\nVÃ©rifiez les LOGS Supabase pour voir s'il y a une erreur au dÃ©marrage.");
      } else if (response.status === 401) {
        toast.warning("âš ï¸ 401 Unauthorized - ProblÃ¨me d'auth");
        console.log("ðŸ“„ Response:", text);
        alert("âš ï¸ 401 Unauthorized\n\nLa route existe mais l'authentification a Ã©chouÃ©.\nVÃ©rifiez le token.");
      } else if (response.ok) {
        try {
          const json = JSON.parse(text);
          toast.success("âœ… La route /quotes fonctionne parfaitement !");
          console.log("âœ… SUCCESS:", json);
          alert("âœ… SUCCESS !\n\nLa route /quotes fonctionne correctement.\n\nNombre de devis: " + (json.quotes?.length || 0));
        } catch (e) {
          toast.warning("âš ï¸ RÃ©ponse OK mais pas JSON");
          console.log("Response:", text);
        }
      } else {
        toast.error(`âŒ Erreur ${response.status}`);
        console.error("Error:", response.status, text);
        alert(`âŒ Erreur ${response.status}\n\n${text}`);
      }
    } catch (error: any) {
      toast.error("âŒ Erreur rÃ©seau : " + error.message);
      console.error("Network error:", error);
      alert("âŒ Erreur rÃ©seau:\n\n" + error.message);
    }
  };

  return (
    <Alert className="bg-[#CCFF00]/10 border-[#CCFF00]/50 mb-6">
      <AlertCircle className="h-5 w-5 text-red-400" />
      <AlertTitle className="text-[#CCFF00] text-lg">
        ðŸš¨ SERVEUR NON DÃ‰PLOYÃ‰ - 2 Ã‰TAPES OBLIGATOIRES
      </AlertTitle>
      <AlertDescription className="text-[#F4F4F4] mt-2">
        <p className="mb-3">
          <strong className="text-red-400">âš ï¸ Erreur actuelle : 404 Not Found</strong>
          <br />
          <strong>Ã‰TAPE 1 :</strong> DÃ©ployez <code className="bg-black/30 px-1">/supabase/functions/server/index-complete.tsx</code> sur Supabase
          <br />
          â€¢ Ouvrez le fichier â†’ Ctrl+A â†’ Ctrl+C
          <br />
          â€¢ Supabase Dashboard â†’ Edge Functions â†’ Ctrl+A â†’ Delete â†’ Ctrl+V â†’ Deploy
          <br />
          â€¢ Attendez 2 minutes â±ï¸
          <br />
          <strong>Ã‰TAPE 2 :</strong> Cliquez "ðŸŒ± Initialiser les DonnÃ©es" (aprÃ¨s dÃ©ploiement)
          <br />
          â€¢ CrÃ©e 3 projets + 3 blogs + 2 Ã©tudes de cas + 2 tÃ©moignages
          <br />
          ðŸ“ <strong>Fichier mis Ã  jour :</strong> Fixes <code className="bg-black/30 px-1">posts.map is not a function</code> + Route <code className="bg-black/30 px-1">/seed-data</code>
        </p>
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={async () => {
              try {
                toast.info("ðŸ” Test connexion serveur...");
                const response = await fetch(
                  `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`,
                  {
                    headers: {
                      Authorization: `Bearer ${publicAnonKey}`,
                    },
                  }
                );
                
                if (response.ok) {
                  const data = await response.json();
                  toast.success(`âœ… Serveur connectÃ© ! Version: ${data.version || 'v2'}`);
                  alert(`âœ… SERVEUR OPÃ‰RATIONNEL !\n\nStatut: ${response.status}\nVersion: ${data.version || 'v2'}\n\nVous pouvez maintenant initialiser les donnÃ©es.`);
                } else if (response.status === 404) {
                  toast.error("âŒ Serveur non dÃ©ployÃ© (404)");
                  alert("âŒ ERREUR 404\n\nLe serveur n'est PAS dÃ©ployÃ©.\n\nDÃ©ployez index-complete.tsx maintenant !");
                } else {
                  toast.error(`âŒ Erreur ${response.status}`);
                }
              } catch (error: any) {
                toast.error("âŒ Serveur inaccessible");
                alert("âŒ SERVEUR INACCESSIBLE\n\nLe serveur n'est pas dÃ©ployÃ© ou ne rÃ©pond pas.\n\nDÃ©ployez index-complete.tsx sur Supabase !");
              }
            }}
            className="bg-blue-500 text-white hover:bg-blue-600"
            size="sm"
          >
            <TestTube className="h-4 w-4 mr-2" />
            ðŸ” Tester Connexion
          </Button>
          <Button
            onClick={seedData}
            className="bg-green-500 text-white hover:bg-green-600"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            ðŸŒ± Initialiser les DonnÃ©es
          </Button>
          <Button
            onClick={() => {
              window.open('/guide-deploiement-express.html', '_blank');
            }}
            className="bg-purple-500 text-white hover:bg-purple-600"
            size="sm"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            ðŸ“– Guide Interactif
          </Button>
          <Button
            onClick={() => {
              const message = `
ðŸ”§ VERSION v2 - TOUTES LES ROUTES + FIXES

âœ… CORRECTIONS APPLIQUÃ‰ES :
   1. Dashboard retourne TABLEAUX (fix: leads.filter is not a function)
   2. Routes ajoutÃ©es : Projects, Newsletter, Testimonials, Blog, etc.

ðŸ“„ Fichier : /supabase/functions/server/index-complete.tsx

ðŸ“¦ Contient :
  âœ… Auth, Clients, Leads, Bookings, Dashboard (CORRIGÃ‰)
  âœ… Quotes (6 routes), Projects, Newsletter
  âœ… Testimonials, Blog, Case Studies, Resources, FAQ
  âœ… ~850 lignes (optimisÃ©e)

ðŸ“‹ DÃ‰PLOIEMENT :
  1. Ouvrez index-complete.tsx
  2. Ctrl+A, Ctrl+C
  3. Supabase Dashboard
  4. Ctrl+A, Delete, Ctrl+V
  5. Deploy
  6. Attendez 2 min
  7. F5 (rafraÃ®chir)

ðŸŽ¯ RÃ‰SULTAT :
  âœ… Plus d'erreur .filter
  âœ… Dashboard fonctionne
  âœ… Projets chargent
  âœ… TOUT fonctionne !
              `;
              alert(message);
              navigator.clipboard.writeText(message);
              toast.success("Instructions copiÃ©es !");
            }}
            className="bg-[#CCFF00] text-black hover:bg-[#C6FF1A]"
            size="sm"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            ðŸ“– PROCHAINE Ã‰TAPE
          </Button>
          <Button
            onClick={() => {
              const solution = `
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  âœ… VERSION COMPLÃˆTE - Toutes les Routes Fonctionnent
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

ðŸŽ‰ BONNE NOUVELLE :
   Les routes /quotes fonctionnent ! (test rÃ©ussi)
   
ðŸ”§ PROCHAINE Ã‰TAPE :
   DÃ©ployez la version COMPLÃˆTE avec toutes les routes.

âœ… SOLUTION EN 3 MINUTES :

1. Ouvrez ce fichier dans votre Ã©diteur :
   ðŸ“„ /supabase/functions/server/index-complete.tsx

2. Copiez TOUT le contenu (Ctrl+A, Ctrl+C)

3. Allez sur Supabase :
   https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions/make-server-04919ac5/details

4. Dans l'Ã©diteur Supabase :
   - Ctrl+A (tout sÃ©lectionner)
   - Delete
   - Ctrl+V (coller)

5. Cliquez sur "Deploy"

6. Attendez 2 minutes

7. Testez avec le bouton "ðŸ§ª Tester Maintenant"

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

ðŸ“¦ CONTENU DE CETTE VERSION :
   
   âœ… Auth (login, init-admin)
   âœ… Clients (GET/POST/PUT/DELETE)
   âœ… Leads (GET/POST/PUT/DELETE)
   âœ… Bookings (GET/POST/PUT/DELETE)
   âœ… Dashboard stats
   âœ… Quotes (GET/POST/PUT/DELETE/convert/send-reminder)
   
   Taille : ~700 lignes (optimisÃ©e pour Supabase)

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

ðŸŽ¯ RÃ‰SULTAT ATTENDU :
   
   Tout fonctionnera : Clients, Devis, Bookings, Dashboard !

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
`;
              console.log(solution);
              alert(solution);
              // Copier dans le presse-papier
              navigator.clipboard.writeText(solution).then(() => {
                toast.success("âœ… Instructions copiÃ©es dans le presse-papier !");
              });
            }}
            variant="outline"
            className="border-[#CCFF00] text-[#CCFF00] hover:bg-[#CCFF00]/10"
            size="sm"
          >
            ðŸ“‹ Copier Instructions
          </Button>
          <Button
            onClick={testQuotesRoute}
            variant="outline"
            className="border-[#CCFF00] text-[#CCFF00] hover:bg-[#CCFF00]/10"
            size="sm"
          >
            <TestTube className="h-4 w-4 mr-2" />
            ðŸ§ª Tester les Routes
          </Button>
          <Button
            onClick={() => window.open('https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions/make-server-04919ac5/logs', '_blank')}
            variant="outline"
            className="border-[#CCFF00] text-[#CCFF00] hover:bg-[#CCFF00]/10"
            size="sm"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            ðŸ“‹ Logs
          </Button>
          <Button
            onClick={() => window.open('https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions/make-server-04919ac5/details', '_blank')}
            className="bg-[#CCFF00] text-black hover:bg-[#C6FF1A]"
            size="sm"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            ðŸš€ Aller DÃ©ployer
          </Button>
        </div>
        <p className="mt-3 text-sm text-red-300">
          â±ï¸ Temps estimÃ© : <strong>5 minutes</strong> pour dÃ©ployer les routes
        </p>
      </AlertDescription>
    </Alert>
  );
}

