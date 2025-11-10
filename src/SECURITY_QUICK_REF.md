# 🔒 SÉCURITÉ - RÉFÉRENCE RAPIDE

## 🎯 TL;DR - Ce qui a été fait

✅ **Rate Limiting** - 3 requêtes/min sur formulaires  
✅ **CSRF Protection** - Tokens sur endpoints authentifiés  
✅ **Security Headers** - CSP + X-Frame-Options + HSTS  
✅ **Input Validation** - Email, longueur, sanitization XSS  
✅ **CORS Sécurisé** - À configurer avec votre domaine  
✅ **Body Size Limit** - Max 1MB par requête  
✅ **IP Blocking** - Blocage auto après abus  
✅ **Honeypot** - Détection de bots  

---

## 🚀 UTILISATION RAPIDE

### Frontend - Ajouter honeypot aux formulaires
```jsx
// Ajouter cet état
const [honeypot, setHoneypot] = useState("");

// Ajouter ce champ caché AVANT vos autres inputs
<input
  type="text"
  name="website"
  value={honeypot}
  onChange={(e) => setHoneypot(e.target.value)}
  tabIndex={-1}
  autoComplete="off"
  style={{
    position: "absolute",
    left: "-9999px",
    width: "1px",
    height: "1px",
  }}
  aria-hidden="true"
/>

// Inclure dans le body de la requête
body: JSON.stringify({
  ...formData,
  website: honeypot  // ← Ajouter ceci
})
```

### Backend - Ajouter validation à un endpoint
```typescript
// 1. Import des fonctions
import { validateHoneypot, isValidEmail, sanitizeHtml } from "./security_middleware.tsx";

// 2. Dans votre endpoint
app.post("/make-server-04919ac5/mon-endpoint", async (c) => {
  const body = await c.req.json();
  
  // Vérifier honeypot
  if (!validateHoneypot(body.website)) {
    return c.json({ success: true }); // Fake success pour bots
  }
  
  // Valider email
  if (!isValidEmail(body.email)) {
    return c.json({ success: false, error: "Invalid email" }, 400);
  }
  
  // Sanitiser les inputs
  const clean = {
    name: sanitizeHtml(body.name),
    message: sanitizeHtml(body.message)
  };
  
  // Continuer le traitement...
});
```

---

## ⚠️ AVANT PRODUCTION

### 1. Changer CORS origin
```typescript
// Dans /supabase/functions/server/index.tsx
// Ligne ~24

// ❌ NE PAS garder ça en prod
origin: "*",

// ✅ Remplacer par
origin: "https://votredomaine.com",
```

### 2. Définir FRONTEND_URL
```bash
# Dans les secrets Supabase
FRONTEND_URL=https://votredomaine.com
```

### 3. Changer mot de passe admin
```bash
# Définir dans les secrets Supabase
ADMIN_PASSWORD=VotreMotDePasseFort123!
```

---

## 🧪 TESTS RAPIDES

### Test 1 : Rate Limit fonctionne
```bash
# Envoyer 4 requêtes rapidement
# La 4ème doit être bloquée (429)
```

### Test 2 : Honeypot détecte les bots
```bash
# Envoyer une requête avec website="http://spam.com"
# Doit retourner success mais ne rien enregistrer
```

### Test 3 : Headers présents
```bash
# Inspecter DevTools → Network → Response Headers
# Doit voir : CSP, X-Frame-Options, X-Content-Type-Options
```

---

## 📊 LIMITES ACTUELLES

| Endpoint | Max/minute |
|----------|-----------|
| POST /leads | 3 |
| POST /bookings | 3 |
| POST /newsletter/subscribe | 2 |
| POST /auth/login | 5/5min |
| GET * | 60 |
| POST * | 20 |

---

## 🆘 DÉPANNAGE

### "Rate limit exceeded"
→ Attendre 5 minutes ou ajuster les limites dans `security_middleware.tsx`

### "CSRF token missing"
→ Endpoints authentifiés nécessitent `X-CSRF-Token` header  
→ Obtenir via `GET /csrf-token`

### CORS error en production
→ Vérifier que `FRONTEND_URL` est défini correctement

### Bot pas détecté
→ Vérifier que le champ `website` est bien envoyé dans le body

---

## 📚 DOCUMENTATION COMPLÈTE

Voir `/SECURITY_IMPLEMENTATION_COMPLETE.md` pour tous les détails.

---

*Dernière mise à jour : 7 novembre 2025*
