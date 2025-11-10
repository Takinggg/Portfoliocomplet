# 🚀 Guide de Déploiement du Backend Complet

## ✅ Votre serveur est PRÊT à être déployé !

Le serveur backend complet a été créé avec **TOUTES** les fonctionnalités de votre CRM :

### 📦 Fonctionnalités incluses

- ✅ **Authentification** - Login admin
- ✅ **Newsletter** - Inscriptions et statistiques
- ✅ **Contacts/Leads** - Gestion complète des prospects
- ✅ **Clients** - Base de données clients
- ✅ **Devis** - Création et envoi par email
- ✅ **Factures** - Création et envoi par email
- ✅ **Réservations** - Calendrier et confirmations
- ✅ **Projets** - Portfolio
- ✅ **Case Studies** - Études de cas multilingues
- ✅ **FAQ** - Questions-réponses multilingues
- ✅ **Blog** - Articles avec commentaires
- ✅ **Analytics** - Tracking des visiteurs
- ✅ **Testimonials** - Témoignages clients
- ✅ **Resources** - Ressources gratuites gatées

---

## 🎯 Déploiement en 3 étapes

### Étape 1 : Vérifier les prérequis

Assurez-vous d'avoir :

1. **Supabase CLI installé**
   ```bash
   npm install -g supabase
   ```

2. **Être connecté à Supabase**
   ```bash
   supabase login
   ```

3. **Lier votre projet**
   ```bash
   supabase link --project-ref ptcxeqtjlxittxayffgu
   ```

---

### Étape 2 : Déployer le serveur

Lancez simplement le script de déploiement :

```bash
chmod +x deploy-server.sh
./deploy-server.sh
```

Le script va :
- ✅ Vérifier que tout est prêt
- ✅ Déployer le serveur
- ✅ Tester automatiquement la connexion
- ✅ Afficher les prochaines étapes

---

### Étape 3 : Initialiser les données

Une fois le serveur déployé :

1. **Connectez-vous au dashboard**
   - Allez sur `/dashboard`
   - Email: `contact@maxence.design`
   - Password: `vbz657D9`

2. **Peuplez la base de données**
   - Utilisez les boutons "Seed" dans chaque onglet
   - Ou importez vos propres données

3. **Vérifiez que tout fonctionne**
   - Blog : `/blog`
   - Case Studies : `/case-studies`
   - Resources : `/resources`
   - FAQ : `/faq`

---

## 🔧 Commandes utiles

### Voir les logs en temps réel
```bash
supabase functions logs server --follow
```

### Redéployer après modifications
```bash
supabase functions deploy server --no-verify-jwt
```

### Tester le health check
```bash
curl https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health
```

---

## 🌐 URLs importantes

**Health Check:**
```
https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health
```

**Base URL API:**
```
https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5
```

---

## 📋 Routes disponibles

### Authentication
- `POST /auth/init-admin` - Créer le compte admin
- `POST /auth/login` - Se connecter

### Newsletter
- `POST /newsletter/subscribe` - S'inscrire
- `GET /newsletter/stats` - Statistiques
- `GET /newsletter/subscribers` - Liste (auth requise)

### Contacts/Leads
- `POST /contacts` - Nouveau contact
- `GET /leads` - Liste des leads (auth requise)
- `PUT /leads/:id` - Modifier (auth requise)
- `DELETE /leads/:id` - Supprimer (auth requise)

### Clients
- `GET /clients` - Liste (auth requise)
- `POST /clients` - Créer (auth requise)
- `PUT /clients/:id` - Modifier (auth requise)
- `DELETE /clients/:id` - Supprimer (auth requise)

### Devis
- `GET /quotes` - Liste (auth requise)
- `POST /quotes` - Créer (auth requise)
- `PUT /quotes/:id` - Modifier (auth requise)
- `DELETE /quotes/:id` - Supprimer (auth requise)
- `POST /quotes/:id/send` - Envoyer par email (auth requise)

### Factures
- `GET /invoices` - Liste (auth requise)
- `POST /invoices` - Créer (auth requise)
- `PUT /invoices/:id` - Modifier (auth requise)
- `DELETE /invoices/:id` - Supprimer (auth requise)
- `POST /invoices/:id/send` - Envoyer par email (auth requise)

