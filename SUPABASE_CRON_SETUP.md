# Configuration des CRON Jobs Supabase

Ce guide explique comment configurer les tâches automatisées (CRON jobs) dans Supabase pour les relances et rappels automatiques.

## 📋 Prérequis

- Accès à votre projet Supabase
- Extension `pg_cron` activée (activée par défaut sur Supabase)
- Routes backend déployées sur Supabase Edge Functions

## 🔧 Étape 1 : Activer pg_cron

Connectez-vous au SQL Editor de Supabase et exécutez :

```sql
-- Activer l'extension pg_cron (si pas déjà fait)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Autoriser pg_cron à accéder aux URLs externes
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;
```

## 📧 Étape 2 : Relances de Factures Impayées

Cette tâche s'exécute **tous les jours à 9h du matin** pour envoyer des relances automatiques.

```sql
-- Relances factures impayées (tous les jours à 9h)
SELECT cron.schedule(
  'daily-invoice-reminders',                    -- Nom de la tâche
  '0 9 * * *',                                 -- CRON : tous les jours à 9h00
  $$
  SELECT
    net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-invoice-reminders',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_SUPABASE_ANON_KEY'
      ),
      body := jsonb_build_object(
        'scheduled', true
      )
    )
  $$
);
```

**⚙️ Logique de relance :**
- J+7 après échéance : Premier rappel aimable
- J+15 après échéance : Deuxième relance (urgent)
- J+30 après échéance : Relance finale avant actions

## 📅 Étape 3 : Rappels de Rendez-vous

Cette tâche s'exécute **tous les jours à 10h du matin** pour rappeler les RDV du lendemain.

```sql
-- Rappels RDV 24h avant (tous les jours à 10h)
SELECT cron.schedule(
  'daily-booking-reminders',                   -- Nom de la tâche
  '0 10 * * *',                                -- CRON : tous les jours à 10h00
  $$
  SELECT
    net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-booking-reminders',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_SUPABASE_ANON_KEY'
      ),
      body := jsonb_build_object(
        'scheduled', true
      )
    )
  $$
);
```

**⚙️ Logique de rappel :**
- Envoi 24h avant le RDV
- Email de confirmation avec détails
- Lien pour annuler/reprogrammer (optionnel)

## 🔑 Étape 4 : Remplacer les Variables

Dans les commandes SQL ci-dessus, remplacez :

1. **`YOUR_PROJECT_REF`** : Votre référence projet Supabase
   - Trouvable dans l'URL : `https://YOUR_PROJECT_REF.supabase.co`
   - Ou dans Settings → API

2. **`YOUR_SUPABASE_ANON_KEY`** : Votre clé API anonyme
   - Trouvable dans Settings → API → Project API keys
   - Utilisez la clé `anon` / `public`

**Exemple :**
```sql
url := 'https://abcdefghijklmnop.supabase.co/functions/v1/send-invoice-reminders',
'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

## ✅ Étape 5 : Vérifier que tout fonctionne

### Lister les tâches CRON actives :
```sql
SELECT * FROM cron.job;
```

Vous devriez voir :
- `daily-invoice-reminders` avec schedule `0 9 * * *`
- `daily-booking-reminders` avec schedule `0 10 * * *`

### Voir l'historique d'exécution :
```sql
SELECT 
  job_id,
  jobname,
  status,
  start_time,
  end_time,
  return_message
FROM cron.job_run_details
ORDER BY start_time DESC
LIMIT 10;
```

### Tester manuellement (sans attendre le CRON) :
```sql
-- Tester la relance factures
SELECT cron.schedule(
  'test-invoice-reminder-now',
  '* * * * *',  -- Toutes les minutes (TEMPORAIRE)
  $$ SELECT net.http_post(...) $$
);

-- Attendre 1-2 minutes puis supprimer le test
SELECT cron.unschedule('test-invoice-reminder-now');
```

## 🗑️ Gestion des tâches

### Supprimer une tâche :
```sql
SELECT cron.unschedule('daily-invoice-reminders');
SELECT cron.unschedule('daily-booking-reminders');
```

### Modifier une tâche (supprimer + recréer) :
```sql
-- Supprimer l'ancienne
SELECT cron.unschedule('daily-invoice-reminders');

