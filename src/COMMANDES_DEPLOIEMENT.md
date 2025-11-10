# 🚀 DÉPLOIEMENT SERVER AVEC ROUTES INVOICES

## ✅ FICHIER CRÉÉ
`/supabase/functions/server/index-with-invoices.tsx`

Ce fichier contient **TOUTES** les routes, y compris les 4 nouvelles routes invoices.

---

## 📋 COMMANDES À EXÉCUTER

### 1️⃣ Remplacer le fichier index.tsx actuel

```bash
# Windows PowerShell / CMD
copy /supabase/functions/server/index-with-invoices.tsx /supabase/functions/server/index.tsx

# macOS / Linux / Git Bash
cp /supabase/functions/server/index-with-invoices.tsx /supabase/functions/server/index.tsx
```

**OU** manuellement :
- Supprimer `/supabase/functions/server/index.tsx`
- Renommer `/supabase/functions/server/index-with-invoices.tsx` en `index.tsx`

---

### 2️⃣ Se connecter à Supabase

```bash
supabase login
```

Si `supabase` n'est pas installé :
```bash
npm install -g supabase
```

---

### 3️⃣ Lier votre projet

```bash
supabase link --project-ref ptcxeqtjlxittxayffgu
```

Il vous demandera le mot de passe de la database (trouvable dans Settings > Database de Supabase).

---

### 4️⃣ Déployer la fonction Edge

```bash
supabase functions deploy make-server-04919ac5
```

---

## ✅ VÉRIFICATION

Après le déploiement, testez dans votre navigateur :

```
https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "COMPLETE server running (with quotes + invoices)",
  "timestamp": "2024-11-10T..."
}
```

---

## 🎯 NOUVELLES ROUTES DISPONIBLES

Après le déploiement, ces routes fonctionneront :

### Invoices (Factures)
- `GET /invoices` - Liste toutes les factures
- `GET /invoices/:id` - Récupère une facture spécifique
- `PUT /invoices/:id` - Met à jour une facture
- `DELETE /invoices/:id` - Supprime une facture

**Exemple :**
```
GET https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/invoices
```

---

## 🔧 EN CAS DE PROBLÈME

### "supabase: command not found"
```bash
npm install -g supabase
```

### "Project not linked"
```bash
supabase link --project-ref ptcxeqtjlxittxayffgu
```

### Les routes ne marchent toujours pas
1. Vérifiez que `index.tsx` a bien été remplacé
2. Rafraîchissez la page (Ctrl+F5)
3. Vérifiez la console pour les erreurs
4. Assurez-vous d'être connecté au dashboard

---

## 💡 RÉSULTAT ATTENDU

✅ GET /invoices → 200 OK (au lieu de 404)
✅ Les factures converties apparaissent dans l'onglet Factures
✅ Plus de message "Failed to load invoices"
✅ Synchronisation complète avec Supabase

---

## 📝 NOTES IMPORTANTES

- Le fichier `/supabase/functions/server/index-with-invoices.tsx` contient TOUT le code nécessaire
- Vous devez le copier/renommer en `index.tsx` pour qu'il soit déployé
- Les routes invoices nécessitent une authentification (token Bearer)
- Les factures sont stockées avec le préfixe `invoice:` dans la table KV
