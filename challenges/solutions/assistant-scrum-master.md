# Assistant Scrum Master (Flow)

## 1. Résolution du Challenge

### Objectif
Créer un assistant connecté à JIRA qui analyse la performance d'équipe (vélocité, blocages, patterns).

### Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   JIRA      │───▶│   n8n        │───▶│   Analyse   │
│   (API)     │    │   (extract)  │    │   (LLM)     │
└─────────────┘    └──────────────┘    └─────────────┘
                                              │
                                              ▼
                                       ┌─────────────┐
                                       │   Rapport   │
                                       │   Sprint    │
                                       └─────────────┘
```

### Données à extraire de JIRA

| Donnée | Endpoint API | Usage |
|--------|--------------|-------|
| Sprints | `/rest/agile/1.0/board/{id}/sprint` | Liste des sprints |
| Issues du sprint | `/rest/agile/1.0/sprint/{id}/issue` | Tickets du sprint |
| Vélocité | Calcul (story points done) | Tendance |
| Burndown | `/rest/agile/1.0/sprint/{id}/burndown` | Progression |
| Changelog | `/rest/api/3/issue/{id}/changelog` | Historique des changements |

### Prompt système de l'assistant

```
Tu es un Scrum Master analytique qui aide les équipes à s'améliorer en analysant leurs données sprint.

## Tes analyses

### 1. Vélocité
- Vélocité du sprint (story points terminés)
- Tendance sur les 5 derniers sprints
- Écart vs engagement initial

### 2. Flux de travail
- Temps moyen par statut
- Tickets bloqués > 2 jours
- Pattern de changement de scope

### 3. Qualité
- Bugs introduits pendant le sprint
- Ratio bugs/features
- Tickets réouverts

### 4. Prédictibilité
- % d'engagement tenu
- Corrélation estimation/réel
- Tendance de surestimation/sous-estimation

## Format de rapport

```markdown
# Rapport Sprint [Nom]

## 📊 Vue d'ensemble
| Métrique | Valeur | Tendance |
|----------|--------|----------|
| Vélocité | X pts | ↗️ +10% |
| Engagement tenu | X% | → Stable |
| Bugs | X | ↘️ -2 |

## ✅ Ce qui a bien fonctionné
- [Point positif 1]
- [Point positif 2]

## ⚠️ Points d'attention
- [Alerte 1]
- [Alerte 2]

## 🎯 Recommandations pour le prochain sprint
1. [Recommandation actionnable]
2. [Recommandation actionnable]

## 📈 Tendances sur 5 sprints
[Graphique ou tableau de tendance]
```

Commence par : "Donne-moi les données de ton sprint (ou connecte-moi à JIRA)."
```

### Workflow n8n

```json
{
  "nodes": [
    {
      "name": "Trigger: Fin de sprint",
      "type": "n8n-nodes-base.scheduleTrigger"
    },
    {
      "name": "Get Sprint Data",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://[instance].atlassian.net/rest/agile/1.0/sprint/{{$json.sprintId}}/issue",
        "authentication": "genericCredentialType"
      }
    },
    {
      "name": "Calculate Metrics",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// Calcul vélocité, ratio, etc."
      }
    },
    {
      "name": "Analyze with AI",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "parameters": {
        "prompt": "Analyse ces données sprint..."
      }
    },
    {
      "name": "Post to Slack",
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "channel": "#scrum-team"
      }
    }
  ]
}
```

### Métriques calculées

```javascript
// Vélocité
const velocity = issues
  .filter(i => i.fields.status.name === 'Done')
  .reduce((sum, i) => sum + (i.fields.customfield_storypoints || 0), 0);

// Engagement tenu
const committed = issues.length;
const completed = issues.filter(i => i.fields.status.name === 'Done').length;
const commitmentRate = (completed / committed) * 100;

// Scope change
const addedDuringSprint = issues.filter(i => {
  const created = new Date(i.fields.created);
  return created > sprintStart;
}).length;
```

### Critères de réussite
- Assistant connecté à JIRA (ou mockup de données)
- Rapport d'analyse généré
- Insights actionnables pour l'équipe

---

## 2. Animation Dojo Challenge (1h)

### Déroulé

| Temps | Activité | Description |
|-------|----------|-------------|
| 0-10 | Intro métriques | Présenter les KPIs Scrum clés |
| 10-20 | Démo JIRA API | Montrer comment extraire les données |
| 20-40 | Construction | Créer le workflow ou utiliser des données mockées |
| 40-55 | Analyse | Générer et interpréter le rapport |
| 55-60 | Discussion | Comment utiliser ces insights en rétro |

### Alternative sans accès JIRA
- Fournir un jeu de données fictif (JSON)
- Focus sur l'analyse et les insights
