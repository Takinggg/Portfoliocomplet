# 🔒 SECURITY CHECKLIST - AVANT PRODUCTION

## ⚡ ACTIONS IMMÉDIATES (Critique)

### 🔐 Secrets & Configuration

- [ ] **FRONTEND_URL défini**
  ```bash
  # Dans Supabase → Settings → Edge Functions → Secrets
  FRONTEND_URL=https://votredomaine.com
  ```
  
- [ ] **CORS origin changé**
  ```typescript
  // Dans /supabase/functions/server/index.tsx
  // Remplacer origin: "*" par origin: FRONTEND_URL
  ```

- [ ] **ADMIN_PASSWORD changé**
  ```bash
  # Générer un mot de passe fort
  ADMIN_PASSWORD=VotreNouveauMotDePasse123!
  ```

- [ ] **Vérifier que les clés sensibles ne sont PAS dans le code**
  - ✅ SUPABASE_SERVICE_ROLE_KEY → Seulement côté serveur
  - ✅ RESEND_API_KEY → Seulement côté serveur
  - ✅ Aucun mot de passe en dur dans le code

---

## 🧪 TESTS DE SÉCURITÉ

### Tests Automatiques

- [ ] **Lancer le script de test**
  ```javascript
  // Dans la console navigateur
  import { runSecurityTests } from './utils/testSecurity';
  await runSecurityTests();
  ```

- [ ] **Vérifier les résultats**
  - Tous les tests doivent passer (100%)
  - Si échecs : corriger avant déploiement

### Tests Manuels

- [ ] **Test Rate Limiting**
  - Soumettre 4 formulaires rapidement
  - Le 4ème doit être bloqué avec erreur 429

- [ ] **Test Headers de sécurité**
  - Ouvrir DevTools → Network → Sélectionner une requête
  - Onglet Headers → Response Headers
  - Vérifier présence de : CSP, X-Frame-Options, HSTS

- [ ] **Test HTTPS**
  - Toutes les URLs doivent être en `https://`
  - Pas de ressources mixtes (http dans https)

---

## 🌐 CONFIGURATION PRODUCTION

### DNS & SSL

