# La QA Augmentée (IT)

## 1. Résolution du Challenge

### Objectif
Générer automatiquement des plans de tests et scénarios de recette exhaustifs à partir des spécifications produit.

### Prompt système de l'assistant

```
Tu es un QA Engineer senior avec 10 ans d'expérience. Tu excelles dans la création de plans de tests exhaustifs qui capturent les cas nominaux ET les edge cases.

## Ta mission
Analyser une spécification produit (PRD, user story, feature spec) et générer un plan de test complet.

## Structure du plan de test

### 1. Résumé du périmètre
- Feature testée
- Version/Sprint concerné
- Prérequis de test
- Environnement cible

### 2. Matrice de couverture
Mapping entre requirements et cas de test pour garantir 100% de couverture.

### 3. Cas de test détaillés

Pour chaque cas de test :
```
**ID** : TC-XXX
**Titre** : [Action] [Objet] [Condition]
**Priorité** : Critique / Haute / Moyenne / Basse
**Type** : Fonctionnel / Régression / Performance / Sécurité

**Préconditions :**
- Condition 1
- Condition 2

**Étapes :**
1. Action utilisateur précise
2. Action utilisateur précise
3. ...

**Résultat attendu :**
- Ce qu'on doit observer/vérifier

**Données de test :**
- Données nécessaires pour le test

**Post-conditions :**
- État du système après le test
```

### 4. Cas aux limites (Edge Cases)
- Valeurs limites (min, max, zéro, négatif)
- Entrées invalides
- Timeouts et erreurs réseau
- Permissions et droits d'accès
- Multi-utilisateurs concurrent

### 5. Tests de régression
- Fonctionnalités existantes impactées
- Intégrations à vérifier

---

## Ta méthodologie d'analyse

### Étape 1 : Comprendre la feature
- Quel est l'objectif business ?
- Qui sont les utilisateurs ?
- Quels sont les critères d'acceptation ?

### Étape 2 : Identifier les parcours
- Happy path (cas nominal)
- Chemins alternatifs
- Cas d'erreur

### Étape 3 : Techniques de test
- **Equivalence Partitioning** : Regrouper les entrées similaires
- **Boundary Value Analysis** : Tester les limites
- **Decision Table** : Combinaisons de conditions
- **State Transition** : Changements d'état

### Étape 4 : Priorisation
- P0 : Bloquant si KO (critique business)
- P1 : Important mais contournable
- P2 : Confort utilisateur
- P3 : Nice to have

---

## Ton style
- Tu demandes la spec avant de commencer
- Tu poses des questions si quelque chose est ambigu
- Tu génères des tests exhaustifs mais actionnables
- Tu proposes des données de test réalistes
- Tu identifies les risques de régression

Commence par : "Envoie-moi la spec ou les user stories à couvrir. Précise aussi l'environnement de test si tu le connais."
```

### Exemple de plan de test généré

**User Story source :**
```
En tant qu'utilisateur connecté
Je veux réinitialiser mon mot de passe
Afin de récupérer l'accès à mon compte

Critères d'acceptation :
- Email avec lien de réinitialisation envoyé
- Lien valide 24h
- Nouveau mot de passe doit respecter les règles de sécurité
- Confirmation par email après changement
```

**Plan de test généré :**

```markdown
# Plan de Test : Réinitialisation Mot de Passe

## 1. Résumé du périmètre
| Attribut | Valeur |
|----------|--------|
| Feature | Reset Password |
| Sprint | 2024-S03 |
| Environnement | Staging |
| Prérequis | Compte utilisateur existant |

## 2. Matrice de couverture

| Requirement | Cas de test |
|-------------|-------------|
| Email envoyé | TC-001, TC-002, TC-003 |
| Lien valide 24h | TC-004, TC-005, TC-006 |
| Règles sécurité MDP | TC-007, TC-008, TC-009, TC-010 |
| Confirmation email | TC-011 |

## 3. Cas de test - Happy Path

### TC-001 : Demande reset avec email valide
**Priorité** : Critique
**Type** : Fonctionnel

**Préconditions :**
- Utilisateur avec compte actif
- Email : test@example.com

**Étapes :**
1. Aller sur la page de connexion
2. Cliquer sur "Mot de passe oublié"
3. Saisir l'email test@example.com
4. Cliquer sur "Envoyer"

**Résultat attendu :**
- Message "Email envoyé" affiché
- Email reçu dans les 2 minutes
- Email contient lien de reset valide

---

### TC-002 : Reset avec email inexistant
**Priorité** : Haute
**Type** : Fonctionnel (cas d'erreur)

**Préconditions :**
- Email non enregistré : fake@example.com

**Étapes :**
1. Demander reset avec fake@example.com

**Résultat attendu :**
- Message identique à TC-001 (sécurité : ne pas révéler si email existe)
- Aucun email envoyé

---

## 4. Cas aux limites

### TC-005 : Lien expiré (>24h)
**Priorité** : Haute
**Type** : Fonctionnel

**Préconditions :**
- Lien de reset généré il y a 25h (manipuler la date serveur ou attendre)

**Étapes :**
1. Cliquer sur le lien expiré

**Résultat attendu :**
- Message "Lien expiré, veuillez refaire une demande"
- Redirection vers page de demande

---

### TC-007 : MDP trop court
**Priorité** : Critique
**Type** : Sécurité

**Préconditions :**
- Lien de reset valide

**Données de test :**
- Nouveau MDP : "abc" (3 caractères)

**Résultat attendu :**
- Erreur : "Minimum 8 caractères"
- MDP non modifié

---

### TC-008 : MDP sans caractère spécial
**Priorité** : Critique
**Type** : Sécurité

**Données de test :**
- Nouveau MDP : "Password123" (sans spécial)

**Résultat attendu :**
- Erreur : "Doit contenir au moins un caractère spécial"

---

## 5. Tests de régression

| Zone impactée | Test à exécuter |
|---------------|-----------------|
| Connexion | Vérifier login avec nouveau MDP |
| Sessions actives | Vérifier déconnexion des autres sessions |
| Historique MDP | Vérifier qu'on ne peut pas réutiliser les 3 derniers MDP |
```

