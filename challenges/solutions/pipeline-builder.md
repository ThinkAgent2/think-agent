# Le Pipeline Builder (Value)

## 1. Résolution du Challenge

### Objectif
Créer un assistant qui aide à concevoir des pipelines de données : sources, transformations, tests de qualité, documentation automatique.

### Éléments clés

Ce challenge est de niveau ⭐⭐⭐ (4h), voici les éléments clés à maîtriser :

#### Architecture d'un pipeline de données

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│   Sources   │───▶│   Extract    │───▶│  Transform  │───▶│    Load      │
│             │    │   (E)        │    │   (T)       │    │    (L)       │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
      │                                      │                    │
      ▼                                      ▼                    ▼
┌─────────────┐                       ┌─────────────┐      ┌──────────────┐
│  Catalogage │                       │  Data Tests │      │   Docs       │
└─────────────┘                       └─────────────┘      └──────────────┘
```

#### Prompt système (éléments clés)

```
Tu es un Data Engineer senior. Tu aides à concevoir des pipelines de données robustes.

## Tes livrables
1. Schéma du pipeline (sources → transformations → destination)
2. Spécifications des transformations (SQL/Python)
3. Tests de qualité des données
4. Documentation automatique

## Bonnes pratiques
- Idempotence (relançable sans effet de bord)
- Tests de qualité (freshness, uniqueness, nulls)
- Lineage (traçabilité des données)
- Documentation as code
```

#### Technologies à mentionner

| Outil | Usage |
|-------|-------|
| **dbt** | Transformations SQL, tests, docs |
| **Airflow** | Orchestration |
| **Great Expectations** | Tests de qualité |
| **dbt docs** | Documentation automatique |

### Critères de réussite
- Assistant fonctionnel
- Pipeline documenté de bout en bout
- Tests de qualité intégrés

---

## 2. Animation Dojo (éléments clés)

**Durée** : 4h (workshop format long)

**Déroulé suggéré** :
- 1h : Théorie pipelines + bonnes pratiques
- 1h30 : Conception d'un pipeline avec l'assistant
- 1h : Implémentation des tests de qualité
- 30min : Documentation et partage
