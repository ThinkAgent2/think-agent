# Le Product System (Architect - Flow)

## 1. Résolution du Challenge

### Objectif
Concevoir un système autonome de Product Discovery : orchestration d'agents pour mener des interviews, synthétiser les insights, alimenter un backlog et prioriser automatiquement.

### Éléments clés

Ce challenge est de niveau ⭐⭐⭐⭐ (4h).

#### Architecture multi-agents

```
┌─────────────────────────────────────────────────────────┐
│                   PRODUCT SYSTEM                         │
├─────────────┬─────────────┬─────────────┬───────────────┤
│  Agent      │   Agent     │   Agent     │   Agent       │
│  Researcher │   Analyst   │   PM        │   Prioritizer │
│             │             │             │               │
│  • Mène les │  • Synthèse │  • Backlog  │  • Score      │
│    interviews│    insights │    stories  │    RICE/WSJF  │
│  • Capture  │  • Patterns │  • Specs    │  • Ranking    │
│    verbatims │  • Personas │             │               │
└─────────────┴─────────────┴─────────────┴───────────────┘
         │             │             │             │
         ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────┐
│                   KNOWLEDGE BASE                         │
│  • Interviews (transcripts, summaries)                   │
│  • Insights (themes, opportunities)                      │
│  • Backlog (stories, priorities)                         │
│  • Decisions (what we did and why)                       │
└─────────────────────────────────────────────────────────┘
```

#### Agents et leurs rôles

| Agent | Inputs | Outputs | Outils |
|-------|--------|---------|--------|
| Researcher | Transcripts d'interview | Synthèses structurées | NotebookLM, Claude |
| Analyst | Synthèses | Themes, Insights, Opportunities | Chat IA |
| PM | Insights | User Stories, Specs | Assistant PRD |
| Prioritizer | Stories | Backlog priorisé | Scoring RICE/WSJF |

#### Workflow orchestré

```
1. INPUT: Transcript d'interview
   ↓
2. RESEARCHER: Synthèse + extraction verbatims clés
   ↓
3. ANALYST: Identification patterns (si N synthèses)
   ↓
4. PM: Génération user stories
   ↓
5. PRIORITIZER: Scoring et ranking
   ↓
6. OUTPUT: Backlog priorisé dans Notion/JIRA
```

### Dashboard de priorisation

```markdown
| Story | Reach | Impact | Confidence | Effort | RICE Score |
|-------|-------|--------|------------|--------|------------|
| [Story 1] | 1000 | 3 | 80% | 2 | 1200 |
| [Story 2] | 500 | 2 | 90% | 1 | 900 |
```

**RICE = (Reach × Impact × Confidence) / Effort**

### Critères de réussite
- Système multi-agents fonctionnel
- Backlog généré automatiquement
- Dashboard de priorisation

---

## 2. Animation Dojo (éléments clés)

**Durée** : 4h (workshop Architect)

**Déroulé suggéré** :
- 1h : Théorie Product Discovery + architecture
- 1h30 : Setup des agents et workflow
- 1h : Test avec données réelles/fictives
- 30min : Dashboard et documentation
