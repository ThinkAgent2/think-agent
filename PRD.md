# THINK AGENT - PRD SIMPLIFIÉ (v3 - Enrichi)

## 1. VISION & CONTEXTE

**THINK AGENT** - "DON'T JUST DO IT! TEACH IT!"

> *"Ne le fais pas toi-même. Enseigne à l'agent comment le faire."*

[vision.md]

Plateforme de challenges IA pour les collaborateurs d'eXalt (1500-1700 personnes). Les utilisateurs développent leurs compétences IA en créant des agents auxquels ils "enseignent" leur expertise métier.

### Philosophie Clé

Think Agent n'est **pas** une montée en compétences technologique. C'est un **changement de paradigme** — une transformation de la façon dont on travaille, crée de la valeur, et se positionne dans un monde où l'IA exécute de plus en plus de tâches.

[niveaux.md]

| ❌ Idée reçue | ✅ Réalité |
|---------------|-----------|
| "C'est pour les profils tech" | C'est pour tous les métiers |
| "Il faut maîtriser des outils" | Il faut comprendre une nouvelle façon de travailler |
| "Niveau 3 = expert technique" | Niveau 3 = repenser son rôle et sa valeur |

### Ambition

**Transformer chaque collaborateur en bâtisseur de son propre futur.**

[vision.md]

---

## 2. STACK TECHNIQUE

- **Frontend** : Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend/DB** : Supabase (Database, Storage)
- **Hébergement** : Vercel (Frontend), Supabase (Backend)
- **i18n** : next-intl (FR/EN)

---

## 3. CHARTE GRAPHIQUE GLITCHFORGE

### Palette CSS

```css
:root {
  --bg-primary: #0A0A0A;    /* Fond principal */
  --bg-secondary: #3B82F6;  /* Bleu eXalt */
  --accent-rose: #EC4899;   /* Badges challenge */
  --accent-jaune: #FCD34D;  /* CTAs */
  --accent-vert: #10B981;   /* Succès/Leaderboard */
  --accent-cyan: #06B6D4;   /* Connexions/Hover */
  --neutral-gray: #374151;  /* Borders */
  --text-primary: #FFFFFF;  /* Texte */
}
```

### Typographie

- **Titres** : Century Gothic Bold (fallback: Inter Black)
- **Corps** : Century Gothic Regular (fallback: Inter Regular)
- H1: 4rem/900 | H2: 2.5rem/700 | H3: 1.5rem/600 | Body: 1rem/400

### Règles UI

- Fond noir 80% + accents vifs 20%
- Hover : Glow cyan `box-shadow: 0 0 20px var(--accent-cyan)`
- Boutons CTA : `bg-accent-jaune text-bg-primary font-bold`
- Animations subtiles (0.3s ease)
- Contraste WCAG AAA

---

## 4. ARCHITECTURE & NAVIGATION

### 3 Pages Principales

| Page | URL | Description |
|------|-----|-------------|
| Catalogue | `/challenges` | Liste filtrable des challenges |
| Ma Page | `/me` | Profil, mes challenges, leaderboard |
| Événements | `/events` | Dojos avec lien 360 Learning |

### Pages Additionnelles

- `/login` - Saisie email uniquement
- `/challenges/[id]` - Détail challenge + solution de référence
- `/mentor/queue` - File d'attente (Mentors)
- `/mentor/evaluate/[id]` - Évaluation
- `/admin/*` - Dashboard, gestion

---

## 5. PUBLIC CIBLE - CARTOGRAPHIE DES CONSULTANTS

### 7 Marques / Communautés (~28 profils)

[cartographie-consultants.md]

| Marque | Focus | Nb profils |
|--------|-------|------------|
| **Nilo** | Engineering / Industrie | 6 |
| **Forge** | Cloud / DevOps | 4 |
| **Flow** | Produit / Projet / Change | 6 |
| **Value** | Data / IA | 4 |
| **IT** | Développement | 2 |
| **Fi** | Finance de marché | 3 |
| **Shield** | Cybersécurité | 3 |

