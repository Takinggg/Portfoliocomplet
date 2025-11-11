# 📧 Configuration Resend - Emails de Newsletter

## 🎯 Objectif
Activer l'envoi automatique d'emails de bienvenue quand quelqu'un s'inscrit à la newsletter.

---

## 📝 Étape 1 : Créer un compte Resend

1. Va sur https://resend.com
2. Clique sur **Sign Up** (ou **Get Started**)
3. Crée ton compte (gratuit - 3000 emails/mois)

---

## 🔑 Étape 2 : Obtenir ta clé API

1. Une fois connecté, va dans **API Keys** dans le menu
2. Clique sur **Create API Key**
3. Donne-lui un nom : `Portfolio Newsletter`
4. **Copie la clé** (elle commence par `re_...`)
   ⚠️ **IMPORTANT** : Tu ne pourras la voir qu'une seule fois !

---

## 🌐 Étape 3 : Configurer ton domaine (recommandé)

### Option A : Utiliser le domaine Resend (test)
Par défaut, les emails seront envoyés depuis `onboarding@resend.dev`
✅ Fonctionne immédiatement
❌ Moins professionnel

### Option B : Utiliser ton propre domaine (recommandé)
1. Dans Resend, va dans **Domains**
2. Clique sur **Add Domain**
3. Entre ton domaine : `maxence.design`
4. Copie les enregistrements DNS fournis :
   - **SPF** : TXT record
   - **DKIM** : TXT record  
   - **DMARC** : TXT record (optionnel mais recommandé)

5. Va dans ton hébergeur DNS (OVH, Cloudflare, etc.)
6. Ajoute ces 3 enregistrements DNS
7. Attends 10-30 minutes pour la propagation
8. Retourne sur Resend et clique sur **Verify Domain**

Une fois vérifié, les emails seront envoyés depuis `contact@maxence.design` 🎉

---

## ⚙️ Étape 4 : Configurer Supabase

1. Va sur https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/settings/functions

2. Clique sur **Edge Functions** dans le menu

3. Trouve la section **Environment Variables** ou **Secrets**

4. Ajoute une nouvelle variable :
   ```
   Nom  : RESEND_API_KEY
   Valeur : re_ton_api_key_ici
   ```

5. Clique sur **Save** ou **Add Secret**

---

## 🚀 Étape 5 : Déployer le backend

1. Va sur https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions

2. Ouvre ta fonction **server**

3. Copie TOUT le contenu de `src/supabase/functions/server/index.tsx`

4. Colle dans l'éditeur Supabase

5. Clique sur **Deploy**

---

## ✅ Étape 6 : Tester

1. Va sur ton site (footer)
2. Inscris-toi avec ton email
3. Tu devrais voir :
   - ✅ Toast de confirmation
   - 📧 Email de bienvenue dans ta boîte mail (dans 1-2 minutes)
   - 🟢 Bannière verte "Inscription confirmée"

---

## 🔍 Vérifier les logs

### Dans Supabase :
1. Va sur https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions
2. Clique sur ta fonction **server**
3. Onglet **Logs**
4. Tu devrais voir :
   ```
   ✅ New subscriber: email@example.com
   📧 Welcome email sent to email@example.com
   ```

### Dans Resend :
1. Va sur https://resend.com/emails
2. Tu verras tous les emails envoyés
3. Clique sur un email pour voir le statut (Sent, Delivered, Opened, etc.)

---

## 🎨 Personnaliser l'email de bienvenue

L'email est dans `src/supabase/functions/server/index.tsx` ligne ~1465

Tu peux modifier :
- Le sujet : `subject: "..."`
- Le contenu HTML : `html: \`...\``
- Le contenu texte : `text: \`...\``
- La couleur du gradient
- Le texte et les émojis
- Le bouton CTA

---

## 🐛 Résolution de problèmes

### ❌ "Email service not configured"
→ La clé API n'est pas configurée dans Supabase
→ Va dans Settings > Edge Functions > Environment Variables

### ❌ Email non reçu
1. Vérifie les logs Supabase (voir section ci-dessus)
2. Vérifie les spams de ta boîte mail
3. Vérifie que la clé API est valide sur https://resend.com/api-keys
4. Vérifie le quota (3000 emails/mois max en gratuit)

### ❌ "Domain not verified"
→ Si tu utilises ton propre domaine, vérifie les DNS
→ Utilise https://dnschecker.org pour vérifier la propagation
→ Attends 30 minutes max

### ⚠️ Emails en spam
→ Configure SPF, DKIM et DMARC (voir Étape 3, Option B)
→ Utilise ton propre domaine vérifié
→ Demande aux destinataires d'ajouter ton email aux contacts

---

## 📊 Limites du plan gratuit Resend

- ✅ **3000 emails/mois**
- ✅ **100 emails/jour**
- ✅ **1 domaine personnalisé**
- ✅ Logs 30 jours
- ✅ Support email

Si tu dépasses, passe au plan Pro ($20/mois pour 50k emails).

---

## 🎯 Prochaines étapes possibles

1. **Email de newsletter mensuelle** : Envoyer du contenu à tous les inscrits
2. **Email de désabonnement** : Lien direct pour se désinscrire
3. **Statistiques** : Taux d'ouverture, de clic, etc.
4. **Segmentation** : Groupes d'abonnés (clients, prospects, etc.)
5. **Automation** : Séquences d'emails automatiques

---

## 📚 Ressources

- Documentation Resend : https://resend.com/docs
- API Reference : https://resend.com/docs/api-reference
- Templates HTML : https://resend.com/docs/send-with-react
- Support : support@resend.com

---

**🎉 Voilà ! Une fois configuré, chaque nouvel inscrit recevra automatiquement un bel email de bienvenue !**
