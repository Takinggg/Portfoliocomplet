# ⚡ EMAIL EXPÉDITEUR - QUICK FIX

## 📧 ACTUELLEMENT

Tes emails partent de :
```
"Votre Freelance <onboarding@resend.dev>"
```

✅ **Ça fonctionne**, mais ce n'est **pas ton email**.

---

## 🎯 OPTION 1 : JE CHANGE MAINTENANT (30 secondes)

### Change juste le nom (temporaire)

**Fichier :** `/supabase/functions/server/email_service.tsx`  
**Ligne 375 :**

```typescript
// Trouve cette ligne
from: params.from || "Votre Freelance <onboarding@resend.dev>",

// Change en
from: params.from || "TON NOM ICI <onboarding@resend.dev>",
```

**Exemple :**
```typescript
from: params.from || "Marie Dupont <onboarding@resend.dev>",
```

✅ **Au moins le nom sera correct** dans les emails !

---

## 🚀 OPTION 2 : JE CONFIGURE MON DOMAINE (15 min)

### Si tu as `contact@tondomaine.com`

#### 1. Configure sur Resend (5 min)

1. Va sur [resend.com/domains](https://resend.com/domains)
2. Clique **"Add Domain"**
3. Entre `tondomaine.com`
4. Copie les 3 DNS records

#### 2. Ajoute les DNS (5 min)

1. Va chez ton hébergeur (OVH, Gandi, etc.)
2. Zone DNS → Ajouter les 3 records
3. Sauvegarde

#### 3. Attends vérification (24h max)

Vérifie sur Resend → Statut **✅ Verified**

#### 4. Change le code (1 min)

**Ligne 375 :**
```typescript
from: params.from || "Ton Nom <contact@tondomaine.com>",
```

✅ **TERMINÉ !**

---

## 📋 DNS RECORDS À AJOUTER

Resend te donnera 3 records :

```
1. Type: TXT     Name: @    Value: resend-domain-verify=...
2. Type: MX      Name: @    Value: mx1.resend.com (Priority: 10)
3. Type: MX      Name: @    Value: mx2.resend.com (Priority: 20)
```

---

## ❓ JE N'AI PAS DE DOMAINE ?

### Garde l'email de test

C'est OK pour tester ! Mais :
- ❌ Pas professionnel
- ❌ Risque SPAM
- ❌ Clients voient `onboarding@resend.dev`

### Achète un domaine (10€/an)

- [Gandi.net](https://www.gandi.net/) → Simple, français
- [Namecheap.com](https://www.namecheap.com/) → Pas cher
- [Google Domains](https://domains.google/) → Facile

---

## 🔍 OÙ MODIFIER LE CODE ?

**Fichier :** `/supabase/functions/server/email_service.tsx`  
**Ligne :** 375  

**Cherche :**
```typescript
from: params.from || "Votre Freelance <onboarding@resend.dev>",
```

**Change par :**
```typescript
// Avec domaine vérifié
from: params.from || "Ton Nom <contact@tondomaine.com>",

// Ou temporairement (juste le nom)
from: params.from || "Ton Nom <onboarding@resend.dev>",
```

---

## ✅ RÉSUMÉ

| Option | Temps | Avantage | Inconvénient |
|--------|-------|----------|--------------|
| **Changer le nom** | 30 sec | Rapide | Email de test |
| **Configurer domaine** | 15 min + 24h | Pro, délivrabilité | Nécessite un domaine |
| **Garder tel quel** | 0 sec | Rien à faire | Pas professionnel |

---

## 🎯 MA RECOMMANDATION

### 👉 Maintenant (30 sec)
Change au moins le **nom** pour que ce soit toi :
```typescript
from: params.from || "Ton Nom <onboarding@resend.dev>",
```

### 👉 Ensuite (15 min + 24h)
Configure ton **propre domaine** :
```typescript
from: params.from || "Ton Nom <contact@tondomaine.com>",
```

---

**Guide complet :** `CONFIGURATION_EMAIL_EXPEDITEUR.md`

**Tout fonctionne déjà ! C'est juste pour améliorer le professionnalisme.** ✅
