-- Challenge: Mon Premier Agent n8n - Gestionnaire de Tâches
-- Marque: Tous (accessible à tous les collaborateurs)

INSERT INTO challenges (
  titre,
  description,
  niveau_associe,
  type,
  difficulte,
  duree_estimee,
  type_evaluation,
  outils_recommandes,
  criteres_evaluation,
  xp,
  statut,
  solution_reference,
  solution_fichiers,
  marque,
  participants,
  livrables,
  vision_impact,
  le_saviez_vous,
  sources
) VALUES (
  'Mon Premier Agent n8n - Gestionnaire de Tâches',
  
  'Construis ton premier agent IA conversationnel avec n8n ! Tu vas créer un assistant capable de gérer une liste de tâches stockée dans Google Sheets : créer, lire, modifier et supprimer des tâches en langage naturel.

C''est le "Hello World" des agents IA — simple mais puissant. Tu découvriras comment un LLM peut orchestrer des outils pour agir sur des données réelles.',
  
  'Explorer',
  'Exercice',
  2,
  '45 min',
  'Manuelle',
  
  ARRAY['n8n', 'Google Sheets', 'OpenAI API'],
  
  'Critères d''évaluation :
• L''agent répond en langage naturel (20 pts)
• Création de tâches fonctionnelle (20 pts)
• Lecture des tâches fonctionnelle (20 pts)
• Mise à jour de tâches fonctionnelle (20 pts)
• Suppression avec confirmation (10 pts)
• System prompt clair et structuré (10 pts)',
  
  100,
  'Actif',
  
  '## Architecture du workflow

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

## Étapes clés

1. **Chat Trigger** : Point d''entrée conversationnel
2. **AI Agent** (LangChain) : Le cerveau qui orchestre tout
3. **OpenAI Chat Model** : GPT-4o comme LLM
4. **Window Buffer Memory** : Garde les 10 derniers messages
5. **4 Google Sheets Tools** : CRUD complet sur les tâches

## System Prompt recommandé

```
# Task Management Agent

Tu es un assistant de gestion de tâches via Google Sheets.

## Capacités
- Voir, créer, modifier et supprimer des tâches

## Structure des données
- Task (obligatoire), Status (TODO/IN PROGRESS/DONE), Description, Deadline

## Règles
- Statut par défaut : TODO
- Toujours confirmer avant suppression
- Demander le nom si non fourni
```

## Points techniques

- Utiliser `$fromAI()` pour permettre au LLM de remplir dynamiquement les champs
- `row_number` est généré automatiquement par Google Sheets (utile pour Update/Delete)
- La mémoire contextuelle permet des conversations naturelles multi-tours',

  ARRAY['https://github.com/fxlainr/think-agent/blob/main/challenges/explorer/task-agent-n8n.json'],
  
  'Tous',
  'Solo',
  
  ARRAY[
    'Workflow n8n fonctionnel exporté en JSON',
    'Screenshot de l''interface de chat avec une conversation de test',
    'Google Sheet avec quelques tâches créées via l''agent'
  ],
  
  'Les agents IA autonomes sont la prochaine révolution. Alors que les chatbots classiques se contentent de répondre, les agents **agissent** : ils lisent des données, prennent des décisions et exécutent des actions.

Ce challenge t''initie à cette nouvelle ère. Un gestionnaire de tâches, c''est basique — mais les patterns que tu apprends ici s''appliquent à des cas bien plus complexes : CRM automatisé, support client intelligent, pilotage de projets...',
  
  'Le concept d''agent IA remonte aux années 1990, mais c''est l''arrivée des LLM comme GPT-4 qui l''a rendu accessible. Aujourd''hui, avec des outils no-code comme n8n, tu peux créer en 45 minutes ce qui aurait demandé des semaines de développement il y a 2 ans.',
  
  ARRAY[
    'https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/',
    'https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-base.googlesheetstool/'
  ]
);

-- Note: Pour éviter les doublons, vérifier avant d'exécuter :
-- SELECT id, titre FROM challenges WHERE titre LIKE '%Agent n8n%';
-- Si le challenge existe déjà, utiliser UPDATE au lieu de INSERT.