### Critères de réussite
- Assistant fonctionnel qui génère des plans de test
- Plan de test généré à partir d'une spec réelle
- Couverture des edge cases et cas d'erreur
- Format exploitable par l'équipe QA

---

## 2. Animation Dojo Challenge (1h, ~10 personnes)

### Objectifs pédagogiques
À la fin de l'atelier, les participants sauront :
- Analyser une spec pour identifier les cas de test
- Appliquer les techniques de test (boundary, equivalence...)
- Rédiger des cas de test précis et reproductibles
- Identifier les edge cases souvent oubliés

### Prérequis participants
- Accès à un chat IA
- Une spec/user story à tester (ou utiliser l'exemple fourni)
- Notions de base en test (pas obligatoire)

### Matériel nécessaire
- Prompt système (ci-dessus)
- 2-3 specs exemple de difficulté croissante
- Checklist des edge cases classiques
- Template de cas de test

### Déroulé minute par minute

| Temps | Activité | Animateur fait | Participants font | Valeur pédagogique |
|-------|----------|----------------|-------------------|-------------------|
| 0-5 | Intro | Présente l'importance d'une bonne couverture de test | Contexte | Motivation |
| 5-10 | Techniques | Explique les 4 techniques (boundary, equivalence, decision, state) | Comprennent les concepts | Théorie |
| 10-15 | Démo | Génère un plan de test sur l'exemple "reset password" | Observent le résultat | Voir le livrable |
| 15-20 | Setup | Distribue le prompt et les specs | Choisissent leur spec | Préparation |
| 20-40 | Génération | Circule, aide à identifier les edge cases | Génèrent leur plan de test | Production |
| 40-50 | Challenge croisé | Forme des binômes | Cherchent les cas manqués dans le plan du binôme | Revue critique |
| 50-55 | Synthèse | Collecte les edge cases les plus créatifs | Partagent leurs découvertes | Apprentissage |
| 55-60 | Clôture | Tips pour intégrer dans le workflow CI/CD | Notent les next steps | Autonomie |

### Points d'attention animateur

**Pièges courants :**
- Plans trop vagues → Insister sur les étapes précises
- Oubli des cas d'erreur → "Qu'est-ce qui peut mal tourner ?"
- Tests non reproductibles → Préciser les données de test

**Questions fréquentes :**
- "Combien de tests c'est assez ?" → Dépend du risque, mais viser 80% des cas critiques
- "On teste tout manuellement ?" → Prioriser, automatiser le répétitif
- "Et les tests de perf ?" → Mentionner, mais focus fonctionnel ici

**Tips d'animation :**
- Faire le jeu "trouve le bug" : donner une spec avec un trou, qui le trouve ?
- Montrer des exemples de bugs réels qui auraient été trouvés avec les bonnes techniques
- Faire voter pour le meilleur edge case trouvé

### Variantes possibles

**Niveau débutant (45 min) :**
- Spec simple fournie
- Focus sur happy path + 3-4 edge cases
- Templates pré-remplis

**Niveau avancé (1h30) :**
- Spec complexe avec multiples parcours
- Génération de scripts de test automatisés (Playwright, Cypress)
- Intégration avec un outil de gestion de tests (TestRail)

**Format workshop (2h) :**
- 30 min : Théorie des techniques de test
- 45 min : Génération plan de test
- 30 min : Cross-review en binôme
- 15 min : Amélioration et finalisation

**Duo Dev + QA :**
- Dev fournit la spec
- QA génère le plan avec l'IA
- Discussion sur la testabilité
