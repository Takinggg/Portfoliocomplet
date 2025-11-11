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
      toast.info("🌱 Initialisation des données...");
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expirée");
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
        toast.success(`✅ Données initialisées ! ${result.counts.projects} projets, ${result.counts.blogPosts} articles, ${result.counts.caseStudies} études de cas`);
        console.log("✅ Seed result:", result);
        alert(`✅ DONNÉES INITIALISÉES !\n\n` +
          `📦 ${result.counts.projects} projets\n` +
          `📝 ${result.counts.blogPosts} articles de blog\n` +
          `📊 ${result.counts.caseStudies} études de cas\n` +
          `⭐ ${result.counts.testimonials} témoignages\n\n` +
          `Rafraîchissez la page pour voir les données !`);
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
    toast.info("🧪 Test de la route /quotes en cours...");
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("❌ Pas de session - Connectez-vous d'abord");
        return;
      }

      const url = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/quotes`;
      console.log("🧪 Testing URL:", url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("📊 Status:", response.status);
      console.log("📊 Status Text:", response.statusText);
      
      const text = await response.text();
      console.log("📄 Raw Response:", text);
      
      if (response.status === 404) {
        toast.error("❌ Erreur 404 - Route non trouvée !");
        console.error("❌ 404 ERROR - Vérifiez les logs Supabase");
        console.log("🔍 Possible causes:");
        console.log("   1. Serveur n'a pas démarré correctement");
        console.log("   2. Propagation en cours (attendez 5 min)");
        console.log("   3. Erreur au démarrage du serveur");
        alert("❌ Erreur 404 !\n\nLes routes sont dans le code mais le serveur ne les charge pas.\n\nVérifiez les LOGS Supabase pour voir s'il y a une erreur au démarrage.");
      } else if (response.status === 401) {
        toast.warning("⚠️ 401 Unauthorized - Problème d'auth");
        console.log("📄 Response:", text);
        alert("⚠️ 401 Unauthorized\n\nLa route existe mais l'authentification a échoué.\nVérifiez le token.");
      } else if (response.ok) {
        try {
          const json = JSON.parse(text);
          toast.success("✅ La route /quotes fonctionne parfaitement !");
          console.log("✅ SUCCESS:", json);
          alert("✅ SUCCESS !\n\nLa route /quotes fonctionne correctement.\n\nNombre de devis: " + (json.quotes?.length || 0));
        } catch (e) {
          toast.warning("⚠️ Réponse OK mais pas JSON");
          console.log("Response:", text);
        }
      } else {
        toast.error(`❌ Erreur ${response.status}`);
        console.error("Error:", response.status, text);
        alert(`❌ Erreur ${response.status}\n\n${text}`);
      }
    } catch (error: any) {
      toast.error("❌ Erreur réseau : " + error.message);
      console.error("Network error:", error);
      alert("❌ Erreur réseau:\n\n" + error.message);
    }
  };

  return (
    <Alert className="bg-[#00FFC2]/10 border-[#00FFC2]/50 mb-6">
      <AlertCircle className="h-5 w-5 text-red-400" />
      <AlertTitle className="text-[#00FFC2] text-lg">
        🚨 SERVEUR NON DÉPLOYÉ - 2 ÉTAPES OBLIGATOIRES
      </AlertTitle>
      <AlertDescription className="text-[#F4F4F4] mt-2">
        <p className="mb-3">
          <strong className="text-red-400">⚠️ Erreur actuelle : 404 Not Found</strong>
          <br />
          <strong>ÉTAPE 1 :</strong> Déployez <code className="bg-black/30 px-1">/supabase/functions/server/index-complete.tsx</code> sur Supabase
          <br />
          • Ouvrez le fichier → Ctrl+A → Ctrl+C
          <br />
          • Supabase Dashboard → Edge Functions → Ctrl+A → Delete → Ctrl+V → Deploy
          <br />
          • Attendez 2 minutes ⏱️
          <br />
          <strong>ÉTAPE 2 :</strong> Cliquez "🌱 Initialiser les Données" (après déploiement)
          <br />
          • Crée 3 projets + 3 blogs + 2 études de cas + 2 témoignages
          <br />
          📝 <strong>Fichier mis à jour :</strong> Fixes <code className="bg-black/30 px-1">posts.map is not a function</code> + Route <code className="bg-black/30 px-1">/seed-data</code>
        </p>
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={async () => {
              try {
                toast.info("🔍 Test connexion serveur...");
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
                  toast.success(`✅ Serveur connecté ! Version: ${data.version || 'v2'}`);
                  alert(`✅ SERVEUR OPÉRATIONNEL !\n\nStatut: ${response.status}\nVersion: ${data.version || 'v2'}\n\nVous pouvez maintenant initialiser les données.`);
                } else if (response.status === 404) {
                  toast.error("❌ Serveur non déployé (404)");
                  alert("❌ ERREUR 404\n\nLe serveur n'est PAS déployé.\n\nDéployez index-complete.tsx maintenant !");
                } else {
                  toast.error(`❌ Erreur ${response.status}`);
                }
              } catch (error: any) {
                toast.error("❌ Serveur inaccessible");
                alert("❌ SERVEUR INACCESSIBLE\n\nLe serveur n'est pas déployé ou ne répond pas.\n\nDéployez index-complete.tsx sur Supabase !");
              }
            }}
            className="bg-blue-500 text-white hover:bg-blue-600"
            size="sm"
          >
            <TestTube className="h-4 w-4 mr-2" />
            🔍 Tester Connexion
          </Button>
          <Button
            onClick={seedData}
            className="bg-green-500 text-white hover:bg-green-600"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            🌱 Initialiser les Données
          </Button>
          <Button
            onClick={() => {
              window.open('/guide-deploiement-express.html', '_blank');
            }}
            className="bg-purple-500 text-white hover:bg-purple-600"
            size="sm"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            📖 Guide Interactif
          </Button>
          <Button
            onClick={() => {
              const message = `