### Exemples de Profils par Marque

**Flow** : Product Manager, UX/UI Designer, Scrum Master, Chef de projet, Change Manager
[cartographie-consultants.md]

**Forge** : Ingénieur DevOps, Cloud Engineer, SRE, Chef de projet technique
[cartographie-consultants.md]

**Fi** : Business Analyst Finance, Quant/IT Quant, Commando/Dev de proximité
[cartographie-consultants.md]

---

## 6. SYSTÈME DE PROGRESSION

### 3 Niveaux

[niveaux.md]

| Niveau | Citation | Description | Compétences clés | Couleur |
|--------|----------|-------------|------------------|---------|
| **Explorer** | *"Je découvre ce que l'IA peut faire pour moi."* | S'habituer à travailler avec l'IA, expérimenter sans enjeu de production | Curiosité, Prompting basique, Réflexes sécurité | `accent-vert` |
| **Crafter** | *"Je crée des outils qui augmentent ma productivité."* | Création d'assistants métier, production de livrables plus rapidement | Création d'assistants, RAG, Prompt avancé | `bg-secondary` |
| **Architecte** | *"Je ne fais plus. Je fais faire — et je repense ma valeur."* | Concevoir et superviser des systèmes autonomes, repenser son rôle | Multi-agents, Orchestration, Vision stratégique | `accent-rose` |

### La Polarisation à Venir

[niveaux.md]

Le monde du travail se divise en deux rôles :
- **Architectes de valeur** — Ceux qui conçoivent, décident, créent du sens
- **Superviseurs de solutions IA** — Ceux qui opèrent et contrôlent les agents qui exécutent

### Passage de Niveau

- **2 challenges minimum** du niveau actuel validés
- **Note moyenne ≥ 3/5**
- Validation automatique

### Points & XP

[challenges-structure.md]

- **XP par challenge** : Points proportionnels à la difficulté
- Explorer : 50-75 XP | Crafter : 100-150 XP | Architecte : 250-400 XP
- **Duo bonus** : XP bonus si réalisé en binôme

---

## 7. STRUCTURE D'UN CHALLENGE

[challenges-structure.md]

### Attributs Standards

| Attribut | Type | Obligatoire | Exemple |
|----------|------|-------------|---------|
| **Titre** | Texte | ✅ | "Le Conseiller McKinsey" |
| **Description** | Texte | ✅ | Objectif et contexte |
| **Niveau** | Explorer / Crafter / Architect | ✅ | Crafter |
| **Difficulté** | 1-5 ⭐ | ✅ | ⭐⭐⭐ |
| **Durée estimée** | Texte | ✅ | "2h" |
| **Marque** | Tous / Flow / IT / etc. | ✅ | Flow |
| **Participants** | Solo / Duo / Équipe | ✅ | Solo |
| **Livrables** | Liste | ✅ | Assistant + documentation |
| **Outils** | Liste | ✅ | Chat IA, n8n, NotebookLM |
| **Évaluation** | Type | ✅ | Peer review / Automatique |
| **Critères** | Texte | ✅ | Ce qui sera évalué |
| **XP** | Nombre | ✅ | 150 |
| **Prérequis** | Liste | ❌ | Challenge précédent |
| **Solution de référence** | Texte/Fichiers | ❌ | Piste de solution |

---

## 8. CATALOGUE DES CHALLENGES

### Challenges Explorer (Exemples)

[explorer.md]

| Challenge | Difficulté | Durée | Description |
|-----------|------------|-------|-------------|
| **Les Basiques du Prompting** | ⭐ | 15 min | Quiz sur zero-shot, few-shot, chain-of-thought, persona |
| **Le Gardien des Données** | ⭐ | 15 min | Quiz sur confidentialité, RGPD, anonymisation |
| **Le Coffre-Fort** | ⭐⭐ | 30 min | Créer un assistant résistant au prompt injection |
| **La Fabrique à Experts** | ⭐⭐ | 1h | Créer une formation avec NotebookLM (modules + quiz + podcast) |
| **Le Sparring Partner** | ⭐⭐ | 1h | S'entraîner aux objections IA avec un DG sceptique |

