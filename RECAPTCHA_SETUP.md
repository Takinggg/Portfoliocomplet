# Configuration reCAPTCHA v3

## Étapes d'installation

### 1. Créer les clés reCAPTCHA

1. Aller sur https://www.google.com/recaptcha/admin/create
2. Choisir **reCAPTCHA v3**
3. Domaines:
   - `localhost` (pour tests)
   - `your-domain.com` (votre domaine production)
   - `*.netlify.app` (si Netlify)
4. Récupérer:
   - **Site Key** (publique - frontend)
   - **Secret Key** (privée - backend)

### 2. Configurer les variables d'environnement

#### Supabase (Backend):
```bash
# Dans Supabase Dashboard > Settings > Edge Functions > Secrets
RECAPTCHA_SECRET_KEY=6Lf...votre_secret_key
```

#### Frontend (.env):
```bash
VITE_RECAPTCHA_SITE_KEY=6Lf...votre_site_key
```

### 3. Code déjà ajouté

✅ **Backend** (`arcjet-config.ts`):
- Fonction `verifyRecaptcha()` prête à l'emploi
- Vérifie les tokens reCAPTCHA
- Score minimum: 0.5 (0.0 = bot, 1.0 = humain)

✅ **Frontend** (`useRecaptcha.ts` hook):
- Hook React pour générer tokens
- S'utilise dans n'importe quel formulaire
- Automatique et invisible

### 4. Utilisation dans les formulaires

#### Login (déjà configuré):
```typescript
// Le backend vérifie automatiquement le token
// Si score < 0.5 → Bloqué avec 403
```

#### Newsletter, Contact, Bookings:
Frontend doit envoyer le token dans le body:
```json
{
  "email": "user@example.com",
  "recaptchaToken": "03AGdBq24..." 
}
```

### 5. Test

1. Déployer le backend avec `RECAPTCHA_SECRET_KEY`
2. Ajouter le script reCAPTCHA dans `index.html`:
```html
<script src="https://www.google.com/recaptcha/api.js?render=VOTRE_SITE_KEY"></script>
```

3. Tester les formulaires:
   - Utilisateur normal → Score > 0.5 → Accepté ✅
   - Bot/VPN/comportement suspect → Score < 0.5 → Bloqué 🚫

### 6. Monitoring

Dashboard reCAPTCHA: https://www.google.com/recaptcha/admin
- Voir les requêtes
- Statistiques des scores
- Ajuster le seuil si besoin

## Alternatives

### hCaptcha (Privacy-focused)
- Plus respectueux RGPD
- Pas de tracking Google
- Même principe mais avec hCaptcha.com

### Turnstile (Cloudflare)
- Gratuit et performant
- Pas de tracking
- turnstile.dev

## Notes

- reCAPTCHA v3 est **invisible** (pas de challenge utilisateur)
- Le score est automatique basé sur le comportement
- Peut causer des faux positifs (VPN, Tor)
- Ajuster le seuil selon vos besoins (0.3 = plus permissif, 0.7 = plus strict)
