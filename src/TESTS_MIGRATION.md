# 🧪 TESTS DE MIGRATION - Guide Rapide

**Objectif :** Vérifier que la migration vers Supabase Session fonctionne correctement

---

## ⚡ Tests rapides (5 minutes)

### Test 1 : Connexion basique ✅

```
📍 Action :
1. Ouvrir l'application
2. Cliquer sur "Dashboard" dans la navigation
3. Vous êtes redirigé vers /login
4. Entrer le mot de passe : vbz657D9
5. Cliquer "Se connecter"

✅ Résultat attendu :
- Toast "Connexion réussie !"
- Redirection vers le dashboard
- Vous voyez les KPIs et données

❌ Si ça ne marche pas :
- Vérifier la console (F12) pour les erreurs
- Vérifier que le compte admin existe
```

---

### Test 2 : Vérifier le localStorage ✅

```
📍 Action :
1. Se connecter au dashboard
2. Ouvrir DevTools (F12)
3. Aller dans Application > Local Storage
4. Regarder le contenu

✅ Résultat attendu :
- localStorage est VIDE (pas de auth_token, pas de user_email)
- Aller dans Application > Cookies
- Vous devriez voir des cookies "sb-*-auth-token" (httpOnly)

❌ Si localStorage contient encore auth_token :
- La migration n'a pas été appliquée correctement
- Vérifier les fichiers LoginPage.tsx et App.tsx
```

---

### Test 3 : Persistance de session ✅

```
📍 Action :
1. Se connecter au dashboard
2. Rafraîchir la page (F5)

✅ Résultat attendu :
- Vous restez connecté
- Pas de redirection vers login
- Les données se rechargent

❌ Si vous êtes déconnecté :
- Vérifier la console pour des erreurs
- Vérifier que supabase.auth.getSession() est appelé dans App.tsx
```

---

### Test 4 : Déconnexion ✅

```
📍 Action :
1. Dans le dashboard, cliquer sur "Déconnexion"
2. Vous êtes redirigé vers la page d'accueil
3. Essayer de retourner sur /dashboard

✅ Résultat attendu :
- Redirection automatique vers /login
- Vous devez vous reconnecter

❌ Si vous restez connecté :
- Vérifier que handleLogout() appelle supabase.auth.signOut()
```

---

### Test 5 : Routes publiques ✅

```
📍 Action :
1. SANS être connecté
2. Aller sur la page d'accueil
3. Faire défiler jusqu'aux projets épinglés
4. Aller sur la page Contact
5. Remplir le formulaire de contact
6. Envoyer

✅ Résultat attendu :
- Les projets épinglés s'affichent
- Le formulaire fonctionne
- Toast "Message envoyé !"
- Le lead est créé

❌ Si les projets ne s'affichent pas :
- Vérifier que HomePage utilise publicAnonKey
- Vérifier la console pour des erreurs
```

---

## 🔍 Tests avancés (10 minutes)

### Test 6 : Multi-onglets ✅

```
📍 Action :
1. Se connecter dans l'onglet 1
2. Ouvrir l'onglet 2
3. Aller sur /dashboard dans l'onglet 2
4. Se déconnecter dans l'onglet 1
5. Retourner sur l'onglet 2

✅ Résultat attendu :
- Onglet 2 : Vous êtes déjà connecté (session partagée)
- Après déconnexion : L'onglet 2 détecte la déconnexion

Note : La synchronisation peut prendre quelques secondes
```

---

### Test 7 : Chargement des données ✅

```
📍 Action :
1. Se connecter au dashboard
2. Vérifier que toutes les sections chargent :
   - Vue d'ensemble (KPIs)
   - Leads
   - Clients
   - Projets
   - Factures
   - Calendrier

✅ Résultat attendu :
- Toutes les données s'affichent
- Pas d'erreur 401 Unauthorized
- Console log : "🔐 Using session token for API requests"

❌ Si erreur 401 :
- Vérifier que fetchAllData() utilise session.access_token
- Vérifier la console pour plus de détails
```

---

### Test 8 : Mise à jour de données ✅

```
📍 Action :
1. Se connecter au dashboard
2. Aller dans la section "Leads"
3. Changer le statut d'un lead
4. Cliquer sur "Convertir en client"

✅ Résultat attendu :
- Statut mis à jour immédiatement
- Toast "Statut mis à jour"
- Conversion fonctionne

❌ Si erreur :
- Vérifier que updateLeadStatus() utilise session.access_token
```

---

### Test 9 : Session expirée ✅

```
📍 Action :
1. Se connecter au dashboard
2. Attendre 1 heure (ou modifier l'expiration pour tester)
3. Essayer de charger des données ou mettre à jour quelque chose

✅ Résultat attendu :
- Toast "Session expirée. Veuillez vous reconnecter."
- Redirection vers login

Note : Pour tester rapidement, vous pouvez :
- Supprimer manuellement les cookies d'auth
- Redémarrer le serveur Supabase (en dev)
```

