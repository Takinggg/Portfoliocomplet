# 🚀 Configuration DNS pour éviter les SPAMS

## 🎯 Pourquoi vos emails vont dans les spams ?

Sans configuration DNS, les serveurs de messagerie (Gmail, Outlook, etc.) ne peuvent pas vérifier que vous êtes bien le propriétaire légitime de `maxence.design` et que Resend a l'autorisation d'envoyer des emails pour vous.

### Les 3 protocoles d'authentification

```
SPF   → Autorise Resend à envoyer des emails depuis votre domaine
DKIM  → Signature cryptographique pour prouver l'authenticité
DMARC → Politique de gestion des emails non authentifiés
```

---

## 📋 ÉTAPE 1 : Récupérer les enregistrements DNS depuis Resend

### 1. Connectez-vous à Resend
```
https://resend.com/domains
```

### 2. Cliquez sur votre domaine `maxence.design`

### 3. Vous verrez une page avec 3 enregistrements DNS à ajouter

**Exemple (les valeurs seront différentes pour vous)** :

```
┌─────────────────────────────────────────────────────────┐
│ SPF Record                                              │
├─────────────────────────────────────────────────────────┤
│ Type : TXT                                              │
│ Name : @                                                │
│ Value: v=spf1 include:spf.resend.com ~all             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ DKIM Record                                             │
├─────────────────────────────────────────────────────────┤
│ Type : TXT                                              │
│ Name : resend._domainkey                               │
│ Value: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3...          │
│        (longue chaîne cryptographique)                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ DMARC Record (Recommandé)                               │
├─────────────────────────────────────────────────────────┤
│ Type : TXT                                              │
│ Name : _dmarc                                           │
│ Value: v=DMARC1; p=none; rua=mailto:maxence@...       │
└─────────────────────────────────────────────────────────┘
```

**⚠️ IMPORTANT** : Copiez exactement les valeurs fournies par Resend !

---

## 📋 ÉTAPE 2 : Identifier votre hébergeur DNS

Votre domaine `maxence.design` est enregistré chez un hébergeur (registrar). Vous devez accéder à votre **panneau de configuration DNS**.

### Hébergeurs courants

```
OVH          → https://www.ovh.com/manager/
Gandi        → https://admin.gandi.net/
Cloudflare   → https://dash.cloudflare.com/
Namecheap    → https://ap.www.namecheap.com/
GoDaddy      → https://dcc.godaddy.com/
```

**Vous ne savez pas où votre domaine est hébergé ?**

Utilisez cet outil : https://www.whois.com/whois/maxence.design

---

## 📋 ÉTAPE 3 : Ajouter les enregistrements DNS

### A. Accéder à la zone DNS

1. **Connectez-vous** à votre hébergeur
2. **Trouvez** la section "DNS", "Zone DNS" ou "DNS Management"
3. **Sélectionnez** le domaine `maxence.design`

### B. Ajouter l'enregistrement SPF

**Vérifier d'abord si un enregistrement SPF existe déjà** :
- Cherchez un enregistrement TXT avec `@` ou `maxence.design`
- S'il existe déjà avec `v=spf1`, vous devez le **modifier** (pas en créer un nouveau)

**Si pas d'enregistrement SPF existant** :
```
Type  : TXT
Nom   : @ (ou vide ou maxence.design selon l'hébergeur)
Valeur: v=spf1 include:spf.resend.com ~all
TTL   : 3600 (ou laisser par défaut)
```

**Si un enregistrement SPF existe déjà** :
```
Ancien: v=spf1 include:_spf.google.com ~all
Nouveau: v=spf1 include:_spf.google.com include:spf.resend.com ~all
```
→ Ajoutez `include:spf.resend.com` **avant** `~all`

### C. Ajouter l'enregistrement DKIM

```
Type  : TXT
Nom   : resend._domainkey
Valeur: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3... (copier depuis Resend)
TTL   : 3600
```

**⚠️ ATTENTION** : La valeur DKIM est **très longue** (plusieurs centaines de caractères). Copiez-la entièrement !

### D. Ajouter l'enregistrement DMARC (Recommandé)

```
Type  : TXT
Nom   : _dmarc
Valeur: v=DMARC1; p=none; rua=mailto:maxence.foulon17@gmail.com
TTL   : 3600
```

