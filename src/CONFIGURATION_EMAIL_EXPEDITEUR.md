# 📧 CONFIGURATION EMAIL EXPÉDITEUR - GUIDE COMPLET

## 🎯 CONTEXTE

Actuellement, tes emails sont envoyés depuis :
```
"Votre Freelance <onboarding@resend.dev>"
```

C'est l'email de **test de Resend**. Ça fonctionne, mais ce n'est **pas idéal** pour un usage professionnel.

---

## ⚠️ POURQUOI CHANGER ?

### Avec l'email de test actuel ❌

- ❌ **Pas professionnel** : Tes clients voient `onboarding@resend.dev`
- ❌ **Risque SPAM** : Les filtres anti-spam préfèrent les domaines vérifiés
- ❌ **Pas de réponse** : Si un client répond, ça ne va nulle part
- ❌ **Image de marque** : Aucune cohérence avec ton portfolio

### Avec ton propre domaine ✅

- ✅ **100% professionnel** : `contact@tonportfolio.com`
- ✅ **Meilleure délivrabilité** : Arrive dans la boîte principale
- ✅ **Peut recevoir des réponses** : Gère ta boîte email normalement
- ✅ **Cohérence** : Correspond à ton site web

---

## 🚀 SOLUTION RAPIDE (5 minutes)

### Si tu as DÉJÀ un domaine et un email

**Exemple :** Tu as `contact@monportfolio.com`

1. **Configure ton domaine sur Resend** (voir instructions complètes ci-dessous)
2. **Modifie le fichier** `/supabase/functions/server/email_service.tsx`
3. **Change la ligne 375** :

```typescript
// TROUVE CETTE LIGNE :
from: params.from || "Votre Freelance <onboarding@resend.dev>",

// REMPLACE PAR :
from: params.from || "Ton Nom <contact@tondomaine.com>",
```

**Exemples concrets :**
```typescript
from: params.from || "Marie Dupont <marie@mariedupont.fr>",
from: params.from || "Web Design Studio <hello@webdesign.studio>",
from: params.from || "John Freelance <contact@johnfreelance.io>",
```

✅ **C'est tout !**

---

## 📋 GUIDE COMPLET : CONFIGURER TON DOMAINE SUR RESEND

### Étape 1 : Vérifier ton domaine

#### 1.1 - Aller sur Resend Dashboard