### Réservations
- `GET /bookings` - Liste (auth requise)
- `POST /bookings` - Créer
- `PUT /bookings/:id` - Modifier (auth requise)
- `DELETE /bookings/:id` - Supprimer (auth requise)

### Projets
- `GET /projects` - Liste publique
- `GET /projects/:id` - Détail

### Case Studies
- `GET /case-studies` - Liste (avec ?lang=fr|en)
- `GET /case-studies/:slug` - Détail
- `POST /case-studies` - Créer (auth requise)
- `PUT /case-studies/:id` - Modifier (auth requise)
- `DELETE /case-studies/:id` - Supprimer (auth requise)

### FAQ
- `GET /faq` - Liste (avec ?lang=fr|en)
- `POST /faq` - Créer (auth requise)
- `PUT /faq/:id` - Modifier (auth requise)
- `DELETE /faq/:id` - Supprimer (auth requise)

### Blog
- `GET /blog/posts` - Liste (avec ?lang=fr|en)
- `GET /blog/posts/:slug` - Détail
- `POST /blog/posts/:slug/view` - Incrémenter vues
- `POST /blog/posts` - Créer (auth requise)
- `PUT /blog/posts/:id` - Modifier (auth requise)
- `DELETE /blog/posts/:id` - Supprimer (auth requise)
- `GET /blog/posts/:slug/comments` - Commentaires
- `POST /blog/posts/:slug/comments` - Ajouter commentaire

### Analytics
- `POST /analytics/pageview` - Tracker pageview
- `POST /analytics/session/start` - Démarrer session
- `POST /analytics/conversion` - Tracker conversion
- `GET /analytics/stats` - Statistiques (auth requise)
- `GET /analytics/top-pages` - Pages populaires (auth requise)
- `GET /analytics/traffic-sources` - Sources de trafic (auth requise)

### Testimonials
- `GET /testimonials` - Liste publique (avec ?lang=fr|en)
- `GET /testimonials/admin` - Liste admin (auth requise)
- `POST /testimonials` - Créer (auth requise)
- `PUT /testimonials/:id` - Modifier (auth requise)
- `DELETE /testimonials/:id` - Supprimer (auth requise)
- `POST /testimonials/request` - Demander témoignage (auth requise)

### Resources
- `GET /resources` - Liste publique (avec ?lang=fr|en)
- `GET /resources/admin` - Liste admin (auth requise)
- `POST /resources` - Créer (auth requise)
- `PUT /resources/:id` - Modifier (auth requise)
- `DELETE /resources/:id` - Supprimer (auth requise)
- `POST /resources/:id/download` - Télécharger (avec email)
- `GET /resources/analytics/downloads` - Stats téléchargements (auth requise)
- `POST /resources/upload` - Upload fichier (auth requise)

---

## ⚠️ Important

### Variables d'environnement

Le serveur utilise automatiquement ces variables (déjà configurées) :
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`
- `RESEND_API_KEY`
- `FRONTEND_URL`
- `ADMIN_PASSWORD`

### Sécurité

- ✅ Routes publiques : projets, blog, case studies, FAQ, resources (liste)
- ✅ Routes protégées : toutes les opérations CRUD nécessitent l'authentification
- ✅ CORS configuré pour votre domaine
- ✅ Validation des données sur toutes les routes

---

## 🐛 Dépannage

### Le déploiement échoue
```bash
# Vérifier que vous êtes connecté
supabase login

# Vérifier le projet lié
supabase projects list

# Relancer le déploiement
./deploy-server.sh
```

### Le serveur ne répond pas
```bash
# Voir les logs
supabase functions logs server --follow

# Vérifier le health check
curl https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health
```

### Erreur 401 Unauthorized
- Vérifiez que vous êtes connecté au dashboard
- Le token de session est peut-être expiré, reconnectez-vous

---

## 🎉 Prêt à déployer ?

Lancez simplement :

```bash
./deploy-server.sh
```

Et votre backend CRM complet sera en ligne ! 🚀
