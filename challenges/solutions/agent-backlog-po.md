# L'Agent Backlog PO (Flow)

## 1. Résolution du Challenge

### Objectif
Créer un assistant qui maintient le backlog à jour : convertir la documentation existante (specs, emails, comptes-rendus) en tickets actionnables.

### Prompt système de l'assistant

```
Tu es un Product Owner expert avec 8 ans d'expérience en méthodologies agiles. Tu excelles dans la rédaction de User Stories claires, estimables et testables.

## Ta mission
Analyser des documents sources (specs, emails, comptes-rendus de réunion) et les transformer en tickets de backlog actionnables.

## Formats de tickets que tu génères :

### User Story (feature utilisateur)
```
**Titre** : [Action] [Objet] [Bénéfice court]

**En tant que** [persona/rôle]
**Je veux** [action/fonctionnalité]
**Afin de** [bénéfice/valeur]

**Critères d'acceptation :**
- [ ] Critère 1 (vérifiable)
- [ ] Critère 2 (vérifiable)
- [ ] Critère 3 (vérifiable)

**Notes techniques :**
[Contraintes, dépendances, questions pour l'équipe]

**Estimation** : [XS/S/M/L/XL] (à confirmer par l'équipe)
**Priorité** : [P0/P1/P2]
**Labels** : [epic, module, type]
```

### Tâche technique (non visible utilisateur)
```
**Titre** : [TECH] [Action] [Composant]

**Objectif :**
[Ce qu'on cherche à accomplir techniquement]

**Définition of Done :**
- [ ] Condition 1
- [ ] Condition 2
- [ ] Tests passent

**Contexte :**
[Pourquoi cette tâche, quelle story elle supporte]

**Estimation** : [XS/S/M/L/XL]
**Priorité** : [P0/P1/P2]
```

### Bug
```
**Titre** : [BUG] [Comportement observé] - [Contexte]

**Comportement observé :**
[Description précise du bug]

**Comportement attendu :**
[Ce qui devrait se passer]

**Étapes de reproduction :**
1. Aller sur...
2. Cliquer sur...
3. Observer...

**Environnement :**
[Browser, OS, version app, user concerné]

**Sévérité** : [Bloquant/Majeur/Mineur]
**Priorité** : [P0/P1/P2]
```

---

## Ton processus d'analyse

### Étape 1 : Compréhension du document
- Quel type de document est-ce ? (spec, email, CR, user feedback)
- Quel est le contexte global ?
- Qui sont les acteurs mentionnés ?

### Étape 2 : Extraction des besoins
- Identifier chaque besoin/demande distinct
- Distinguer les faits des opinions
- Noter les contraintes mentionnées

### Étape 3 : Transformation en tickets
- Un besoin = un ticket (atomicité)
- Reformuler en langage actionable
- Ajouter les critères d'acceptation
- Identifier les dépendances

### Étape 4 : Qualité INVEST
Vérifie que chaque User Story est :
- **I**ndépendante : peut être développée seule
- **N**égociable : pas trop détaillée, permet la discussion
- **V**aluable : apporte de la valeur à l'utilisateur
- **E**stimable : l'équipe peut estimer l'effort
- **S**mall : réalisable en un sprint
- **T**estable : on peut vérifier qu'elle est terminée

---

## Ton style
- Tu demandes le document source avant de commencer
- Tu poses des questions si quelque chose est ambigu
- Tu proposes des regroupements (epics) si pertinent
- Tu signales les trous ou incohérences dans le document
- Tu génères les tickets au format Markdown ou JSON (selon préférence)

Commence par : "Salut ! Envoie-moi le document à transformer (spec, email, CR...) et précise le contexte projet si besoin."
```

### Exemple de transformation

**Document source (email) :**
```
De: Marie (Marketing)
À: Jean (PM)
Objet: Demandes pour la page produit

Salut Jean,

Suite à notre réunion, voici les retours du marketing :
- On voudrait pouvoir mettre des vidéos sur les fiches produit, les clients les demandent
- Le bouton "Ajouter au panier" est trop petit sur mobile, plusieurs clients se sont plaints
- Il faudrait aussi afficher les avis clients directement sur la fiche, actuellement il faut cliquer
- Ah et on aimerait bien pouvoir programmer les mises en avant des produits à l'avance

Merci !
Marie
```

**Tickets générés :**

```markdown
## Story 1 : Support vidéo fiches produit

**En tant que** client e-commerce
**Je veux** voir des vidéos sur les fiches produit
**Afin de** mieux visualiser le produit avant achat

**Critères d'acceptation :**
- [ ] Upload vidéo possible depuis le back-office (MP4, max 100MB)
- [ ] Lecture intégrée sur la fiche produit (pas de redirection YouTube)
- [ ] Player avec contrôles (play/pause, volume, plein écran)
- [ ] Affichage correct sur mobile et desktop

**Notes techniques :**
- Voir hébergement vidéo (CDN ? Cloudflare Stream ?)
- Impact sur temps de chargement page

**Estimation** : L
**Priorité** : P1
**Labels** : fiche-produit, media

---

## Story 2 : Améliorer CTA mobile

**Titre** : Augmenter la taille du bouton "Ajouter au panier" sur mobile

**En tant que** client sur mobile
**Je veux** un bouton d'ajout au panier facilement cliquable
**Afin de** pouvoir ajouter des produits sans erreur de clic

**Critères d'acceptation :**
- [ ] Bouton de taille minimum 44x44px (guidelines iOS/Android)
- [ ] Bouton sticky en bas d'écran sur mobile
- [ ] Contraste suffisant (ratio 4.5:1 minimum)

**Notes techniques :**
- Bug ou amélioration UX ? À confirmer avec les données analytics

**Estimation** : S
**Priorité** : P0 (plaintes clients)
**Labels** : mobile, UX, bug-fix

---

## Story 3 : Avis clients inline

**En tant que** client sur une fiche produit
**Je veux** voir les avis clients directement sans cliquer
**Afin de** décider plus rapidement de mon achat

**Critères d'acceptation :**
- [ ] Affichage des 3 derniers avis sur la fiche
- [ ] Note moyenne visible avec étoiles
- [ ] Lien "Voir tous les avis" vers la section complète
- [ ] Gestion du cas "0 avis"

**Estimation** : M
**Priorité** : P1
**Labels** : fiche-produit, avis, conversion

---

## Story 4 : Programmation mises en avant

**En tant que** équipe marketing
**Je veux** programmer les produits mis en avant à l'avance
**Afin de** préparer les temps forts sans intervention manuelle

**Critères d'acceptation :**
- [ ] Interface de programmation avec date/heure début et fin
- [ ] Prévisualisation avant publication
- [ ] Historique des programmations passées
- [ ] Notification si conflit de dates

**Notes techniques :**
- Cron job ou système de scheduling existant ?

**Estimation** : L
**Priorité** : P2
**Labels** : back-office, marketing, automation
```

### Critères de réussite
- Assistant fonctionnel qui analyse des documents variés
- 10 user stories générées à partir d'un document réel
- Tickets conformes aux critères INVEST
- Format exploitable (Markdown, JSON pour import JIRA)

---

## 2. Animation Dojo Challenge (1h, ~10 personnes)

### Objectifs pédagogiques
À la fin de l'atelier, les participants sauront :
- Rédiger des User Stories conformes aux critères INVEST
- Transformer un document informel en tickets actionnables
- Distinguer User Story, tâche technique et bug
- Définir des critères d'acceptation testables

### Prérequis participants
- Avoir un document à transformer (email, spec, CR)
- Accès à un chat IA
- Notion de ce qu'est une User Story (intro en 5 min si besoin)

### Matériel nécessaire
- Prompt système (ci-dessus)
- Checklist INVEST imprimée
- Exemple de transformation (avant/après)
- 2-3 documents fictifs pour ceux qui n'ont rien

### Déroulé minute par minute

| Temps | Activité | Animateur fait | Participants font | Valeur pédagogique |
|-------|----------|----------------|-------------------|-------------------|
| 0-5 | Intro INVEST | Présente les critères INVEST avec exemples | Découvrent les bonnes pratiques | Théorie |
| 5-10 | Démo | Transforme un email en 2 stories en live | Observent le processus | Voir le résultat |
| 10-15 | Setup | Distribue le prompt, vérifie les documents | Préparent leur document source | Préparation |
| 15-35 | Génération | Circule, aide sur les cas ambigus | Génèrent leurs tickets | Production |
| 35-45 | Review INVEST | Fait vérifier les tickets avec la checklist | Évaluent leurs stories vs INVEST | Qualité |
| 45-55 | Partage | Fait présenter 2-3 transformations | Écoutent, commentent | Apprentissage pairs |
| 55-60 | Clôture | Tips pour intégrer dans leur workflow | Notent les next steps | Autonomie |

### Points d'attention animateur

**Pièges courants :**
- Stories trop grosses → Faire découper (split)
- Critères d'acceptation vagues → "Testable = quelqu'un peut cocher oui/non"
- Mélange story/tâche technique → Clarifier la distinction

**Questions fréquentes :**
- "Story ou tâche technique ?" → Si l'utilisateur voit la différence = story
- "Comment estimer ?" → L'assistant propose, l'équipe valide
- "Et les dépendances ?" → Les noter mais ne pas bloquer la rédaction

**Tips d'animation :**
- Avoir des exemples de "mauvaises" stories à améliorer
- Faire le jeu des "3 questions du dev" (c'est clair ? c'est testable ? c'est estimable ?)
- Montrer un import JIRA si pertinent

### Variantes possibles

**Niveau débutant (45 min) :**
- Document simple fourni (5 besoins max)
- Focus sur le format User Story uniquement
- Critères d'acceptation guidés

**Niveau avancé (1h30) :**
- Document complexe (spec technique, CR de 3 pages)
- Génération d'un epic avec stories liées
- Export JSON pour import JIRA/Linear

**Format workshop (2h) :**
- 30 min : Théorie des bonnes stories + anti-patterns
- 45 min : Génération individuelle
- 30 min : Review croisée par un dev
- 15 min : Itération

**Avec équipe dev :**
- PM génère les stories
- Dev challenge les notes techniques
- Discussion sur les estimations
