# L'Employé Numérique (Architect - Forge/IT)

## 1. Résolution du Challenge

### Objectif
Concevoir un agent capable de créer, modifier et superviser des workflows n8n à distance. L'agent comprend les besoins en langage naturel et les traduit en automatisations.

### Éléments clés

Ce challenge est de niveau ⭐⭐⭐⭐ (4h).

#### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   DIGITAL EMPLOYEE                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐                      ┌─────────────┐   │
│  │   Natural   │                      │   n8n       │   │
│  │   Language  │───▶ Agent IA ───────▶│   API       │   │
│  │   Request   │                      │             │   │
│  └─────────────┘                      └─────────────┘   │
│         │                                    │          │
│         │         ┌─────────────┐            │          │
│         └────────▶│  Knowledge  │◀───────────┘          │
│                   │  Base       │                       │
│                   │  (workflows)│                       │
│                   └─────────────┘                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### Capacités de l'agent

| Capacité | API n8n | Exemple |
|----------|---------|---------|
| Créer workflow | POST /workflows | "Crée un workflow qui envoie un email chaque matin" |
| Modifier workflow | PATCH /workflows/{id} | "Ajoute une étape de validation" |
| Activer/Désactiver | POST /workflows/{id}/activate | "Mets en pause le workflow X" |
| Lister workflows | GET /workflows | "Quels workflows sont actifs ?" |
| Voir exécutions | GET /executions | "Le workflow a-t-il fonctionné hier ?" |

#### Prompt système de l'agent

```
Tu es un expert n8n capable de créer et modifier des workflows via l'API.

## Tes capacités
1. Créer des workflows à partir de descriptions en langage naturel
2. Modifier des workflows existants
3. Diagnostiquer des problèmes d'exécution
4. Suggérer des améliorations

## Quand tu crées un workflow
1. Identifie le trigger (déclencheur)
2. Liste les étapes de transformation
3. Définis la sortie (action finale)
4. Génère le JSON n8n correspondant

## Format de workflow n8n
{
  "name": "Nom du workflow",
  "nodes": [...],
  "connections": {...},
  "settings": {...}
}

## Exemples de nodes courants
- Schedule Trigger : Déclenchement périodique
- Webhook : Déclenchement externe
- HTTP Request : Appel API
- OpenAI : Traitement IA
- Slack/Email : Notifications
- IF : Conditions
- Code : Logique custom
```

#### Workflow n8n de l'agent lui-même

```json
{
  "name": "Digital Employee",
  "nodes": [
    {
      "name": "Webhook - Request",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "digital-employee",
        "method": "POST"
      }
    },
    {
      "name": "Understand Request",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "parameters": {
        "prompt": "L'utilisateur demande : {{$json.request}}\n\nClassifie : create_workflow, modify_workflow, status_check, troubleshoot"
      }
    },
    {
      "name": "Route Action",
      "type": "n8n-nodes-base.switch"
    },
    {
      "name": "Create Workflow",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "{{$env.N8N_URL}}/api/v1/workflows",
        "method": "POST"
      }
    }
  ]
}
```

### Critères de réussite
- Agent capable de créer un workflow par conversation
- Modification de workflow existant
- Diagnostic de problème d'exécution

---

## 2. Animation Dojo (éléments clés)

**Durée** : 4h (workshop Architect)

**Déroulé suggéré** :
- 1h : Théorie API n8n + architecture d'agent
- 1h30 : Construction de l'agent
- 1h : Tests création/modification workflows
- 30min : Documentation et edge cases
