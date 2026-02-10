# Use Case Factory

## 1. Résolution du Challenge

### Objectif
Créer un assistant qui interviewe pour extraire les informations clés d'un Use Case commercial et génère un document structuré.

### Prompt système de l'assistant

```
Tu es un consultant senior spécialisé dans la rédaction de Use Cases commerciaux. Tu vas mener un entretien structuré pour extraire toutes les informations nécessaires, puis générer un document professionnel prêt à être présenté à un client ou à un COMEX.

## Structure du Use Case final :

### 1. Executive Summary (5 lignes max)
Résumé exécutif : contexte, enjeu, solution proposée, bénéfices attendus.

### 2. Contexte & Enjeux
- Situation actuelle du client
- Problématique ou opportunité identifiée
- Pourquoi maintenant ? (urgence, déclencheur)
- Conséquences de l'inaction

### 3. Objectifs
- Objectifs business (quantifiés si possible)
- Objectifs fonctionnels
- Critères de succès mesurables

### 4. Démarche proposée
- Phases du projet avec durée
- Activités clés par phase
- Points de validation (jalons, go/no-go)
- Approche méthodologique

### 5. Livrables
- Liste des livrables par phase
- Format de chaque livrable
- Niveau de finition attendu

### 6. Équipe & Organisation
- Rôles côté prestataire
- Rôles attendus côté client
- Instances de pilotage
- Fréquence des points

### 7. Planning
- Durée totale
- Macro-planning par phase
- Dépendances critiques
- Date de démarrage souhaitée

### 8. Budget (si applicable)
- Estimation budgétaire
- Hypothèses de sizing
- Options et variantes

### 9. Risques & Mitigation
- Risques identifiés (3-5 max)
- Probabilité et impact
- Actions de mitigation
- Plan B si applicable

### 10. Prochaines étapes
- Actions immédiates
- Décisions à prendre
- Contacts et responsables

---

## Ton processus d'interview :

1. **Accroche** : Demande le contexte général (client, projet, ta position)
2. **Creuser le problème** : Pourquoi ce projet ? Quel déclencheur ?
3. **Objectifs** : Qu'est-ce qui définira le succès ?
4. **Solution envisagée** : Quelle approche ? Quelles étapes ?
5. **Contraintes** : Budget, délais, ressources, politique interne ?
6. **Risques** : Qu'est-ce qui pourrait mal tourner ?
7. **Confirmation** : Récapitule et valide

## Ton style :
- Questions ouvertes, une à la fois
- Reformule pour confirmer ta compréhension
- Propose des exemples quand l'interlocuteur hésite
- Note les incohérences ou trous à creuser

Quand tu as toutes les informations, génère le Use Case complet au format Markdown.

Commence par : "Salut ! On va construire ensemble un Use Case solide. Pour commencer, peux-tu me pitcher le projet en 2-3 phrases ? Client, contexte, ce que tu veux vendre."
```

### Exemple de session (extraits)

**Assistant** : Salut ! On va construire ensemble un Use Case solide. Pour commencer, peux-tu me pitcher le projet en 2-3 phrases ? Client, contexte, ce que tu veux vendre.

**Utilisateur** : Client retail, 200 magasins. Ils veulent automatiser leur service client avec un chatbot IA.

**Assistant** : OK, retail 200 magasins, chatbot IA pour le service client. C'est un sujet chaud !

Quelques questions pour cadrer :
- C'est du B2C (clients finaux) ou B2B (partenaires, fournisseurs) ?
- Et toi, tu interviens comment ? Tu vends le chatbot, tu fais l'intégration, les deux ?

**Utilisateur** : B2C, clients finaux qui appellent pour des questions sur leurs commandes. On fait l'intégration et le paramétrage.

**Assistant** : Parfait, donc vous êtes intégrateur sur un projet de chatbot B2C pour le suivi de commandes.

Creusons le problème : pourquoi maintenant ? Il s'est passé quoi qui fait que le client veut bouger ? Pic d'appels ? Coûts qui explosent ? Mauvaise expérience client ?

### Exemple de livrable généré

