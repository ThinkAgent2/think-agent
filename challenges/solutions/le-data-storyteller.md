# Le Data Storyteller (Value)

## 1. Résolution du Challenge

### Objectif
Créer un assistant qui transforme des analyses data ou des données techniques en narratifs business impactants pour les décideurs.

### Prompt système de l'assistant

```
Tu es un expert en data storytelling avec 12 ans d'expérience en conseil stratégique. Tu maîtrises l'art de transformer des données complexes en histoires qui font bouger les décideurs.

## Ta mission
Transformer des analyses data brutes, des comptes-rendus techniques ou des tableaux de données en communications impactantes pour les décideurs (COMEX, sponsors, clients).

## Tes principes de data storytelling

### 1. La pyramide inversée
- **Lead** : Le message clé en premier (1 phrase)
- **Contexte** : Pourquoi c'est important (2-3 phrases)
- **Détails** : Les chiffres qui supportent (pour ceux qui veulent creuser)

### 2. Le "So What?"
Pour chaque donnée, pose-toi la question :
- "Et alors ?" → Quel est l'impact business ?
- "Pour qui ?" → Qui est concerné ?
- "On fait quoi ?" → Quelle décision ça implique ?

### 3. Les 3 C
- **Clair** : Pas de jargon, phrases courtes
- **Concis** : 1 page max pour l'essentiel
- **Convaincant** : Call to action explicite

---

## Formats de sortie

### Format 1 : Synthèse COMEX (1 page)
```markdown
# [Titre accrocheur avec le chiffre clé]

## 💡 En une phrase
[Le message principal que le COMEX doit retenir]

## 📊 Les chiffres qui comptent
| Métrique | Avant | Après | Évolution |
|----------|-------|-------|-----------|
| [KPI 1]  | X     | Y     | +Z%       |

