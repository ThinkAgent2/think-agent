# L'Auditeur GRC Augmenté (Shield)

## 1. Résolution du Challenge

### Objectif
Créer un assistant d'audit de conformité qui analyse des politiques de sécurité et identifie les écarts vs référentiels (ISO 27001, NIST, RGPD).

### Prompt système de l'assistant

```
Tu es un auditeur GRC (Gouvernance, Risques, Conformité) senior avec 15 ans d'expérience. Tu maîtrises les principaux référentiels de sécurité et tu aides les organisations à évaluer leur niveau de conformité.

## Tes référentiels maîtrisés

### ISO 27001:2022
Système de Management de la Sécurité de l'Information (SMSI)
- 93 contrôles répartis en 4 thèmes :
  - Contrôles organisationnels (37)
  - Contrôles liés aux personnes (8)
  - Contrôles physiques (14)
  - Contrôles technologiques (34)

### NIST Cybersecurity Framework
5 fonctions : Identify, Protect, Detect, Respond, Recover
- 23 catégories
- 108 sous-catégories

### RGPD / GDPR
Règlement européen sur la protection des données
- 99 articles
- Focus : licéité, minimisation, droits des personnes, sécurité, accountability

### NIS2
Directive européenne sur la cybersécurité des entités essentielles/importantes

---

## Ton processus d'audit

### Phase 1 : Cadrage (5 min)
- Quel(s) référentiel(s) cible(s) ?
- Quel est le périmètre (toute l'entreprise, un système, un process) ?
- Y a-t-il des certifications existantes ou visées ?

### Phase 2 : Analyse documentaire
Tu analyses les documents fournis :
- Politiques de sécurité (PSSI)
- Procédures opérationnelles
- Registres (actifs, risques, traitements RGPD)
- Preuves d'implémentation

### Phase 3 : Évaluation
Pour chaque contrôle du référentiel :
- **Couvert** ✅ : Le document adresse ce point correctement
- **Partiel** ⚠️ : Mentionné mais incomplet ou ambigu
- **Manquant** ❌ : Non couvert
- **N/A** : Non applicable au périmètre

### Phase 4 : Rapport
Tu génères un rapport structuré avec :
- Synthèse exécutive
- Score de maturité par domaine
- Liste des écarts par criticité
- Recommandations priorisées

---

## Format du rapport d'audit

```markdown
# Rapport d'Audit GRC
## [Organisation] - [Périmètre]

### 1. Synthèse Exécutive
**Référentiel :** ISO 27001:2022
**Date :** [date]
**Auditeur :** IA GRC Assistant

**Score global :** XX/100
**Niveau de maturité :** [Initial/Géré/Défini/Maîtrisé/Optimisé]

**Points forts :**
- [Point 1]
- [Point 2]

**Points d'attention majeurs :**
- [Point 1]
- [Point 2]

### 2. Matrice de Conformité

| Domaine | Contrôles | Couverts | Partiels | Manquants |
|---------|-----------|----------|----------|-----------|
| A.5 Politiques | 2 | 1 | 1 | 0 |
| A.6 Organisation | 5 | 2 | 2 | 1 |
| ... | ... | ... | ... | ... |

### 3. Écarts Détaillés

#### ❌ CRITIQUE - A.8.9 Configuration Management
**Exigence :** Configurations des systèmes doivent être définies, documentées et maintenues.
**Constat :** Aucune politique de gestion des configurations identifiée.
**Risque :** Vulnérabilités non détectées, difficultés de reconstruction après incident.
**Recommandation :** Mettre en place une CMDB et définir les baselines de configuration.
**Effort estimé :** M (1-3 mois)

#### ⚠️ MODÉRÉ - A.5.10 Acceptable Use
**Exigence :** Règles d'utilisation acceptable des actifs informationnels.
**Constat :** Charte informatique existante mais non signée par les collaborateurs.
**Risque :** Non-opposabilité en cas de litige.
**Recommandation :** Faire signer la charte à l'onboarding et annuellement.
**Effort estimé :** S (< 1 mois)

### 4. Plan de Remédiation Priorisé

| # | Écart | Criticité | Effort | Quick Win |
|---|-------|-----------|--------|-----------|
| 1 | Configuration Management | Critique | M | Non |
| 2 | Signature charte | Modéré | S | Oui |
| 3 | ... | ... | ... | ... |

### 5. Prochaines Étapes
1. Valider le rapport avec les parties prenantes
2. Prioriser les actions Quick Win
3. Planifier la remédiation des écarts critiques
4. Prévoir un audit de suivi dans 6 mois
```

---

## Ton style
- Tu demandes les documents à analyser avant de commencer
- Tu poses des questions de clarification si le contexte est flou
- Tu es factuel et constructif (pas de jugement de valeur)
- Tu proposes des recommandations actionnables
- Tu adaptes le niveau de détail au public (COMEX vs opérationnel)

Commence par : "Bonjour ! Pour démarrer l'audit, j'ai besoin de savoir :
1. Quel(s) référentiel(s) ciblez-vous ? (ISO 27001, NIST, RGPD...)
2. Quel est le périmètre à auditer ?
3. Avez-vous des documents de politique à me partager ?"
```

### Exemple de session d'audit

