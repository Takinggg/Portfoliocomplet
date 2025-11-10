# 📧 Bonnes Pratiques - Maximiser la délivrabilité

## 🎯 Après la configuration DNS

Une fois SPF, DKIM et DMARC configurés, voici les bonnes pratiques pour que vos emails restent hors des spams.

---

## ✅ 1. Configuration DNS (Priorité 1)

### Ce qui est OBLIGATOIRE
```
✅ SPF    → Autorise Resend à envoyer pour vous
✅ DKIM   → Signature cryptographique
✅ DMARC  → Politique d'authentification
```

**Sans ces 3, vos emails VONT en spam.**

---

## ✅ 2. Contenu des emails (Priorité 2)

### Mots à ÉVITER dans l'objet et le contenu

❌ **Interdits** (triggers de spam) :
```
- GRATUIT / FREE
- URGENT / URGENT!!!
- CLIQUEZ ICI / CLICK HERE
- Félicitations, vous avez gagné
- 100% garanti
- Augmentez vos revenus
- Offre limitée
- RE: (si ce n'est pas vraiment une réponse)
- Promotion exclusive
- Argent facile
```

✅ **À utiliser** :
```
- Proposition commerciale
- Devis pour votre projet
- Facture N°XXX
- Suivi de votre demande
- Confirmation de réservation
- Merci pour votre confiance
```

### Votre template actuel
Vos templates sont déjà bien conçus :
- ✅ Objet clair : "Proposition commerciale DEV-XXX"
- ✅ Pas de mots spam
- ✅ Contexte professionnel

---

## ✅ 3. Ratio texte/HTML (Priorité 2)

### Règle d'or
**Au moins 60% de texte, maximum 40% d'images**

### Votre situation
Vos emails sont principalement en HTML/texte → ✅ OK

### À éviter
- ❌ Email = 1 seule grosse image
- ❌ Pas de texte alternatif
- ❌ Trop de couleurs criardes

---

## ✅ 4. Réputation de l'expéditeur (Priorité 1)

### Warmup : Démarrer doucement

**Pourquoi ?**
Si vous envoyez 500 emails le premier jour avec un nouveau domaine, Gmail vous marquera comme spammeur.

**Comment faire ?**

```
Semaine 1 : 10-20 emails/jour maximum
Semaine 2 : 50 emails/jour
Semaine 3 : 100 emails/jour
Semaine 4 : 200+ emails/jour
```

**Votre cas (freelance) :**
Vous envoyez probablement 5-10 devis par semaine → ✅ Pas de problème

### Éviter les rebonds (bounces)

**Vérifiez toujours que l'email existe avant d'envoyer**

Dans votre code actuel, vous vérifiez :
```typescript
if (!client.email) {
  return res.status(400).json({ 
    success: false, 
    error: "Client n'a pas d'email" 
  });
}
```
→ ✅ Bien !

**Amélioration possible** : Valider le format email
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(client.email)) {
  return res.status(400).json({ error: "Email invalide" });
}
```

---

## ✅ 5. Lien de désinscription (Priorité 3)

### Légalement requis pour les emails marketing

**Votre cas (devis/factures) :**
Les emails transactionnels (devis, factures) ne nécessitent PAS de lien de désinscription.

**Si vous ajoutez une newsletter plus tard**, ajoutez :
```html
<p style="text-align: center; font-size: 11px; color: #999; margin-top: 20px;">
  Vous recevez cet email car vous êtes inscrit à notre newsletter.
  <a href="%unsubscribe_url%" style="color: #666;">Se désabonner</a>
</p>
```

---

## ✅ 6. Informations légales dans le footer (Priorité 2)

### Ce qui est obligatoire en France

Pour les emails commerciaux :
- ✅ Nom de l'entreprise
- ✅ SIRET
- ✅ Adresse physique
- ✅ Email de contact

### Amélioration de votre template

**Actuel** :
```html
<p>© 2025 Portfolio Freelance. Tous droits réservés.</p>
```

**Amélioré** :
```html
<div style="text-align: center; color: #666; font-size: 12px;">
  <p>Maxence Foulon - Développeur Freelance</p>
  <p>SIRET: [VOTRE SIRET] | TVA: [SI APPLICABLE]</p>
  <p>[Votre adresse complète]</p>
  <p>Email: contact@maxence.design | Tél: [VOTRE TÉLÉPHONE]</p>
  <p style="margin-top: 10px;">
    © 2025 Maxence - Portfolio Freelance. Tous droits réservés.
  </p>
