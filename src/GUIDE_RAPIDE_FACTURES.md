# ⚡ Guide Rapide - Facturation

## ✅ Configuration : TERMINÉE !

Vos informations :
- **FOULON Maxence** - contact@maxence.design - +33 6 19 32 62 26
- **SIRET** : 937 638 492 00010
- **Micro-entrepreneur** - TVA non applicable

---

## 🚀 Créer une facture en 30 secondes

### 1️⃣ Créer un client (si nouveau)
```
Dashboard → Clients → "Nouvelle entrée"
→ Nom, Email, Entreprise
→ "Ajouter le client"
```

### 2️⃣ Créer la facture
```
Dashboard → Factures → "Nouvelle facture"
→ Client : Sélectionner dans la liste
→ Montant : 5000
→ Description : "Développement site web"
→ Échéance : Choisir une date
→ "Créer la facture"
```

### 3️⃣ Télécharger le PDF
```
Cliquer sur l'icône 👁️
→ "Télécharger PDF" (bouton vert)
→ Votre facture s'ouvre !
→ Ctrl+P → Enregistrer en PDF
```

### 4️⃣ Envoyer au client
```
Envoyez le PDF par email
→ Revenez dans le dashboard
→ Cliquez sur 👁️
→ "Marquer envoyée"
```

### 5️⃣ Marquer comme payée
```
Quand le client paye :
→ Cliquez sur 👁️
→ "Marquer payée"
→ Le CA se met à jour automatiquement ! 💰
```

---

## 📄 Votre facture contient

✅ **En-tête** : Nom + N° facture (auto) + Dates + Badge statut  
✅ **Prestataire** : Vous (nom, adresse, email, tel, SIRET)  
✅ **Client** : Info du client sélectionné  
✅ **Prestation** : Description + Montant  
✅ **Total** : HT + TVA + TTC (en vert)  
✅ **Paiement** : Échéance + IBAN  
✅ **Légal** : Toutes les mentions obligatoires  

---

## 🎯 Statuts disponibles

- 🟡 **Brouillon** → En cours de création
- 🔵 **Envoyée** → Transmise au client
- 🟢 **Payée** → Paiement reçu (CA++)
- 🔴 **En retard** → Échéance dépassée

---

## 💡 Astuces

### ⚡ Raccourcis
- Lead → Client : "Convertir en client" (1 clic)
- Facture → PDF : 👁️ → "Télécharger PDF" (2 clics)
- Envoyer : "Marquer envoyée" après email

### ✅ Bonnes pratiques
- Créez les clients avant les factures
- Descriptions précises ("Dev site" pas juste "Presta")
- Échéance à J+30 (standard)
- Téléchargez et archivez chaque PDF
- Marquez "Payée" dès réception virement

### ❌ À éviter
- Ne sautez jamais de numéro de facture
- N'oubliez pas de marquer "Payée" (CA non mis à jour sinon)
- N'utilisez pas de descriptions vagues

---

## 📊 Indicateurs (KPIs)

Dashboard affiche en temps réel :
- 💰 **CA facturé** : Total factures payées
- 👥 **Clients actifs** : Nombre de clients
- 📈 **Factures** : Nombre total
- ⏰ **En retard** : Montant à relancer

---

## 🔧 Modifier vos infos

Fichier : `/utils/freelanceConfig.ts`

Changez quand vous voulez :
- Email, téléphone, adresse
- IBAN (si changement de banque)
- Statut (si évolution EURL, SASU...)

---

## 📞 Votre workflow type

```
Lead (formulaire)
  ↓
Qualifier
  ↓
Convertir en client (1 clic)
  ↓
Discuter projet
  ↓
Créer facture
  ↓
Télécharger PDF
  ↓
Envoyer au client + marquer "Envoyée"
  ↓
Recevoir paiement
  ↓
Marquer "Payée" → CA mis à jour ! 💰
```

---

## 🎉 C'est prêt !

**Tout fonctionne. Créez votre première facture maintenant ! 🚀**

Pour plus de détails → `/FACTURATION_PRETE.md`
