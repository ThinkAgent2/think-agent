# PRD Manager (Flow)

## 1. Résolution du Challenge

### Objectif
Créer un assistant qui interviewe les parties prenantes et rédige le PRD (Product Requirements Document) complet.

### Prompt système de l'assistant

```
Tu es un Product Manager senior avec 10 ans d'expérience chez des scale-ups tech (Datadog, Notion, Figma). Tu excelles dans l'art de transformer des besoins flous en spécifications actionables.

## Ta mission
Mener un entretien structuré pour extraire toutes les informations nécessaires à la rédaction d'un PRD complet et professionnel.

## Structure du PRD que tu produiras :

### 1. Overview
- **Titre du produit/feature**
- **Date & Version**
- **Auteur & Stakeholders**
- **Statut** (Draft / In Review / Approved)

### 2. Problem Statement
- Quel problème résolvons-nous ?
- Pour qui ? (persona cible)
- Pourquoi maintenant ? (contexte, urgence)
- Que se passe-t-il si on ne fait rien ?

### 3. Goals & Success Metrics
- **Objectif business** (impact attendu)
- **Objectifs utilisateur** (jobs-to-be-done)
- **KPIs de succès** (métriques quantifiées)
- **Anti-goals** (ce qu'on ne cherche PAS à faire)

### 4. User Stories & Use Cases
- User stories au format : "En tant que [persona], je veux [action] afin de [bénéfice]"
- Cas d'usage principaux avec scénarios
- Edge cases identifiés

### 5. Requirements
- **Must Have (P0)** : Fonctionnalités indispensables au MVP
- **Should Have (P1)** : Important mais pas bloquant
- **Nice to Have (P2)** : Si on a le temps/budget
- **Out of Scope** : Ce qu'on ne fera PAS (explicite)

### 6. Design & UX
- Wireframes ou maquettes (références ou à créer)
- Parcours utilisateur principal
- Points d'attention UX

### 7. Technical Considerations
- Contraintes techniques connues
- Dépendances (APIs, systèmes, équipes)
- Questions ouvertes pour l'équipe tech

### 8. Timeline & Milestones
- Planning macro (phases, jalons)
- Date de lancement cible
- Dépendances critiques

### 9. Risks & Mitigations
- Risques identifiés (produit, tech, business)
- Probabilité et impact
- Actions de mitigation

### 10. Open Questions
- Questions non résolues à ce stade
- Décisions en attente
- Points à valider avec d'autres équipes

---

## Ton processus d'interview

### Phase 1 : Contexte (5 min)
- C'est quoi le projet en une phrase ?
- Qui demande ça et pourquoi maintenant ?
- Quel est le contexte (nouveau produit, évolution, refonte) ?

### Phase 2 : Problème (10 min)
- Quel problème résout-on ?
- Pour qui exactement ? Décris-moi l'utilisateur type.
- Comment il fait aujourd'hui sans cette feature ?
- Qu'est-ce qui fait mal ? (pain points)

### Phase 3 : Solution (10 min)
- Quelle est la vision de la solution ?
- Quelles sont les features clés ?
- Qu'est-ce qui est indispensable pour le MVP ?
- Qu'est-ce qui est explicitement hors scope ?

### Phase 4 : Succès (5 min)
- Comment on saura qu'on a réussi ?
- Quels sont les objectifs chiffrés ?
- Quels sont les risques majeurs ?

### Phase 5 : Contraintes (5 min)
- Quelles sont les contraintes (délai, budget, tech) ?
- Quelles sont les dépendances ?
- Questions ouvertes ?

---

## Ton style
- Une question à la fois, claire et directe
- Tu reformules pour confirmer ta compréhension
- Tu challenges les "évidences" (pourquoi ça ?)
- Tu proposes des exemples quand l'interlocuteur hésite
- Tu n'acceptes pas les réponses vagues sur les métriques

Commence par : "Salut ! Je vais t'aider à construire un PRD solide. Pour commencer : c'est quoi le projet en une phrase, et qui le demande ?"
```

### Exemple de PRD généré

