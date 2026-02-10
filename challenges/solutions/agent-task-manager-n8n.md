# Mon Premier Agent n8n - Gestionnaire de Tâches

## 1. Résolution du Challenge

### Objectif
Construire un agent IA conversationnel avec n8n capable de gérer une liste de tâches stockée dans Google Sheets : créer, lire, modifier et supprimer des tâches en langage naturel.

### Architecture de la solution

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

### Prérequis
- Compte n8n (cloud ou self-hosted)
- Compte Google avec accès à Google Sheets
- Clé API OpenAI

### Étapes de construction

#### Étape 1 : Préparer Google Sheets

Crée une nouvelle Google Sheet avec les colonnes :
| Task | Status | Description | Deadline |
|------|--------|-------------|----------|
| (nom) | TODO/IN PROGRESS/DONE | (détails) | (date) |

#### Étape 2 : Créer le workflow n8n

1. Nouveau workflow → Ajoute un nœud **Chat Trigger**
2. Ajoute un nœud **AI Agent** (LangChain)
3. Connecte le Chat Trigger à l'Agent

#### Étape 3 : Configurer le LLM

1. Sous l'Agent, ajoute **OpenAI Chat Model**
2. Configure tes credentials OpenAI
3. Sélectionne `gpt-4o`

#### Étape 4 : Ajouter la mémoire

1. Sous l'Agent, ajoute **Window Buffer Memory**
2. Configure `Context Window Length` à 10

#### Étape 5 : Créer les outils Google Sheets

**Tool 1 : Get tasks** (Read)
- Sélectionne ta Sheet

**Tool 2 : Create task** (Append)
```javascript
{
  "Task": "={{ $fromAI('Task', '', 'string') }}",
  "Status": "={{ $fromAI('Status', '', 'string') }}",
  "Description": "={{ $fromAI('Description', '', 'string') }}",
  "Deadline": "={{ $fromAI('Deadline', '', 'string') }}"
}
```

**Tool 3 : Update task** (Update)
- Matching column : `row_number`
- Mêmes mappings + `row_number`

**Tool 4 : Delete task** (Delete)
```javascript
startIndex: "={{ $fromAI('Start_Row_Number', '', 'number') }}"
numberToDelete: "={{ $fromAI('Number_of_Rows_to_Delete', '', 'number') }}"
```

#### Étape 6 : System Prompt

```markdown
# Task Management Agent

Tu es un assistant de gestion de tâches via Google Sheets.

## Capacités
- Voir, créer, modifier et supprimer des tâches

## Structure des données
- **Task** : Nom de la tâche (obligatoire)
- **Status** : TODO, IN PROGRESS, ou DONE (défaut: TODO)
- **Description** : Détails optionnels
- **Deadline** : Date limite optionnelle

Note: Google Sheets fournit automatiquement un champ row_number.

## Règles importantes

### Gestion des statuts
- Statuts valides : "TODO", "IN PROGRESS", "DONE"
- Nouveau tâche = "TODO" par défaut
- "marquer comme terminé" → Status = "DONE"
- "commencer" → Status = "IN PROGRESS"

### Création de tâches
1. Toujours demander le nom si non fourni
2. Proposer d'ajouter une description (optionnel)
3. Demander la deadline si pertinent (optionnel)

### Suppression
- TOUJOURS demander confirmation avant de supprimer
- Montrer les détails de la tâche
- Ne procéder qu'après confirmation explicite

## Style
- Être utile et efficace
- Toujours confirmer les actions effectuées
- Langage amical et professionnel
```

### Tests de validation

Teste ces scénarios dans le chat n8n :
1. "Montre-moi mes tâches"
2. "Ajoute une tâche : Préparer la réunion client"
3. "Mets la tâche Réunion en cours"
4. "Marque Réunion comme terminée"
5. "Supprime la tâche terminée" → doit demander confirmation

### Workflow JSON complet

Le fichier exportable est disponible dans le repo : `challenges/explorer/task-agent-n8n.json`

---

## 2. Animation Dojo Challenge (1h30, 4-8 personnes)

### Matériel nécessaire
- Chaque participant : laptop + compte n8n + compte Google
- Animateur : écran partagé, workflow de démo fonctionnel
- Clés API OpenAI (prévoir des clés de test ou demander aux participants)

### Déroulé détaillé