**Note** : "Les Basiques du Prompting" et "Le Gardien des Données" sont des **prérequis obligatoires** pour tous les autres challenges.

[explorer.md]

### Challenges Crafter (Exemples)

[crafter.md]

| Challenge | Marque | Difficulté | Durée | Description |
|-----------|--------|------------|-------|-------------|
| **Le Conseiller McKinsey** | Tous | ⭐⭐⭐ | 2h | Assistant stratégique avec frameworks MECE, Minto, Issue Trees |
| **PRD Manager** | Flow | ⭐⭐⭐ | 2h | Assistant qui interviewe et rédige le PRD |
| **Le Guide d'Entretien** | Flow | ⭐⭐ | 1h | Générer des trames d'interviews UX |
| **La QA Augmentée** | IT | ⭐⭐⭐ | 2h | Plans de tests automatiques depuis specs |
| **Le Traducteur Quant** | Fi | ⭐⭐⭐ | 2h | Traduire specs métier finance en specs techniques |
| **Veille Augmentée** | Tous | ⭐⭐⭐ | 2h | Pipeline n8n de veille automatisée |

### Challenges Architecte (Exemples)

[architect.md]

| Challenge | Marque | Difficulté | Durée | Description |
|-----------|--------|------------|-------|-------------|
| **L'Employé Numérique** | Forge/IT | ⭐⭐⭐⭐ | 4h | Agent créant des workflows n8n par conversation |
| **Le Conformity Guardian** | Fi | ⭐⭐⭐⭐ | 4h | Surveillance réglementaire (EMIR, MiFID) |
| **L'Ingénieur Durable** | Nilo | ⭐⭐⭐⭐ | 4h | Système de scoring impact environnemental |
| **AgCraft (Boss Final)** 🏆 | Tous | ⭐⭐⭐⭐⭐ | 16h | Interface RTS pour piloter des agents IA |

---

## 9. MODÈLE DE DONNÉES

### Tables Principales

```sql
-- UTILISATEURS (identification simple par email)
users (
  id UUID PK DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  nom TEXT,
  metier_id UUID FK,
  marque_id UUID FK,
  localisation TEXT,
  niveau_actuel ENUM('Explorer','Crafter','Architecte') DEFAULT 'Explorer',
  role ENUM('Utilisateur','Mentor','Administrateur') DEFAULT 'Utilisateur',
  points_totaux INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- CHALLENGES
challenges (
  id UUID PK,
  titre TEXT,
  description TEXT (Markdown),
  niveau_associe ENUM('Explorer','Crafter','Architecte'),
  type ENUM('Quiz','Exercice','Projet','Use_Case'),
  difficulte INTEGER 1-5,
  duree_estimee TEXT,
  type_evaluation ENUM('Manuelle','Automatique','Hybride'),
  outils_recommandes JSONB,
  criteres_evaluation TEXT,
  xp INTEGER,
  statut ENUM('Actif','Archivé'),
  prerequis JSONB,
  solution_reference TEXT,     -- NOUVEAU : Piste de solution
  solution_fichiers JSONB      -- NOUVEAU : Fichiers de la solution
)

-- SOLUTIONS
solutions (
  id UUID PK,
  user_id UUID FK,
  challenge_id UUID FK,
  contenu_texte TEXT,
  fichiers_attaches JSONB,
  statut ENUM('Soumise','Évaluée'),
  note INTEGER 1-5,
  feedback_reviewer TEXT,
  reviewer_id UUID FK,
  a_consulte_solution BOOLEAN DEFAULT FALSE  -- NOUVEAU : Track consultation
)

-- PARTICIPATIONS
participations (
  user_id UUID FK,
  challenge_id UUID FK,
  statut ENUM('En_cours','Terminé')
)

-- BADGES
badges (id, nom, description, type, conditions JSONB)
obtention_badge (user_id, badge_id, date)

-- ÉVÉNEMENTS
evenements_dojo (
  id, titre, description, date_debut, date_fin,
  format ENUM('En_Ligne','Présentiel'),
  lien_360learning TEXT (obligatoire),
  organisateur_id UUID FK
)
```

