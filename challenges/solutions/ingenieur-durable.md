# L'Ingénieur Durable (Architect - Nilo)

## 1. Résolution du Challenge

### Objectif
Concevoir un système d'aide à la décision pour l'ingénierie durable : agents analysant les choix techniques, scorant l'impact environnemental, proposant des alternatives.

### Éléments clés

Ce challenge est de niveau ⭐⭐⭐⭐ (4h).

#### Architecture

```
┌─────────────────────────────────────────────────────────┐
│              SUSTAINABLE ENGINEERING SYSTEM              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Options   │    │   Impact    │    │ Alternative │  │
│  │   Input     │───▶│   Scoring   │───▶│  Generator  │  │
│  │             │    │             │    │             │  │
│  │ • Tech A    │    │ • CO2       │    │ • Suggest   │  │
│  │ • Tech B    │    │ • Eau       │    │ • Compare   │  │
│  │ • Tech C    │    │ • Ressources│    │ • Trade-off │  │
│  └─────────────┘    └─────────────┘    └─────────────┘  │
│                                               │          │
│                                               ▼          │
│  ┌─────────────────────────────────────────────────────┐│
│  │                  DECISION REPORT                     ││
│  │  • Comparatif multi-critères                        ││
│  │  • Recommandation argumentée                        ││
│  │  • Fiche technique de chaque option                 ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### Critères d'évaluation

| Critère | Indicateur | Unité | Source |
|---------|------------|-------|--------|
| Carbone | Empreinte CO2 | kg CO2eq | Base Carbone ADEME |
| Eau | Consommation | L | Footprint Network |
| Ressources | Épuisement | ADP | Ecoinvent |
| Énergie | Consommation | kWh | Mesure directe |
| Toxicité | Impact santé | CTUh | USEtox |
| Recyclabilité | Taux recyclage | % | Analyse composition |

#### Prompt du système de scoring

```
Tu es un ingénieur en éco-conception. Tu évalues les choix techniques selon leur impact environnemental.

## Input
Liste des options techniques à comparer :
[Options avec caractéristiques]

## Critères d'évaluation
Pour chaque option, score de 0-10 sur :
1. Empreinte carbone (10 = très faible)
2. Consommation d'eau (10 = très faible)
3. Durabilité/longévité (10 = très durable)
4. Recyclabilité (10 = 100% recyclable)
5. Énergie d'usage (10 = très sobre)
6. Réparabilité (10 = facilement réparable)

## Output

### Tableau comparatif
| Critère | Option A | Option B | Option C |
|---------|----------|----------|----------|
| Carbone | X/10 | X/10 | X/10 |
| ... | ... | ... | ... |
| **TOTAL** | X/60 | X/60 | X/60 |

### Recommandation
[Option recommandée avec justification]

### Trade-offs
[Ce qu'on sacrifie avec chaque choix]
```

#### Format de rapport de décision

```markdown
# Rapport de Décision Durable
## [Choix technique à faire]

### 1. Contexte
[Description du projet et des contraintes]

### 2. Options évaluées

#### Option A : [Nom]
- **Description** : [...]
- **Coût** : X €
- **Score environnemental** : X/60

| Critère | Score | Justification |
|---------|-------|---------------|
| Carbone | 7/10 | Fabrication locale, peu de transport |
| Eau | 5/10 | Process industriel intensif |
| ... | ... | ... |

#### Option B : [Nom]
[Même structure]

### 3. Analyse comparative
[Graphique radar ou tableau synthétique]

### 4. Recommandation
**Choix recommandé** : Option A

**Justification** :
- Principal avantage : [...]
- Trade-off accepté : [...]
- Conditions de validité : [...]

### 5. Pistes d'amélioration
[Comment réduire encore l'impact de l'option choisie]
```

### Critères de réussite
- Système de scoring multi-critères
- Comparateur d'options fonctionnel
- Rapport d'aide à la décision généré

---

## 2. Animation Dojo (éléments clés)

**Durée** : 4h (workshop Architect)

**Déroulé suggéré** :
- 1h : Théorie ACV et critères d'évaluation
- 1h30 : Construction du système de scoring
- 1h : Génération de rapport sur un cas réel
- 30min : Discussion et partage
