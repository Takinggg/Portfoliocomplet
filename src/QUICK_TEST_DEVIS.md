# 🚀 Test Rapide - Système de Devis

## ⚡ En 3 minutes, testez toutes les fonctionnalités

### ✅ 1. Correction de l'erreur email (FAIT ✓)

L'adresse d'expéditeur a été mise à jour :
```
Avant : onboarding@resend.dev (erreur 403)
Après : contact@maxence.design (domaine vérifié)
```

**Vous pouvez maintenant envoyer des emails à n'importe quelle adresse !**

---

## 🎯 2. Accéder aux devis

1. **Connexion** au dashboard :
   - Email : `contact@maxence.design`
   - Mot de passe : `vbz657D9`

2. **Cliquer sur "Devis"** dans le menu latéral
   - Entre "Projets" et "Factures"
   - Icône : 📄

---

## 📝 3. Créer votre premier devis (30 secondes)

1. **Cliquer sur "Nouveau devis"** (bouton vert en haut à droite)

2. **Remplir le formulaire** :
   ```
   Client : Sélectionner dans la liste (ex: TechCorp)
   Montant : 5000
   Description : Développement d'une application web React avec dashboard admin
   Valide jusqu'au : [Date dans 30 jours]
   ```

3. **Cliquer sur "Créer le devis"**
   - ✅ Le devis apparaît dans la liste avec le statut "Brouillon"
   - ✅ Numéro automatique : DEV-202511-001

---

## 📧 4. Envoyer le devis par email (10 secondes)

1. **Dans la ligne du devis**, cliquer sur l'icône **"Envoyer"** (📧)
   
2. **Confirmation automatique** :
   - Statut passe à "Envoyé" (bleu)
   - Toast de confirmation "Devis envoyé avec succès (email envoyé)"
   - Email automatiquement envoyé au client

3. **Vérifier l'email** :
   - Sujet : "Proposition commerciale DEV-202511-001 - TechCorp"
   - Expéditeur : `Maxence - Portfolio Freelance <contact@maxence.design>`
   - Contenu professionnel avec date de validité en évidence

---

## 👁️ 5. Prévisualiser le devis PDF (5 secondes)

1. **Cliquer sur l'icône "Œil"** (👁️) dans la liste

2. **Aperçu s'affiche** avec :
   - En-tête professionnel
   - Informations client
   - Notice de validité (encadré jaune)
   - Conditions générales
   - Zone de signature

3. **Boutons disponibles** :
   - "Télécharger PDF" → Ouvre dans un nouvel onglet
   - "Imprimer" → Dialogue d'impression

---

## ✏️ 6. Modifier un devis (20 secondes)

1. **Cliquer sur l'icône "Modifier"** (✏️)

2. **Modifier les champs** :
   - Montant
   - Description
   - Date de validité
   - Adresse du client

3. **Enregistrer** → Mise à jour instantanée

---

## ✅ 7. Accepter et convertir (30 secondes)

### Marquer comme accepté
1. **Cliquer sur l'icône "✓"** (vert) dans la liste
2. Statut passe à "Accepté" (vert)

### Convertir en facture
1. **Cliquer sur l'icône "→"** (violet) qui apparaît
2. **Confirmation** : "Devis converti en facture avec succès !"
3. **Résultat** :
   - ✅ Devis marqué "Converti" (violet)
   - ✅ Facture créée automatiquement en brouillon
   - ✅ Numéro de facture : INV-202511-001
   - ✅ Échéance à 30 jours

4. **Aller dans "Factures"** pour voir la nouvelle facture créée

---

## 📨 8. Renvoyer un devis (5 secondes)

1. **Pour un devis "Envoyé"**, cliquer sur l'icône "Mail" (📧)
2. Email de rappel envoyé automatiquement
3. Toast : "Email de rappel envoyé avec succès"

---

## 🔍 9. Filtrer et rechercher

### Barre de recherche
- Taper un numéro de devis : `DEV-202511-001`
- Taper un nom de client : `TechCorp`
- Résultats instantanés

### Filtre par statut
- **Tous** : Voir tous les devis
- **Brouillon** : Devis non envoyés
- **Envoyés** : En attente de réponse
- **Acceptés** : Validés par les clients
- **Refusés** : Déclinés
- **Convertis** : Transformés en factures

