# AgCraft - Boss Final (Architect)

## 1. Résolution du Challenge

### Objectif
Créer une interface de jeu de stratégie (type RTS) pour piloter une équipe d'agents IA. Visualisation temps réel des tâches, allocation des ressources, gestion des priorités.

### Éléments clés

Ce challenge est de niveau ⭐⭐⭐⭐⭐ (16h) - **Projet Capstone**.

#### Concept

Imaginez StarCraft, mais au lieu de contrôler des unités militaires, vous pilotez une équipe d'agents IA :
- **Visualisation** : Voir vos agents travailler en temps réel
- **Allocation** : Assigner des tâches aux bons agents
- **Priorisation** : Gérer les urgences et les ressources
- **Stratégie** : Optimiser l'ensemble du système

#### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                       AGCRAFT                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │                    GAME UI                          ││
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   ││
│  │  │ Agent 1 │ │ Agent 2 │ │ Agent 3 │ │ Agent 4 │   ││
│  │  │ 🔵 Idle │ │ 🟢 Work │ │ 🟡 Queue│ │ 🔴 Error│   ││
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘   ││
│  │                                                      ││
│  │  ┌──────────────────────────────────────────────┐   ││
│  │  │              TASK QUEUE                       │   ││
│  │  │  📋 Task A (High) → Agent 2                   │   ││
│  │  │  📋 Task B (Med)  → Waiting                   │   ││
│  │  │  📋 Task C (Low)  → Agent 1 assigned          │   ││
│  │  └──────────────────────────────────────────────┘   ││
│  │                                                      ││
│  │  ┌──────────────────────────────────────────────┐   ││
│  │  │              RESOURCES                        │   ││
│  │  │  💰 API Credits: 8,432 / 10,000               │   ││
│  │  │  ⏱️ Time: 14:32:08                            │   ││
│  │  │  📊 Throughput: 12 tasks/hour                 │   ││
│  │  └──────────────────────────────────────────────┘   ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │                ORCHESTRATION ENGINE                  ││
│  │  • Task routing (capabilities matching)             ││
│  │  • Load balancing                                   ││
│  │  • Priority management                              ││
│  │  • Error handling & retry                           ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │                   AGENT FLEET                        ││
│  │  🤖 Agent 1: Research (Claude)                      ││
│  │  🤖 Agent 2: Coding (GPT-4)                         ││
│  │  🤖 Agent 3: Writing (Claude)                       ││
│  │  🤖 Agent 4: Analysis (GPT-4)                       ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### Composants techniques

| Composant | Technologies | Responsabilité |
|-----------|--------------|----------------|
| **Frontend** | React/Vue + WebSocket | Visualisation temps réel |
| **Backend** | FastAPI/Node.js | Orchestration, API |
| **Agents** | OpenClaw, n8n, custom | Exécution des tâches |
| **Queue** | Redis, RabbitMQ | File de tâches |
| **Storage** | PostgreSQL | Historique, logs |

#### Fonctionnalités de jeu

**1. Agent Cards**
```typescript
interface AgentCard {
  id: string;
  name: string;
  type: 'researcher' | 'coder' | 'writer' | 'analyst';
  status: 'idle' | 'working' | 'queued' | 'error';
  currentTask?: Task;
  capabilities: string[];
  stats: {
    tasksCompleted: number;
    avgTime: number;
    successRate: number;
  };
}
```

**2. Task Queue**
```typescript
interface Task {
  id: string;
  title: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  requiredCapabilities: string[];
  status: 'pending' | 'assigned' | 'running' | 'completed' | 'failed';
  assignedTo?: string;
  progress: number;  // 0-100
  createdAt: Date;
  completedAt?: Date;
}
```

**3. Drag & Drop Assignment**
- Glisser une tâche sur un agent pour l'assigner
- Glisser un agent sur un autre pour transférer les tâches
- Double-clic pour voir les détails

**4. Resource Management**
- Budget API tokens (ne pas dépasser la limite)
- Time tracking (SLA sur les tâches)
- Parallel execution limit

#### Game Loop

```
while (game_running) {
    // 1. Check for new tasks
    new_tasks = fetch_incoming_tasks()
    add_to_queue(new_tasks)
    
    // 2. Check agent status
    for agent in agents:
        if agent.status == 'completed':
            handle_completion(agent.current_task)
            agent.status = 'idle'
        if agent.status == 'error':
            handle_error(agent)
    
    // 3. Assign pending tasks
    for task in queue.pending:
        available_agent = find_capable_idle_agent(task)
        if available_agent:
            assign(task, available_agent)
    
    // 4. Update UI
    broadcast_state_to_clients()
    
    // 5. Check win/lose conditions
    if all_tasks_completed():
        show_victory_screen()
    if resources_exhausted():
        show_game_over()
    
    sleep(1 second)
}
```

#### Métriques de scoring

| Métrique | Points | Description |
|----------|--------|-------------|
| Tasks completed | +10/task | Base score |
| Speed bonus | +5 if < SLA | Rapidité |
| Efficiency | +tokens saved × 0.01 | Économie |
| Error penalty | -15/error | Fiabilité |
| Streak bonus | +5 × streak | Consistance |

### Critères de réussite
- Prototype jouable avec agents réels intégrés
- Visualisation temps réel fonctionnelle
- Système d'allocation des tâches
- Fun factor (agréable à utiliser)

---

## 2. Animation Dojo (éléments clés)

**Durée** : 16h+ (Hackathon ou projet de fin de parcours)

**Format suggéré** : Équipe de 3-5 personnes

| Rôle | Responsabilité |
|------|----------------|
| **Frontend Lead** | UI React/Vue, animations |
| **Backend Lead** | API, orchestration |
| **Agent Engineer** | Intégration agents IA |
| **Designer** | UX, game feel |
| **PM/QA** | Coordination, tests |

**Déroulé suggéré (2 jours)** :
- Jour 1 matin : Architecture + setup
- Jour 1 après-midi : Core features (agents, queue)
- Jour 2 matin : UI + intégration
- Jour 2 après-midi : Polish + démo

**Critères de jugement** :
- Innovation (originalité de l'approche)
- Fonctionnalité (ça marche vraiment)
- Fun (envie de l'utiliser)
- Polish (qualité de finition)
