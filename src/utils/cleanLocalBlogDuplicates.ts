/**
 * Nettoyage automatique des doublons dans le localStorage au démarrage
 * Ce script s'exécute une fois au chargement de l'app pour nettoyer les données corrompues
 */

const STORAGE_KEY = "local_blog_posts";
const CLEANUP_DONE_KEY = "blog_duplicates_cleaned";

function cleanupLocalBlogDuplicates() {
  // Vérifier si le nettoyage a déjà été fait
  if (localStorage.getItem(CLEANUP_DONE_KEY) === "true") {
    return;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(CLEANUP_DONE_KEY, "true");
      return;
    }

    const data = JSON.parse(stored);
    const posts = data.posts || [];

    // Dédupliquer par ID
    const seen = new Set<string>();
    const cleanedPosts = posts.filter((post: any) => {
      if (seen.has(post.id)) {
        return false;
      }
      seen.add(post.id);
      return true;
    });

    // Si on a trouvé des doublons, sauvegarder la version nettoyée
    if (cleanedPosts.length < posts.length) {
      data.posts = cleanedPosts;
      data.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      
      if (window.location.hostname === "localhost") {
        console.log(`🧹 Blog localStorage cleaned: removed ${posts.length - cleanedPosts.length} duplicate(s)`);
      }
    }

    // Marquer le nettoyage comme terminé
    localStorage.setItem(CLEANUP_DONE_KEY, "true");
  } catch (error) {
    console.error("Error cleaning blog duplicates:", error);
  }
}

// Exécuter automatiquement au chargement
cleanupLocalBlogDuplicates();

export default cleanupLocalBlogDuplicates;