**Explication des options DMARC** :
```
p=none       → Mode surveillance (recommandé au début)
p=quarantine → Mettre en spam si échec d'authentification
p=reject     → Rejeter complètement si échec (le plus strict)

rua=mailto:... → Recevoir des rapports quotidiens
```

---

## 📋 ÉTAPE 4 : Guides spécifiques par hébergeur

### 🔵 OVH

1. Allez sur https://www.ovh.com/manager/
2. Cliquez sur **Web Cloud** → **Domaines** → `maxence.design`
3. Onglet **Zone DNS**
4. Cliquez sur **Ajouter une entrée**
5. Sélectionnez **TXT**
6. Remplissez les champs et **Valider**

### 🟠 Cloudflare

1. Allez sur https://dash.cloudflare.com/
2. Sélectionnez `maxence.design`
3. Onglet **DNS** → **Records**
4. Cliquez sur **Add record**
5. Type : **TXT**, remplissez, **Save**

### 🟢 Gandi

1. Allez sur https://admin.gandi.net/
2. **Domaines** → `maxence.design`
3. **Enregistrements DNS**
4. **Ajouter un enregistrement**
5. Type **TXT**, remplissez, **Créer**

### 🔴 Namecheap

1. Allez sur https://ap.www.namecheap.com/
2. **Domain List** → `maxence.design` → **Manage**
3. **Advanced DNS**
4. **Add New Record**
5. Type : **TXT Record**, remplissez, **Save**

---

## 📋 ÉTAPE 5 : Vérifier la configuration

### A. Attendre la propagation DNS

**⏱️ Délai** : 5 minutes à 48 heures (généralement 1-4 heures)

### B. Vérifier depuis Resend

1. Retournez sur https://resend.com/domains
2. Cliquez sur `maxence.design`
3. Resend affiche des **coches vertes ✅** si les enregistrements sont corrects

**Statuts possibles** :
```
✅ Verified   → Tout est OK
⏳ Pending    → En cours de propagation (attendre)
❌ Failed     → Erreur de configuration (vérifier)
```

### C. Vérifier avec des outils externes

#### 1. Vérifier SPF
```
https://mxtoolbox.com/spf.aspx
Domaine : maxence.design
```

**Résultat attendu** :
```
✅ v=spf1 include:spf.resend.com ~all
```

#### 2. Vérifier DKIM
```
https://mxtoolbox.com/dkim.aspx
Sélecteur : resend
Domaine : maxence.design
```

**Résultat attendu** :
```
✅ DKIM record found
```

#### 3. Vérifier DMARC
```
https://mxtoolbox.com/dmarc.aspx
Domaine : maxence.design
```

**Résultat attendu** :
```
✅ v=DMARC1; p=none; rua=...
```

### D. Envoyer un email de test

Une fois tout configuré et vérifié :

1. Allez dans votre dashboard → **Devis**
2. Créez un devis et envoyez-le à `maxence.foulon17@gmail.com`
3. Vérifiez la boîte de réception (pas les spams !)

---

## 🎯 Checklist de configuration complète

```
Configuration DNS :
□ SPF ajouté et vérifié
□ DKIM ajouté et vérifié
□ DMARC ajouté et vérifié
□ Propagation DNS terminée (1-4h)

Vérification Resend :
□ Domaine marqué "Verified" avec coches vertes
□ Aucun avertissement affiché

Tests d'envoi :
□ Email de test envoyé
□ Email reçu dans boîte de réception (pas spam)
□ En-têtes email corrects (voir ci-dessous)
```

---

## 🔍 Comment vérifier les en-têtes d'email ?

### Dans Gmail

1. Ouvrez l'email reçu
2. Cliquez sur les **3 points** (en haut à droite)
3. **Afficher l'original**

**Recherchez ces lignes** :
```
✅ spf=pass
✅ dkim=pass
✅ dmarc=pass
```

**Si tout est "pass", vos emails ne devraient plus aller en spam !**

---

## 🚨 Problèmes courants

### 1. "SPF record already exists"

**Cause** : Vous avez déjà un enregistrement SPF (ex: pour Gmail)

**Solution** : **Modifier** l'existant au lieu d'en créer un nouveau
```
Avant : v=spf1 include:_spf.google.com ~all
Après : v=spf1 include:_spf.google.com include:spf.resend.com ~all
```

### 2. "DKIM verification failed"

