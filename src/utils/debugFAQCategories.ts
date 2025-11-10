import { projectId, publicAnonKey } from "./supabase/info";
import { createClient } from "./supabase/client";

/**
 * Debug FAQ Categories - Vérifier les icônes
 * Affiche toutes les catégories avec leurs icônes pour diagnostiquer le problème
 */
export async function debugFAQCategories() {
  try {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║          🔍 DEBUG FAQ CATÉGORIES - VÉRIFICATION ICÔNES          ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
    `);

    // Check if logged in
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    const authHeader = session 
      ? `Bearer ${session.access_token}` 
      : `Bearer ${publicAnonKey}`;

    // Fetch categories
    console.log("📦 Récupération des catégories FAQ...\n");
    
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-categories`,
      {
        headers: { Authorization: authHeader },
      }
    );

    if (!response.ok) {
      console.error("❌ Erreur lors du chargement des catégories");
      console.error(`   Status: ${response.status} ${response.statusText}`);
      return;
    }

    const data = await response.json();
    const categories = data.categories || [];

    if (categories.length === 0) {
      console.log(`
⚠️ AUCUNE CATÉGORIE TROUVÉE
────────────────────────────────────────────────────────────────────

Vous devez initialiser les catégories FAQ :

  1. Dashboard → FAQ → 🌟 Initialiser FAQ (6 cat. + 37 Q)
  
  OU
  
  2. Console : await window.seedFAQData()
      `);
      return;
    }

    console.log(`✅ ${categories.length} catégories trouvées\n`);
    console.log("═".repeat(70));
    console.log("CATÉGORIES FAQ - DÉTAILS");
    console.log("═".repeat(70));

    categories.forEach((cat: any, idx: number) => {
      console.log(`
┌─────────────────────────────────────────────────────────────────┐
│ Catégorie ${idx + 1}/${categories.length}
├─────────────────────────────────────────────────────────────────┤
│ ID       : ${cat.id}
│ Nom FR   : ${cat.name || '(vide)'}
│ Nom EN   : ${cat.name_en || '(vide)'}
│ Icône    : ${cat.icon || '❌ VIDE'}
│ Ordre    : ${cat.order ?? '(non défini)'}
│ Couleur  : ${cat.color || '(non défini)'}
└─────────────────────────────────────────────────────────────────┘
      `);
    });

    console.log("\n" + "═".repeat(70));
    console.log("RÉSUMÉ");
    console.log("═".repeat(70));

    const withIcons = categories.filter((c: any) => c.icon);
    const withoutIcons = categories.filter((c: any) => !c.icon);

    console.log(`
✅ Catégories avec icônes : ${withIcons.length}
❌ Catégories SANS icônes : ${withoutIcons.length}
    `);

    if (withoutIcons.length > 0) {
      console.log(`
🔴 PROBLÈME DÉTECTÉ
────────────────────────────────────────────────────────────────────

${withoutIcons.length} catégories n'ont PAS d'icônes définies :

${withoutIcons.map((c: any) => `  • ${c.name || c.id}`).join('\n')}

🔧 SOLUTION
────────────────────────────────────────────────────────────────────

Ces catégories ont probablement été créées AVANT que le champ "icon"
soit ajouté au schéma.

OPTION 1 - Réinitialiser (recommandé) :
────────────────────────────────────────────────────────────────────

  1. Supprimer toutes les catégories existantes
  2. Réinitialiser avec : await window.seedFAQData()

OPTION 2 - Mettre à jour manuellement :
────────────────────────────────────────────────────────────────────

  Dashboard → FAQ → Modifier chaque catégorie → Ajouter une icône

OPTION 3 - Fonction de correction automatique :
────────────────────────────────────────────────────────────────────

  await window.fixFAQCategoryIcons()
  
  (Cette fonction va ajouter les icônes manquantes automatiquement)
      `);
    } else {
      console.log(`
🎉 TOUT EST CORRECT !
────────────────────────────────────────────────────────────────────

Toutes les catégories ont des icônes définies.

Si les icônes ne s'affichent toujours pas sur la page FAQ,
vérifiez que les noms d'icônes correspondent aux composants Lucide :

ICÔNES SUPPORTÉES :
  • Sparkles
  • Code
  • DollarSign
  • Clock
  • MessageSquare
  • Zap
  • Shield
  • Rocket
  • Calendar
  • Mail
  • HelpCircle (fallback)

ICÔNES ACTUELLES :
${withIcons.map((c: any) => `  • ${c.name}: ${c.icon}`).join('\n')}
      `);
    }

    console.log("\n" + "═".repeat(70));

    return {
      total: categories.length,
      withIcons: withIcons.length,
      withoutIcons: withoutIcons.length,
      categories,
    };

  } catch (error: any) {
    console.error("❌ Erreur lors du debug des catégories FAQ:", error);
    return { error: error.message };
  }
}

