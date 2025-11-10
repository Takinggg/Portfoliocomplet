/**
 * Message d'information sur les projets bilingues
 * Version complète avec tous les détails
 */

const styles = {
  banner: 'background: linear-gradient(135deg, #00FFC2 0%, #00CC9A 100%); color: #0C0C0C; padding: 12px 20px; font-size: 14px; font-weight: bold; border-radius: 6px;',
  title: 'color: #00FFC2; font-size: 16px; font-weight: bold;',
  subtitle: 'color: #888; font-size: 13px; font-weight: bold;',
  success: 'color: #00FFC2;',
  info: 'color: #60A5FA;',
  warning: 'color: #FFA500;',
  code: 'background: #1a1a1a; color: #00FFC2; padding: 2px 8px; border-radius: 4px; font-family: monospace;',
  text: 'color: #CCC;',
  muted: 'color: #666; font-size: 11px;',
};

// Only show detailed message if explicitly requested
const showDetailedMessage = () => {
  console.log('');
  console.log('%c🌍 PROJETS BILINGUES DISPONIBLES', styles.banner);
  console.log('');

  console.log('%c🔍 Problème', styles.warning);
  console.log('%c   Les projets ne changent pas de langue lors du switch FR/EN', styles.text);
  console.log('');

  console.log('%c✅ Solution implémentée', styles.success);
  console.log('%c   • Nouveau fichier : seedBilingualProjects.ts', styles.text);
  console.log('%c   • 6 projets professionnels en FR et EN (12 entrées)', styles.text);
  console.log('%c   • Traductions complètes (nom, description, résultats...)', styles.text);
  console.log('');

  console.log('%c🚀 COMMENT UTILISER', styles.title);
  console.log('');

  console.log('%c   1️⃣ Peupler la base avec les projets bilingues :', styles.info);
  console.log('%c      await seedBilingualProjects()       %c← Crée 12 projets (6×FR + 6×EN)', styles.code, styles.text);
  console.log('');

  console.log('%c   2️⃣ Vérifier les projets créés :', styles.info);
  console.log('%c      await checkBilingualProjects()      %c← Affiche les projets FR et EN', styles.code, styles.text);
  console.log('');

  console.log('%c   3️⃣ Tester sur la page Projects :', styles.info);
  console.log('%c      • Aller sur /projects', styles.text);
  console.log('%c      • Changer la langue (🇫🇷 ↔ 🇬🇧)', styles.text);
  console.log('%c      • Les projets changent de langue ✨', styles.text);
  console.log('');

  console.log('%c📦 PROJETS INCLUS', styles.title);
  console.log('%c   1. Plateforme E-commerce / E-commerce Platform', styles.text);
  console.log('%c   2. Application Bancaire Mobile / Mobile Banking App', styles.text);
  console.log('%c   3. Dashboard Analytics SaaS / SaaS Analytics Dashboard', styles.text);
  console.log('%c   4. CRM Automatisé Notion / Automated Notion CRM', styles.text);
  console.log('%c   5. Assistant IA Support Client / AI Customer Support Assistant', styles.text);
  console.log('%c   6. Site Portfolio + IA / Portfolio Site + AI Generator', styles.text);
  console.log('');

  console.log('%c🎯 DÉTAILS TECHNIQUES', styles.subtitle);
  console.log('%c   • Stockage : project_1_fr, project_1_en, project_2_fr...', styles.text);
  console.log('%c   • Filtrage serveur par paramètre ?lang=fr ou ?lang=en', styles.text);
  console.log('%c   • useEffect détecte le changement de langue et refetch', styles.text);
  console.log('');

  console.log('%c📖 Documentation complète : PROJETS_BILINGUES_SOLUTION.md', styles.info);
  console.log('');
};

// Expose message function
if (typeof window !== 'undefined') {
  (window as any).showBilingualProjectsHelp = () => {
    console.log('');
    console.log('%c═══════════════════════════════════════════════════════', styles.title);
    console.log('%c🌍 AIDE : PROJETS BILINGUES', styles.title);
    console.log('%c═══════════════════════════════════════════════════════', styles.title);
    console.log('');
    console.log('%c📝 COMMANDES DISPONIBLES :', styles.subtitle);
    console.log('');
    console.log('%c   seedBilingualProjects()         %c← Créer les projets FR + EN', styles.code, styles.text);
    console.log('%c   checkBilingualProjects()        %c← Vérifier les projets', styles.code, styles.text);
    console.log('%c   showBilingualProjectsHelp()     %c← Afficher cette aide', styles.code, styles.text);
    console.log('');
    console.log('%c💡 ASTUCE :', styles.info);
    console.log('%c   Si les projets ne changent pas de langue, c\'est que', styles.text);
    console.log('%c   la base de données ne contient que des projets FR.', styles.text);
    console.log('%c   Exécutez seedBilingualProjects() pour corriger ça !', styles.success);
    console.log('');
  };

  console.log('%c💡 Tapez showBilingualProjectsHelp() pour revoir cette aide', 'color: #888; font-style: italic;');
  console.log('');
}
