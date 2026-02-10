# Automated Platform Manager (Architect)

## 1. Résolution du Challenge

### Objectif
Créer un système autonome de pilotage de plateforme : acquisition, onboarding, engagement, rétention.

### Éléments clés

Ce challenge est de niveau ⭐⭐⭐⭐ (4h), voici les concepts essentiels :

#### Architecture du système

```
┌─────────────────────────────────────────────────────────┐
│                  PLATFORM MANAGER                        │
├─────────────┬─────────────┬─────────────┬───────────────┤
│ Acquisition │  Onboarding │ Engagement  │  Rétention    │
│             │             │             │               │
│ • Landing   │ • Welcome   │ • Usage     │ • Churn       │
│ • Signup    │ • Tutorial  │ • Features  │ • Win-back    │
│ • Activation│ • First     │ • Community │ • Feedback    │
│             │   value     │             │               │
└─────────────┴─────────────┴─────────────┴───────────────┘
         │             │             │             │
         ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────┐
│                    AUTOMATION ENGINE                     │
│  • Triggers (événements)                                 │
│  • Actions (emails, notifications, tasks)                │
│  • Rules (si X alors Y)                                  │
│  • Monitoring (métriques, alertes)                       │
└─────────────────────────────────────────────────────────┘
```

#### Workflows à automatiser

| Phase | Trigger | Action | Outil |
|-------|---------|--------|-------|
| Acquisition | Visite > 3 pages | Popup inscription | n8n + Website |
| Onboarding | Signup | Email bienvenue + séquence | n8n + Mailchimp |
| Activation | 0 action après 24h | Email rappel + notification | n8n + Push |
| Engagement | Feature non utilisée | Tutorial ciblé | n8n + In-app |
| Rétention | Inactivité 7 jours | Email win-back | n8n + Mailchimp |

#### Métriques à monitorer

- **Acquisition** : Conversion visiteur → signup
- **Activation** : Time to first value
- **Engagement** : DAU/MAU, features used
- **Rétention** : Churn rate, NPS
- **Revenue** : MRR, LTV, CAC

### Structure du livrable

```
📁 Platform Manager
├── workflows/
│   ├── acquisition.json (n8n)
│   ├── onboarding.json
│   ├── engagement.json
│   └── retention.json
├── dashboards/
│   └── metrics.md (Notion/Airtable)
└── documentation/
    └── rules.md (logique métier)
```

### Critères de réussite
- Système de workflows n8n interconnectés
- Dashboard de suivi des métriques
- Documentation des règles d'automatisation

---

## 2. Animation Dojo (éléments clés)

**Durée** : 4h (workshop Architect)

**Déroulé suggéré** :
- 1h : Théorie AARRR et automatisation plateforme
- 1h30 : Construction des workflows principaux
- 1h : Mise en place du dashboard
- 30min : Documentation et partage