- [ ] **Certificat SSL/TLS valide**
  - Vérifier sur [ssllabs.com](https://www.ssllabs.com/ssltest/)
  - Note minimale : A

- [ ] **HSTS preload**
  - Soumettre sur [hstspreload.org](https://hstspreload.org/)

### CDN & WAF (Optionnel mais recommandé)

- [ ] **Cloudflare activé** (ou équivalent)
  - Protection DDoS
  - WAF rules activées
  - Bot Fight Mode ON

- [ ] **Rate limiting additionnel**
  - Cloudflare Rate Limiting sur routes critiques
  - Ou AWS Shield / Akamai

---

## 📊 MONITORING & ALERTES

### Logs

- [ ] **Supabase Logs configurés**
  - Vérifier dans Supabase → Logs
  - Activer les alertes sur erreurs critiques

- [ ] **Sentry opérationnel**
  - Vérifier que les erreurs remontent
  - Configurer alertes email/Slack

### Alertes à configurer

- [ ] **Alerte sur rate limit excessif**
  - Si > 10 blocages/heure → Investigation

- [ ] **Alerte sur tentatives de connexion échouées**
  - Si > 20 tentatives/heure sur /auth/login

- [ ] **Alerte sur bots détectés**
  - Si > 50 bots/jour via honeypot

---

## 📝 DOCUMENTATION

### Documentation interne

- [ ] **Guide de réponse aux incidents de sécurité**
  - Qui contacter
  - Procédure de blocage IP
  - Rollback plan

- [ ] **Liste des secrets et leur localisation**
  - Document sécurisé (Notion, 1Password, etc.)

### Documentation légale

- [ ] **Politique de confidentialité à jour**
  - Cookies utilisés
  - Analytics (GA4, Clarity)
  - Supabase (hébergement données)

- [ ] **Mentions légales**
  - Hébergeur : Supabase
  - Responsable : Vos coordonnées

- [ ] **CGU/CGV** (si commerce)

---

## 🔍 AUDIT EXTERNE

### Scan de vulnérabilités

- [ ] **OWASP ZAP scan**
  - Scanner votre site avec [OWASP ZAP](https://www.zaproxy.org/)
  - Corriger vulnérabilités critiques/moyennes

- [ ] **Security Headers check**
  - Vérifier sur [securityheaders.com](https://securityheaders.com)
  - Objectif : Note A

- [ ] **SSL Labs test**
  - Vérifier sur [ssllabs.com](https://www.ssllabs.com/ssltest/)
  - Objectif : Note A+

### Penetration Testing (Optionnel)

- [ ] **Pentest par professionnel**
  - Budget ~1000-5000€
  - Recommandé pour projets sensibles

---

## 🚀 DÉPLOIEMENT

### Pre-deployment

- [ ] **Backup de la base de données**
  - Export manuel ou automatique activé

- [ ] **Variables d'environnement vérifiées**
  ```bash
  ✓ SUPABASE_URL
  ✓ SUPABASE_ANON_KEY
  ✓ SUPABASE_SERVICE_ROLE_KEY
  ✓ RESEND_API_KEY
  ✓ FRONTEND_URL
  ✓ ADMIN_PASSWORD
  ```

- [ ] **Rate limits ajustés selon trafic prévu**
  - Si forte affluence attendue → Augmenter limites

### Post-deployment

- [ ] **Surveillance 24h**
  - Vérifier logs pendant 24h après déploiement
  - Surveiller métriques de performance

- [ ] **Test de charge** (si forte affluence prévue)
  - Simuler 100-1000 utilisateurs simultanés
  - Vérifier que rate limiting tient

---

## 📈 AMÉLIORATION CONTINUE

### Semaine 1

- [ ] **Analyser les premiers logs**
  - Combien de rate limits déclenchés ?
  - Combien de bots détectés ?
  - Faux positifs ?

- [ ] **Ajuster les limites si nécessaire**

### Mois 1

- [ ] **Review sécurité mensuelle**
  - Nouvelles vulnérabilités découvertes ?
  - Mises à jour de dépendances

- [ ] **Backup test**
  - Vérifier que les backups fonctionnent
  - Test de restauration

### Trimestriel

- [ ] **Audit de sécurité complet**
  - Re-scanner avec OWASP ZAP
  - Vérifier compliance RGPD

- [ ] **Mise à jour des dépendances**
  - Supabase SDK
  - Autres packages npm

---

## ✅ CHECKLIST DE LANCEMENT

### Tout est prêt si :

- ✅ Tous les secrets sont configurés
- ✅ CORS est restrictif (pas de wildcard *)
- ✅ Tests de sécurité passent à 100%
- ✅ Headers de sécurité présents (Note A sur securityheaders.com)
- ✅ SSL/TLS actif (Note A sur ssllabs.com)
- ✅ Monitoring opérationnel (Sentry)
- ✅ Politique de confidentialité publiée
- ✅ Backup configuré

---

## 🆘 EN CAS D'INCIDENT

### Procédure d'urgence

1. **Bloquer l'IP malveillante**
   ```typescript
   // Dans le code serveur
   import { blockIp } from './security_middleware.tsx';
   blockIp('xxx.xxx.xxx.xxx', 86400000); // 24h
   ```

2. **Vérifier les logs**
   - Supabase → Logs
   - Identifier l'attaque

3. **Augmenter temporairement les défenses**
   - Activer Cloudflare "Under Attack Mode"
   - Réduire rate limits

4. **Notifier l'équipe**
   - Email/Slack
   - Escalader si nécessaire

5. **Post-mortem**
   - Analyser l'incident
   - Mettre à jour la sécurité

---

## 📞 CONTACTS UTILES

- **Supabase Support** : support@supabase.io
- **Cloudflare Support** : (si utilisé)
- **Sentry Support** : (si problème monitoring)

---

## 📚 RESSOURCES ADDITIONNELLES

### Formations recommandées
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Security Academy (PortSwigger)](https://portswigger.net/web-security)
- [Google Web Fundamentals - Security](https://developers.google.com/web/fundamentals/security)

### Outils recommandés
- **OWASP ZAP** - Scanner de vulnérabilités
- **Burp Suite** - Pentest tool
- **Wireshark** - Analyse réseau
- **Nmap** - Port scanning

---

## 📊 MÉTRIQUES DE SUCCÈS

Après 1 mois en production :

| Métrique | Objectif |
|----------|----------|
| Vulnérabilités critiques | 0 |
| Note securityheaders.com | A |
| Note ssllabs.com | A+ |
| Rate limit false positives | < 1% |
| Bots détectés | Variable |
| Uptime | > 99.9% |
| Temps de réponse moyen | < 500ms |

---

**🎯 RAPPEL IMPORTANT**

La sécurité n'est jamais "terminée". C'est un processus continu qui nécessite :
- Vigilance constante
- Mises à jour régulières  
- Formation continue
- Tests périodiques

**Ne JAMAIS considérer qu'un site est "100% sécurisé"**

---

*Dernière mise à jour : 7 novembre 2025*