🔧 VERSION v2 - TOUTES LES ROUTES + FIXES

✅ CORRECTIONS APPLIQUÉES :
   1. Dashboard retourne TABLEAUX (fix: leads.filter is not a function)
   2. Routes ajoutées : Projects, Newsletter, Testimonials, Blog, etc.

📄 Fichier : /supabase/functions/server/index-complete.tsx

📦 Contient :
  ✅ Auth, Clients, Leads, Bookings, Dashboard (CORRIGÉ)
  ✅ Quotes (6 routes), Projects, Newsletter
  ✅ Testimonials, Blog, Case Studies, Resources, FAQ
  ✅ ~850 lignes (optimisée)

📋 DÉPLOIEMENT :
  1. Ouvrez index-complete.tsx
  2. Ctrl+A, Ctrl+C
  3. Supabase Dashboard
  4. Ctrl+A, Delete, Ctrl+V
  5. Deploy
  6. Attendez 2 min
  7. F5 (rafraîchir)

🎯 RÉSULTAT :
  ✅ Plus d'erreur .filter
  ✅ Dashboard fonctionne
  ✅ Projets chargent
  ✅ TOUT fonctionne !
              `;
              alert(message);
              navigator.clipboard.writeText(message);
              toast.success("Instructions copiées !");
            }}
            className="bg-[#00FFC2] text-black hover:bg-[#00cc9a]"
            size="sm"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            📖 PROCHAINE ÉTAPE
          </Button>
          <Button
            onClick={() => {
              const solution = `
═══════════════════════════════════════════════════════════
  ✅ VERSION COMPLÈTE - Toutes les Routes Fonctionnent
═══════════════════════════════════════════════════════════

🎉 BONNE NOUVELLE :
   Les routes /quotes fonctionnent ! (test réussi)
   
🔧 PROCHAINE ÉTAPE :
   Déployez la version COMPLÈTE avec toutes les routes.

✅ SOLUTION EN 3 MINUTES :

1. Ouvrez ce fichier dans votre éditeur :
   📄 /supabase/functions/server/index-complete.tsx

2. Copiez TOUT le contenu (Ctrl+A, Ctrl+C)

3. Allez sur Supabase :
   https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions/make-server-04919ac5/details

4. Dans l'éditeur Supabase :
   - Ctrl+A (tout sélectionner)
   - Delete
   - Ctrl+V (coller)

5. Cliquez sur "Deploy"

6. Attendez 2 minutes

7. Testez avec le bouton "🧪 Tester Maintenant"

═══════════════════════════════════════════════════════════

📦 CONTENU DE CETTE VERSION :
   
   ✅ Auth (login, init-admin)
   ✅ Clients (GET/POST/PUT/DELETE)
   ✅ Leads (GET/POST/PUT/DELETE)
   ✅ Bookings (GET/POST/PUT/DELETE)
   ✅ Dashboard stats
   ✅ Quotes (GET/POST/PUT/DELETE/convert/send-reminder)
   
   Taille : ~700 lignes (optimisée pour Supabase)

═══════════════════════════════════════════════════════════

🎯 RÉSULTAT ATTENDU :
   
   Tout fonctionnera : Clients, Devis, Bookings, Dashboard !

═══════════════════════════════════════════════════════════
`;
              console.log(solution);
              alert(solution);
              // Copier dans le presse-papier
              navigator.clipboard.writeText(solution).then(() => {
                toast.success("✅ Instructions copiées dans le presse-papier !");
              });
            }}
            variant="outline"
            className="border-[#00FFC2] text-[#00FFC2] hover:bg-[#00FFC2]/10"
            size="sm"
          >
            📋 Copier Instructions
          </Button>
          <Button
            onClick={testQuotesRoute}
            variant="outline"
            className="border-[#00FFC2] text-[#00FFC2] hover:bg-[#00FFC2]/10"
            size="sm"
          >
            <TestTube className="h-4 w-4 mr-2" />
            🧪 Tester les Routes
          </Button>
          <Button
            onClick={() => window.open('https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions/make-server-04919ac5/logs', '_blank')}
            variant="outline"
            className="border-[#00FFC2] text-[#00FFC2] hover:bg-[#00FFC2]/10"
            size="sm"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            📋 Logs
          </Button>
          <Button
            onClick={() => window.open('https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions/make-server-04919ac5/details', '_blank')}
            className="bg-[#00FFC2] text-black hover:bg-[#00cc9a]"
            size="sm"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            🚀 Aller Déployer
          </Button>
        </div>
        <p className="mt-3 text-sm text-red-300">
          ⏱️ Temps estimé : <strong>5 minutes</strong> pour déployer les routes
        </p>
      </AlertDescription>
    </Alert>
  );
}

