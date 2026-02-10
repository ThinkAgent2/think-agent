# Podcast Running

## 1. Résolution du Challenge

### Objectif
Générer un podcast pédagogique personnalisé à écouter pendant le sport.

### Étape 1 : Choisir un sujet

Critères d'un bon sujet pour le sport :
- **Narratif** : Histoires, anecdotes, parcours
- **Progressif** : Concepts qui s'enchaînent
- **Pas trop technique** : Éviter les schémas ou visuels nécessaires

Exemples :
- Histoire d'une entreprise (Apple, Tesla, SpaceX)
- Biographie inspirante
- Concept expliqué simplement (blockchain, IA, quantique)
- Actualité décryptée

### Étape 2 : Rassembler les sources

**Avec NotebookLM :**
1. Créer un nouveau notebook
2. Ajouter 2-4 sources de qualité :
   - Articles Wikipedia
   - Vidéos YouTube (transcription)
   - Articles de blog/presse
   - PDF de livres/rapports

### Étape 3 : Structurer le contenu

**Prompt pour structurer :**
```
Analyse ces sources et propose un plan de podcast de 10-15 minutes sur [sujet].

Structure recommandée :
1. Accroche (30 sec) - Pourquoi c'est intéressant
2. Contexte (2 min) - Le décor
3. Partie 1 (3 min) - Premier concept clé
4. Partie 2 (3 min) - Deuxième concept clé
5. Partie 3 (3 min) - Troisième concept clé
6. Conclusion (2 min) - Ce qu'il faut retenir
7. Ouverture (30 sec) - Pour aller plus loin

Le ton doit être conversationnel, comme si tu expliquais à un ami pendant un jogging.
```

### Étape 4 : Générer le podcast

**Avec NotebookLM Audio Overview :**
1. Cliquer sur "Audio Overview" dans le notebook
2. Optionnel : Personnaliser avec des instructions
   - "Ton dynamique et motivant"
   - "Focus sur [aspect spécifique]"
   - "Éviter le jargon technique"
3. Générer (2-5 minutes d'attente)
4. Télécharger le MP3

**Alternative avec ElevenLabs :**
1. Rédiger le script complet avec l'IA
2. Copier dans ElevenLabs
3. Choisir une voix (ou créer un dialogue à 2 voix)
4. Générer et télécharger

### Exemple : Podcast "L'histoire de SpaceX en 10 minutes"

**Sources utilisées :**
- Article Wikipedia SpaceX
- Vidéo TED d'Elon Musk
- Article "The Making of SpaceX"

**Plan généré :**
```
1. ACCROCHE (30 sec)
   "En 2002, un entrepreneur sans expérience aérospatiale décide de coloniser Mars. Tout le monde le prend pour un fou..."

2. CONTEXTE (2 min)
   - Qui est Elon Musk en 2002
   - Pourquoi Mars ?
   - Le pari impossible

3. LES ÉCHECS (3 min)
   - Falcon 1 : 3 échecs consécutifs
   - La quasi-faillite de 2008
   - "Un 4e échec et c'était fini"

4. LA RÉVOLUTION (3 min)
   - Fusées réutilisables
   - Division par 10 des coûts
   - L'atterrissage historique de 2015

5. AUJOURD'HUI (3 min)
   - Starship et Mars
   - Starlink et internet mondial
   - La nouvelle course à l'espace

6. CONCLUSION (2 min)
   - Ce que SpaceX a changé
   - Leçons d'entrepreneuriat

7. OUVERTURE (30 sec)
   - Pour aller plus loin : biographie d'Elon Musk
```

### Critères de réussite
- Podcast audio de 5-15 minutes
- Sujet de son choix
- Qualité audio écoutable pendant le sport

---

## 2. Animation Dojo Challenge (1h, ~10 personnes)

### Objectifs pédagogiques
À la fin de l'atelier, les participants sauront :
- Utiliser NotebookLM pour synthétiser des sources
- Générer un podcast audio automatiquement
- Structurer un contenu pour l'écoute "en mobilité"

### Déroulé minute par minute

| Temps | Activité | Description |
|-------|----------|-------------|
| 0-5 | Intro | Faire écouter 1 min d'un podcast généré |
| 5-15 | Choix sujet & sources | Chacun choisit son sujet et trouve 2-3 sources |
| 15-25 | Import NotebookLM | Créer le notebook, importer les sources |
| 25-40 | Génération podcast | Lancer Audio Overview (temps de génération ~3 min) |
| 40-50 | Écoute collective | Faire écouter des extraits des podcasts générés |
| 50-60 | Clôture | Partage des sujets, tips pour personnaliser |

### Points d'attention
- NotebookLM génère en anglais par défaut avec sources anglaises → Privilégier sources FR
- Le temps de génération peut varier → Lancer tôt dans l'atelier
- La qualité dépend des sources → Insister sur la curation en amont