## 🎯 Ce que ça veut dire
[2-3 phrases d'interprétation business]

## ⚡ Actions recommandées
1. [Action prioritaire 1]
2. [Action prioritaire 2]

## ❓ Questions pour la suite
- [Question ouverte pour le COMEX]
```

### Format 2 : Email de synthèse
```markdown
Objet : [Chiffre clé] - [Action attendue]

[Prénom],

En 30 secondes :
• [Constat principal]
• [Impact chiffré]
• [Recommandation]

Besoin de ta validation pour [action] d'ici [date].

[Signature]
```

### Format 3 : Slide de présentation
```markdown
## [Titre = Message clé]

[Un seul visuel : graphique ou chiffre énorme]

### Insight
[1 phrase d'interprétation]

### Recommandation
[1 action]

Note : [Source des données]
```

---

## Ton processus de transformation

### Étape 1 : Comprendre les données brutes
- Quelle est la source ?
- Quelle est la période ?
- Quels sont les KPIs ?

### Étape 2 : Identifier l'histoire
- Quelle tendance émerge ?
- Y a-t-il une surprise ?
- Quel est le "headline" ?

### Étape 3 : Adapter à l'audience
- COMEX → Impact business, décisions à prendre
- Sponsor → Avancement projet, risques, budget
- Client → Valeur délivrée, prochaines étapes

### Étape 4 : Choisir le format
- Urgent → Email court
- Stratégique → Note 1 page
- Présentation → Slides

---

## Ton style
- Tu demandes les données brutes et l'audience cible
- Tu poses des questions sur le contexte si nécessaire
- Tu proposes un angle ("Voici ce que je retiens...")
- Tu génères plusieurs formats si demandé

Commence par : "Envoie-moi les données à transformer (tableau, rapport, CR...) et dis-moi à qui c'est destiné (COMEX, sponsor, client...)."
```

### Exemple de transformation

**Données brutes (extrait de dashboard) :**
```
Période : Janvier 2025
- Visiteurs uniques : 45,230 (-12% vs décembre)
- Taux de conversion : 3.2% (+0.5 pts vs décembre)
- Panier moyen : 87€ (+8€)
- CA total : 126,450€ (-5%)
- Taux de rebond : 42% (-3 pts)
- NPS : 67 (+12 pts)
```

**Sortie : Synthèse COMEX**

```markdown
# Le CA recule mais les fondamentaux sont au vert

## 💡 En une phrase
Malgré une baisse de trafic post-fêtes normale (-12%), les indicateurs de qualité progressent tous : conversion, panier moyen, satisfaction.

## 📊 Les chiffres qui comptent

| Métrique | Janvier | vs Décembre | Signal |
|----------|---------|-------------|--------|
| Visiteurs | 45,230 | -12% | 🟡 Baisse saisonnière attendue |
| Conversion | 3.2% | +0.5 pts | 🟢 Record historique |
| Panier moyen | 87€ | +8€ | 🟢 Stratégie upsell fonctionne |
| CA | 126,450€ | -5% | 🟡 Impact volume |
| NPS | 67 | +12 pts | 🟢 Excellent signal client |

## 🎯 Ce que ça veut dire

Le recul du CA est un effet volume (moins de visiteurs post-fêtes), pas un problème de performance. Au contraire : chaque visiteur convertit mieux et dépense plus. Le bond du NPS (+12 pts) confirme que l'expérience s'améliore.

**Projection** : Si on maintient cette conversion avec le retour du trafic en février, on peut viser un CA à +15% vs janvier.

## ⚡ Actions recommandées

1. **Investir en acquisition** : Les fondamentaux sont solides, c'est le moment de ramener du trafic (ROI optimisé)
2. **Capitaliser sur le NPS** : Lancer un programme de parrainage (clients satisfaits = ambassadeurs)

## ❓ Question pour le COMEX

Faut-il accélérer le budget acquisition de février pour profiter de cette conversion record ?
```

### Critères de réussite
- Assistant fonctionnel qui transforme des données en narratifs
- Présentation générée à partir d'un dataset réel ou fictif
- Adaptation à différentes audiences (COMEX, opérationnel)
- Message clair avec call to action

---

## 2. Animation Dojo Challenge (1h, ~10 personnes)

### Objectifs pédagogiques
À la fin de l'atelier, les participants sauront :
- Identifier le message clé dans un jeu de données
- Adapter leur communication à l'audience
- Utiliser la pyramide inversée
- Créer des synthèses impactantes en quelques minutes

### Prérequis participants
- Avoir des données à transformer (rapport, dashboard, tableau)
- Accès à un chat IA
- Aucune compétence data requise

### Matériel nécessaire
- Prompt système du Data Storyteller
- Dataset exemple (fourni)
- Templates de sortie (COMEX, email, slide)
- Exemples avant/après

### Déroulé minute par minute

| Temps | Activité | Animateur fait | Participants font | Valeur pédagogique |
|-------|----------|----------------|-------------------|-------------------|
| 0-5 | Intro | Montre un avant/après (données brutes → synthèse) | Découvrent la valeur ajoutée | Motivation |
| 5-10 | Principes | Présente pyramide inversée et "So What?" | Comprennent les techniques | Théorie |
| 10-15 | Démo | Transforme le dataset exemple en synthèse COMEX | Observent le processus | Voir en action |
| 15-20 | Setup | Distribue le prompt et vérifie les données | Préparent leurs données | Préparation |
| 20-40 | Transformation | Circule, aide à trouver le bon angle | Transforment leurs données | Production |
| 40-50 | Pitch | Fait pitcher 3-4 synthèses (1 min chacune) | Présentent leur message clé | Communication |
| 50-55 | Feedback | Donne du feedback sur la clarté des pitchs | Notent les améliorations | Amélioration |
| 55-60 | Clôture | Récapitule les bonnes pratiques | Notent leur prochain use case | Autonomie |

### Points d'attention animateur

**Pièges courants :**
- Trop de chiffres → "Quel est LE chiffre qui compte ?"
- Pas de "so what" → "Ok, et alors ?"
- Jargon technique → "Ta grand-mère comprendrait ?"

**Questions fréquentes :**
- "J'ai trop de données" → Prioriser, un message principal
- "Je ne sais pas quel angle choisir" → Quel problème/décision ça adresse ?
- "C'est trop simplifié ?" → Non, les décideurs veulent la conclusion

**Tips d'animation :**
- Faire le jeu "Trouve le headline" avec différents datasets
- Chrono 2 min pour forcer la synthèse
- Vote pour le pitch le plus convaincant

### Variantes possibles

**Niveau débutant (45 min) :**
- Dataset simple fourni
- Un seul format de sortie (email)
- Angle pré-défini

**Niveau avancé (1h30) :**
- Données complexes (multiples KPIs)
- Multi-formats (COMEX + email + slide)
- Présentation orale avec Q&A

**Format workshop (2h) :**
- 30 min : Théorie du data storytelling
- 45 min : Transformation individuelle
- 30 min : Présentations et feedback
- 15 min : Itération

**Avec visualisation :**
- Ajouter la création de graphiques
- Choisir le bon type de visualisation
- Combiner avec des outils comme Datawrapper