### Tables Référentielles

- `marques` : FLOW, IT, VALUE, FORGE, FI, SHIELD, NILO
- `metiers` : Product Manager, Designer, Développeur, RH, etc.
- `competences_ia` : 23 compétences en 5 catégories

---

## 10. FONCTIONNALITÉS DÉTAILLÉES

### 10.1 Identification Utilisateur

- **Email uniquement** (pas de mot de passe)
- Si email existe → connexion directe
- Si email n'existe pas → création user + redirection
- Stockage email en localStorage/cookie
- Profil éditable ensuite (nom, métier, marque, localisation)

### 10.2 Catalogue Challenges

- Grille de cards responsive
- Filtres : Marque, Niveau, Compétence IA, Type, Difficulté, Durée
- Recherche textuelle avec debounce
- Affichage XP et durée estimée
- Indicateur de prérequis
- Bouton "Participer" → ajoute à mes challenges

### 10.3 Détail Challenge

- Description Markdown avec objectifs pédagogiques
- Critères d'évaluation détaillés
- Outils recommandés : Chat IA eXalt, N8N, Notebook LM, Suite Google
- Livrables attendus
- Zone soumission (si participé) : Rich text + upload fichiers
- **🆕 Bouton "Voir la solution de référence"** (voir section 10.4)

### 10.4 🆕 Solution de Référence (Nouvelle Fonctionnalité)

**Concept** : Après soumission, l'utilisateur peut consulter une piste de solution pour comparer avec sa propre approche et apprendre.

**Règles d'accès** :
- ❌ Invisible tant que l'utilisateur n'a pas soumis sa solution
- ✅ Bouton "Voir la solution de référence" apparaît après soumission
- Le bouton est accessible même si la solution n'est pas encore évaluée

**Comportement** :
1. Utilisateur soumet sa solution
2. Bouton "🔓 Voir la solution de référence" devient visible (style `accent-cyan`)
3. Au clic → Modal ou section dépliable avec :
   - Description de l'approche recommandée
   - Points clés à retenir
   - Pièges courants à éviter
   - Fichiers/exemples si applicable
4. Flag `a_consulte_solution = TRUE` enregistré en BDD

**Contenu de la solution de référence** (basé sur les fichiers challenges) :
- Prompt système recommandé (pour les assistants)
- Workflow type (pour les automatisations)
- Critères de réussite détaillés
- Exemples de bons outputs
- Points d'attention et pièges courants

**UI** :
```
┌─────────────────────────────────────────────┐
│ ✅ Solution soumise le 15/01/2025           │
│                                             │
│ [🔓 Voir la solution de référence]          │
│                                             │
│ Statut : En attente d'évaluation ⏳         │
└─────────────────────────────────────────────┘
```

### 10.5 Soumission

- Éditeur rich text (Tiptap)
- Upload multi-fichiers (Supabase Storage, max 50MB)
- Soumission définitive (pas de brouillon)
- Statut "En attente d'évaluation"
- Déblocage de l'accès à la solution de référence

### 10.6 Page Personnelle

- **Profil** : Email, nom, métier, marque, niveau, points (XP), badges
- **Barre de progression** vers niveau suivant
- **Mes Challenges** : 2 onglets (En cours / Terminés)
- **Pastille rouge** sur nouveaux feedbacks
- **Indicateur** si solution de référence non consultée
- **Leaderboard** : Position personnelle + Top 10 avec filtres

### 10.7 Système Mentor

- Rôle permettant d'évaluer les solutions
- **Pas de contrainte de niveau** (peut tout évaluer)
- File d'attente des solutions à évaluer
- Formulaire : Note (1-5 étoiles) + Feedback texte (min 50 car.)
- `reviewer_id` tracé pour rémunération
- Accès aux grilles d'évaluation par challenge

### 10.8 Événements Dojo

