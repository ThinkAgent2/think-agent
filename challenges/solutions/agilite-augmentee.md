# L'Agilité Augmentée (Architect - Flow)

## 1. Résolution du Challenge

### Objectif
Créer un système d'amélioration continue autonome : analyse des rétros, détection des patterns récurrents, proposition d'actions, suivi d'implémentation.

### Éléments clés

Ce challenge est de niveau ⭐⭐⭐⭐ (4h).

#### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 CONTINUOUS IMPROVEMENT SYSTEM            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Collect   │───▶│   Analyze   │───▶│   Recommend │  │
│  │             │    │             │    │             │  │
│  │ • Rétros    │    │ • Patterns  │    │ • Actions   │  │
│  │ • Sprints   │    │ • Trends    │    │ • Priority  │  │
│  │ • Incidents │    │ • Root cause│    │ • Owner     │  │
│  └─────────────┘    └─────────────┘    └─────────────┘  │
│         │                                      │         │
│         ▼                                      ▼         │
│  ┌─────────────┐                      ┌─────────────┐   │
│  │   Monitor   │◀─────────────────────│   Execute   │   │
│  │             │                      │             │   │
│  │ • Métriques │                      │ • Tasks     │   │
│  │ • Alertes   │                      │ • Follow-up │   │
│  └─────────────┘                      └─────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### Sources de données

| Source | Données | Outil |
|--------|---------|-------|
| JIRA | Sprints, vélocité, bugs | API JIRA |
| Confluence | Rétros, ADRs | API Confluence |
| Slack | Discussions, incidents | API Slack |
| Git | Commits, PRs, cycle time | API GitHub/GitLab |

#### Patterns à détecter

**Patterns récurrents :**
- "On manque de temps pour les tests" → Apparaît dans 3 rétros consécutives
- "Les specs arrivent trop tard" → Mentionné par 4 personnes différentes
- "Trop de context switching" → Corrélé avec baisse de vélocité

**Corrélations :**
- Vélocité ↓ quand scope change > 20%
- Bugs ↑ quand pas de code review
- Satisfaction ↓ quand rétros non suivies d'actions

#### Prompt d'analyse longitudinale

```
Analyse ces données de rétros et métriques des 6 derniers sprints.

Données :
[JSON avec rétros + métriques]

Identifie :
1. Les 3 patterns récurrents les plus fréquents
2. Les corrélations entre métriques et problèmes
3. Les actions proposées mais jamais implémentées
4. Les "victoires" (actions qui ont marché)

Pour chaque pattern, propose :
- Une action concrète
- Un owner suggéré
- Une métrique de succès
- Un délai réaliste
```

### Livrables

```
📁 Continuous Improvement
├── data/
│   ├── retros.json (historique des rétros)
│   └── metrics.json (vélocité, bugs, etc.)
├── analysis/
│   ├── patterns.md (patterns identifiés)
│   └── correlations.md (liens métriques/problèmes)
├── actions/
│   └── backlog.md (actions priorisées)
└── dashboard/
    └── improvement-board.md (suivi)
```

### Critères de réussite
- Agent connecté aux sources de données
- Analyse longitudinale fonctionnelle
- Recommandations actionnables avec suivi

---

## 2. Animation Dojo (éléments clés)

**Durée** : 4h (workshop Architect)

**Déroulé suggéré** :
- 1h : Théorie amélioration continue + patterns
- 1h : Extraction et structuration des données
- 1h30 : Analyse et détection de patterns
- 30min : Mise en place du suivi
