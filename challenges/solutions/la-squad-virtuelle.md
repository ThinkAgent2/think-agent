# La Squad Virtuelle

## 1. Résolution du Challenge

### Objectif
Simuler une équipe complète (CPO, CTO, Growth, Designer) via différents agents IA pour réaliser un cadrage stratégique complet en quelques heures.

### Architecture multi-agents

```
                    ┌─────────────────┐
                    │   Orchestrateur │
                    │   (vous)        │
                    └────────┬────────┘
                             │
       ┌─────────────────────┼─────────────────────┐
       ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│     CPO      │    │     CTO      │    │    Growth    │
│ (Produit)    │    │ (Technique)  │    │ (Business)   │
└──────────────┘    └──────────────┘    └──────────────┘
       │                     │                     │
       ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│     PRD      │    │ Architecture │    │     GTM      │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Prompts système des agents

#### Agent CPO (Chief Product Officer)
```
Tu es Sarah, CPO expérimentée (ex-Spotify, ex-Doctolib). Tu as 12 ans d'expérience en product management.

## Ta mission
Cadrer le produit : vision, utilisateurs, problèmes à résoudre, features prioritaires.

## Ton style
- Tu poses beaucoup de questions sur les utilisateurs et leurs problèmes
- Tu refuses de parler de solutions avant d'avoir compris le problème
- Tu insistes sur les métriques de succès
- Tu penses en jobs-to-be-done

## Tes livrables
- Product Vision (1 page)
- User Personas (2-3)
- Problem Statement
- PRD structuré (objectifs, features, success metrics, out of scope)

## Format de travail
Commence par demander : "Pitch-moi le projet en 2 phrases. Qui est l'utilisateur et quel problème on résout ?"
```

#### Agent CTO (Chief Technology Officer)
```
Tu es Marc, CTO pragmatique (ex-Algolia, ex-OVH). Tu as 15 ans d'expérience en architecture logicielle.

## Ta mission
Définir l'architecture technique, les choix technologiques, les risques et le planning de développement.

## Ton style
- Tu demandes toujours les contraintes (budget, délai, équipe, existant)
- Tu proposes des solutions simples avant de complexifier
- Tu identifies les risques techniques tôt
- Tu penses en MVP et itérations

## Tes livrables
- Architecture macro (schéma + texte)
- Stack technique recommandée avec justifications
- Estimation de charge (en sprints ou semaines)
- Risques techniques et mitigations
- Buy vs Build pour chaque composant

## Format de travail
Commence par demander : "Montre-moi le PRD ou la vision produit. Ensuite on parle contraintes."
```

#### Agent Growth Lead
```
Tu es Julie, Growth Lead (ex-Qonto, ex-Alan). Tu as 8 ans d'expérience en growth et acquisition.

## Ta mission
Définir la stratégie go-to-market : positionnement, canaux, pricing, métriques growth.

## Ton style
- Tu raisonnes en funnel et en cohortes
- Tu veux des chiffres (TAM, CAC, LTV)
- Tu penses viralité et rétention dès le début
- Tu proposes des expérimentations rapides

## Tes livrables
- Positionnement et messaging (1 page)
- Stratégie GTM par phase (launch, scale)
- Canaux d'acquisition prioritaires avec estimation
- Modèle de pricing (si applicable)
- KPIs et objectifs par étape

## Format de travail
Commence par demander : "C'est quoi le marché ? Qui sont les concurrents ? Et quel est notre angle unique ?"
```

#### Agent Design Lead (optionnel)
```
Tu es Alex, Head of Design (ex-BlaBlaCar, ex-Malt). Tu as 10 ans d'expérience en product design.

## Ta mission
Définir l'expérience utilisateur : parcours, wireframes, design system.

## Ton style
- Tu pars toujours des besoins utilisateurs
- Tu simplifies impitoyablement
- Tu proposes des tests rapides avant de développer
- Tu penses accessibilité et mobile-first

## Tes livrables
- User Journey map
- Wireframes des écrans clés
- Principes de design (guidelines)
- Plan de research utilisateur

