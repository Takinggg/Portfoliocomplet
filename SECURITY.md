# 🔒 GUIDE DE SÉCURITÉ - PORTFOLIO CRM

## ✅ Mesures de Sécurité Implémentées

### 1. **Headers de Sécurité HTTP** (Netlify + Vite)

#### Content Security Policy (CSP)
```
default-src 'self'
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
connect-src 'self' https://*.supabase.co https://api.stripe.com
```

#### Protection contre Clickjacking
- `X-Frame-Options: DENY`
- `frame-ancestors 'none'`

#### Autres Headers
- `X-Content-Type-Options: nosniff` - Empêche MIME sniffing
- `X-XSS-Protection: 1; mode=block` - Protection XSS legacy
- `Strict-Transport-Security: max-age=31536000` - Force HTTPS
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` - Restreint géolocalisation, microphone, caméra

### 2. **Vulnérabilités Corrigées**

#### Dépendances (npm audit fix)
- ✅ **PrismJS**: v1.30.0 (DOM Clobbering corrigé)
- ✅ **React Router**: v7.9.5 (Data spoofing corrigé)
- ✅ **Vite**: v6.4.1 (File serving vulns corrigées)
- ✅ **0 vulnérabilités** restantes

#### Build de Production
- ✅ Sourcemaps désactivés (pas d'exposition du code)
- ✅ Console.log supprimés automatiquement
- ✅ Code minifié avec Terser
- ✅ Commentaires supprimés

### 3. **Validation et Sanitization**

#### Utilitaires de Sécurité (`src/utils/security.ts`)

**Validation d'Inputs:**
```typescript
sanitizeEmail()      // Regex stricte RFC 5322
sanitizeName()       // Suppression caractères dangereux
sanitizePhone()      // Format téléphone sécurisé
sanitizeUrl()        // Validation protocole HTTP(S) uniquement
sanitizeHtml()       // Protection XSS avancée
sanitizeToken()      // UUID/JWT validation
sanitizeAmount()     // Validation montants financiers
```

**Rate Limiting Client:**
```typescript
rateLimiter.check('action_key', maxAttempts, windowMs)
// Empêche brute force et spam
```

**Validation Mot de Passe:**
```typescript
validatePasswordStrength(password)
// Score 0-6, vérifie:
// - Longueur min 8 caractères
// - Majuscule + minuscule + chiffre + spécial
// - Pas de mots de passe communs
```

**Protection CSRF:**
```typescript
generateCSRFToken()
validateCSRFToken(token)
```

### 4. **Hooks React de Sécurité** (`src/utils/hooks/useSecurity.ts`)

#### useSecureForm()
```typescript
const { csrfToken, validateSubmission, sanitizeFormData } = useSecureForm();
```
- Token CSRF unique par formulaire
- Rate limiting (5 soumissions/min)
- Sanitization automatique

#### useSecurityMonitoring()
```typescript
useSecurityMonitoring();
```
- Détecte tentatives XSS dans les inputs
- Alerte sur DevTools (en prod)
- Nettoyage automatique

#### useClickjackingProtection()
```typescript
useClickjackingProtection();
```
- Détecte chargement dans iframe
- Tente de sortir de l'iframe
- Cache le contenu si piégé

#### useSecureSession()
```typescript
const { sessionValid } = useSecureSession();
```
- Session expire après 24h d'inactivité
- Token unique par session
- Détection d'inactivité

### 5. **Protection Backend** (Supabase Edge Functions)

#### Authentification
- ✅ JWT Supabase vérifié sur chaque requête
- ✅ Row Level Security (RLS) actif
- ✅ Service Role Key jamais exposé au frontend

#### Variables d'Environnement Sécurisées
```bash
# ⚠️ NE JAMAIS committer ces secrets
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
ADMIN_PASSWORD=...
```

#### Rate Limiting Backend
- Token validation
- IP tracking (via Supabase)

### 6. **Protection des Données**

#### Données Sensibles
- ❌ Mots de passe: JAMAIS stockés en clair
- ✅ JWT avec expiration (1h)
- ✅ Refresh tokens avec rotation
- ✅ HTTPS obligatoire (HSTS)

#### localStorage vs sessionStorage
```typescript
// ✅ BON - Tokens temporaires
sessionStorage.setItem('csrf_token', token);

