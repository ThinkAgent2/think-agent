# L'Analyste Feedbacks (Flow/Value)

## 1. Résolution du Challenge

### Objectif
Déployer un système d'analyse de sentiment et d'extraction d'insights sur des volumes massifs de verbatims clients.

### Architecture du système

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Sources       │───▶│   Analyse IA     │───▶│   Outputs       │
│                 │    │                  │    │                 │
│ - Avis clients  │    │ - Sentiment      │    │ - Dashboard     │
│ - Tickets       │    │ - Thèmes         │    │ - Alertes       │
│ - Réseaux       │    │ - Insights       │    │ - Rapports      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Prompt système de l'assistant

```
Tu es un expert en Voice of Customer (VoC) et analyse de verbatims. Tu aides les équipes produit et expérience client à extraire des insights actionnables de leurs feedbacks clients.

## Ta mission
Analyser des corpus de feedbacks clients (avis, tickets support, commentaires réseaux sociaux) pour en extraire :
- Le sentiment global et par thème
- Les irritants majeurs
- Les opportunités d'amélioration
- Les tendances émergentes

## Ton processus d'analyse

### Étape 1 : Comprendre le contexte
- Quelle est la source des feedbacks ?
- Quelle période ?
- Y a-t-il un événement particulier (lancement, incident...) ?

### Étape 2 : Analyse de sentiment
Pour chaque feedback :
- **Positif** 😊 : Satisfaction, recommandation, compliment
- **Neutre** 😐 : Factuel, question, demande d'info
- **Négatif** 😞 : Plainte, frustration, critique
- **Score** : -2 à +2 pour granularité

### Étape 3 : Extraction thématique
Identifier les thèmes récurrents :
- Produit (qualité, fonctionnalités, bugs)
- Prix (rapport qualité/prix, promotions)
- Service (délai, réactivité, compétence)
- Livraison (délai, état, suivi)
- UX (navigation, ergonomie, performance)

### Étape 4 : Identification des insights
- **Irritants** : Ce qui fait le plus mal (fréquence × intensité)
- **Opportunités** : Ce que les clients demandent
- **Signaux faibles** : Tendances émergentes

---

## Format de rapport d'analyse

```markdown
# Analyse Voice of Customer
## [Source] - [Période]

### 📊 Vue d'ensemble
- **Volume analysé** : XXX feedbacks
- **Sentiment global** : [Score] - [Tendance vs période précédente]

| Sentiment | % | Volume |
|-----------|---|--------|
| 😊 Positif | X% | XXX |
| 😐 Neutre | X% | XXX |
| 😞 Négatif | X% | XXX |

### 🔥 Top 5 Irritants

| # | Thème | Mentions | Sentiment | Exemple type |
|---|-------|----------|-----------|--------------|
| 1 | [Thème] | XX | -1.8 | "[Verbatim représentatif]" |

### 💡 Top 3 Opportunités

| # | Insight | Source | Potentiel |
|---|---------|--------|-----------|
| 1 | [Opportunité] | "Verbatim" | [Impact estimé] |

### 📈 Tendances
- [Tendance 1 avec évolution]
- [Tendance 2 avec évolution]

### 🎯 Recommandations
1. **Quick Win** : [Action immédiate à faible effort]
2. **Priorité** : [Action importante à moyen terme]
3. **À explorer** : [Piste à investiguer]

### 📝 Verbatims remarquables
> "[Verbatim positif notable]" - ⭐⭐⭐⭐⭐

> "[Verbatim négatif représentatif]" - ⭐
```

---

## Techniques d'analyse avancées

### Matrice Impact/Fréquence
Positionner chaque thème selon :
- Axe X : Fréquence de mention
- Axe Y : Impact sur la satisfaction (sentiment moyen)

### Analyse de cohortes
Segmenter les feedbacks par :
- Type de client (nouveau, fidèle, churné)
- Canal (app, web, magasin)
- Période (avant/après changement)

### Détection de signaux faibles
Identifier les thèmes à faible fréquence mais fort sentiment négatif.

---

## Ton style
- Tu demandes le corpus de feedbacks avant de commencer
- Tu poses des questions sur le contexte business
- Tu priorises les insights par actionabilité
- Tu illustres chaque point avec des verbatims

Commence par : "Partage-moi les feedbacks à analyser (copie les verbatims ou décris la source). Précise aussi le contexte : quel produit/service ? quelle période ?"
```

### Exemple d'analyse

**Input : Avis Google (10 verbatims)**
```
1. "Super application, très intuitive ! J'adore la nouvelle fonctionnalité de scan." ⭐⭐⭐⭐⭐
2. "Impossible de me connecter depuis la mise à jour. Support inexistant." ⭐
3. "RAS, fait le job." ⭐⭐⭐
4. "Très déçu par le délai de livraison, 2 semaines au lieu de 3 jours..." ⭐⭐
5. "Équipe super réactive quand j'ai eu un souci, merci !" ⭐⭐⭐⭐⭐
6. "L'app plante tout le temps sur Android 14." ⭐
7. "Prix un peu élevé mais qualité au rendez-vous." ⭐⭐⭐⭐
8. "Produit conforme, livraison rapide, je recommande." ⭐⭐⭐⭐⭐
9. "SAV nul, 3 relances pour un remboursement." ⭐
10. "Nouvelle version top ! Enfin le mode sombre." ⭐⭐⭐⭐⭐
```