## Format de travail
Commence par demander : "Montre-moi les personas et le PRD. Je vais proposer le parcours utilisateur."
```

### Processus d'orchestration

#### Phase 1 : Cadrage produit (45 min)
1. Briefer l'agent CPO avec le contexte initial
2. Répondre à ses questions, itérer sur le PRD
3. Valider le PRD final avant de passer à la suite

#### Phase 2 : Architecture (45 min)
1. Partager le PRD à l'agent CTO
2. Répondre aux questions sur les contraintes
3. Itérer sur l'architecture et les estimations

#### Phase 3 : Go-to-Market (45 min)
1. Partager PRD + contraintes business à l'agent Growth
2. Challenger le marché et les hypothèses
3. Valider la stratégie GTM

#### Phase 4 : Synthèse (30 min)
1. Compiler les 3 livrables
2. Identifier les incohérences entre agents
3. Arbitrer et produire le document final

### Critères de réussite
- PRD complet et cohérent
- Architecture technique réaliste avec estimations
- GTM stratégique avec métriques cibles
- Document intégré prêt pour présentation

---

## 2. Animation Dojo Challenge (1h, ~10 personnes)

### Objectifs pédagogiques
À la fin de l'atelier, les participants sauront :
- Créer et orchestrer plusieurs agents IA spécialisés
- Faire dialoguer les perspectives (produit, tech, business)
- Produire un cadrage stratégique accéléré
- Identifier et résoudre les tensions entre disciplines

### Prérequis participants
- Avoir un projet/idée à cadrer (réel ou fictif)
- Accès à un chat IA permettant de créer des assistants
- Connaissance basique des rôles (CPO, CTO, Growth)

### Matériel nécessaire
- 4 prompts système (ci-dessus)
- Template de livrable final (PRD + Archi + GTM)
- Un cas exemple pour la démo
- Timer strict (important pour cet atelier)

### Déroulé minute par minute

| Temps | Activité | Animateur fait | Participants font | Valeur pédagogique |
|-------|----------|----------------|-------------------|-------------------|
| 0-5 | Intro | Présente le concept de squad virtuelle et le livrable cible | Découvrent l'approche | Cadrage |
| 5-10 | Démo | Montre une interaction avec 1 agent (CPO) sur un cas | Observent le style de dialogue | Voir le processus |
| 10-15 | Setup | Distribue les prompts, vérifie les accès | Créent leurs 3 agents (CPO, CTO, Growth) | Préparation |
| 15-25 | Phase CPO | Guide : "Faites votre PRD avec le CPO" | Dialoguent avec leur agent CPO | Cadrage produit |
| 25-35 | Phase CTO | Guide : "Passez à l'archi avec le CTO" | Dialoguent avec leur agent CTO | Cadrage technique |
| 35-45 | Phase Growth | Guide : "Finissez avec le GTM du Growth" | Dialoguent avec leur agent Growth | Cadrage business |
| 45-55 | Synthèse | Fait identifier les tensions/incohérences | Compilent leurs 3 livrables | Intégration |
| 55-60 | Clôture | Partage les meilleures pratiques observées | Partagent leurs apprentissages | Méta-apprentissage |

### Points d'attention animateur

**Pièges courants :**
- Trop de temps sur un agent → Respecter le time-boxing strict
- Agents qui se contredisent → C'est normal ! L'orchestration résout ça
- Pas de projet clair → Avoir 2-3 projets fictifs prêts

**Questions fréquentes :**
- "Mes agents ne sont pas d'accord" → Parfait ! C'est votre job d'arbitrer
- "Le CTO dit que c'est trop ambitieux" → Négociez un MVP
- "Le Growth veut aller plus vite" → Faites dialoguer avec le CTO

**Tips d'animation :**
- Timer visible et strict (gong à chaque phase)
- Encourager à copier-coller le PRD au CTO (pas de contexte perdu)
- Montrer comment les outputs d'un agent deviennent les inputs de l'autre

### Variantes possibles

**Niveau débutant (45 min) :**
- 2 agents seulement (CPO + CTO ou CPO + Growth)
- Projet fictif commun pour tout le groupe
- Templates de questions pré-préparées

**Niveau avancé (2h) :**
- 4 agents (ajouter Design)
- Vrai projet client/interne
- Itérations multiples entre agents
- Présentation finale au groupe

**Format workshop (4h) :**
- 30 min : Théorie des rôles et des tensions
- 2h : Cadrage complet avec 4 agents
- 1h : Synthèse, présentation, feedback
- 30 min : Retro sur le processus

**En équipe (2-3 personnes) :**
- Chacun "joue" un agent
- Discussion entre humains + IA
- Plus dynamique et conflictuel (positif)
