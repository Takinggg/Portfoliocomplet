// HTML content for downloadable resources
// These are served via the /resources/files/:filename route

export const resourcesHTML: Record<string, string> = {
  "guide-cahier-des-charges.html": `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guide - Comment Préparer un Cahier des Charges</title>
    <style>
        @page { margin: 2cm; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #0C0C0C;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 40px 0;
            background: linear-gradient(135deg, #0C0C0C 0%, #1a1a1a 100%);
            color: #00FFC2;
            margin: -20px -20px 40px -20px;
        }
        h2 { color: #0C0C0C; border-bottom: 3px solid #00FFC2; padding-bottom: 10px; margin-top: 40px; }
        .tip { background: linear-gradient(135deg, #00FFC2 0%, #00e6ae 100%); padding: 20px; border-radius: 8px; margin: 20px 0; color: #0C0C0C; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 Guide Complet</h1>
        <h2 style="margin: 20px 0; border: none; padding: 0;">Comment Préparer un Cahier des Charges</h2>
        <p>Le guide essentiel pour structurer votre projet web</p>
    </div>
    <div class="tip">
        <strong>💡 Pourquoi ce guide ?</strong>
        <p>Un cahier des charges bien préparé est la clé d'un projet réussi. Il permet d'aligner toutes les parties prenantes, d'éviter les malentendus et de cadrer précisément le scope du projet.</p>
    </div>
    <h2>1. Qu'est-ce qu'un Cahier des Charges ?</h2>
    <p>Le cahier des charges (CDC) est un document de référence qui décrit en détail les besoins, les objectifs et les contraintes d'un projet.</p>
    <h3>Les 3 types de CDC</h3>
    <ul>
        <li><strong>CDC Fonctionnel</strong> : Décrit QUOI (les fonctionnalités souhaitées)</li>
        <li><strong>CDC Technique</strong> : Décrit COMMENT (les technologies et l'architecture)</li>
        <li><strong>CDC Créatif</strong> : Décrit le STYLE (l'identité visuelle et l'UX)</li>
    </ul>
    <p>Pour télécharger le guide complet avec tous les chapitres, contactez-moi à <strong>contact@maxence.design</strong></p>
</body>
</html>`,

  "template-cahier-des-charges.html": `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Template - Cahier des Charges à Remplir</title>
    <style>
        @page { margin: 2cm; }
        body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #0C0C0C; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 40px 0; background: linear-gradient(135deg, #0C0C0C 0%, #1a1a1a 100%); color: #00FFC2; margin: -20px -20px 40px -20px; }
        .section-title { background: #0C0C0C; color: #00FFC2; padding: 15px 20px; font-size: 20px; font-weight: bold; }
        .field { margin: 20px 0; }
        .field-label { font-weight: bold; display: block; margin-bottom: 8px; }
        .field-input { width: 100%; min-height: 40px; border: 2px solid #00FFC2; border-radius: 4px; padding: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 Cahier des Charges</h1>
        <p>Template à remplir pour votre projet web</p>
    </div>
    <div class="section-title">1. INFORMATIONS GÉNÉRALES</div>
    <div class="field">
        <span class="field-label">Nom du projet :</span>
        <div class="field-input"></div>
    </div>
    <div class="field">
        <span class="field-label">Entreprise / Organisation :</span>
        <div class="field-input"></div>
    </div>
    <p>Pour obtenir le template complet avec toutes les sections, contactez-moi à <strong>contact@maxence.design</strong></p>
</body>
</html>`,

  "checklist-lancement-site.html": `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Checklist - Lancement de Site Web</title>
    <style>
        @page { margin: 2cm; }
        body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #0C0C0C; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 40px 0; background: linear-gradient(135deg, #0C0C0C 0%, #1a1a1a 100%); color: #00FFC2; margin: -20px -20px 40px -20px; }
        .category { margin: 40px 0; border: 2px solid #00FFC2; border-radius: 8px; overflow: hidden; }
        .category-header { background: #0C0C0C; color: #00FFC2; padding: 15px 20px; font-size: 20px; font-weight: bold; }
        .checklist-item { padding: 12px 15px; margin: 8px 0; background: #f8f9fa; border-left: 4px solid #00FFC2; padding-left: 50px; }
        .checklist-item:before { content: "☐"; position: absolute; left: 15px; font-size: 24px; color: #00FFC2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>✅ Checklist Complète</h1>
        <h2 style="margin: 20px 0; border: none; padding: 0;">Lancement de Site Web</h2>
        <p>100+ points de vérification avant la mise en ligne</p>
    </div>
    <div class="category">
        <div class="category-header">🔍 SEO & RÉFÉRENCEMENT</div>
        <div style="padding: 20px;">
            <div class="checklist-item" style="position: relative;">Balise Title unique et optimisée sur chaque page</div>
            <div class="checklist-item" style="position: relative;">Meta Description pertinente sur chaque page</div>
            <div class="checklist-item" style="position: relative;">Sitemap XML généré et soumis</div>
        </div>
    </div>
    <p>Pour obtenir la checklist complète avec 100+ points, contactez-moi à <strong>contact@maxence.design</strong></p>
</body>
</html>`,

  "guide-tarification-freelance.html": `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Guide - Tarification Freelance</title>
    <style>
        @page { margin: 2cm; }
        body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #0C0C0C; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 40px 0; background: linear-gradient(135deg, #0C0C0C 0%, #1a1a1a 100%); color: #00FFC2; margin: -20px -20px 40px -20px; }
        .calculator { background: #f8f9fa; padding: 30px; border-radius: 8px; border: 2px solid #00FFC2; margin: 30px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #dee2e6; padding: 12px; text-align: left; }
        th { background: #0C0C0C; color: #00FFC2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>💰 Guide Complet</h1>
        <h2 style="margin: 20px 0; border: none; padding: 0;">Calculer ses Tarifs Freelance</h2>
        <p>La méthode pour fixer des tarifs justes et rentables</p>
    </div>
    <h2>La Formule Magique</h2>
    <div class="calculator">
        <h3>📊 Calculateur de Taux Horaire</h3>
        <p><strong>Formule :</strong> (Revenu net souhaité + Charges + Impôts + Frais) ÷ Heures facturables = Taux horaire</p>
    </div>
    <h2>Grille de Tarifs par Expérience</h2>
    <table>
        <tr><th>Profil</th><th>Taux Horaire</th><th>Taux Journalier</th></tr>
        <tr><td>Junior (0-2 ans)</td><td>40-60€ HT</td><td>300-450€ HT</td></tr>
        <tr><td>Confirmé (2-5 ans)</td><td>60-90€ HT</td><td>450-650€ HT</td></tr>
        <tr><td>Senior (5-10 ans)</td><td>90-120€ HT</td><td>650-900€ HT</td></tr>
    </table>
    <p>Pour obtenir le guide complet avec calculateur interactif, contactez-moi à <strong>contact@maxence.design</strong></p>
</body>
</html>`
};