**Output : Rapport d'analyse**

```markdown
# Analyse Voice of Customer
## Avis Google - Janvier 2025 (10 feedbacks)

### 📊 Vue d'ensemble
- **Volume analysé** : 10 feedbacks
- **Sentiment global** : +0.6 (plutôt positif)
- **Note moyenne** : 3.5/5

| Sentiment | % | Volume |
|-----------|---|--------|
| 😊 Positif | 50% | 5 |
| 😐 Neutre | 20% | 2 |
| 😞 Négatif | 30% | 3 |

### 🔥 Top 3 Irritants

| # | Thème | Mentions | Sentiment | Exemple |
|---|-------|----------|-----------|---------|
| 1 | Bugs/Stabilité | 2 | -2.0 | "L'app plante tout le temps sur Android 14" |
| 2 | SAV/Support | 2 | -1.5 | "Support inexistant", "3 relances pour un remboursement" |
| 3 | Livraison | 1 | -1.0 | "2 semaines au lieu de 3 jours" |

### 💡 Top 2 Opportunités

| Insight | Source | Potentiel |
|---------|--------|-----------|
| Mode sombre apprécié | "Nouvelle version top ! Enfin le mode sombre" | Feature différenciante |
| Scan bien perçu | "J'adore la nouvelle fonctionnalité de scan" | Mettre en avant |

### 🎯 Recommandations

1. **URGENT** : Investiguer crash Android 14 (2 mentions, sentiment très négatif)
2. **Quick Win** : Mettre en avant mode sombre et scan dans la communication
3. **Moyen terme** : Revoir process SAV (délai de réponse, suivi)

### 📝 Verbatims remarquables

> 😊 "Super application, très intuitive ! J'adore la nouvelle fonctionnalité de scan."

> 😞 "SAV nul, 3 relances pour un remboursement."
```

### Critères de réussite
- Pipeline d'analyse fonctionnel (prompt ou workflow)
- Rapport d'insights sur un corpus réel ou exemple
- Identification des irritants et opportunités
- Recommandations actionnables

---

## 2. Animation Dojo Challenge (1h, ~10 personnes)

### Objectifs pédagogiques
À la fin de l'atelier, les participants sauront :
- Analyser le sentiment d'un corpus de verbatims
- Extraire les thèmes récurrents
- Identifier les irritants et opportunités
- Produire un rapport VoC actionnable

### Prérequis participants
- Avoir accès à des verbatims clients (ou utiliser le corpus exemple)
- Accès à un chat IA
- Aucune compétence data requise

### Matériel nécessaire
- Prompt système de l'analyste
- Corpus exemple (50-100 verbatims)
- Template de rapport VoC
- Grille de scoring sentiment

### Déroulé minute par minute

| Temps | Activité | Animateur fait | Participants font | Valeur pédagogique |
|-------|----------|----------------|-------------------|-------------------|
| 0-5 | Intro | Présente l'importance de la VoC + exemple de découverte | Comprennent l'enjeu | Motivation |
| 5-10 | Méthodologie | Explique sentiment, thèmes, matrice impact/fréquence | Apprennent les techniques | Théorie |
| 10-15 | Démo | Analyse 5 verbatims en live | Observent le processus | Voir en action |
| 15-20 | Setup | Distribue le prompt et le corpus | Préparent leurs données | Préparation |
| 20-40 | Analyse | Circule, aide sur l'interprétation | Analysent leur corpus | Production |
| 40-50 | Insights | Fait identifier le top 3 irritants | Priorisent leurs findings | Synthèse |
| 50-55 | Partage | 2-3 présentations des insights clés | Découvrent d'autres insights | Apprentissage |
| 55-60 | Clôture | Comment industrialiser (n8n, webhooks...) | Notent les next steps | Autonomie |

### Points d'attention animateur

**Pièges courants :**
- Analyser trop peu de verbatims → Minimum 20-30 pour des patterns
- Confondre fréquence et importance → Un irritant rare peut être critique
- Pas d'action → "OK et on fait quoi maintenant ?"

**Questions fréquentes :**
- "Combien de verbatims faut-il ?" → 50+ pour des tendances fiables
- "Comment automatiser ?" → Webhook depuis l'outil d'avis → n8n → analyse
- "Peut-on analyser plusieurs langues ?" → Oui, les LLM gèrent bien

**Tips d'animation :**
- Avoir un corpus avec des patterns clairs
- Faire deviner les irritants avant l'analyse
- Montrer l'impact d'un insight transformé en action

### Variantes possibles

**Niveau débutant (45 min) :**
- Corpus de 20 verbatims pré-sélectionnés
- Focus sur sentiment + 1 insight
- Template de rapport simplifié

**Niveau avancé (1h30) :**
- Corpus de 100+ verbatims
- Analyse multi-sources (avis + tickets)
- Dashboard de suivi avec métriques

**Format workshop (2h) :**
- 30 min : Théorie VoC et méthodologies
- 45 min : Analyse de corpus réel
- 30 min : Création du plan d'action
- 15 min : Présentation aux stakeholders (simulation)

**Avec automatisation :**
- Connecter l'analyse à un flux n8n
- Alertes automatiques si sentiment < seuil
- Rapport hebdomadaire automatique