</div>
```

**Je peux l'ajouter si vous me donnez les infos !**

---

## ✅ 7. Taux d'engagement (Priorité 2)

### Comment améliorer l'engagement

**Gmail/Outlook analysent** :
- Taux d'ouverture
- Taux de clics
- Réponses reçues
- Ajout aux contacts
- Marquage en spam

**Actions pour vous** :

1. **Personnalisez l'objet** :
   ```
   ❌ Devis N° DEV-202511-001
   ✅ Devis pour [Nom du projet] - [Nom Client]
   ```

2. **Encouragez une réponse** :
   ```
   "N'hésitez pas à me répondre si vous avez des questions."
   ```

3. **Demandez d'ajouter en contact** :
   ```
   "Pour recevoir mes futurs emails, ajoutez contact@maxence.design 
   à vos contacts."
   ```

---

## ✅ 8. Fréquence d'envoi (Priorité 2)

### Éviter le spam par volume

**Bonnes pratiques** :
- ✅ Maximum 1 email par destinataire par jour
- ✅ Espacer les envois de masse (1h entre chaque lot)

**Votre cas** :
Vous envoyez des devis individuels → ✅ Pas de problème

---

## ✅ 9. Authentification renforcée (Priorité 3)

### Enregistrement MX (optionnel mais recommandé)

Si vous voulez **recevoir** des emails sur `contact@maxence.design` :

**Ajouter sur Resend** :
```
Type : MX
Nom  : @
Valeur : [FOURNI PAR RESEND]
Priorité : 10
```

**Avantages** :
- Recevoir des réponses directement
- Crédibilité accrue
- Boîte email professionnelle complète

---

## ✅ 10. Monitoring et rapports (Priorité 3)

### Suivre vos métriques

**Dans Resend Dashboard** :
- Nombre d'emails envoyés
- Taux de délivrabilité
- Bounces (échecs)
- Spams signalés
- Ouvertures (si activé)

**Si taux de spam > 0.1%** :
→ Revoir le contenu et les destinataires

---

## 📊 Checklist complète de délivrabilité

### Configuration technique (Obligatoire)
```
□ SPF configuré et vérifié
□ DKIM configuré et vérifié
□ DMARC configuré et vérifié
□ Domaine vérifié sur Resend (coches vertes)
```

### Contenu (Recommandé)
```
□ Pas de mots spam dans l'objet
□ Ratio texte/HTML équilibré
□ Footer avec infos légales complètes
□ Adresse physique incluse
□ SIRET inclus
```

### Pratiques d'envoi (Recommandé)
```
□ Warmup progressif (si gros volumes)
□ Validation des emails avant envoi
□ Maximum 1 email/destinataire/jour
□ Monitoring des métriques Resend
```

### Engagement (Bonus)
```
□ Objets personnalisés
□ Encourager les réponses
□ Demander l'ajout en contact
```

---

## 🎯 Pour votre CRM freelance

### Ce qui est déjà bien fait ✅

```
✅ Templates professionnels
✅ Emails transactionnels (devis/factures)
✅ Pas de mots spam
✅ Validation côté serveur
✅ Logs détaillés
```

### Ce qu'on peut améliorer 🚀

1. **Ajouter les infos légales complètes dans le footer**
2. **Personnaliser les objets d'emails**
3. **Valider le format des emails**
4. **Monitorer les bounces**

---

## 📝 Template email amélioré

Voulez-vous que je mette à jour vos templates pour inclure :

1. **Footer légal complet** (SIRET, adresse, téléphone)
2. **Objets personnalisés** (inclure le nom du projet)
3. **Validation d'email** côté serveur
4. **Encouragement à répondre** (augmente l'engagement)

**Donnez-moi vos infos et je les intègre !**

---

## 🚨 Cas spécifiques

### "Mes emails vont toujours en spam malgré la config DNS"

**Vérifiez** :
1. Les 3 DNS sont bien en place (SPF, DKIM, DMARC)
2. Resend affiche tout en vert
3. Vous envoyez bien depuis `contact@maxence.design`
4. Le contenu ne contient pas de mots spam

**Testez** :
- Envoyez à Gmail, Outlook, Yahoo
- Vérifiez les en-têtes (spf=pass, dkim=pass, dmarc=pass)
- Regardez le "spam score" sur mail-tester.com

### "Les emails arrivent en boîte principale chez moi mais en spam chez les clients"

**Normal au début !**

- Gmail : Apprend progressivement (warmup)
- Demandez aux clients de :
  1. Marquer "Pas un spam"
  2. Ajouter `contact@maxence.design` en contact
  3. Répondre au premier email

**Après 5-10 emails, ce sera résolu automatiquement.**

---

## 🎉 Résumé

### Priorité 1 (OBLIGATOIRE)
```
1. Configurer SPF, DKIM, DMARC
2. Vérifier sur Resend (tout en vert)
```

### Priorité 2 (RECOMMANDÉ)
```
3. Ajouter footer légal complet
4. Éviter les mots spam
5. Warmup progressif si gros volumes
```

### Priorité 3 (BONUS)
```
6. Personnaliser les objets
7. Encourager l'engagement
8. Monitorer les métriques
```

---

## 📞 Besoin d'aide ?

Si vous voulez que je :
- ✅ Mette à jour vos templates email
- ✅ Ajoute la validation d'email
- ✅ Intègre le footer légal complet

**Envoyez-moi vos infos** :
- SIRET
- Adresse physique
- Téléphone
- Nom complet

Et je les intègre proprement dans vos templates ! 🚀

---

**Avec la config DNS + ces bonnes pratiques, vous aurez une délivrabilité de 95%+ !** ✨
