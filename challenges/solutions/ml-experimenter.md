# Le ML Experimenter (Value)

## 1. Résolution du Challenge

### Objectif
Créer un assistant de prototypage ML : approches, code d'expérimentation, documentation des hypothèses, interprétation des résultats.

### Éléments clés

Ce challenge est de niveau ⭐⭐⭐ (4h), voici les éléments essentiels :

#### Workflow d'expérimentation ML

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  Problème   │───▶│  Hypothèse   │───▶│  Expérience │
│  Business   │    │  (approche)  │    │  (code)     │
└─────────────┘    └──────────────┘    └─────────────┘
                                              │
      ┌───────────────────────────────────────┘
      ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  Résultats  │───▶│ Interprétation───▶│  Décision   │
│  (métriques)│    │  (insights)  │    │  (next)     │
└─────────────┘    └──────────────┘    └─────────────┘
```

#### Prompt système (éléments clés)

```
Tu es un ML Engineer/Data Scientist senior. Tu guides les expérimentations ML de manière structurée.

## Ton processus

### 1. Cadrage
- Quel est le problème business ?
- Quel type de ML ? (classification, régression, clustering, NLP...)
- Quelles données disponibles ?
- Quelle métrique de succès ?

### 2. Hypothèses
- Quelles approches tester ?
- Pourquoi cette approche pour ce problème ?
- Baseline à battre ?

### 3. Expérimentation
- Code propre et reproductible
- Logging des hyperparamètres
- Versioning des expériences

### 4. Interprétation
- Feature importance
- Analyse des erreurs
- Limites du modèle

## Format de documentation

# Experiment Log

## Contexte
- **Problème** : [Description]
- **Données** : [Sources, taille, période]
- **Métrique** : [Métrique principale + seuil de succès]

## Expérience #N
- **Hypothèse** : [Ce qu'on teste]
- **Approche** : [Modèle, features, hyperparams]
- **Résultat** : [Métriques obtenues]
- **Analyse** : [Pourquoi ce résultat]
- **Next** : [Prochaine expérience]
```

#### Technologies à mentionner

| Outil | Usage |
|-------|-------|
| **MLflow** | Tracking expériences |
| **Weights & Biases** | Visualisation, collaboration |
| **Jupyter** | Prototypage |
| **Scikit-learn** | Modèles classiques |
| **XGBoost/LightGBM** | Gradient boosting |

### Critères de réussite
- Assistant guidant les expérimentations
- Notebook documenté avec hypothèses et résultats
- Interprétabilité des modèles

---

## 2. Animation Dojo (éléments clés)

**Durée** : 4h (workshop format long)

**Déroulé suggéré** :
- 45min : Théorie du workflow d'expérimentation
- 1h30 : Setup + première expérience guidée
- 1h : Itérations et comparaisons
- 45min : Documentation et interprétation
