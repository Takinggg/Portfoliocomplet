# ✅ Système de Devis/Propositions Commerciales - OPÉRATIONNEL

## 🎯 Ce qui a été implémenté

### 1. Nouvel onglet "Devis" dans le Dashboard
- **Emplacement** : Entre "Projets" et "Factures" dans le menu latéral
- **Composant** : `QuotesTab.tsx`
- **Fonctionnalités** :
  - ✅ Création de nouveaux devis
  - ✅ Liste complète des devis avec filtrage et recherche
  - ✅ Statistiques en temps réel (total, en attente, acceptés, montant total)
  - ✅ Gestion des statuts : brouillon, envoyé, accepté, refusé, converti
  - ✅ Édition des devis existants
  - ✅ Prévisualisation et génération PDF
  - ✅ Envoi automatique d'emails
  - ✅ Conversion devis → facture en 1 clic

### 2. Générateur de PDF professionnel
- **Composant** : `QuoteGenerator.tsx`
- **Design** : Identique aux factures (cohérence visuelle)
- **Contenu** :
  - En-tête avec logo et informations freelance
  - Informations client
  - **Notice de validité** (avec date limite)
  - Tableau des prestations
  - Conditions générales (acompte 30%, révisions, etc.)
  - **Zone de signature** ("Bon pour accord")
  - Mentions légales

### 3. Backend complet
- **Routes API** : `/make-server-04919ac5/quotes`
  - `GET /quotes` - Liste tous les devis
  - `POST /quotes` - Créer un nouveau devis
  - `PUT /quotes/:id` - Modifier un devis
  - `DELETE /quotes/:id` - Supprimer un devis
  - `POST /quotes/:id/convert` - **Convertir en facture**
  - `POST /quotes/:id/send-reminder` - Renvoyer par email

### 4. Envoi automatique d'emails
- **Template professionnel** pour les devis
- **Envoi automatique** lors du passage au statut "envoyé"
- **Bouton de relance** pour renvoyer un devis
- **Domaine configuré** : `contact@maxence.design`

### 5. Conversion Devis → Facture
- **Conversion automatique** :
  - Génère un numéro de facture
  - Reprend toutes les informations du devis
  - Calcule l'échéance (30 jours)
  - Marque le devis comme "converti"
  - Crée une facture en statut "brouillon"

---

## 🚀 Comment utiliser

### Créer un devis
1. Aller dans **Dashboard** → **Devis**
2. Cliquer sur **"Nouveau devis"**
3. Remplir :
   - Client (liste déroulante)
   - Montant
   - Description de la prestation
   - **Date de validité** (ex: 30 jours)
4. **Sauvegarder** → Le devis est en statut "brouillon"

### Envoyer un devis
1. Dans la liste, cliquer sur l'icône **"Envoyer"** (📧)
2. Le statut passe à **"Envoyé"**
3. Un email est **automatiquement envoyé** au client avec :
   - Le devis en format professionnel
   - La date de validité mise en évidence
   - Les conditions générales
   - Instructions pour accepter

### Suivre un devis
- **Envoyé** : En attente de réponse
- **Accepté** : Client a validé → Bouton "Convertir en facture" apparaît
- **Refusé** : Client a décliné
- **Converti** : Transformé en facture (lien vers la facture créée)

### Convertir en facture
1. Quand le devis est **"Accepté"**
2. Cliquer sur l'icône **"Convertir"** (➡️)
3. Une facture est **automatiquement créée** avec :
   - Numéro de facture unique
   - Échéance à 30 jours
   - Mêmes informations que le devis
   - Statut "brouillon" (à envoyer manuellement)

### Relancer un client
- Cliquer sur l'icône **"Mail"** (📧) dans la liste
- Un email de rappel est envoyé
- Utile si le client n'a pas répondu

---

## 📊 Workflow complet

```
1. CRÉATION
   Lead qualifié → Créer devis → Remplir infos

2. ENVOI
   Devis brouillon → Cliquer "Envoyer" → Email automatique

3. SUIVI
   Client reçoit → Examine → Accepte ou refuse

4. CONVERSION
   Devis accepté → Cliquer "Convertir" → Facture créée

5. FACTURATION
   Facture brouillon → Envoyer → Paiement → Marquée payée
```

---

## 🎨 Caractéristiques du template de devis

