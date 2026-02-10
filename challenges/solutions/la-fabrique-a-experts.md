# La Fabrique à Experts

## 1. Résolution du Challenge

### Objectif
Créer une formation pédagogique complète sur un sujet complexe à partir de sources brutes, avec quiz, synthèses et podcast audio.

### Étape 1 : Rassembler les sources

1. **Identifier le sujet** : Choisir un thème complexe mais accessible (ex : ordinateur quantique, numérique responsable, blockchain, IA générative)

2. **Collecter 3-5 sources de qualité** :
   - Articles de référence (Wikipedia, publications académiques)
   - Vidéos explicatives (conférences, TED Talks)
   - Documents techniques (livres blancs, rapports)

3. **Charger dans NotebookLM** :
   - Créer un nouveau notebook
   - Importer les sources (PDF, liens, textes)
   - Laisser NotebookLM indexer

### Étape 2 : Structurer la formation avec NotebookLM

**Prompt à utiliser dans NotebookLM :**
```
Analyse toutes les sources et propose une structure de formation en 5 modules pour un débutant complet. Pour chaque module :
- Titre accrocheur
- Objectif pédagogique (ce que l'apprenant saura faire)
- Concepts clés à retenir (3-5 max)
- Durée estimée
- Prérequis (module précédent si applicable)
```

### Étape 3 : Générer le contenu de chaque module

Pour chaque module, demander à NotebookLM :
```
Pour le module [X] sur [titre], génère :
1. Une introduction engageante (2 paragraphes)
2. L'explication des concepts clés avec des analogies simples
3. Un exemple concret du monde réel
4. 3 points à retenir (format bullet)
5. Une transition vers le module suivant
```

### Étape 4 : Créer les quiz

**Prompt pour les quiz :**
```
Crée un quiz de 5 questions pour le module [X]. 
- 3 questions à choix multiple (4 options, 1 seule bonne)
- 1 question vrai/faux avec explication
- 1 question ouverte de réflexion
Inclus les réponses et explications à la fin.
```

### Étape 5 : Générer le podcast avec NotebookLM

1. Dans NotebookLM, cliquer sur "Audio Overview"
2. Sélectionner le style conversationnel
3. Personnaliser si nécessaire : "Focus sur les concepts clés et les analogies, ton accessible et engageant"
4. Générer le podcast (5-15 min automatiquement)
5. Télécharger le fichier audio

### Livrable final attendu

```
📁 Formation : [Sujet]
├── 00-introduction.md (présentation, objectifs, prérequis)
├── 01-module-fondamentaux.md
├── 02-module-concepts.md
├── 03-module-applications.md
├── 04-module-enjeux.md
├── 05-module-perspectives.md
├── quiz/
│   ├── quiz-module-01.md
│   ├── quiz-module-02.md
│   └── ...
├── synthese-globale.md
└── podcast-formation.mp3
```

### Exemple : Formation "Ordinateur Quantique pour les Nuls"

**Module 1 : Les bases de la physique quantique**
- Objectif : Comprendre ce qu'est un qubit vs un bit
- Concepts : Superposition, intrication, mesure
- Analogie : "Imaginez une pièce qui est pile ET face en même temps..."

**Module 2 : Comment fonctionne un ordinateur quantique**
- Objectif : Visualiser l'architecture d'un QC
- Concepts : Portes quantiques, cohérence, refroidissement

**Module 3 : Ce que ça change concrètement**
- Objectif : Identifier les cas d'usage réels
- Concepts : Cryptographie, optimisation, simulation

---

## 2. Animation Dojo Challenge (1h, ~10 personnes)

### Objectifs pédagogiques
À la fin de l'atelier, les participants sauront :
- Utiliser NotebookLM pour synthétiser des sources complexes
- Structurer une formation pédagogique en modules progressifs
- Générer un podcast audio automatiquement
- Créer des quiz d'évaluation pertinents

### Prérequis participants
- Compte Google (pour NotebookLM)
- Avoir identifié un sujet avant l'atelier (ou en choisir un sur place)
- 2-3 sources sur leur sujet (articles, PDF, liens)

### Matériel nécessaire
- Accès NotebookLM (notebook.google.com)
- Écouteurs (pour écouter les podcasts générés)
- Template de structure de formation (optionnel)
- Timer visible

### Déroulé minute par minute

| Temps | Activité | Animateur fait | Participants font | Valeur pédagogique |
|-------|----------|----------------|-------------------|-------------------|
| 0-5 | Intro & démo | Montre un exemple de formation générée + fait écouter 1 min de podcast | Découvrent le livrable cible | Vision du résultat final |
| 5-10 | Setup | Vérifie les accès NotebookLM, aide les retardataires | Créent leur notebook, chargent leurs sources | Préparation technique |
| 10-15 | Structuration | Guide le premier prompt (structure en modules) | Génèrent leur structure de formation | Apprendre à prompter NotebookLM |
| 15-30 | Génération modules | Circule, aide ceux qui bloquent, partage les bons exemples | Génèrent le contenu de 2-3 modules | Production guidée |
| 30-40 | Quiz | Montre le format de quiz attendu | Créent le quiz d'un module | Évaluation pédagogique |
| 40-50 | Podcast | Explique Audio Overview, lance la génération pour tous | Génèrent leur podcast (prend ~2-3 min) | Découverte fonctionnalité clé |
| 50-55 | Écoute & partage | Fait écouter 2-3 extraits de podcasts générés | Écoutent, commentent | Valorisation des productions |
| 55-60 | Clôture | Récapitule le workflow, donne les prochaines étapes | Notent ce qu'ils vont compléter | Ancrage et projection |

### Points d'attention animateur

**Pièges courants :**
- Sources de mauvaise qualité → Le podcast sera mauvais. Insister sur la qualité des inputs
- Trop de sources → NotebookLM peut se perdre. Recommander 3-5 sources max
- Sujet trop large → Cadrer dès le début (pas "l'IA" mais "l'IA générative pour le marketing")

**Questions fréquentes :**
- "Le podcast est en anglais" → Vérifier que les sources sont en français
- "La génération prend trop de temps" → Normal (2-5 min), lancer et passer au quiz
- "Je n'ai pas de sources" → Proposer un sujet par défaut avec sources fournies

**Tips d'animation :**
- Préparer 2-3 sujets avec sources pour les participants non préparés
- Faire un "listening party" des meilleurs podcasts à la fin
- Encourager le partage des formations créées sur un canal commun

### Variantes possibles

**Niveau débutant (45 min) :**
- Fournir les sources (un sujet commun pour tous)
- Se concentrer sur 2 modules + 1 quiz
- Skipper la génération podcast (montrer juste comment faire)

**Niveau avancé (1h30) :**
- Formation complète 5 modules
- Personnalisation avancée du podcast (instructions custom)
- Cross-review : chaque participant évalue la formation d'un autre

**Format workshop (2h) :**
- Phase 1 : Recherche et curation de sources (30 min)
- Phase 2 : Génération formation (45 min)
- Phase 3 : Test croisé des quiz (20 min)
- Phase 4 : Amélioration itérative (25 min)

**En équipe (2-3 personnes) :**
- Un chercheur (sources)
- Un structureur (modules + quiz)
- Un producteur (podcast + mise en forme)