/**
 * Corriger automatiquement les icônes manquantes
 */
export async function fixFAQCategoryIcons() {
  try {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║      🔧 CORRECTION AUTOMATIQUE DES ICÔNES FAQ CATÉGORIES        ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
    `);

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("⚠️ Vous devez être connecté au Dashboard pour utiliser cette fonction");
      return;
    }

    const authHeader = `Bearer ${session.access_token}`;

    // Mapping des noms de catégories → icônes
    const iconMapping: { [key: string]: string } = {
      "Services": "Sparkles",
      "Tarifs & Paiement": "DollarSign",
      "Pricing & Payment": "DollarSign",
      "Processus & Délais": "Clock",
      "Process & Timelines": "Clock",
      "Communication": "MessageSquare",
      "Technique": "Code",
      "Technical": "Code",
      "Légal & Sécurité": "Shield",
      "Legal & Security": "Shield",
    };

    // Fetch categories
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-categories`,
      {
        headers: { Authorization: authHeader },
      }
    );

    if (!response.ok) {
      console.error("❌ Erreur lors du chargement des catégories");
      return;
    }

    const data = await response.json();
    const categories = data.categories || [];

    console.log(`📦 ${categories.length} catégories trouvées\n`);

    let fixed = 0;
    let skipped = 0;

    for (const cat of categories) {
      if (cat.icon) {
        console.log(`⏩ ${cat.name} : icône déjà définie (${cat.icon})`);
        skipped++;
        continue;
      }

      // Chercher l'icône correspondante
      const icon = iconMapping[cat.name] || iconMapping[cat.name_en] || "HelpCircle";

      console.log(`🔧 ${cat.name} : ajout de l'icône "${icon}"...`);

      // Update category
      const updateResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-categories/${cat.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({
            ...cat,
            icon,
          }),
        }
      );

      if (updateResponse.ok) {
        console.log(`  ✅ Icône ajoutée !`);
        fixed++;
      } else {
        console.error(`  ❌ Erreur lors de la mise à jour`);
      }
    }

    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║                     📊 RÉSUMÉ DE LA CORRECTION                  ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

✅ Icônes ajoutées : ${fixed}
⏩ Déjà correctes  : ${skipped}
📦 Total           : ${categories.length}

${fixed > 0 ? `
🎉 CORRECTION TERMINÉE !

Rechargez la page FAQ (F5) pour voir les icônes s'afficher.
` : `
✅ Aucune correction nécessaire - toutes les icônes sont déjà définies !
`}
    `);

    return { fixed, skipped, total: categories.length };

  } catch (error: any) {
    console.error("❌ Erreur lors de la correction des icônes:", error);
    return { error: error.message };
  }
}

// Make available globally
if (typeof window !== "undefined") {
  (window as any).debugFAQCategories = debugFAQCategories;
  (window as any).fixFAQCategoryIcons = fixFAQCategoryIcons;
}
