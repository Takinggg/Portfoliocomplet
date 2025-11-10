# 🚀 Déploiement Simple du Fix Case Studies

## Option 1 : Via Supabase Dashboard (Recommandé)

### Étape 1 : Accéder aux Edge Functions

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Cliquez sur "Edge Functions" dans le menu de gauche

### Étape 2 : Déployer la fonction "server"

1. Cliquez sur la fonction "server"
2. Cliquez sur "Deploy new version"
3. Sélectionnez le fichier `/supabase/functions/server/index.tsx`
4. Cliquez sur "Deploy"
5. Attendez 30-60 secondes

### Étape 3 : Vérifier le déploiement

1. Revenez sur votre application
2. Rechargez la page (F5)
3. Ouvrez la console (F12)
4. Vous devriez voir le message de succès

---

## Option 2 : Via Supabase CLI

Si vous avez la CLI Supabase installée :

```bash
supabase functions deploy server
```

---

## Étape Suivante : Normaliser les Clés

Une fois le serveur déployé :

```javascript
normalizeCaseStudiesKeys()
```

Cette commande va :
- ✅ Analyser tous les case studies
- ✅ Normaliser les clés au format `case_study_{id}`
- ✅ Supprimer les anciennes clés
- ✅ Afficher un rapport détaillé

---

## Vérification

Après normalisation, testez :

```javascript
testKVDeletion()
```

Résultat attendu :
```
✅ TEST RÉUSSI !
Le case study de test a été correctement supprimé !
```

---

## Problème ?

Si vous voyez encore l'erreur `kv.getByPrefixWithKeys is not a function` :

1. ✅ Vérifiez que le déploiement est terminé
2. ✅ Rechargez complètement la page (Ctrl+Shift+R / Cmd+Shift+R)
3. ✅ Vérifiez les logs de la fonction Edge sur Supabase Dashboard

---

## Fichier à Déployer

Le fichier corrigé est : `/supabase/functions/server/index.tsx`

### Modifications apportées :

1. Ajout de `getByPrefixWithKeys()` dans l'objet `kv`
2. Routes GET/POST/PUT/DELETE corrigées pour utiliser les vraies clés
3. Nouvelle route POST `/normalize-keys` pour normaliser toutes les clés

---

## Contact Support

Si le problème persiste après déploiement, vérifiez :
- Les logs de la fonction Edge
- Que la fonction est bien active
- Que les variables d'environnement sont configurées
