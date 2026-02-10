# L'Auditeur FinOps (Architect - Forge)

## 1. Résolution du Challenge

### Objectif
Concevoir un agent "Cost Killer" qui analyse les factures Cloud, détecte les anomalies, identifie les ressources sous-utilisées et génère des recommandations avec ROI.

### Éléments clés

Ce challenge est de niveau ⭐⭐⭐⭐ (4h).

#### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FINOPS AUDITOR                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Collect   │───▶│   Analyze   │───▶│  Recommend  │  │
│  │             │    │             │    │             │  │
│  │ • AWS CUR   │    │ • Trends    │    │ • Actions   │  │
│  │ • GCP Bill  │    │ • Anomalies │    │ • ROI       │  │
│  │ • Azure     │    │ • Unused    │    │ • Priority  │  │
│  └─────────────┘    └─────────────┘    └─────────────┘  │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │                    ALERTS                            ││
│  │  • Spike > 20%                                       ││
│  │  • Unused resources > $100/month                     ││
│  │  • Commitment expiring                               ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### Sources de données

| Cloud | Source | Données |
|-------|--------|---------|
| AWS | Cost and Usage Reports (CUR) | Coûts détaillés par service |
| GCP | BigQuery Export | Billing data |
| Azure | Cost Management API | Usage + costs |

#### Types d'anomalies à détecter

| Type | Détection | Action |
|------|-----------|--------|
| Spike soudain | Coût J > Coût J-7 × 1.5 | Alerte immédiate |
| Ressource inutilisée | CPU < 5% pendant 7 jours | Recommandation arrêt |
| Surdimensionnement | Utilisation < 30% | Recommandation resize |
| Absence de commitment | On-demand > 70% | Recommandation Reserved/Savings Plans |
| Stockage orphelin | EBS/S3 non attaché | Recommandation suppression |

#### Prompt d'analyse FinOps

```
Analyse ces données de coûts Cloud :

[JSON avec données de facturation]

Génère un rapport FinOps avec :

## 1. Vue d'ensemble
- Coût total du mois
- Évolution vs mois précédent
- Top 5 services par coût

## 2. Anomalies détectées
Pour chaque anomalie :
- Type
- Ressource concernée
- Coût mensuel estimé
- Cause probable

## 3. Recommandations
Pour chaque recommandation :
- Action à prendre
- Économie potentielle (€/mois)
- Effort (Facile/Moyen/Complexe)
- ROI (payback en mois)

## 4. Quick Wins
Les 3 actions à faire immédiatement
```

#### Métriques de succès

| Métrique | Définition | Cible |
|----------|------------|-------|
| Waste identified | Ressources inutilisées détectées | > 10% du budget |
| Savings realized | Économies réellement faites | > 50% du waste |
| Coverage | % de ressources avec commitment | > 60% |

### Critères de réussite
- Agent analysant des données de coûts (fictives ou réelles)
- Pipeline de détection d'anomalies
- Rapport avec recommandations chiffrées

---

## 2. Animation Dojo (éléments clés)

**Durée** : 4h (workshop Architect)

**Déroulé suggéré** :
- 1h : Théorie FinOps + métriques clés
- 1h : Setup pipeline d'analyse
- 1h : Détection anomalies et recommandations
- 1h : Rapport et calcul de ROI
