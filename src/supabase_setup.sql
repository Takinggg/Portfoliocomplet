-- ============================================================================
-- SUPABASE SETUP - CONFIGURATION COMPLÈTE DE LA BASE DE DONNÉES
-- ============================================================================
-- 
-- Ce script crée toutes les tables et configurations nécessaires pour
-- faire fonctionner l'application en mode production.
--
-- Instructions:
-- 1. Ouvrir Supabase Dashboard > SQL Editor
-- 2. Copier-coller tout ce script
-- 3. Cliquer sur "Run"
-- 4. Vérifier qu'il n'y a pas d'erreurs
--
-- ============================================================================

-- ============================================================================
-- 1. TABLE KV_STORE (Stockage clé-valeur universel)
-- ============================================================================

-- Créer la table principale
CREATE TABLE IF NOT EXISTS kv_store_04919ac5 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Commentaire pour documentation
COMMENT ON TABLE kv_store_04919ac5 IS 'Stockage clé-valeur pour tous les contenus de l''application (projets, blog, case studies, etc.)';

-- Index pour recherches par préfixe (important pour getByPrefix)
CREATE INDEX IF NOT EXISTS kv_store_key_prefix_idx 
  ON kv_store_04919ac5 (key text_pattern_ops);

-- Index sur la date de mise à jour (pour trier par date)
CREATE INDEX IF NOT EXISTS kv_store_updated_at_idx 
  ON kv_store_04919ac5 (updated_at DESC);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_kv_store_updated_at ON kv_store_04919ac5;
CREATE TRIGGER update_kv_store_updated_at
  BEFORE UPDATE ON kv_store_04919ac5
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 2. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Activer RLS
ALTER TABLE kv_store_04919ac5 ENABLE ROW LEVEL SECURITY;

-- Policy: Lecture publique (pour les contenus publics)
CREATE POLICY "Allow public read access" ON kv_store_04919ac5
  FOR SELECT
  USING (true);

-- Policy: Écriture pour service_role uniquement (sécurité)
CREATE POLICY "Allow service_role write access" ON kv_store_04919ac5
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Policy temporaire: Permettre toutes les opérations (à restreindre en prod)
-- ATTENTION: Cette policy est permissive, à ajuster selon vos besoins
DROP POLICY IF EXISTS "Allow all operations" ON kv_store_04919ac5;
CREATE POLICY "Allow all operations" ON kv_store_04919ac5
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 3. VUES UTILES (Pour faciliter les requêtes)
-- ============================================================================

-- Vue: Tous les projets
CREATE OR REPLACE VIEW v_projects AS
SELECT 
  key,
  value,
  created_at,
  updated_at
FROM kv_store_04919ac5
WHERE key LIKE 'project_%'
ORDER BY updated_at DESC;

-- Vue: Tous les articles de blog
CREATE OR REPLACE VIEW v_blog_posts AS
SELECT 
  key,
  value,
  created_at,
  updated_at
FROM kv_store_04919ac5
WHERE key LIKE 'blog_post_%'
ORDER BY (value->>'publishedAt')::timestamp DESC;

-- Vue: Toutes les case studies
CREATE OR REPLACE VIEW v_case_studies AS
SELECT 
  key,
  value,
  created_at,
  updated_at
FROM kv_store_04919ac5
WHERE key LIKE 'case_study_%'
ORDER BY updated_at DESC;

-- Vue: Tous les leads
CREATE OR REPLACE VIEW v_leads AS
SELECT 
  key,
  value,
  created_at,
  updated_at
FROM kv_store_04919ac5
WHERE key LIKE 'lead:%'
ORDER BY created_at DESC;

-- Vue: Tous les subscribers newsletter
CREATE OR REPLACE VIEW v_newsletter_subscribers AS
SELECT 
  key,
  value,
  created_at,
  updated_at
FROM kv_store_04919ac5
WHERE key LIKE 'newsletter:%'
ORDER BY created_at DESC;

-- ============================================================================
-- 4. FONCTIONS UTILES
-- ============================================================================

-- Fonction: Compter les éléments par préfixe
CREATE OR REPLACE FUNCTION count_by_prefix(prefix TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM kv_store_04919ac5
    WHERE key LIKE prefix || '%'
  );
END;
$$ LANGUAGE plpgsql;

-- Fonction: Obtenir les statistiques globales
CREATE OR REPLACE FUNCTION get_kv_stats()
RETURNS TABLE (
  category TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN key LIKE 'project_%' THEN 'Projects'
      WHEN key LIKE 'blog_post_%' THEN 'Blog Posts'
      WHEN key LIKE 'case_study_%' THEN 'Case Studies'
      WHEN key LIKE 'faq_%' THEN 'FAQs'
      WHEN key LIKE 'testimonial_%' THEN 'Testimonials'
      WHEN key LIKE 'resource_%' THEN 'Resources'
      WHEN key LIKE 'lead:%' THEN 'Leads'
      WHEN key LIKE 'newsletter:%' THEN 'Newsletter Subscribers'
      ELSE 'Other'
    END as category,
    COUNT(*) as count
  FROM kv_store_04919ac5
  GROUP BY category
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Nettoyer les anciennes données (pour maintenance)
CREATE OR REPLACE FUNCTION cleanup_old_data(days INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM kv_store_04919ac5
  WHERE 
    updated_at < NOW() - (days || ' days')::INTERVAL
    AND key LIKE 'temp_%'; -- Seulement les données temporaires
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 5. REQUÊTES DE VÉRIFICATION
-- ============================================================================

-- Ces commandes sont en commentaire, décommentez pour tester:

-- Voir le nombre d'éléments par catégorie
-- SELECT * FROM get_kv_stats();

-- Compter les projets
-- SELECT count_by_prefix('project_');

-- Voir tous les projets
-- SELECT * FROM v_projects LIMIT 10;

-- Voir tous les articles de blog
-- SELECT * FROM v_blog_posts LIMIT 10;

-- Voir tous les leads
-- SELECT * FROM v_leads LIMIT 10;

-- Voir la taille de la table
-- SELECT pg_size_pretty(pg_total_relation_size('kv_store_04919ac5'));

-- ============================================================================
-- 6. PERMISSIONS (Auth)
-- ============================================================================

-- Permettre à auth.users d'avoir accès
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON kv_store_04919ac5 TO anon, authenticated;
GRANT ALL ON kv_store_04919ac5 TO service_role;

-- ============================================================================
-- FIN DU SCRIPT
-- ============================================================================

-- Vérification finale
DO $$ 
BEGIN
  RAISE NOTICE '✅ Setup terminé avec succès!';
  RAISE NOTICE '📊 Statistiques:';
  RAISE NOTICE '   - Table kv_store_04919ac5 créée';
  RAISE NOTICE '   - Index créés';
  RAISE NOTICE '   - RLS activé';
  RAISE NOTICE '   - 5 vues créées';
  RAISE NOTICE '   - 3 fonctions utilitaires créées';
  RAISE NOTICE '';
  RAISE NOTICE '🔍 Prochaines étapes:';
  RAISE NOTICE '   1. Synchroniser les données: syncAllDataToSupabase()';
  RAISE NOTICE '   2. Vérifier: SELECT * FROM get_kv_stats();';
  RAISE NOTICE '   3. Tester l''application';
END $$;
