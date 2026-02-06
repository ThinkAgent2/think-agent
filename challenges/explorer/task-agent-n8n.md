# Challenge : Mon Premier Agent n8n - Gestionnaire de Tâches

## Informations

| Champ | Valeur |
|-------|--------|
| Niveau | Explorer |
| Difficulté | ⭐⭐ (2/5) |
| Durée estimée | 45 min |
| XP | 100 |
| Participants | Solo |
| Marque | Tous |

## Description

Construis ton premier agent IA conversationnel avec n8n ! Tu vas créer un assistant capable de gérer une liste de tâches stockée dans Google Sheets : créer, lire, modifier et supprimer des tâches en langage naturel.

C'est le "Hello World" des agents IA — simple mais puissant. Tu découvriras comment un LLM peut orchestrer des outils pour agir sur des données réelles.

## Vision & Impact

Les agents IA autonomes sont la prochaine révolution. Alors que les chatbots classiques se contentent de répondre, les agents **agissent** : ils lisent des données, prennent des décisions et exécutent des actions.

Ce challenge t'initie à cette nouvelle ère. Un gestionnaire de tâches, c'est basique — mais les patterns que tu apprends ici s'appliquent à des cas bien plus complexes : CRM automatisé, support client intelligent, pilotage de projets...

## Le saviez-vous ?

Le concept d'agent IA remonte aux années 1990, mais c'est l'arrivée des LLM comme GPT-4 qui l'a rendu accessible. Aujourd'hui, avec des outils no-code comme n8n, tu peux créer en 45 minutes ce qui aurait demandé des semaines de développement il y a 2 ans.

## Objectifs pédagogiques

À la fin de ce challenge, tu sauras :
- Configurer un agent LangChain dans n8n
- Connecter un LLM (GPT-4o) comme "cerveau" de l'agent
- Ajouter une mémoire conversationnelle
- Créer des outils (Tools) que l'agent peut appeler
- Rédiger un System Prompt efficace pour guider le comportement

## Prérequis

- Compte n8n (cloud ou self-hosted)
- Compte Google avec accès à Google Sheets
- Clé API OpenAI

## Outils recommandés

- **n8n** — Plateforme d'automatisation
- **Google Sheets** — Base de données simple
- **OpenAI API** — Modèle GPT-4o

## Livrables attendus

1. **Workflow n8n fonctionnel** exporté en JSON
2. **Screenshot** de l'interface de chat avec une conversation de test
3. **Google Sheet** avec quelques tâches créées via l'agent

## Critères d'évaluation

| Critère | Points |
|---------|--------|
| L'agent répond en langage naturel | 20 |
| Création de tâches fonctionnelle | 20 |
| Lecture des tâches fonctionnelle | 20 |
| Mise à jour de tâches fonctionnelle | 20 |
| Suppression avec confirmation | 10 |
| System prompt clair et structuré | 10 |

## Instructions pas à pas

### Étape 1 : Préparer Google Sheets

1. Crée une nouvelle Google Sheet nommée "Task Manager"
2. Ajoute les colonnes en ligne 1 :
   - `Task` (nom de la tâche)
   - `Status` (TODO, IN PROGRESS, DONE)
   - `Description` (détails optionnels)
   - `Deadline` (date limite optionnelle)

### Étape 2 : Créer le workflow n8n

1. Nouveau workflow → Ajoute un nœud **Chat Trigger**
2. Ajoute un nœud **AI Agent** (LangChain)
3. Connecte le Chat Trigger à l'Agent

### Étape 3 : Configurer le LLM

1. Sous l'Agent, ajoute un nœud **OpenAI Chat Model**
2. Configure tes credentials OpenAI
3. Sélectionne le modèle `gpt-4o`

### Étape 4 : Ajouter la mémoire

1. Sous l'Agent, ajoute un nœud **Window Buffer Memory**
2. Configure `Context Window Length` à 10 (garde les 10 derniers messages)

