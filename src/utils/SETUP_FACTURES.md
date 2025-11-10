# 🧾 Configuration des factures - Guide rapide

## ⚡ Étapes pour personnaliser vos factures

### 1. Ouvrez le fichier de configuration
Fichier : `/utils/freelanceConfig.ts`

### 2. Remplacez les informations par les vôtres

```typescript
export const freelanceInfo = {
  name: "Prénom NOM",                        // ✏️ VOTRE NOM COMPLET
  email: "votre.email@exemple.com",          // ✏️ VOTRE EMAIL PRO
  phone: "+33 6 12 34 56 78",                // ✏️ VOTRE TÉLÉPHONE
  address: "123 Rue Example, 75001 Paris",   // ✏️ VOTRE ADRESSE
  
  // Informations légales (si applicable)
  siret: "123 456 789 00012",                // ✏️ VOTRE SIRET (ou "" si n'avez pas)
  tva: "FR12 123456789",                     // ✏️ VOTRE N° TVA (ou "" si micro-entreprise)
  
  // Pas besoin de modifier les champs ci-dessous pour l'instant
  iban: "FR76 XXXX XXXX XXXX XXXX XXXX XXX",
  bic: "XXXXXXXX",
  legalStatus: "Auto-entrepreneur",
  tvaApplicable: false,
};
```

### 3. Testez la génération de facture

1. Allez dans **Dashboard → Factures**
2. Créez une nouvelle facture
3. Sélectionnez un client
4. Remplissez le montant et la date
5. Cliquez sur l'icône 👁️ pour voir la facture
6. Cliquez sur **"Télécharger PDF"**

✅ Votre facture personnalisée s'ouvrira dans une nouvelle fenêtre !

## 📋 Exemple de facture générée

La facture inclut automatiquement :

```
┌─────────────────────────────────────────────────┐
│ VOTRE NOM                    Facture N° 2024-001│
│ Développeur Freelance        Date: 05/11/2024   │
│                              Échéance: 05/12/2024│
├─────────────────────────────────────────────────┤
│                                                  │
│ PRESTATAIRE              CLIENT                 │
│ Votre Nom                Nom du Client          │
│ Votre Adresse            Email du Client        │
│ Votre Email                                     │
│ Votre Téléphone                                 │
│ SIRET: XXX XXX XXX                              │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│ DESCRIPTION                          MONTANT    │
│ Développement site web               5 000 €    │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│                       Sous-total HT: 5 000 €    │
│                       TVA:              0 €     │
│                       TOTAL TTC:     5 000 €    │
│                                                  │
├─────────────────────────────────────────────────┤
│ CONDITIONS DE PAIEMENT                          │
│ Échéance : 05/12/2024                           │
│ Modalités : Virement bancaire                   │
│ TVA non applicable, article 293 B du CGI        │
└─────────────────────────────────────────────────┘
```

## 🎨 Design professionnel

✅ En-tête moderne avec votre nom stylisé
✅ Numérotation automatique (2024-001, 2024-002, etc.)
✅ Sections bien organisées
✅ Prêt pour l'impression
✅ Conforme aux obligations légales

## ⚠️ IMPORTANT : Informations à fournir maintenant

Pour que je puisse configurer vos factures, donnez-moi :

1. **Nom complet** : 
2. **Email professionnel** : 
3. **Téléphone** : 
4. **Adresse complète** : 
5. **SIRET** (si vous en avez) : 
6. **Statut** (Auto-entrepreneur, EURL, etc.) : 

Je vais mettre à jour le fichier de configuration avec vos vraies informations ! 🚀
