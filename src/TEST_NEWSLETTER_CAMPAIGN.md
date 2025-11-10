# 🧪 Test Newsletter Campaign - Checklist

## ✅ Composants créés

- [x] `NewsletterCampaignTab.tsx` - Interface d'envoi de campagnes
- [x] `NewsletterTab.tsx` - Système d'onglets (Abonnés / Campagne)
- [x] Route backend `/newsletter/send-campaign`
- [x] Gestion du désabonnement via URL
- [x] Documentation complète

---

## 🧪 Tests à effectuer

### Test 1 : Interface Dashboard

**Objectif** : Vérifier que le nouvel onglet s'affiche correctement

**Étapes** :
1. Connectez-vous au dashboard : `https://maxence.design/dashboard`
2. Cliquez sur **"Newsletter"** dans la sidebar
3. Vous devez voir **2 onglets** :
   - Abonnés (X)
   - Envoyer une campagne

**Résultat attendu** :
- ✅ Les 2 onglets sont visibles
- ✅ L'onglet "Abonnés" affiche la liste existante
- ✅ L'onglet "Envoyer une campagne" affiche le formulaire

---

### Test 2 : Formulaire de composition

**Objectif** : Vérifier que le formulaire fonctionne

**Étapes** :
1. Cliquez sur **"Envoyer une campagne"**
2. Remplissez :
   - **Sujet** : "Test newsletter"
   - **Contenu** : "Ceci est un test"
3. Vérifiez les statistiques en haut :
   - Abonnés confirmés
   - Total abonnés
   - Destinataires

**Résultat attendu** :
- ✅ Les champs sont éditables
- ✅ Le compteur de caractères s'affiche
- ✅ Les statistiques sont correctes
- ✅ Le filtre "Confirmés uniquement" est sélectionné par défaut

---

### Test 3 : Prévisualisation

**Objectif** : Vérifier que la prévisualisation fonctionne

**Étapes** :
1. Remplissez le formulaire (sujet + contenu)
2. Cliquez sur **"Prévisualiser"**
3. Une modale s'ouvre avec l'aperçu

**Résultat attendu** :
- ✅ La modale s'ouvre
- ✅ Le sujet s'affiche
- ✅ Le contenu s'affiche avec les bons styles
- ✅ Le lien "Se désabonner" est présent
- ✅ Les couleurs sont correctes (noir/vert)

---

### Test 4 : Envoi de campagne (avec votre email)

**Objectif** : Envoyer un vrai email de test

**Pré-requis** :
- Vous devez être inscrit à la newsletter
- Votre email doit être confirmé

**Étapes** :
1. Remplissez le formulaire :
   - **Sujet** : "🧪 Test campagne newsletter"
   - **Contenu** : "Bonjour,\n\nCeci est un email de test pour vérifier que le système fonctionne.\n\nÀ bientôt !"
2. Vérifiez que "Confirmés uniquement" est sélectionné
3. Cliquez sur **"Envoyer la campagne"**
4. Attendez le toast de confirmation

**Résultat attendu** :
- ✅ Toast de succès : "✅ Campagne envoyée à X abonné(s)"
- ✅ Le formulaire se réinitialise
- ✅ Vous recevez l'email dans votre boîte
- ✅ L'email a les bons styles (noir/vert)
- ✅ Le lien de désabonnement fonctionne

---

### Test 5 : Vérification de l'email reçu

**Objectif** : Vérifier la qualité de l'email

**Étapes** :
1. Ouvrez votre boîte email
2. Trouvez l'email "🧪 Test campagne newsletter"
3. Vérifiez :
   - Le sujet
   - Le contenu
   - Les styles
   - Le lien de désabonnement

**Résultat attendu** :
- ✅ Email reçu
- ✅ Sujet correct
- ✅ Contenu bien formaté (sauts de ligne respectés)
- ✅ Header noir avec titre vert
- ✅ Footer avec copyright
- ✅ Lien "Se désabonner" en bas

---

### Test 6 : Désabonnement via email

**Objectif** : Vérifier que le lien de désabonnement fonctionne

**Étapes** :
1. Dans l'email de test, cliquez sur **"Se désabonner"**
2. Vous êtes redirigé vers le site
3. Un message de confirmation s'affiche
4. Retournez dans Dashboard → Newsletter → Abonnés
5. Vérifiez votre statut

**Résultat attendu** :
- ✅ Redirection vers le site
- ✅ Message : "✅ Vous avez été désabonné de la newsletter avec succès."
- ✅ Dans le dashboard, votre statut est "Désabonné"

---

### Test 7 : Réinscription (optionnel)

**Objectif** : Vérifier qu'on peut se réinscrire après désabonnement

**Étapes** :
1. Sur le site, inscrivez-vous à nouveau à la newsletter
2. Confirmez votre email
3. Vérifiez dans le dashboard que le statut est "Confirmé"

**Résultat attendu** :
- ✅ Réinscription possible
- ✅ Email de confirmation reçu
- ✅ Statut "Confirmé" dans le dashboard

---

## 📊 Résultats des tests

| Test | Statut | Notes |
|------|--------|-------|
| Interface Dashboard | ⏳ À tester | |
| Formulaire | ⏳ À tester | |
| Prévisualisation | ⏳ À tester | |
| Envoi campagne | ⏳ À tester | |
| Email reçu | ⏳ À tester | |
| Désabonnement | ⏳ À tester | |
| Réinscription | ⏳ À tester | |

**Légende** :
- ⏳ À tester
- ✅ OK
- ❌ Erreur
- ⚠️ Problème mineur

---

## 🐛 Problèmes connus

### Aucun pour l'instant

(À compléter après les tests)

---

## 📝 Notes

### Premier test recommandé

1. **Créez un abonné de test** :
   - Inscrivez-vous avec votre email
   - Confirmez l'email
   
2. **Envoyez une campagne de test** :
   - Sujet court
   - Contenu simple
   - À vous-même uniquement
   
3. **Vérifiez l'email** :
   - Styles corrects
   - Lien de désabonnement fonctionne

### Conseils

- **Testez d'abord avec 1 seul abonné** (vous)
- **Vérifiez les logs Supabase** si problème
- **Utilisez `newsletterDebug()`** en cas de doute
- **Consultez les guides** :
  - `/NEWSLETTER_CAMPAIGN_GUIDE.md` - Guide utilisateur
  - `/components/dashboard/NEWSLETTER_CAMPAIGN_README.md` - Doc technique

---

## ✅ Validation finale

Une fois tous les tests passés :

- [ ] Interface dashboard OK
- [ ] Formulaire fonctionnel
- [ ] Prévisualisation OK
- [ ] Envoi d'email OK
- [ ] Email reçu avec bons styles
- [ ] Désabonnement fonctionne
- [ ] Statistiques correctes

**Si tous les tests sont ✅, le système est prêt pour la production ! 🚀**

---

**Créé le** : 2025-11-06  
**Version** : 1.0.0
