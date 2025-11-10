# 🔑 GUIDE : OBTENIR TA CLÉ API RESEND

## ⚡ QUICK START

### 1️⃣ Créer un compte Resend (GRATUIT)

👉 **Va sur** : https://resend.com/signup

- ✅ **Plan gratuit** : 100 emails/jour (largement suffisant)
- ✅ **Pas de carte bancaire** requise
- ✅ **Configuration en 2 minutes**

---

### 2️⃣ Obtenir ta clé API

Une fois connecté :

1. **Dashboard Resend** → https://resend.com/api-keys
2. **Cliquer sur "Create API Key"**
3. **Nom** : `Mon Portfolio CRM` (ou ce que tu veux)
4. **Permissions** : Sélectionner **"Sending access"** (Full access)
5. **Cliquer "Create"**
6. ✅ **Copier la clé** (commence par `re_...`)

```
Exemple de clé API :
re_123abc456def789ghi012jkl345mno678pqr
```

⚠️ **IMPORTANT** : La clé ne sera affichée qu'**une seule fois** ! Copie-la maintenant.

---

### 3️⃣ Configurer la clé dans ton app

**C'est fait !** 🎉 Tu viens de configurer la clé API via le popup.

Si tu dois la changer plus tard :
1. Dashboard Figma Make
2. Variables d'environnement
3. Modifier `RESEND_API_KEY`

---

## 📧 CONFIGURER TON DOMAINE (Optionnel mais recommandé)

### Pourquoi ?

Actuellement, les emails partent de :
```
De : onboarding@resend.dev
```

Avec ton domaine :
```
De : contact@ton-domaine.com
De : factures@ton-domaine.com
```

C'est **beaucoup plus professionnel** ! ✨

---

### Comment faire ?

#### Option 1 : Domaine existant

Si tu as déjà un domaine (ex: `mon-portfolio.com`) :

1. **Dashboard Resend** → https://resend.com/domains
2. **Cliquer "Add Domain"**
3. **Entrer ton domaine** : `mon-portfolio.com`
4. **Suivre les instructions** pour ajouter les enregistrements DNS

**Enregistrements DNS à ajouter :**
```
Type  | Nom                    | Valeur
------+------------------------+------------------------
TXT   | @                      | v=spf1 include:...
TXT   | resend._domainkey      | p=MIGfMA0GCSq...
CNAME | resend._domainkey      | resend.com
```

5. **Vérifier le domaine**
6. ✅ **Domaine vérifié !**

#### Option 2 : Acheter un domaine

**Où acheter ?**
- **Namecheap** : ~10€/an (recommandé)
- **OVH** : ~12€/an
- **Google Domains** : ~12€/an

**Exemples de domaines :**
- `prenom-nom.com`
- `mon-portfolio.dev`
- `freelance-prenom.fr`

Une fois acheté, suis l'Option 1 pour le configurer.

---

### Mettre à jour l'email expéditeur

Une fois ton domaine configuré, modifie le fichier :

**`/supabase/functions/server/email_service.tsx`**

```typescript
// AVANT
from: 'Portfolio Pro <onboarding@resend.dev>',

// APRÈS (avec ton domaine)
from: 'Prénom Nom <contact@ton-domaine.com>',
// ou
from: 'Facturation <factures@ton-domaine.com>',
```

---

## ✅ VÉRIFIER QUE ÇA MARCHE

### Test 1 : Envoyer un email de test

1. **Dashboard** → Factures
2. **Créer une facture** avec ton email
3. **Passer le statut** à "Envoyée"
4. **Enregistrer**
5. ✅ **Vérifier ta boîte mail**

### Test 2 : Voir les logs Resend

1. **Dashboard Resend** → https://resend.com/emails
2. **Voir tous les emails** envoyés
3. **Statut** : Delivered ✅, Bounced ❌, etc.

---

## 🔍 TROUBLESHOOTING

### Erreur : "API key is invalid"

**Causes :**
- ❌ Clé API mal copiée (espaces, caractères manquants)
- ❌ Clé API supprimée dans Resend
- ❌ Permissions insuffisantes

**Solution :**
1. Vérifier la clé dans Resend Dashboard
2. Créer une nouvelle clé API
3. La configurer à nouveau dans Figma Make

---

### Erreur : "Domain not verified"

**Causes :**
- ❌ Domaine pas encore vérifié dans Resend
- ❌ Enregistrements DNS pas encore propagés

**Solution :**
1. Utiliser `onboarding@resend.dev` temporairement
2. Vérifier les enregistrements DNS
3. Attendre la propagation (jusqu'à 48h)

---

### Emails arrivent en spam

**Causes :**
- ❌ Utilisation de `onboarding@resend.dev`
- ❌ Domaine pas configuré correctement
- ❌ Pas de SPF/DKIM

**Solution :**
1. Configurer ton propre domaine
2. Vérifier SPF/DKIM dans Resend
3. Envoyer des emails à toi-même d'abord
4. Marquer comme "Pas spam" dans Gmail/Outlook

---

## 📊 LIMITES DU PLAN GRATUIT

| Feature | Gratuit | Payant |
|---------|---------|--------|
| **Emails/jour** | 100 | Illimité |
| **Emails/mois** | 3,000 | Illimité |
| **Domaines** | 1 | Illimité |
| **Support** | Email | Prioritaire |
| **Prix** | 0€ | 20€/mois |

**Pour un portfolio freelance** : Le plan gratuit est **largement suffisant** ! ✅

---

## 🎯 RECOMMANDATIONS

### Pour commencer (aujourd'hui)

✅ Utiliser `onboarding@resend.dev`
- Fonctionne immédiatement
- Aucune configuration DNS
- Parfait pour tester

### Pour professionnaliser (dans 1-2 semaines)

✅ Configurer ton domaine
- Emails plus professionnels
- Meilleure délivrabilité
- Moins de spam

### Pour scaler (si besoin)

✅ Passer au plan payant
- Si tu envoies > 100 emails/jour
- Support prioritaire
- Analytics avancés

---

## 📚 LIENS UTILES

- **Resend Dashboard** : https://resend.com/overview
- **API Keys** : https://resend.com/api-keys
- **Domains** : https://resend.com/domains
- **Emails envoyés** : https://resend.com/emails
- **Documentation** : https://resend.com/docs

---

## 🎊 PROCHAINES ÉTAPES

1. ✅ **Configurer la clé API** (fait via le popup)
2. ✅ **Tester l'envoi** d'une facture
3. ⏳ **Configurer ton domaine** (optionnel mais recommandé)
4. ⏳ **Personnaliser les templates** d'emails

---

**Ta clé API est maintenant configurée ! Tu peux envoyer des emails ! 🎉**

**Questions ?** Vérifie la documentation Resend ou demande de l'aide.