### Étape 5 : Créer les outils Google Sheets

Ajoute 4 nœuds **Google Sheets Tool** :

**Tool 1 : Get tasks**
- Operation : Read
- Sélectionne ta Sheet

**Tool 2 : Create task**
- Operation : Append
- Map les colonnes avec `$fromAI()`

**Tool 3 : Update task**
- Operation : Update
- Matching column : `row_number`
- Map les colonnes avec `$fromAI()`

**Tool 4 : Delete task**
- Operation : Delete
- Utilise `$fromAI('Start_Row_Number')` et `$fromAI('Number_of_Rows_to_Delete')`

### Étape 6 : Rédiger le System Prompt

Dans les options de l'Agent, ajoute un System Message structuré :
- Décris les capacités de l'agent
- Liste les statuts valides (TODO, IN PROGRESS, DONE)
- Définis les règles (toujours confirmer avant suppression, etc.)
- Donne des exemples de dialogue

### Étape 7 : Tester

1. Ouvre le chat intégré n8n
2. Teste chaque fonctionnalité :
   - "Montre-moi mes tâches"
   - "Ajoute une tâche : Préparer la réunion client"
   - "Mets la tâche Réunion en cours"
   - "Supprime la tâche terminée"

---

## Solution de référence

### Architecture du workflow

```
[Chat Trigger] → [AI Agent]
                     ↑
         ┌──────────┼──────────┐
         │          │          │
    [Model]    [Memory]    [Tools]
    GPT-4o     Buffer      - Get tasks
                           - Create task
                           - Update task  
                           - Delete task
```

### System Prompt recommandé

```markdown
# Task Management Agent

Tu es un assistant de gestion de tâches. Tu aides les utilisateurs à organiser leurs tâches via Google Sheets.

## Capacités
- Voir les tâches et leur statut
- Créer de nouvelles tâches
- Mettre à jour les tâches existantes
- Supprimer des tâches (avec confirmation)

## Structure des données
- **Task** : Nom de la tâche (obligatoire)
- **Status** : TODO, IN PROGRESS, ou DONE
- **Description** : Détails optionnels
- **Deadline** : Date limite optionnelle

## Règles importantes
1. Statut par défaut : TODO
2. Toujours confirmer avant suppression
3. Demander le nom si non fourni
4. Être concis et utile

## Exemples
- "Ajoute une tâche" → Demander le nom
- "Marque comme fait" → Status = DONE
- "Supprime X" → Demander confirmation
```

### Workflow JSON complet

Le fichier `task-agent-n8n.json` contient le workflow exportable directement importable dans n8n.

---

## Animation d'atelier (pour les Mentors)

### Format
- **Durée** : 1h30 (45min guidé + 45min autonome)
- **Participants** : 4-8 personnes
- **Niveau requis** : Aucun (débutant friendly)

### Déroulé

| Temps | Phase | Activité |
|-------|-------|----------|
| 0-10 | Intro | Présenter les agents IA, montrer le résultat final |
| 10-25 | Setup | Créer la Sheet, configurer les credentials n8n |
| 25-45 | Build | Construction guidée du workflow |
| 45-60 | Test | Tests en groupe, debug collectif |
| 60-80 | Perso | Chacun personnalise son agent |
| 80-90 | Debrief | Partage des variantes, Q&A |

### Points d'attention

- **Credentials** : Prévoir du temps, c'est souvent le blocage #1
- **$fromAI()** : Expliquer que c'est la "magie" qui permet au LLM de remplir les champs
- **row_number** : Google Sheets l'ajoute automatiquement, pas besoin de le créer

### Variantes suggérées

Pour les plus rapides :
- Ajouter un champ "Priority" (High/Medium/Low)
- Envoyer une notification Slack quand une tâche est créée
- Ajouter un récap quotidien des tâches en cours

### Ressources

- [Documentation n8n AI Agents](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/)
- [Google Sheets Tool](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-base.googlesheetstool/)