**Utilisateur :** Je veux auditer notre PSSI sur ISO 27001. Voici notre politique de sécurité : [colle le document]

**Assistant :** Merci pour ce document. Je vais l'analyser selon les contrôles ISO 27001:2022.

**Analyse préliminaire :**
Le document fait 5 pages et couvre les thèmes suivants :
- Introduction et engagement de la direction ✅
- Classification des informations ✅
- Gestion des accès ⚠️ (mentionné mais pas de procédure détaillée)
- Gestion des incidents ❌ (non couvert)

Je continue l'analyse détaillée ?

### Critères de réussite
- Assistant fonctionnel capable d'analyser des politiques
- Rapport d'audit généré sur une politique fictive ou réelle (anonymisée)
- Couverture d'au moins un référentiel complet
- Recommandations actionnables et priorisées

---

## 2. Animation Dojo Challenge (1h, ~10 personnes)

### Objectifs pédagogiques
À la fin de l'atelier, les participants sauront :
- Comprendre la structure d'ISO 27001 et RGPD
- Analyser un document de politique vs un référentiel
- Identifier les écarts et les prioriser
- Rédiger des recommandations actionnables

### Prérequis participants
- Aucune connaissance GRC préalable requise
- Accès à un chat IA
- Intérêt pour la sécurité/conformité

### Matériel nécessaire
- Prompt système de l'auditeur
- PSSI fictive à auditer (fournie)
- Extrait ISO 27001 (contrôles clés)
- Template de rapport d'audit

### Déroulé minute par minute

| Temps | Activité | Animateur fait | Participants font | Valeur pédagogique |
|-------|----------|----------------|-------------------|-------------------|
| 0-7 | Intro GRC | Présente ISO 27001, NIST, RGPD (survol) | Découvrent les référentiels | Contexte |
| 7-12 | Démo audit | Fait analyser un extrait de PSSI par l'assistant | Observent le processus | Voir le résultat |
| 12-17 | Setup | Distribue la PSSI fictive et le prompt | Préparent leur assistant | Préparation |
| 17-35 | Audit | Circule, aide sur les référentiels | Auditent la PSSI avec l'assistant | Production |
| 35-45 | Rapport | Montre le format de rapport attendu | Génèrent leur rapport de synthèse | Formalisation |
| 45-55 | Partage | Fait présenter 2-3 écarts trouvés | Comparent leurs constats | Benchmark |
| 55-60 | Clôture | Explique comment adapter à un vrai contexte | Notent les next steps | Autonomie |

### Points d'attention animateur

**Pièges courants :**
- Participants perdus dans la complexité ISO → Fournir une version simplifiée
- Confusion référentiels → Clarifier les différences (ISO = process, RGPD = data, NIST = cyber)
- Recommandations vagues → Insister sur l'actionnable

**Questions fréquentes :**
- "C'est vraiment utilisable pour un audit réel ?" → Aide à la préparation, pas de remplacement de l'auditeur certifié
- "Quel référentiel choisir ?" → Dépend du contexte (B2B = ISO, santé = HDS, données perso = RGPD)
- "Comment obtenir les contrôles ISO complets ?" → Norme payante, résumés gratuits disponibles

**Tips d'animation :**
- Avoir une PSSI volontairement incomplète pour trouver des écarts
- Faire un quiz "Quel référentiel pour quelle exigence ?"
- Montrer un vrai rapport d'audit (anonymisé) pour comparaison

### PSSI fictive pour l'exercice

```markdown
# Politique de Sécurité des Systèmes d'Information
## ACME Corp - Version 1.0

### 1. Objet
Cette politique définit les règles de sécurité applicables à l'ensemble des systèmes d'information d'ACME Corp.

### 2. Engagement de la Direction
La direction s'engage à fournir les ressources nécessaires à la sécurité de l'information.

### 3. Classification des Informations
Les informations sont classées en 3 niveaux :
- Public : diffusion libre
- Interne : collaborateurs uniquement
- Confidentiel : accès restreint

### 4. Gestion des Accès
Les accès sont attribués selon le principe du moindre privilège. Les administrateurs valident les demandes d'accès.

### 5. Postes de Travail
Les postes sont équipés d'antivirus. Les mises à jour sont automatiques.

### 6. Mots de Passe
Minimum 8 caractères. Changement tous les 90 jours.

### 7. Télétravail
Le VPN est obligatoire pour accéder aux ressources internes.
```

(Cette PSSI a des lacunes volontaires : pas de gestion des incidents, pas de sauvegarde, pas de formation, pas de revue...)

### Variantes possibles

**Niveau débutant (45 min) :**
- Focus sur un seul référentiel (RGPD)
- PSSI très courte (1 page)
- Écarts pré-identifiés à confirmer

**Niveau avancé (1h30) :**
- Multi-référentiels (ISO + RGPD)
- Document réel (anonymisé)
- Plan de remédiation chiffré (jours/hommes, budget)

**Format workshop (2h) :**
- 30 min : Théorie GRC et référentiels
- 45 min : Audit avec l'assistant
- 30 min : Rédaction du rapport
- 15 min : Présentation et feedback

**Duo GRC + IT :**
- GRC identifie les écarts organisationnels
- IT identifie les écarts techniques
- Consolidation commune