### Design professionnel
- **En-tête** : Logo + Nom + "Devis N° DEV-202511-001"
- **Badge de statut** : Couleur selon l'état
- **Notice de validité** : Encadré jaune avec ⏰
- **Zone signature** : Espace pour "Bon pour accord" + date + signature

### Informations incluses
- Coordonnées complètes du freelance (SIRET, TVA, etc.)
- Coordonnées du client
- Description détaillée de la prestation
- **Conditions générales** :
  - Acompte de 30% à la signature
  - Délai estimé après validation
  - 2 cycles de révisions inclus
  - Modalités de paiement

### Mentions légales
- Identique aux factures pour cohérence
- TVA non applicable (auto-entrepreneur)
- Pénalités de retard
- Indemnité forfaitaire

---

## 🔧 Configuration technique

### Fichiers créés
```
/components/dashboard/QuotesTab.tsx          # Interface principale
/components/invoice/QuoteGenerator.tsx        # Générateur PDF
/components/dashboard/QuoteEditDialog.tsx    # Dialogue d'édition
```

### Fichiers modifiés
```
/supabase/functions/server/index.tsx         # Routes API devis
/supabase/functions/server/email_service.tsx # Template email devis
/components/pages/DashboardPage.tsx          # Intégration onglet
```

### Routes serveur
```typescript
POST   /make-server-04919ac5/quotes              # Créer
GET    /make-server-04919ac5/quotes              # Lister
PUT    /make-server-04919ac5/quotes/:id          # Modifier
DELETE /make-server-04919ac5/quotes/:id          # Supprimer
POST   /make-server-04919ac5/quotes/:id/convert  # Convertir
POST   /make-server-04919ac5/quotes/:id/send-reminder # Rappel
```

---

## ✉️ Email automatique

### Expéditeur
```
Maxence - Portfolio Freelance <contact@maxence.design>
```

### Contenu
- **Sujet** : "Proposition commerciale DEV-202511-001 - [Nom Client]"
- **Corps** :
  - Message d'introduction personnalisé
  - Carte avec montant et date de validité
  - **Encadré de validité** (attention sur la date limite)
  - Instructions pour accepter le devis
  - Conditions de paiement (acompte 30%)
  - Bouton pour télécharger le PDF (si configuré)

---

## 📈 Statistiques du dashboard

Le tableau de bord des devis affiche :
- **Total Devis** : Nombre total créé
- **En attente** : Brouillons + Envoyés
- **Acceptés** : Validés par les clients
- **Montant total** : Somme de tous les devis

---

## 🎯 Prochaines améliorations possibles

### Fonctionnalités avancées
- [ ] Devis avec plusieurs lignes de prestation
- [ ] Calcul automatique des remises
- [ ] Templates de devis préenregistrés
- [ ] Signature électronique intégrée
- [ ] Rappels automatiques avant expiration
- [ ] Export en PDF directement depuis le serveur
- [ ] Historique des versions du devis

### Analytics
- [ ] Taux de conversion devis → factures
- [ ] Délai moyen de réponse des clients
- [ ] Montant moyen des devis acceptés
- [ ] Raisons de refus (champ optionnel)

---

## ✅ Résultat final

Vous avez maintenant un **workflow professionnel complet** :

```
Lead → Devis → Facture → Paiement
```

Avec :
- ✅ Génération automatique des documents
- ✅ Envoi automatique d'emails
- ✅ Suivi en temps réel
- ✅ Conversion en 1 clic
- ✅ Design cohérent et professionnel
- ✅ Mentions légales complètes

**Votre CRM freelance est maintenant au niveau des solutions professionnelles payantes !** 🚀

---

## 🆘 Support

### Problèmes courants

**Le devis ne s'envoie pas**
- Vérifier que le client a une adresse email
- Vérifier la configuration Resend
- Vérifier les logs du serveur

**La conversion ne fonctionne pas**
- Le devis doit être au statut "accepté"
- Vérifier que le client existe toujours

**Le PDF ne se génère pas**
- Vérifier les popups du navigateur
- Autoriser l'ouverture de nouvelles fenêtres

---

## 📝 Notes de version

**Version 1.0** - Novembre 2025
- Système de devis complet
- Conversion automatique en factures
- Envoi d'emails automatique
- Template PDF professionnel
- Interface de gestion complète

---

**Développé avec ❤️ pour maximiser votre productivité freelance**