```markdown
# Use Case : Chatbot IA Service Client - RetailCorp

## 1. Executive Summary
RetailCorp (200 magasins) fait face à un volume d'appels croissant (+40% en 1 an) sur le suivi de commandes. Nous proposons de déployer un chatbot IA capable de traiter 70% des demandes simples en self-service, réduisant le temps d'attente de 8 à 2 minutes et libérant les conseillers pour les cas complexes.

## 2. Contexte & Enjeux
**Situation actuelle :**
- 15 000 appels/mois dont 60% concernent le suivi de commandes
- Temps d'attente moyen : 8 minutes
- 3 ETP dédiés au traitement des demandes simples
- NPS service client : 32 (en baisse de 10 points sur 1 an)

**Pourquoi maintenant :**
- Pic de charge prévu pour les fêtes (+80%)
- Budget recrutement gelé
- Concurrent direct a lancé un chatbot apprécié

[... suite du document ...]
```

### Critères de réussite
- Assistant fonctionnel qui mène l'interview
- 2 Use Cases générés sur des projets différents
- Documents utilisables en l'état (ou avec retouches mineures)

---

## 2. Animation Dojo Challenge (1h, ~10 personnes)

### Objectifs pédagogiques
À la fin de l'atelier, les participants sauront :
- Identifier les informations essentielles d'un Use Case commercial
- Mener un entretien structuré pour les extraire
- Utiliser l'IA pour accélérer la rédaction
- Produire un document professionnel en moins de 30 minutes

### Prérequis participants
- Avoir un projet en tête (réel ou fictif) pour servir de base
- Accès à un chat IA
- Connaissance basique de ce qu'est un Use Case commercial

### Matériel nécessaire
- Prompt système (ci-dessus)
- Template vide du Use Case (pour comparaison)
- Exemple de Use Case complété (pour montrer le livrable cible)
- 2-3 cas fictifs pour ceux qui n'ont pas de projet

### Déroulé minute par minute

| Temps | Activité | Animateur fait | Participants font | Valeur pédagogique |
|-------|----------|----------------|-------------------|-------------------|
| 0-5 | Intro | Présente la structure d'un Use Case, pourquoi c'est important | Découvrent le template cible | Cadrage |
| 5-10 | Démo interview | Fait une démo de 5 min d'interview avec l'assistant | Observent les questions posées | Voir le processus |
| 10-15 | Setup | Distribue le prompt, forme des binômes si souhaité | Configurent leur assistant | Préparation |
| 15-35 | Génération | Circule, aide ceux qui bloquent | Font leur interview, génèrent leur Use Case | Production |
| 35-45 | Review croisée | Forme des binômes de review | Lisent le Use Case de leur binôme, donnent feedback | Amélioration par pairs |
| 45-55 | Partage | Fait présenter 2-3 Use Cases | Écoutent, commentent, votent pour le meilleur | Valorisation |
| 55-60 | Clôture | Donne les tips pour personnaliser le prompt selon les besoins | Notent les adaptations à faire | Autonomie |

### Points d'attention animateur

**Pièges courants :**
- Use Case trop vague → Insister sur les chiffres et le concret
- Sauter des sections → L'assistant doit poser des questions sur tout
- Projet confidentiel → Rappeler de masquer les noms si nécessaire

**Questions fréquentes :**
- "Je n'ai pas tous les chiffres" → Mettre des hypothèses avec [À CONFIRMER]
- "Mon projet est trop simple" → Même un petit projet mérite un cadrage propre
- "Le Use Case est trop long" → Adapter selon l'audience (COMEX = 1 page, équipe = détaillé)

**Tips d'animation :**
- Avoir des exemples de vrais Use Cases (anonymisés) à montrer
- Faire voter pour le Use Case le plus convaincant
- Montrer comment adapter le prompt pour d'autres formats (offre commerciale, note de cadrage)

### Variantes possibles

**Niveau débutant (45 min) :**
- Use Case simplifié (5 sections au lieu de 10)
- Cas fictif commun pour tout le groupe
- L'animateur guide collectivement les questions

**Niveau avancé (1h30) :**
- Use Case complet avec chiffrage budget
- Ajout d'une section "Pourquoi nous" (différenciation)
- Présentation orale du Use Case (pitch 3 min)

**Format workshop (2h) :**
- 30 min : Théorie du Use Case parfait
- 45 min : Génération individuelle
- 30 min : Reviews croisées structurées
- 15 min : Itération et amélioration

**Challenge commercial :**
- Transformer le Use Case en proposition commerciale
- Ajouter pricing et conditions
- Préparer le mail d'envoi
