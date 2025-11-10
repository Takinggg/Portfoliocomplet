# 📧 Newsletter Campaign System

## Composants créés

### `NewsletterCampaignTab.tsx`
Composant principal pour composer et envoyer des campagnes newsletter.

**Fonctionnalités** :
- ✅ Formulaire de composition (sujet + contenu)
- ✅ Filtrage des destinataires (confirmés / tous)
- ✅ Prévisualisation de l'email avant envoi
- ✅ Statistiques en temps réel (nombre d'abonnés)
- ✅ Envoi avec feedback (succès/échecs)
- ✅ Template email professionnel avec couleurs de la marque
- ✅ Lien de désabonnement automatique

### `NewsletterTab.tsx` (modifié)
Ajout d'un système d'onglets pour séparer :
- **Abonnés** : Gestion de la liste
- **Envoyer une campagne** : Interface d'envoi

---

## Routes backend créées

### `POST /newsletter/send-campaign`

Envoie une campagne à tous les abonnés.

**Request** :
```json
{
  "subject": "Titre de l'email",
  "content": "Contenu du message",
  "recipientFilter": "confirmed" | "all"
}
```

**Response** :
```json
{
  "success": true,
  "sent": 42,
  "failed": 0,
  "total": 42
}
```

**Logique** :
1. Récupère les abonnés selon le filtre
2. Génère un email HTML avec template professionnel
3. Envoie via Resend API (avec délai de 100ms entre chaque)
4. Inclut un lien de désabonnement unique par abonné
5. Retourne les statistiques d'envoi

---

## Gestion du désabonnement

### Frontend (`App.tsx`)

Détecte le paramètre `?newsletter_unsubscribe=email@example.com` dans l'URL et désabonne automatiquement.

### Backend (route existante)

`GET /newsletter/unsubscribe/:email` - Met à jour le statut à "unsubscribed".

---

## Template email

Le template utilise :
- **Couleurs** : #0C0C0C (noir), #00FFC2 (vert accent), #F4F4F4 (gris clair)
- **Style** : Linear/Vercel minimaliste
- **Structure** :
  - Header avec dégradé noir et titre vert
  - Contenu sur fond blanc
  - Lien de désabonnement en bas
  - Footer noir avec copyright

**Variables dynamiques** :
- `${subject}` : Sujet de l'email
- `${content}` : Contenu (avec conversion `\n` → `<br>`)
- `${unsubscribeUrl}` : URL de désabonnement unique

---

## Sécurité & Protection

### Anti-spam
- ✅ Lien de désabonnement obligatoire (RGPD)
- ✅ Délai entre chaque email (100ms) pour éviter rate limiting
- ✅ Filtre "confirmés uniquement" recommandé
- ✅ Gestion des erreurs d'envoi

### Limites Resend
- Plan gratuit : 100 emails/jour, 3000 emails/mois
- À surveiller : quota dans le dashboard Resend

---

## Utilisation

### 1. Accéder au dashboard
```
https://maxence.design/dashboard → Newsletter → Envoyer une campagne
```

### 2. Composer l'email
- Sujet (max 50 caractères recommandé)
- Contenu (utilisez des sauts de ligne pour aérer)
- Destinataires (confirmés = recommandé)

### 3. Prévisualiser
Cliquez sur "Prévisualiser" pour voir l'email final.

### 4. Envoyer
Cliquez sur "Envoyer la campagne" (irréversible).

---

## Tests

### Test avec 1 abonné
```javascript
// 1. Inscrivez-vous à la newsletter sur le site
// 2. Confirmez votre email
// 3. Allez dans Dashboard → Newsletter → Envoyer une campagne
// 4. Composez un email de test
// 5. Sélectionnez "Confirmés uniquement"
// 6. Envoyez
// 7. Vérifiez votre boîte email
```

### Test de désabonnement
```javascript
// 1. Cliquez sur le lien "Se désabonner" dans l'email
// 2. Vérifiez que le message de confirmation s'affiche
// 3. Allez dans Dashboard → Newsletter → Abonnés
// 4. Vérifiez que le statut est "Désabonné"
```

---

## Debugging

### Logs serveur
Consultez les logs Supabase Edge Functions :
```
Dashboard Supabase → Edge Functions → server → Logs
```

### Console frontend
```javascript
// Vérifier la configuration
newsletterDebug()
```

### Test API direct
```bash
curl -X POST https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/newsletter/send-campaign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "subject": "Test",
    "content": "Ceci est un test",
    "recipientFilter": "confirmed"
  }'
```

---

## Stack technique

- **Frontend** : React + Tailwind CSS + shadcn/ui
- **Backend** : Supabase Edge Functions (Hono)
- **Email** : Resend API
- **Storage** : Supabase KV Store
- **Auth** : Supabase Auth

---

## Améliorations futures

- [ ] Historique des campagnes envoyées
- [ ] Statistiques d'ouverture (avec pixel de tracking)
- [ ] Statistiques de clics (avec URL trackées)
- [ ] Segmentation des abonnés
- [ ] Templates pré-définis
- [ ] Éditeur WYSIWYG avancé
- [ ] Planification d'envoi
- [ ] A/B testing
- [ ] Drip campaigns automatiques

---

## Support

Pour toute question :
- Consultez `/NEWSLETTER_CAMPAIGN_GUIDE.md` pour le guide utilisateur complet
- Vérifiez les logs Supabase Edge Functions
- Testez avec `newsletterDebug()` dans la console

**Version** : 1.0.0  
**Dernière mise à jour** : 2025-11-06