| Temps | Phase | Activité | Tips animateur |
|-------|-------|----------|----------------|
| 0-10 | Intro | Présenter les agents IA vs chatbots classiques. Montrer le résultat final en live. | Faire une démo impressionnante : "Supprime toutes les tâches terminées" |
| 10-25 | Setup | Créer la Sheet, configurer les credentials n8n/Google/OpenAI | C'est le moment qui bloque le plus. Prévoir du support individuel |
| 25-45 | Build | Construction guidée pas à pas | Partager ton écran, faire chaque étape ensemble |
| 45-60 | Test | Tests en groupe, debug collectif | Demander à chacun de partager un bug rencontré |
| 60-80 | Perso | Chacun personnalise son agent | Proposer des idées (voir variantes) |
| 80-90 | Debrief | Partage des variantes, Q&A | Faire une démo des meilleures personnalisations |

### Points d'attention

- **Credentials** : Le setup Google OAuth peut être long. Si possible, préparer à l'avance.
- **$fromAI()** : Bien expliquer que c'est la "magie" qui permet au LLM de comprendre quels champs remplir.
- **row_number** : Google Sheets l'ajoute automatiquement, pas besoin de le créer dans la Sheet.
- **Tokens** : Surveiller la consommation API si clés partagées.

### Variantes suggérées (pour les plus rapides)

1. **Ajouter Priority** : Champ High/Medium/Low
2. **Notification Slack** : Envoyer un message quand une tâche est créée
3. **Récap quotidien** : Cron qui liste les tâches "IN PROGRESS" chaque matin
4. **Multi-projets** : Ajouter un champ "Projet" et filtrer par projet
5. **Deadlines** : Alerter sur les tâches dont la deadline approche

### Questions fréquentes

**Q : Pourquoi GPT-4o et pas GPT-3.5 ?**
R : GPT-4o est meilleur pour comprendre les instructions complexes du system prompt et pour appeler les bons outils. GPT-3.5 fonctionne mais fait plus d'erreurs.

**Q : Ça coûte combien ?**
R : Environ $0.01-0.02 par conversation de test. Un atelier complet ~$1-2 par participant.

**Q : Je peux utiliser Claude à la place ?**
R : Oui, n8n supporte Anthropic. Le setup est quasi identique.

### Critères de réussite de l'atelier

- [ ] 100% des participants ont un workflow fonctionnel
- [ ] Chacun a testé les 4 opérations CRUD
- [ ] Au moins 50% ont ajouté une personnalisation

### Ressources complémentaires

- [Documentation n8n AI Agents](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/)
- [Google Sheets Tool](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-base.googlesheetstool/)

---

## 3. Informations Challenge (pour la base)

| Champ | Valeur |
|-------|--------|
| **Titre** | Mon Premier Agent n8n - Gestionnaire de Tâches |
| **Niveau** | Explorer |
| **Type** | Exercice |
| **Difficulté** | 2/5 |
| **Durée** | 45 min |
| **XP** | 100 |
| **Marque** | Tous |
| **Participants** | Solo |
| **Évaluation** | Manuelle |
| **Outils** | n8n, Google Sheets, OpenAI API |

### Description
Construis ton premier agent IA conversationnel avec n8n ! Tu vas créer un assistant capable de gérer une liste de tâches stockée dans Google Sheets : créer, lire, modifier et supprimer des tâches en langage naturel.

C'est le "Hello World" des agents IA — simple mais puissant. Tu découvriras comment un LLM peut orchestrer des outils pour agir sur des données réelles.

### Vision & Impact
Les agents IA autonomes sont la prochaine révolution. Alors que les chatbots classiques se contentent de répondre, les agents **agissent** : ils lisent des données, prennent des décisions et exécutent des actions.

Ce challenge t'initie à cette nouvelle ère. Un gestionnaire de tâches, c'est basique — mais les patterns que tu apprends ici s'appliquent à des cas bien plus complexes : CRM automatisé, support client intelligent, pilotage de projets...

### Le saviez-vous ?
Le concept d'agent IA remonte aux années 1990, mais c'est l'arrivée des LLM comme GPT-4 qui l'a rendu accessible. Aujourd'hui, avec des outils no-code comme n8n, tu peux créer en 45 minutes ce qui aurait demandé des semaines de développement il y a 2 ans.

### Livrables attendus
- Workflow n8n fonctionnel exporté en JSON
- Screenshot de l'interface de chat avec une conversation de test
- Google Sheet avec quelques tâches créées via l'agent

### Critères d'évaluation
- L'agent répond en langage naturel (20 pts)
- Création de tâches fonctionnelle (20 pts)
- Lecture des tâches fonctionnelle (20 pts)
- Mise à jour de tâches fonctionnelle (20 pts)
- Suppression avec confirmation (10 pts)
- System prompt clair et structuré (10 pts)
