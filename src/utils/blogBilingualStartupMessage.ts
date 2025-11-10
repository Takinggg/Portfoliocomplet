/**
 * Message de démarrage pour informer sur le blog bilingue
 */

export function showBlogBilingualStartupMessage() {
  const styles = {
    title: 'font-size: 16px; font-weight: bold; color: #00FFC2; background: #0C0C0C; padding: 8px 12px; border-left: 4px solid #00FFC2;',
    success: 'color: #00FFC2; font-weight: bold;',
    info: 'color: #60A5FA; font-weight: bold;',
    warning: 'color: #FFA500; font-weight: bold;',
    error: 'color: #FF6B6B; font-weight: bold;',
    code: 'background: #1a1a1a; color: #00FFC2; padding: 2px 6px; border-radius: 3px; font-family: monospace;',
    dim: 'color: #888;'
  };

  console.log('\n');
  console.log('%c🌍 BLOG BILINGUE CONFIGURÉ', styles.title);
  console.log('');
  
  console.log('%c📝 Le blog supporte maintenant FR + EN', styles.success);
  console.log('   Le problème du "blog vide en anglais" est résolu !');
  console.log('');
  
  console.log('%c🎯 Comment ça fonctionne', styles.info);
  console.log('   • Chaque article a un champ %clanguage%c ("fr" ou "en")', '', styles.code, '');
  console.log('   • Le serveur filtre les posts selon la langue active');
  console.log('   • Le mode local utilise des suffixes (_fr, _en)');
  console.log('');
  
  console.log('%c🚀 Initialiser les articles bilingues', styles.info);
  console.log('   1️⃣  Allez sur %c/blog%c ou %c/dashboard', '', styles.code, '', styles.code, '');
  console.log('   2️⃣  Cliquez sur "Initialiser Blog (10 articles FR+EN)"');
  console.log('   3️⃣  Attendez le rafraîchissement automatique');
  console.log('   4️⃣  Testez le changement de langue FR ↔️ EN');
  console.log('');
  
  console.log('%c🧪 Tester dans la console', styles.info);
  console.log('   %cawait testBlogBilingual()%c      ← Vérifier les articles FR + EN', styles.code, '', styles.dim);
  console.log('   %cawait testLanguageSwitching()%c  ← Tester le changement de langue', styles.code, '', styles.dim);
  console.log('   %cawait seedBlogPostsBilingual()%c ← Créer les 10 articles', styles.code, '', styles.dim);
  console.log('');
  
  console.log('%c📚 10 Articles Créés', styles.info);
  console.log('   Français (5):');
  console.log('   • Débuter avec React en 2024');
  console.log('   • Design System Moderne avec Tailwind CSS');
  console.log('   • Tarification Freelance');
  console.log('   • TypeScript Avancé');
  console.log('   • Animations Web Performantes');
  console.log('');
  console.log('   English (5):');
  console.log('   • Getting Started with React in 2024');
  console.log('   • Building a Modern Design System');
  console.log('   • Freelance Pricing Guide');
  console.log('   • Advanced TypeScript');
  console.log('   • Creating Performant Web Animations');
  console.log('');
  
  console.log('%c💡 Guide Complet', styles.info);
  console.log('   Consultez %c/BLOG_BILINGUE_READY.md%c pour tous les détails', '', styles.code, '');
  console.log('\n');
}

// Auto-affichage en dev (une seule fois)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  const key = 'blog_bilingual_message_shown';
  const shown = sessionStorage.getItem(key);
  
  if (!shown) {
    // Attendre que la console soit prête
    setTimeout(() => {
      showBlogBilingualStartupMessage();
      sessionStorage.setItem(key, 'true');
    }, 1000);
  }
}