**Causes possibles** :
- Valeur DKIM incomplète (très longue chaîne)
- Espaces ajoutés par erreur
- TTL trop court

**Solution** : Recopiez la valeur **entière** depuis Resend, sans espaces

### 3. "DNS changes not propagating"

**Solution** : Attendre plus longtemps (jusqu'à 48h)

Vérifier avec :
```
https://dnschecker.org/
```

### 4. Emails toujours en spam après configuration

**Vérifiez** :
- Les 3 enregistrements (SPF, DKIM, DMARC) sont corrects
- Resend affiche tout en vert
- Vous envoyez depuis `contact@maxence.design` (pas une autre adresse)

**Améliorations supplémentaires** :
- Ajouter un logo dans les emails
- Utiliser un footer avec adresse physique
- Éviter les mots "spam" (gratuit, urgent, promo, etc.)
- Demander aux destinataires de vous ajouter en contact

---

## 🎨 Améliorer le template email (bonus)

Pour augmenter encore la crédibilité, modifiez le template email :

### Ajouter une adresse physique (recommandé)

Dans `/supabase/functions/server/email_service.tsx`, dans le footer :

```typescript
<div style="text-align: center; color: #666; font-size: 12px; padding: 20px;">
  <p>Maxence - Portfolio Freelance</p>
  <p>SIRET: ${freelanceInfo.siret || "[SIRET]"}</p>
  <p>123 Rue de Votre Adresse, 75000 Paris</p>  // ← AJOUTER
  <p>Email: contact@maxence.design | Tél: 06.XX.XX.XX.XX</p>  // ← AJOUTER
  <p style="margin-top: 10px;">
    © 2025 Portfolio Freelance. Tous droits réservés.
  </p>
</div>
```

**Pourquoi ?** Les emails commerciaux doivent légalement inclure :
- Raison sociale (nom)
- Adresse physique
- SIRET

---

## 📊 Résultat attendu après configuration

### Avant
```
📧 Email envoyé
   ↓
📥 Boîte de réception
   ↓
⚠️ [SPAM] Marqué comme indésirable
```

### Après
```
📧 Email envoyé
   ↓
✅ SPF pass
✅ DKIM pass
✅ DMARC pass
   ↓
📥 Boîte de réception principale
   ↓
🎉 Email légitime et professionnel
```

---

## 🎯 Timeline de mise en place

```
Jour 0 (Maintenant) :
  10 min → Récupérer les enregistrements DNS sur Resend
  10 min → Se connecter à l'hébergeur du domaine
  10 min → Ajouter les 3 enregistrements DNS

Jour 0 (1-4h après) :
  5 min → Vérifier la propagation DNS
  5 min → Confirmer sur Resend (coches vertes)
  2 min → Envoyer un email de test

Jour 1 :
  → Emails arrivent en boîte principale
  → Plus de problème de spam
  → CRM 100% opérationnel 🚀
```

---

## 📚 Documentation officielle

- **Resend - Custom Domain** : https://resend.com/docs/dashboard/domains/introduction
- **SPF** : https://www.cloudflare.com/learning/dns/dns-records/dns-spf-record/
- **DKIM** : https://www.cloudflare.com/learning/dns/dns-records/dns-dkim-record/
- **DMARC** : https://dmarc.org/overview/

---

## ✅ Action immédiate

### Ce que vous devez faire MAINTENANT :

1. **Aller sur Resend** : https://resend.com/domains
2. **Cliquer sur `maxence.design`**
3. **Copier les 3 enregistrements DNS**
4. **Identifier votre hébergeur** (OVH, Cloudflare, Gandi, etc.)
5. **Ajouter les enregistrements dans la zone DNS**
6. **Attendre 1-4h** pour la propagation
7. **Vérifier sur Resend** (coches vertes)
8. **Envoyer un email de test**

---

## 🆘 Besoin d'aide ?

Si vous bloquez sur la configuration DNS, indiquez-moi :
- **Quel est votre hébergeur de domaine ?** (OVH, Cloudflare, etc.)
- **Capture d'écran de votre interface DNS** (masquez les infos sensibles)
- **Message d'erreur de Resend** (s'il y en a)

Je pourrai vous guider étape par étape selon votre hébergeur spécifique ! 🚀

---

**Une fois configuré, vos emails seront aussi fiables que ceux d'une grande entreprise !** ✨