1. Va sur [resend.com/domains](https://resend.com/domains)
2. Connecte-toi avec ton compte Resend
3. Clique sur le bouton **"Add Domain"**

#### 1.2 - Ajouter ton domaine

```
┌────────────────────────────────────┐
│  Add Domain                        │
├────────────────────────────────────┤
│  Domain name:                      │
│  [monportfolio.com        ]        │
│                                    │
│  Region: [Europe (Ireland)]        │
│                                    │
│          [Add Domain]              │
└────────────────────────────────────┘
```

**Important :**
- Entre **seulement** le domaine : `monportfolio.com`
- **PAS** de sous-domaine comme `www.monportfolio.com`
- **PAS** de `https://`

#### 1.3 - Copier les DNS Records

Resend va te donner **3 records DNS** à ajouter :

```
Type: TXT
Name: @
Value: resend-domain-verify=abc123xyz...

Type: MX
Name: @
Value: mx1.resend.com
Priority: 10

Type: MX
Name: @
Value: mx2.resend.com
Priority: 20
```

**Ne ferme pas cette page !** Tu en auras besoin pour l'étape suivante.

---

### Étape 2 : Ajouter les DNS chez ton hébergeur

Tu dois ajouter les DNS records **chez ton hébergeur de domaine**. Voici comment faire selon les principaux hébergeurs :

#### 📌 OVH

1. Va sur [ovh.com/manager](https://www.ovh.com/manager/)
2. Clique sur ton domaine dans la liste
3. Clique sur l'onglet **"Zone DNS"**
4. Clique sur **"Ajouter une entrée"**
5. Ajoute les 3 records (TXT + 2 MX)
6. Clique sur **"Valider"**

#### 📌 Gandi

1. Va sur [gandi.net](https://admin.gandi.net/)
2. Clique sur **"Domaines"**
3. Sélectionne ton domaine
4. Clique sur **"Enregistrements DNS"**
5. Clique sur **"Ajouter"**
6. Ajoute les 3 records
7. Clique sur **"Enregistrer"**

#### 📌 Cloudflare

1. Va sur [dash.cloudflare.com](https://dash.cloudflare.com/)
2. Sélectionne ton domaine
3. Clique sur **"DNS"**
4. Clique sur **"Add record"**
5. Ajoute les 3 records
6. Clique sur **"Save"**

#### 📌 Google Domains

1. Va sur [domains.google.com](https://domains.google.com/)
2. Clique sur ton domaine
3. Clique sur **"DNS"** dans le menu
4. Scroll jusqu'à **"Custom records"**
5. Clique sur **"Create new record"**
6. Ajoute les 3 records

#### 📌 Namecheap

1. Va sur [namecheap.com](https://www.namecheap.com/)
2. Clique sur **"Domain List"**
3. Clique sur **"Manage"** à côté de ton domaine
4. Clique sur **"Advanced DNS"**
5. Clique sur **"Add New Record"**
6. Ajoute les 3 records

---

### Étape 3 : Attendre la vérification

1. Retourne sur [resend.com/domains](https://resend.com/domains)
2. Clique sur **"Verify Records"** à côté de ton domaine
3. Attends quelques minutes (peut prendre jusqu'à **24h**)

Tu verras un statut :
```
✅ Verified    → C'est bon !
⏳ Pending     → Attends encore un peu
❌ Failed      → Vérifie tes DNS records
```

---

### Étape 4 : Modifier ton code

Une fois que ton domaine est **✅ Verified**, modifie ton fichier :

**Fichier :** `/supabase/functions/server/email_service.tsx`

**Ligne 375 :**

```typescript
// AVANT
from: params.from || "Votre Freelance <onboarding@resend.dev>",

// APRÈS
from: params.from || "Ton Nom <hello@tondomaine.com>",
```

**Exemples d'emails professionnels :**

```typescript
// Email générique
from: params.from || "Portfolio <hello@monportfolio.com>",

// Email contact
from: params.from || "Marie Dupont <contact@mariedupont.fr>",

// Email no-reply
from: params.from || "Notifications <noreply@monportfolio.com>",

// Email personnalisé
from: params.from || "Studio Créatif <studio@example.com>",
```

---

## 🎨 BONNES PRATIQUES

### ✅ DO (À faire)

- **Utilise un vrai nom** : `"Marie Dupont <marie@...>"`
- **Sois cohérent** : Même nom que sur ton site
- **Utilise un email pro** : `contact@`, `hello@`, `info@`
- **Domaine vérifié** : Configure les DNS correctement

### ❌ DON'T (À éviter)

- **Email générique** : `admin@`, `root@`, `webmaster@`
- **Nom bizarre** : `"NodeMailer Bot <...>"`
- **Domaine non vérifié** : Risque d'aller en SPAM
- **Email de test** : `onboarding@resend.dev` en production

---

## 🔍 DÉPANNAGE

### ❌ "Domain not verified"

**Problème :** Ton domaine n'est pas encore vérifié sur Resend.

**Solutions :**
1. Vérifie que tu as bien ajouté les **3 DNS records**
2. Attends jusqu'à 24h (propagation DNS)
3. Clique sur **"Verify Records"** sur Resend
4. Utilise [dnschecker.org](https://dnschecker.org/) pour vérifier la propagation

### ❌ "Email rejected by recipient"

**Problème :** L'email n'arrive pas.

**Solutions :**
1. Vérifie que l'email du destinataire est valide
2. Regarde dans les **SPAM**
3. Vérifie que ton domaine est bien vérifié
4. Regarde les logs dans Resend Dashboard

### ❌ "RESEND_API_KEY not configured"

**Problème :** La clé API n'est pas configurée.

**Solutions :**
1. Va sur [resend.com/api-keys](https://resend.com/api-keys)
2. Copie ta clé API
3. Configure la variable d'environnement `RESEND_API_KEY`

---

## 📊 STATUT ACTUEL

### Configuration actuelle ✅

```typescript
from: "Votre Freelance <onboarding@resend.dev>"
```

**Status :**
- ✅ **Fonctionnel** : Les emails partent
- ⚠️ **Temporaire** : Utilise l'email de test Resend
- 🎯 **À améliorer** : Configure ton propre domaine

### Configuration recommandée 🎯

```typescript
from: "Ton Nom <contact@tondomaine.com>"
```

**Avantages :**
- ✅ **Professionnel** : Utilise ton propre domaine
- ✅ **Délivrabilité** : Meilleur taux d'arrivée
- ✅ **Image de marque** : Cohérence avec ton site
- ✅ **Réponses** : Les clients peuvent te répondre

---

## 🎯 CHECKLIST COMPLÈTE

### Phase 1 : Configuration Resend
- [ ] Créer un compte Resend
- [ ] Ajouter ton domaine
- [ ] Copier les DNS records
- [ ] Configurer RESEND_API_KEY

### Phase 2 : Configuration DNS
- [ ] Se connecter à ton hébergeur
- [ ] Ajouter le record TXT
- [ ] Ajouter les 2 records MX
- [ ] Sauvegarder les changements

### Phase 3 : Vérification
- [ ] Attendre la propagation DNS (24h max)
- [ ] Cliquer sur "Verify Records" sur Resend
- [ ] Vérifier le statut "✅ Verified"

### Phase 4 : Code
- [ ] Modifier `/supabase/functions/server/email_service.tsx`
- [ ] Changer la ligne 375 avec ton email
- [ ] Tester l'envoi d'un email
- [ ] Vérifier que ça arrive bien

---

## 💡 ALTERNATIVE TEMPORAIRE

Si tu n'as **pas encore de domaine**, tu peux :

1. **Garder l'email de test** (temporairement)
2. **Acheter un domaine** rapidement (10€/an)
3. **Le configurer** ensuite

**Registrars recommandés :**
- [Gandi.net](https://www.gandi.net/) - Simple, français, éthique
- [Namecheap.com](https://www.namecheap.com/) - Pas cher, fiable
- [Google Domains](https://domains.google/) - Intégré, facile

---

## 📚 RESSOURCES

### Documentation Resend
- [Resend Docs](https://resend.com/docs)
- [Verify Domain](https://resend.com/docs/dashboard/domains/introduction)
- [DNS Records](https://resend.com/docs/dashboard/domains/dns-records)

### Outils utiles
- [DNS Checker](https://dnschecker.org/) - Vérifier propagation DNS
- [MX Toolbox](https://mxtoolbox.com/) - Tester configuration email
- [Mail Tester](https://www.mail-tester.com/) - Tester score SPAM

---

## 🎊 RÉSUMÉ ULTRA-RAPIDE

### Si tu as un domaine :

1. **Resend** → Add Domain → Copie DNS records
2. **Hébergeur** → Zone DNS → Ajoute les 3 records
3. **Attends** → 24h max → Vérifie statut
4. **Code** → Ligne 375 → Change l'email
5. **Teste** → Envoie un email → C'est bon ! ✅

### Si tu n'as pas de domaine :

1. **Achète** un domaine (10€/an)
2. **Suis** le guide ci-dessus
3. **Ou attends** et garde l'email de test pour l'instant

---

**Besoin d'aide ?** Les logs d'erreur seront dans :
- Console du serveur backend
- [Resend Dashboard](https://resend.com/logs)
- Console du navigateur (frontend)

---

**Créé le :** 5 novembre 2025  
**Statut actuel :** Email de test `onboarding@resend.dev`  
**Status cible :** Ton propre domaine vérifié ✅  

Bonne configuration ! 📧