-- Recréer avec nouveaux paramètres
SELECT cron.schedule(
  'daily-invoice-reminders',
  '0 8 * * *',  -- Nouvelle heure : 8h au lieu de 9h
  $$ ... $$
);
```

## 📊 Format CRON Expliqué

```
┌───────────── Minute (0-59)
│ ┌─────────── Heure (0-23)
│ │ ┌───────── Jour du mois (1-31)
│ │ │ ┌─────── Mois (1-12)
│ │ │ │ ┌───── Jour de la semaine (0-7, 0 et 7 = dimanche)
│ │ │ │ │
* * * * *
```

**Exemples utiles :**
- `0 9 * * *` → Tous les jours à 9h00
- `0 */6 * * *` → Toutes les 6 heures
- `0 9 * * 1` → Tous les lundis à 9h00
- `0 9 1 * *` → Le 1er de chaque mois à 9h00
- `*/30 * * * *` → Toutes les 30 minutes

## 🔔 Notifications des Erreurs

Pour être alerté si une tâche échoue :

```sql
-- Créer une fonction qui envoie une notification en cas d'échec
CREATE OR REPLACE FUNCTION notify_on_cron_failure()
RETURNS void AS $$
BEGIN
  -- Vérifier les échecs récents
  PERFORM 1 
  FROM cron.job_run_details 
  WHERE status = 'failed' 
  AND start_time > NOW() - INTERVAL '1 hour';
  
  IF FOUND THEN
    -- Envoyer notification (à personnaliser)
    RAISE NOTICE 'CRON job failed in the last hour!';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Programmer la vérification toutes les heures
SELECT cron.schedule(
  'check-cron-failures',
  '0 * * * *',  -- Toutes les heures
  $$ SELECT notify_on_cron_failure(); $$
);
```

## 🎯 Routes Backend Concernées

Les CRON jobs appellent ces routes Edge Functions :

### 1. `/send-invoice-reminders`
- **Fichier :** `supabase/functions/index.ts` (lignes 1337-1455)
- **Logique :**
  - Récupère toutes les factures impayées
  - Calcule les jours de retard
  - Envoie emails de relance selon le délai (J+7, J+15, J+30)
  - Utilise Resend pour l'envoi

### 2. `/send-booking-reminders`
- **Fichier :** `supabase/functions/index.ts` (lignes 1457-1555)
- **Logique :**
  - Récupère les RDV des prochaines 24h
  - Envoie emails de rappel
  - Inclut les détails (date, heure, service)
  - Utilise Resend pour l'envoi

## ⚠️ Important

1. **Fuseaux horaires :** Les heures CRON sont en UTC par défaut
   - Paris = UTC+1 (hiver) ou UTC+2 (été)
   - Pour 9h Paris en hiver → `0 8 * * *` (8h UTC)

2. **Coûts :** Vérifiez les limites de votre plan Supabase
   - Edge Functions invocations
   - Emails envoyés via Resend

3. **Logs :** Surveillez les logs dans Supabase Dashboard
   - Edge Functions → Logs
   - SQL Editor → `cron.job_run_details`

## 🚀 Déploiement Recommandé

1. **Tester d'abord manuellement** les routes avec Postman/curl
2. **Créer les CRON avec `* * * * *`** (toutes les minutes) pour tester
3. **Vérifier les logs** pendant 5-10 minutes
4. **Supprimer les tests** et créer les vraies tâches avec les bonnes heures
5. **Monitorer quotidiennement** les premiers jours

---

## 📝 Checklist de Configuration

- [ ] Extension `pg_cron` activée
- [ ] Routes backend déployées et testées
- [ ] Variables `YOUR_PROJECT_REF` et `YOUR_SUPABASE_ANON_KEY` remplacées
- [ ] CRON `daily-invoice-reminders` créé
- [ ] CRON `daily-booking-reminders` créé
- [ ] Test manuel effectué (exécution immédiate)
- [ ] Logs vérifiés (pas d'erreurs)
- [ ] Premier envoi d'email confirmé

✅ **Configuration terminée !** Les relances et rappels sont maintenant automatiques.