```markdown
# PRD : Chatbot Support Client - v1.0

## 1. Overview
| Attribut | Valeur |
|----------|--------|
| Titre | Chatbot IA Support Client |
| Date | 2024-01-15 |
| Auteur | Marie Dupont (PM) |
| Stakeholders | Jean Martin (CPO), Sophie Tech (Lead Dev), Claire Service (Dir. Support) |
| Statut | Draft |

## 2. Problem Statement

**Problème :**
Notre équipe support traite 2000 tickets/mois dont 60% sont des questions répétitives (suivi commande, mot de passe, horaires). Temps de réponse moyen : 4h. NPS Support : 42.

**Pour qui :**
Clients e-commerce qui ont une question simple et veulent une réponse immédiate.

**Pourquoi maintenant :**
- Pic de charge prévu (+80% sur les fêtes)
- Budget recrutement support gelé
- Concurrents ont lancé des chatbots appréciés

**Si on ne fait rien :**
Dégradation du NPS, perte de clients, équipe support en burn-out.

## 3. Goals & Success Metrics

| Type | Objectif | Métrique | Target |
|------|----------|----------|--------|
| Business | Réduire la charge support | % tickets traités par chatbot | 40% |
| Utilisateur | Réponse instantanée | Temps de réponse moyen | < 30 sec |
| Qualité | Satisfaction | CSAT chatbot | > 4/5 |

**Anti-goals :**
- Pas de gestion des réclamations complexes
- Pas de remboursements automatiques
- Pas d'accès aux données personnelles sensibles

[... suite du PRD ...]
```

### Critères de réussite
- Assistant fonctionnel qui mène l'interview complète
- PRD généré couvrant les 10 sections
- Utilisable en l'état par une équipe produit

---

## 2. Animation Dojo Challenge (1h, ~10 personnes)

### Objectifs pédagogiques
À la fin de l'atelier, les participants sauront :
- Structurer un PRD professionnel (10 sections clés)
- Mener un entretien de discovery efficace
- Distinguer Must Have / Should Have / Nice to Have
- Définir des métriques de succès SMART

### Prérequis participants
- Avoir un projet/feature en tête à spécifier
- Accès à un chat IA
- Connaissance basique du rôle de PM (pas obligatoire)

### Matériel nécessaire
- Prompt système (ci-dessus)
- Template PRD vide (pour comparaison)
- Exemple de PRD complété
- Checklist qualité PRD

### Déroulé minute par minute

| Temps | Activité | Animateur fait | Participants font | Valeur pédagogique |
|-------|----------|----------------|-------------------|-------------------|
| 0-5 | Intro | Présente la structure d'un bon PRD, pourquoi c'est critique | Découvrent le template | Cadrage |
| 5-10 | Démo | Fait une interview de 5 min avec l'assistant | Observent les questions | Voir le processus |
| 10-15 | Setup | Distribue le prompt, vérifie les accès | Configurent leur assistant | Préparation |
| 15-35 | Génération | Circule, aide sur les questions difficiles | Font leur interview, génèrent leur PRD | Production |
| 35-45 | Review qualité | Distribue la checklist qualité | Auto-évaluent leur PRD | Qualité |
| 45-55 | Partage | Fait présenter 2 PRDs au groupe | Écoutent, commentent | Benchmarking |
| 55-60 | Clôture | Donne les tips pour adapter à son contexte | Notent les adaptations | Autonomie |

### Points d'attention animateur

**Pièges courants :**
- PRD trop vague → Insister sur les métriques concrètes
- Confusion Must Have / Nice to Have → Faire prioriser vraiment
- Projet confidentiel → Rappeler de masquer les infos sensibles

**Questions fréquentes :**
- "Je n'ai pas toutes les réponses" → Normal ! Le PRD fait ressortir les questions ouvertes
- "C'est trop long" → Adapter selon le contexte (MVP = PRD léger)
- "Mon équipe utilise un autre template" → Mapper les sections

**Tips d'animation :**
- Avoir des exemples de PRDs réels (anonymisés)
- Montrer un "mauvais" PRD vs un bon PRD
- Challenge : le PRD est-il assez clair pour qu'un dev commence ?

### Variantes possibles

**Niveau débutant (45 min) :**
- PRD simplifié (5 sections)
- Projet fictif commun
- Interview guidée par l'animateur

**Niveau avancé (1h30) :**
- PRD complet + wireframes
- Cross-review par un autre PM
- Présentation au groupe comme à un COMEX

**Format workshop (2h) :**
- 30 min : Théorie du bon PRD
- 45 min : Génération individuelle
- 30 min : Review croisée structurée
- 15 min : Itération

**En équipe :**
- PM génère le PRD
- Dev challenge la section technique
- Designer challenge la section UX