---

## 📊 10. Statistiques en temps réel

En haut de la page, 4 cartes affichent :

1. **Total Devis** : Nombre total
2. **En attente** : Brouillons + Envoyés
3. **Acceptés** : Validés
4. **Montant total** : Somme de tous les devis

**Mise à jour automatique** à chaque action !

---

## 🎨 11. États et actions possibles

### Brouillon (gris)
- 👁️ Prévisualiser
- ✏️ Modifier
- 📧 Envoyer
- 🗑️ Supprimer

### Envoyé (bleu)
- 👁️ Prévisualiser
- ✏️ Modifier
- 📧 Renvoyer (relance)
- ✅ Marquer accepté
- ❌ Marquer refusé
- 🗑️ Supprimer

### Accepté (vert)
- 👁️ Prévisualiser
- ✏️ Modifier
- **→ Convertir en facture** (action principale)
- 🗑️ Supprimer

### Refusé (rouge)
- 👁️ Prévisualiser
- 🗑️ Supprimer

### Converti (violet)
- 👁️ Prévisualiser uniquement
- **Modification bloquée** (déjà converti)

---

## ✉️ 12. Vérifier l'email envoyé

### Template professionnel
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Nouvelle proposition commerciale
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bonjour TechCorp,

J'ai le plaisir de vous transmettre ma proposition 
commerciale DEV-202511-001 pour votre projet.

┌─────────────────────────────┐
│  Devis DEV-202511-001       │
│                             │
│  Montant total : 5 000,00 € │
│  Valide jusqu'au : [Date]   │
└─────────────────────────────┘

⏰ Ce devis est valable jusqu'au [Date]
Passé cette date, les tarifs et disponibilités
pourront être modifiés.

Pour accepter ce devis :
• Signez le document PDF avec "Bon pour accord"
• Retournez-le moi par email
• Un acompte de 30% sera demandé

Cordialement,
Maxence - Portfolio Freelance
```

---

## 🐛 Débogage rapide

### Le devis ne se crée pas
- Vérifier que tous les champs requis sont remplis
- Vérifier que le client existe
- Ouvrir la console (F12) pour voir les erreurs

### L'email ne part pas
- **✅ RÉSOLU** : L'adresse est maintenant `contact@maxence.design`
- Vérifier que le client a une adresse email valide
- Vérifier les logs du serveur dans Supabase

### La conversion échoue
- Le devis doit être au statut "Accepté"
- Vérifier que le client existe toujours

### Le PDF ne s'ouvre pas
- Autoriser les popups dans le navigateur
- Réessayer avec Ctrl+Clic sur le bouton

---

## 🎯 Workflow de test complet (2 minutes)

```bash
1. Créer un devis → ✅ Statut "Brouillon"
   ↓
2. Envoyer → ✅ Email automatique + Statut "Envoyé"
   ↓
3. Prévisualiser → ✅ PDF professionnel
   ↓
4. Marquer accepté → ✅ Statut "Accepté"
   ↓
5. Convertir → ✅ Facture créée
   ↓
6. Vérifier dans "Factures" → ✅ INV-202511-001 en brouillon
```

---

## 📈 Mesures de succès

Après le test, vous devriez avoir :
- ✅ 1 devis créé et converti
- ✅ 1 facture générée automatiquement
- ✅ 1 email envoyé au client
- ✅ Statistiques à jour
- ✅ PDF téléchargeable

---

## 🎉 Félicitations !

Vous avez maintenant un **système de devis professionnel complet** qui :
- Génère des documents automatiquement
- Envoie des emails aux clients
- Convertit les devis en factures en 1 clic
- Suit tout le workflow commercial

**Votre CRM est maintenant aussi puissant que les solutions SaaS à 50€/mois !** 🚀

---

## 📞 Besoin d'aide ?

Si quelque chose ne fonctionne pas :
1. Ouvrir la console (F12) pour voir les erreurs
2. Vérifier les logs du serveur Supabase
3. Vérifier que Resend est bien configuré avec `maxence.design`

**Tout devrait fonctionner parfaitement maintenant !** ✨
