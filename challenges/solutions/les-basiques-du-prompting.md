# Les Basiques du Prompting

## 1. Résolution du Challenge

### Objectif
Valider sa compréhension des patterns fondamentaux de prompting via un quiz interactif.

### Les patterns de prompting à maîtriser

#### 1. Zero-Shot Prompting
Demander directement sans exemple.
```
Traduis ce texte en anglais : "Bonjour, comment allez-vous ?"
```

#### 2. Few-Shot Prompting
Donner des exemples avant la tâche.
```
Classifie le sentiment de ces phrases :
"J'adore ce produit" → Positif
"C'est une catastrophe" → Négatif
"Le colis est arrivé" → Neutre

Maintenant, classifie : "Ce service est exceptionnel" → ?
```

#### 3. Chain-of-Thought (CoT)
Demander de raisonner étape par étape.
```
Résous ce problème étape par étape :
Marie a 3 pommes. Elle en donne 1 à Paul, puis en achète 4 de plus. Combien en a-t-elle ?
```

#### 4. Persona/Role Prompting
Assigner un rôle à l'IA.
```
Tu es un expert en marketing digital avec 15 ans d'expérience. Analyse cette stratégie...
```

#### 5. Output Formatting
Spécifier le format de sortie.
```
Génère une liste de 5 idées au format JSON avec les champs : titre, description, difficulté.
```

#### 6. Délimiteurs
Utiliser des séparateurs clairs.
```
Résume le texte suivant :
---
[Texte à résumer]
---
Format : 3 bullet points maximum.
```

### Quiz de validation (20 questions)

**Section 1 : Identification des patterns**

1. Quel pattern utilise des exemples avant la tâche ? → Few-shot
2. "Raisonne étape par étape" fait référence à ? → Chain-of-Thought
3. "Tu es un avocat spécialisé..." est un exemple de ? → Persona

**Section 2 : Application**

4. Pour une tâche simple et bien définie, quel pattern suffit ? → Zero-shot
5. Pour améliorer la précision sur une tâche complexe ? → Few-shot + CoT
6. Pour obtenir une sortie structurée ? → Output formatting

**Section 3 : Cas pratiques**

7-20. [Exercices de classification et d'application]

### Critères de réussite
- Score ≥ 80% au quiz
- Capacité à identifier le bon pattern pour un cas donné

---

## 2. Animation Dojo Challenge (1h, ~10 personnes)

### Objectifs pédagogiques
À la fin de l'atelier, les participants sauront :
- Reconnaître les 6 patterns fondamentaux
- Choisir le bon pattern selon la tâche
- Améliorer leurs prompts existants

### Déroulé minute par minute

| Temps | Activité | Description |
|-------|----------|-------------|
| 0-10 | Intro patterns | Présentation des 6 patterns avec exemples |
| 10-20 | Quiz interactif | Questions en temps réel (Kahoot ou similaire) |
| 20-40 | Exercices pratiques | Réécrire des prompts avec les bons patterns |
| 40-55 | Partage | Comparer les prompts avant/après |
| 55-60 | Clôture | Récapitulatif et ressources |

### Points d'attention
- Insister sur le fait qu'il n'y a pas de pattern "meilleur" - c'est contextuel
- Montrer des exemples de prompts qui fonctionnent vs qui échouent
- Faire pratiquer sur des cas réels des participants