// ❌ ÉVITER - Données sensibles
localStorage.setItem('password', '...'); // JAMAIS!
```

---

## 🚨 Actions Critiques à Effectuer

### URGENT: Sécuriser le fichier .env

Le fichier `.env` contient des clés Supabase **qui sont déjà commitées dans git**.

**⚠️ ÉTAPES IMMÉDIATES:**

1. **Révoquer les clés exposées:**
   ```bash
   # Aller sur Supabase Dashboard
   # → Settings → API
   # → Régénérer ANON_KEY
   ```

2. **Supprimer .env du repo:**
   ```bash
   # Supprimer du tracking git (mais garder localement)
   git rm --cached .env
   git commit -m "Remove .env from git (security)"
   git push origin main
   
   # Ajouter à .gitignore (déjà fait)
   ```

3. **Utiliser .env.local:**
   ```bash
   # Copier l'exemple
   cp .env.local.example .env.local
   
   # Éditer avec les NOUVELLES clés
   nano .env.local
   ```

4. **Variables Netlify:**
   ```bash
   # Aller sur Netlify Dashboard
   # → Site settings → Environment variables
   # Ajouter:
   VITE_SUPABASE_PROJECT_ID=ptcxeqtjlxittxayffgu
   VITE_SUPABASE_ANON_KEY=(nouvelle clé)
   ```

5. **Vérifier GitHub:**
   ```bash
   # Scanner l'historique git pour secrets
   git log -p | grep -i "supabase"
   
   # Si trouvé, utiliser BFG Repo-Cleaner ou git filter-branch
   ```

---

## 📋 Checklist de Sécurité

### Avant Chaque Déploiement

- [ ] `npm audit` retourne 0 vulnérabilités
- [ ] `.env` n'est PAS dans git
- [ ] Variables d'environnement configurées sur Netlify
- [ ] Build de production testé localement
- [ ] HTTPS activé (Netlify le fait automatiquement)
- [ ] Headers de sécurité vérifiés (https://securityheaders.com/)

### Tests de Sécurité Recommandés

1. **Scanner Online:**
   - https://observatory.mozilla.org/
   - https://securityheaders.com/
   - https://www.ssllabs.com/ssltest/

2. **Tests XSS:**
   ```javascript
   // Dans un formulaire, tester:
   <script>alert('XSS')</script>
   javascript:alert('XSS')
   <img src=x onerror=alert('XSS')>
   ```
   ✅ Devrait être bloqué/nettoyé

3. **Tests CSRF:**
   ```bash
   # Tenter de soumettre depuis un autre domaine
   curl -X POST https://votre-site.com/api/action
   ```
   ✅ Devrait échouer sans token CSRF

4. **Tests Rate Limiting:**
   ```bash
   # 10 requêtes rapides
   for i in {1..10}; do curl https://votre-site.com/api/login; done
   ```
   ✅ Devrait bloquer après 5 tentatives

---

## 🛠️ Utilisation des Utilitaires

### Exemple: Formulaire de Contact Sécurisé

```typescript
import { useSecureForm } from '@/utils/hooks/useSecurity';
import { sanitizeEmail, sanitizeName } from '@/utils/security';

function ContactForm() {
  const { csrfToken, validateSubmission, sanitizeFormData } = useSecureForm();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 1. Valider le formulaire (CSRF + Rate limiting)
      validateSubmission('contact_form');
      
      // 2. Récupérer les données
      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData);
      
      // 3. Sanitizer automatiquement
      const sanitized = sanitizeFormData(data);
      
      // 4. Validation supplémentaire si besoin
      if (!sanitized.email.includes('@')) {
        throw new Error('Email invalide');
      }
      
      // 5. Envoyer
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify(sanitized)
      });
      
      // ...
    } catch (error) {
      console.error('Erreur:', error.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="csrf_token" value={csrfToken} />
      <input name="email" type="email" required />
      <input name="name" type="text" required />
      <textarea name="message" required />
      <button type="submit">Envoyer</button>
    </form>
  );
}
```

### Exemple: Protection Globale de l'App

```typescript
import { useSecurityMonitoring, useClickjackingProtection } from '@/utils/hooks/useSecurity';

function App() {
  useSecurityMonitoring();       // Détection XSS
  useClickjackingProtection();   // Anti-iframe
  
  return <YourApp />;
}
```

---

## 🔍 Monitoring et Alertes

### Logs de Sécurité

Les utilitaires loggent automatiquement:
- ⚠️ Tentatives XSS détectées
- ⚠️ Rate limiting déclenché
- ⚠️ Token CSRF invalide
- ⚠️ Session expirée
- ⚠️ Clickjacking détecté

### En Production

Configurer des alertes sur:
- Erreurs 403 (forbidden) - potentielles attaques
- Pics de trafic soudains - DDoS potentiel
- Erreurs de validation - scanning automatisé

---

## 📚 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CSP Reference](https://content-security-policy.com/)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)
- [Stripe Security](https://stripe.com/docs/security)

---

## ⚡ Quick Start Sécurité

```bash
# 1. Installer les dépendances
npm install

# 2. Scanner les vulnérabilités
npm audit

# 3. Configurer .env.local (JAMAIS .env)
cp .env.local.example .env.local

# 4. Build de production
npm run build

# 5. Tester localement
npm run preview

# 6. Scanner le site
# → https://observatory.mozilla.org/
```

---

## 🆘 En Cas de Faille Découverte

1. **Ne pas paniquer** 
2. **Documenter** l'exploit exactement
3. **Patcher immédiatement** en local
4. **Tester le fix**
5. **Déployer en urgence**
6. **Analyser les logs** pour voir si exploité
7. **Notifier les utilisateurs** si données compromises

---

**Dernière mise à jour:** Novembre 2025  
**Version:** 2.0 - Sécurité renforcée  
**Statut:** ✅ Production-ready avec mesures de sécurité avancées
