# Think Agent — Structure d'un Challenge

Ce document définit les attributs standards pour décrire un challenge Think Agent.

---

## Échelle de difficulté

| Difficulté | Durée max | Exemple |
|------------|-----------|---------|
| ⭐ | 15 min | Quiz, petit assistant métaprompting |
| ⭐⭐ | 30 min - 1h | Assistant simple, workflow basique |
| ⭐⭐⭐ | 2h | Assistant élaboré, intégration simple |
| ⭐⭐⭐⭐ | 4h | Système multi-étapes, intégrations |
| ⭐⭐⭐⭐⭐ | 8h - 16h | Système complet, multi-agents |

---

## Attributs d'un challenge

### Identité

| Attribut | Type | Obligatoire | Exemple |
|----------|------|-------------|---------|
| **Titre** | Texte | ✅ | "Le Conseiller McKinsey" |
| **Description** | Texte | ✅ | Objectif et contexte du challenge |
| **Niveau** | Explorer \| Crafter \| Architect | ✅ | Crafter |
| **Difficulté** | 1-5 ⭐ | ✅ | ⭐⭐⭐ |
| **Durée estimée** | Texte | ✅ | "2h" |

### Ciblage

| Attribut | Type | Obligatoire | Exemple |
|----------|------|-------------|---------|
| **Marque** | Tous \| Flow \| IT \| Forge \| Shield \| Value \| Fi \| Nilo | ✅ | Flow |
| **Participants** | Solo \| Duo \| Équipe | ✅ | Solo |
| **Prérequis** | Liste | ❌ | "Les Basiques du Prompting" |

### Réalisation

| Attribut | Type | Obligatoire | Exemple |
|----------|------|-------------|---------|
| **Livrables attendus** | Liste | ✅ | Assistant fonctionnel, démo |
| **Outils disponibles** | Liste | ✅ | Chat IA, n8n |
| **Ressources** | Liens | ❌ | Tuto, template |

### Évaluation

| Attribut | Type | Obligatoire | Exemple |
|----------|------|-------------|---------|
| **Type d'évaluation** | Peer review \| Automatique | ✅ | Peer review |
| **Critères d'évaluation** | Liste | ✅ | Qualité, pertinence, UX |

### Récompenses

| Attribut | Type | Obligatoire | Exemple |
|----------|------|-------------|---------|
| **XP** | Points | ✅ | 150 XP |
| **Badge** | Texte | ❌ | 🛠️ "Premier outil créé" |

---

## Boîte à outils eXalt

| Outil | Description | Quand l'utiliser |
|-------|-------------|------------------|
| **Chat IA** | Assistant interne, création d'assistants personnalisés | Prototypage, assistants métier |
| **n8n** | Automatisation low-code | Workflows, intégrations, agents |
| **NotebookLM** | Analyse de documents, Q&A sur corpus | RAG simple, synthèse, podcasts |
| **Gemini** | LLM Google, contexte long | Analyse de gros documents |

---

## Gamification

### Mécanismes d'engagement

| Mécanisme | Description |
|-----------|-------------|
| **XP par challenge** | Points proportionnels à la difficulté |
| **Badges** | Jalons symboliques |
| **Progression de niveau** | X challenges validés → passage de niveau |
| **Duo bonus** | XP bonus si réalisé en binôme |

### Exemples de badges

| Badge | Condition |
|-------|-----------|
| 🌱 Premier Pas | Premier challenge validé |
| 🛠️ Bâtisseur | Premier outil créé (Crafter) |
| 🤝 Binôme | Challenge réalisé en duo |
| 🔥 On Fire | 3 challenges validés en 1 mois |
| 🏆 Explorer Complet | Tous les challenges Explorer validés |
| 🏆 Crafter Complet | Tous les challenges Crafter validés |
| 🏆 Architect Complet | Tous les challenges Architect validés |

---

## Template YAML

```yaml
titre: "Le Conseiller McKinsey"
description: |
  Créer un assistant de conseil stratégique maîtrisant les frameworks McKinsey.
niveau: Crafter
difficulte: 3
duree: "2h"
marque: Tous
participants: Solo
prerequis:
  - "Les Basiques du Prompting"
livrables:
  - Assistant fonctionnel
  - Session de travail documentée
outils:
  - Chat IA
evaluation:
  type: Peer review
  criteres:
    - Maîtrise des frameworks
    - Qualité du questionnement
recompenses:
  xp: 150
```
