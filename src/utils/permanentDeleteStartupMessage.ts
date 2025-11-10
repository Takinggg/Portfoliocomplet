// Message de démarrage pour informer du système de suppression permanente

if (typeof window !== "undefined") {
  // Vérifier s'il y a des case studies supprimés
  const deletedCaseStudies = localStorage.getItem("deleted_case_studies");
  const deletedIds = deletedCaseStudies ? JSON.parse(deletedCaseStudies) : [];
  
  if (deletedIds.length > 0) {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║  🗑️  ${deletedIds.length} CASE STUD${deletedIds.length > 1 ? 'IES' : 'Y'} SUPPRIMÉ${deletedIds.length > 1 ? 'S' : ''} DÉFINITIVEMENT                      ║
╚══════════════════════════════════════════════════════════════════╝

📋 IDs supprimés : ${deletedIds.join(', ')}

✅ Ces case studies ne seront PAS recréés lors de :
   • initCaseStudies()
   • seedCaseStudies()
   • Initialisation depuis le dashboard

💡 Pour voir la liste : getDeletedCaseStudies()
🔄 Pour réinitialiser : clearDeletedCaseStudies()

══════════════════════════════════════════════════════════════════
    `);
  }
}

export {};
