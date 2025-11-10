# ⚡ FIX : Erreur Resend API

## 🔴 ERREUR

```
Resend API error: {"statusCode":401,"name":"validation_error","message":"API key is invalid"}
```

## ✅ SOLUTION EN 3 ÉTAPES

### 1️⃣ Obtenir une clé API Resend valide

**👉 Va sur** : https://resend.com/api-keys

Si tu n'as pas de compte :
1. **Créer un compte** : https://resend.com/signup (GRATUIT, pas de CB)
2. **Aller sur API Keys** : https://resend.com/api-keys
3. **Cliquer "Create API Key"**
4. **Nom** : `Portfolio CRM`
5. **Permissions** : **"Sending access"** (Full access)
6. **Copier la clé** (commence par `re_...`)

**Exemple de clé valide :**
```
re_123abc456def789ghi012jkl345mno678pqr
```

⚠️ La clé ne sera affichée qu'une seule fois !

---

### 2️⃣ Configurer la clé dans Figma Make

**Tu viens de le faire via le popup ! ✅**

Si tu dois la changer :
1. Dashboard Figma Make
2. Variables d'environnement
3. Modifier `RESEND_API_KEY`
4. Coller ta nouvelle clé

---

### 3️⃣ Tester

1. **Dashboard** → Section "Factures"
2. **Créer une facture** (ou modifier une existante)
3. **Mettre ton email** comme client
4. **Changer le statut** → "Envoyée"
5. **Enregistrer**
6. ✅ **Vérifier ta boîte mail** !

---

## 🔍 VÉRIFICATIONS

### ✅ La clé API est-elle valide ?

**Test dans le terminal Resend :**

```bash
curl https://api.resend.com/emails \
  -H "Authorization: Bearer re_ta_cle_api" \
  -H "Content-Type: application/json"
```

**Réponse attendue :**
```json
{"statusCode":422,"message":"Missing 'from' field"}
```
✅ C'est bon ! (l'erreur 422 est normale ici)

**Si tu as l'erreur 401 :**
```json
{"statusCode":401,"message":"API key is invalid"}
```
❌ Ta clé n'est pas valide

---

### ✅ La clé est-elle bien configurée ?

**Backend** : `/supabase/functions/server/email_service.tsx`

```typescript
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

if (!RESEND_API_KEY) {
  console.error("⚠️ RESEND_API_KEY not configured");
  return false;
}
```

**Logs attendus :**
```
✅ Email service initialized
```

**Si tu vois :**
```
⚠️ RESEND_API_KEY not configured
```
→ La variable d'environnement n'est pas configurée

---

## 🚨 PROBLÈMES FRÉQUENTS

### Problème 1 : Clé copiée avec des espaces

❌ Mauvais :
```
re_123abc456def789  
```
(espace à la fin)

✅ Bon :
```
re_123abc456def789
```

**Solution :** Recopier la clé sans espaces

---

### Problème 2 : Mauvaise clé API

❌ Tu as copié autre chose qu'une clé API
❌ La clé a été supprimée dans Resend
❌ La clé n'a pas les bonnes permissions

**Solution :**
1. Aller sur https://resend.com/api-keys
2. Créer une **nouvelle clé**
3. Permissions : **"Sending access"**
4. La configurer dans Figma Make

---

### Problème 3 : Compte Resend non vérifié

Resend demande parfois de vérifier ton email.

**Solution :**
1. Vérifier ta boîte mail
2. Cliquer sur le lien de vérification
3. Retourner sur https://resend.com/api-keys

---

## 📧 TEST RAPIDE

### Option 1 : Via le dashboard

1. Facture → Statut "Envoyée"
2. Vérifier les logs dans Resend : https://resend.com/emails

### Option 2 : Via curl (technique)

```bash
curl https://api.resend.com/emails \
  -H "Authorization: Bearer ta_cle_api" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "ton@email.com",
    "subject": "Test",
    "html": "<p>Test email</p>"
  }'
```

**Si ça marche :**
```json
{"id":"abc123..."}
```

**Si erreur 401 :**
```json
{"statusCode":401,"message":"API key is invalid"}
```
→ Mauvaise clé

---

## ✅ CHECKLIST

- [ ] Compte Resend créé
- [ ] Email vérifié
- [ ] Clé API créée avec permissions "Sending access"
- [ ] Clé API copiée (commence par `re_...`)
- [ ] Clé API configurée dans `RESEND_API_KEY`
- [ ] Test d'envoi effectué
- [ ] Email reçu

---

## 🎯 RÉSULTAT ATTENDU

**Quand tu envoies une facture :**

### Backend logs
```
✅ Email service initialized
📧 Sending invoice email to client@example.com
✅ Email sent successfully: abc123def456
```

### Frontend toast
```
✅ Facture mise à jour et email envoyé à Jean Dupont !
```

### Resend dashboard
https://resend.com/emails

```
┌──────────────────────────────────────────┐
│ Emails                                   │
├──────────────────────────────────────────┤
│ ✅ Delivered - Facture INV-2025-001      │
│    To: client@example.com                │
│    Il y a 2 minutes                      │
└──────────────────────────────────────────┘
```

### Boîte mail du client
```
De : Portfolio Pro <onboarding@resend.dev>
À : client@example.com
Sujet : Facture INV-2025-001 - À régler avant le 30 nov

💼 Nouvelle facture
...
```

---

## 📚 LIENS UTILES

- **Créer un compte** : https://resend.com/signup
- **API Keys** : https://resend.com/api-keys
- **Emails envoyés** : https://resend.com/emails
- **Documentation** : https://resend.com/docs/send-with-nodejs

---

## 💡 ALTERNATIVE TEMPORAIRE

Si Resend ne fonctionne pas tout de suite, tu peux :

1. **Télécharger la facture en PDF** (bouton dans le dashboard)
2. **L'envoyer manuellement** par email
3. **Configurer Resend plus tard**

Mais c'est vraiment **super rapide** à configurer ! ⚡

---

**Une fois la clé configurée, tout fonctionnera ! 🎉**

**Besoin d'aide ?** Vérifie le guide complet : `RESEND_API_KEY_GUIDE.md`