[evenement-think-agent.md]

- **Format** : 2h30 (2 créneaux d'1h, 10 ateliers en parallèle)
- **Capacité** : Max 10 personnes par atelier, jusqu'à 200 participants
- Création par Mentors/Admins
- **Tronc commun** : 7 ateliers proposés à chaque événement
- **Inscription via 360 Learning** (lien externe obligatoire)

### 10.9 Gamification

[challenges-structure.md]

**Badges** :

| Badge | Condition |
|-------|-----------|
| 🌱 Premier Pas | Premier challenge validé |
| 🛠️ Bâtisseur | Premier outil créé (Crafter) |
| 🤝 Binôme | Challenge réalisé en duo |
| 🔥 On Fire | 3 challenges validés en 1 mois |
| 🏆 Explorer Complet | Tous les challenges Explorer validés |
| 🏆 Crafter Complet | Tous les challenges Crafter validés |
| 🏆 Architect Complet | Tous les challenges Architect validés |

**Leaderboard** : Filtrable par métier, marque, niveau

### 10.10 Admin

- Dashboard KPIs : Inscriptions, challenges réalisés, répartitions par marque
- CRUD Challenges (avec champ solution de référence)
- Gestion rôles utilisateurs
- Stats de consultation des solutions de référence

---

## 11. RÈGLES MÉTIER IMPORTANTES

1. **Niveau par défaut** : Explorer
2. **Prérequis obligatoires** : "Basiques du Prompting" + "Gardien des Données" pour accéder aux autres challenges
3. **Passage niveau** : 2 challenges ≥3★ du niveau actuel
4. **Points** : XP définis par challenge (50-400 selon difficulté)
5. **Une seule soumission** par challenge par utilisateur
6. **Évaluation définitive** (pas de réassignation)
7. **Solution de référence** : Accessible uniquement après soumission
8. **Notifications** : Pastille visuelle uniquement (pas d'email)

---

## 12. SÉCURITÉ SIMPLIFIÉE

Pas d'authentification complexe. Identification par email uniquement.

**Note** : Ce système n'est pas sécurisé pour des données sensibles. Acceptable pour un MVP interne.

---

## 13. ÉLÉMENTS NON INCLUS (Phase 1)

- ❌ Authentification sécurisée (mot de passe, SSO)
- ❌ Solutions communautaires (voir les solutions des autres)
- ❌ Commentaires entre utilisateurs
- ❌ Évaluation automatique par IA
- ❌ Notifications email/push

---

## 14. OBJECTIFS ANNÉE 1

| Indicateur | Objectif |
|------------|----------|
| Taux d'inscription | 60-80% (1020-1360 users) |
| Challenges réalisés | 500 |
| % Crafters | 50% des actifs |
| Dojos organisés | 50 |

---

## 15. ANNEXE : EXEMPLES DE SOLUTIONS DE RÉFÉRENCE

### Exemple pour "Le Conseiller McKinsey"

[le-conseiller-mckinsey.md]

**Solution de référence** :
```markdown
## Prompt système recommandé
Tu es un consultant senior McKinsey avec 15 ans d'expérience...
[Prompt complet du fichier]

## Critères de réussite
- Assistant fonctionnel qui challenge vraiment
- Session de travail documentée sur un cas réel (30-45 min)
- Au moins 2 frameworks appliqués
- Au moins 1 angle mort identifié

## Pièges courants
- L'assistant qui valide tout sans challenger
- Utilisation superficielle des frameworks
- Pas d'application sur un cas concret
```

### Exemple pour "Veille Augmentée"

[veille-augmentee.md]

**Solution de référence** :
```markdown
## Architecture du workflow n8n
1. Schedule Trigger (quotidien 8h)
2. RSS Parser (sources)
3. OpenAI (filtrage pertinence)
4. OpenAI (synthèse)
5. Slack (envoi)

## Critères de réussite
- Au moins 2 sources différentes
- Filtrage par pertinence (pas de spam)
- Livraison automatique

## Format de sortie attendu
[Template de newsletter]
```
