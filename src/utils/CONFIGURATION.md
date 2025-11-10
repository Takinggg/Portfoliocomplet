# Configuration du Dashboard CRM

## 📝 Configurer vos informations freelance

Pour personnaliser les factures générées avec vos informations, modifiez le fichier `/utils/freelanceConfig.ts` :

```typescript
export const freelanceInfo = {
  // Informations de base (obligatoires)
  name: "John Doe",                          // Votre nom complet
  email: "john.doe@example.com",             // Votre email professionnel
  phone: "+33 6 12 34 56 78",                // Votre téléphone
  address: "123 Rue de la Tech, 75001 Paris", // Votre adresse complète
  
  // Informations légales (optionnelles mais recommandées)
  siret: "123 456 789 00012",                // Votre numéro SIRET
  tva: "FR12 123456789",                     // Votre numéro de TVA (si applicable)
  
  // Informations bancaires (optionnelles)
  iban: "FR76 1234 5678 9012 3456 7890 123",
  bic: "BNPAFRPP",
  
  // Statut légal
  legalStatus: "Auto-entrepreneur",          // ou "EURL", "SASU", "SAS", etc.
  tvaApplicable: false,                      // true si vous êtes assujetti à la TVA
};
```

## 📄 Génération de factures PDF

Les factures générées incluent automatiquement :

### En-tête professionnel
- Votre nom avec style moderne
- Numéro de facture auto-incrémenté (format YYYY-NNN)
- Dates d'émission et d'échéance
- Badge de statut coloré

### Informations des parties
- Bloc "Prestataire" avec vos informations
- Bloc "Client" avec les informations du client
- SIRET et TVA si renseignés

### Détail de la facture
- Description de la prestation
- Montant HT/TTC
- Mention TVA non applicable (si micro-entreprise)

### Conditions de paiement
- Date d'échéance
- Modalités de paiement
- Mentions légales obligatoires

## 🎨 Personnalisation du design

Le design de la facture utilise votre palette de couleurs :
- **Couleur principale** : #00FFC2 (vert fluo)
- **Fond** : Blanc (pour impression)
- **Texte** : #0C0C0C (noir profond)
- **Accents** : #F4F4F4 (gris clair)

## 📥 Téléchargement et impression

Dans le dashboard, cliquez sur une facture puis :
- **Télécharger PDF** : Ouvre la boîte de dialogue d'impression du navigateur
- **Imprimer** : Même fonction (le navigateur permet de "Sauvegarder en PDF")

## ⚖️ Mentions légales

Assurez-vous d'inclure toutes les mentions obligatoires selon votre statut :

### Auto-entrepreneur
- Nom, prénom
- Adresse du siège social
- SIRET
- "TVA non applicable, article 293 B du CGI"

### Société (EURL, SASU, etc.)
- Raison sociale
- Forme juridique
- Capital social
- Numéro RCS
- Numéro de TVA intracommunautaire

## 🔐 Sécurité

Les informations de configuration sont stockées localement dans votre code.
Ne commitez jamais de vraies informations bancaires (IBAN, BIC) dans un repository public.

## 💡 Conseils

1. **Vérifiez vos informations** avant de générer votre première facture
2. **Conservez une copie** de chaque facture générée
3. **Numérotation** : Les numéros sont générés automatiquement par ordre chronologique
4. **Archivage** : Pensez à sauvegarder vos factures (obligation légale : 10 ans)
