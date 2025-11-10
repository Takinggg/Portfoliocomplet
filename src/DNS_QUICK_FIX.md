# ⚡ FIX RAPIDE - Emails dans les spams (5 minutes)

## 🎯 Problème
Vos emails partent depuis `contact@maxence.design` mais arrivent en spam.

## ✅ Solution
Configurer 3 enregistrements DNS pour authentifier votre domaine.

---

## 📋 ÉTAPE 1 : Récupérer les enregistrements (1 min)

1. **Aller sur** : https://resend.com/domains
2. **Cliquer sur** : `maxence.design`
3. **Copier les 3 enregistrements affichés** :
   - SPF (Type TXT, Nom: @)
   - DKIM (Type TXT, Nom: resend._domainkey)
   - DMARC (Type TXT, Nom: _dmarc)

---

## 📋 ÉTAPE 2 : Trouver votre hébergeur (30 sec)

**Où avez-vous acheté `maxence.design` ?**

- OVH → https://www.ovh.com/manager/
- Cloudflare → https://dash.cloudflare.com/
- Gandi → https://admin.gandi.net/
- Namecheap → https://ap.www.namecheap.com/
- GoDaddy → https://dcc.godaddy.com/

**Vous ne savez pas ?** → https://www.whois.com/whois/maxence.design

---

## 📋 ÉTAPE 3 : Ajouter les DNS (3 min)

### Instructions génériques (tous hébergeurs)

1. **Connectez-vous** à votre hébergeur
2. **Trouvez la section "DNS"** ou "Zone DNS"
3. **Sélectionnez** `maxence.design`
4. **Ajoutez 3 enregistrements TXT** :

```
┌─────────────────────────────────────┐
│ Enregistrement 1 : SPF              │
├─────────────────────────────────────┤
│ Type : TXT                          │
│ Nom  : @                            │
│ Valeur : [COPIER DEPUIS RESEND]     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Enregistrement 2 : DKIM             │
├─────────────────────────────────────┤
│ Type : TXT                          │
│ Nom  : resend._domainkey            │
│ Valeur : [COPIER DEPUIS RESEND]     │
│          (TRÈS LONGUE)              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Enregistrement 3 : DMARC            │
├─────────────────────────────────────┤
│ Type : TXT                          │
│ Nom  : _dmarc                       │
│ Valeur : [COPIER DEPUIS RESEND]     │
└─────────────────────────────────────┘
```

5. **Sauvegarder**

---

## 📋 ÉTAPE 4 : Attendre & Vérifier (1-4h)

### Attendre la propagation DNS
⏱️ Patience : 5 min à 4h (généralement 1h)

### Vérifier sur Resend
1. Retourner sur https://resend.com/domains
2. Cliquer sur `maxence.design`
3. **Attendre que tout soit vert** : ✅ ✅ ✅

### Test rapide
```bash
# Vérifier SPF
https://mxtoolbox.com/spf.aspx
→ Entrer : maxence.design

# Vérifier DKIM
https://mxtoolbox.com/dkim.aspx
→ Sélecteur : resend
→ Domaine : maxence.design

# Vérifier DMARC
https://mxtoolbox.com/dmarc.aspx
→ Entrer : maxence.design
```

---

## 🎉 C'est fait !

Envoyez un devis de test depuis votre dashboard → L'email devrait arriver en boîte principale (pas en spam).

---

## 🚨 Si ça ne marche toujours pas

### Vérifier dans Gmail
1. Ouvrir l'email
2. Cliquer sur **⋮** (3 points)
3. **Afficher l'original**
4. Chercher :
   ```
   spf=pass    ← Doit être "pass"
   dkim=pass   ← Doit être "pass"
   dmarc=pass  ← Doit être "pass"
   ```

### Si "fail" ou "none"
- Attendre plus longtemps (propagation DNS)
- Vérifier que les valeurs sont exactes
- Vérifier qu'il n'y a pas de doublon d'enregistrement

---

## 📞 Hébergeurs spécifiques

### OVH
1. https://www.ovh.com/manager/
2. **Web Cloud** → **Domaines** → `maxence.design`
3. **Zone DNS** → **Ajouter une entrée** → **TXT**

### Cloudflare
1. https://dash.cloudflare.com/
2. Sélectionner `maxence.design`
3. **DNS** → **Add record** → **TXT**

### Gandi
1. https://admin.gandi.net/
2. **Domaines** → `maxence.design`
3. **Enregistrements DNS** → **Ajouter** → **TXT**

### Namecheap
1. https://ap.www.namecheap.com/
2. **Domain List** → `maxence.design` → **Manage**
3. **Advanced DNS** → **Add New Record** → **TXT**

---

## 🎯 Résumé ultra-rapide

```
1. Resend → Copier 3 DNS
2. Hébergeur → Zone DNS
3. Ajouter 3 TXT (SPF, DKIM, DMARC)
4. Attendre 1-4h
5. Vérifier Resend = ✅ ✅ ✅
6. Tester un email
7. ✨ Plus de spam !
```

---

**Temps total : 5 min de config + 1-4h de propagation**

**Difficulté : 🟢 Facile**

**Impact : 🚀 Énorme (emails professionnels légitimes)**