---

### Test 10 : Console logs ✅

```
📍 Action :
1. Se connecter au dashboard
2. Ouvrir la console (F12)
3. Observer les logs

✅ Résultat attendu :
🔐 Initial session check: Authenticated
👤 User email: contact@maxence.design
🔐 Using session token for API requests
🔐 Auth state changed: SIGNED_IN Authenticated

❌ Si vous voyez des erreurs :
- Noter l'erreur exacte
- Vérifier le fichier concerné
```

---

## 📊 Checklist complète

### Authentification
- [ ] ✅ Connexion fonctionne
- [ ] ✅ Déconnexion fonctionne
- [ ] ✅ Persistance au refresh
- [ ] ✅ Redirection si non authentifié
- [ ] ✅ localStorage vide (pas de token)
- [ ] ✅ Cookies httpOnly présents

### Dashboard
- [ ] ✅ Vue d'ensemble charge
- [ ] ✅ Leads s'affichent
- [ ] ✅ Clients s'affichent
- [ ] ✅ Projets s'affichent
- [ ] ✅ Factures s'affichent
- [ ] ✅ Calendrier fonctionne
- [ ] ✅ Mise à jour de statut fonctionne
- [ ] ✅ Email admin s'affiche

### Routes publiques
- [ ] ✅ Page d'accueil charge
- [ ] ✅ Projets épinglés s'affichent
- [ ] ✅ Formulaire de contact fonctionne
- [ ] ✅ Réservation fonctionne
- [ ] ✅ Pas besoin d'authentification

### Sécurité
- [ ] ✅ Token dans httpOnly cookies
- [ ] ✅ Pas de token en localStorage
- [ ] ✅ Session token utilisé pour API
- [ ] ✅ Expiration gérée automatiquement

---

## 🐛 Dépannage

### Problème : "Session expirée" immédiatement après connexion

**Solution :**
```
1. Vérifier que initAdminAccount() a créé le compte
2. Vérifier que le mot de passe est correct
3. Console logs : Vérifier que signInWithPassword() retourne une session
4. Vérifier les variables d'environnement Supabase
```

---

### Problème : Les données ne chargent pas (erreur 401)

**Solution :**
```
1. Vérifier que session.access_token est utilisé
2. Console : "🔐 Using session token for API requests" doit apparaître
3. Vérifier que getSession() retourne bien une session
4. Vérifier les headers dans Network (F12)
```

---

### Problème : localStorage contient encore auth_token

**Solution :**
```
1. Vider le localStorage manuellement :
   localStorage.clear()
2. Se reconnecter
3. Vérifier que LoginPage.tsx n'a plus localStorage.setItem()
```

---

### Problème : Multi-onglets ne synchronise pas

**Solution :**
```
1. C'est normal, la synchronisation peut prendre 5-10 secondes
2. Vérifier que onAuthStateChange() est bien écouté
3. Rafraîchir l'onglet 2 pour forcer le check
```

---

### Problème : Routes publiques ne fonctionnent plus

**Solution :**
```
1. Vérifier que HomePage utilise publicAnonKey
2. Vérifier que ContactPage utilise publicAnonKey
3. Vérifier que le backend accepte publicAnonKey pour POST /leads
```

---

## ✅ Validation finale

Une fois tous les tests passés :

```bash
# ✅ Sécurité
- Token dans httpOnly cookies
- localStorage vide
- Session expiration gérée

# ✅ Fonctionnalités
- Connexion / Déconnexion
- Dashboard complet
- Routes publiques

# ✅ Expérience
- Persistance de session
- Multi-onglets
- Pas de déconnexion intempestive
```

---

## 🎯 Résultat attendu

**Si tous les tests passent :**

✅ **La migration est réussie !**  
✅ **Sécurité améliorée : 8.7/10 → 10/10**  
✅ **Aucune fonctionnalité cassée**  
✅ **Application prête pour la production**  

---

## 📝 Rapport de test

Une fois les tests terminés, notez le résultat :

```
Date : ___________
Tests effectués : ___/10
Tests réussis : ___/10
Problèmes rencontrés : 
_______________________________________
_______________________________________

Résultat final : ✅ / ⚠️ / ❌

Notes :
_______________________________________
_______________________________________
```

---

## 🚀 Prochaines étapes

Si tous les tests passent :

1. ✅ **Documenter** - Marquer la migration comme terminée
2. ✅ **Commit** - Sauvegarder les changements
3. ✅ **Déployer** - Mettre en production (si prêt)
4. ✅ **Monitorer** - Surveiller les logs de connexion

Si des tests échouent :

1. ⚠️ **Identifier** - Noter le test qui échoue
2. ⚠️ **Debug** - Utiliser la section Dépannage
3. ⚠️ **Corriger** - Appliquer la solution
4. ⚠️ **Re-tester** - Relancer tous les tests

---

**Bon courage pour les tests ! 🧪**
