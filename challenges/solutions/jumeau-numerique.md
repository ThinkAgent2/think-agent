# Le Jumeau Numérique (Architect - Nilo)

## 1. Résolution du Challenge

### Objectif
Créer un système de simulation industrielle avec optimisation par agents : modélisation d'une ligne de production, tests de configurations, identification des goulots.

### Éléments clés

Ce challenge est de niveau ⭐⭐⭐⭐⭐ (16h).

#### Concept de Digital Twin

Un jumeau numérique est une réplique virtuelle d'un système physique qui permet de :
- **Simuler** : Tester des configurations sans risque
- **Prédire** : Anticiper les problèmes
- **Optimiser** : Trouver la meilleure configuration
- **Monitorer** : Suivre en temps réel

#### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    DIGITAL TWIN SYSTEM                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  PHYSICAL WORLD              │    DIGITAL WORLD          │
│  ┌─────────────┐             │    ┌─────────────┐       │
│  │   Sensors   │────────────►│───▶│   Model     │       │
│  │   (IoT)     │             │    │   (SimPy)   │       │
│  └─────────────┘             │    └──────┬──────┘       │
│                              │           │              │
│  ┌─────────────┐             │    ┌──────▼──────┐       │
│  │   Actuators │◄────────────│◄───│  Optimizer  │       │
│  │             │             │    │   (Agent)   │       │
│  └─────────────┘             │    └──────┬──────┘       │
│                              │           │              │
│                              │    ┌──────▼──────┐       │
│                              │    │  Dashboard  │       │
│                              │    │  (Visu)     │       │
│                              │    └─────────────┘       │
│                              │                          │
└─────────────────────────────────────────────────────────┘
```

#### Modélisation avec SimPy (Python)

```python
import simpy
import random

class ProductionLine:
    def __init__(self, env, config):
        self.env = env
        self.config = config
        
        # Ressources
        self.machine_a = simpy.Resource(env, capacity=config['machine_a_capacity'])
        self.machine_b = simpy.Resource(env, capacity=config['machine_b_capacity'])
        self.operators = simpy.Resource(env, capacity=config['operators'])
        
        # Métriques
        self.completed = 0
        self.wait_times = []
        self.cycle_times = []
    
    def process_item(self, item_id):
        arrival = self.env.now
        
        # Machine A
        with self.machine_a.request() as req:
            yield req
            yield self.env.timeout(random.normalvariate(
                self.config['machine_a_time'], 
                self.config['machine_a_variance']
            ))
        
        # Machine B
        with self.machine_b.request() as req:
            yield req
            yield self.env.timeout(random.normalvariate(
                self.config['machine_b_time'], 
                self.config['machine_b_variance']
            ))
        
        # Contrôle qualité (opérateur)
        with self.operators.request() as req:
            yield req
            yield self.env.timeout(self.config['qc_time'])
        
        self.completed += 1
        self.cycle_times.append(self.env.now - arrival)

def run_simulation(config, duration=480):  # 8h = 480 min
    env = simpy.Environment()
    line = ProductionLine(env, config)
    
    # Générer des items à produire
    def item_generator():
        item_id = 0
        while True:
            yield env.timeout(random.expovariate(1/config['arrival_rate']))
            env.process(line.process_item(item_id))
            item_id += 1
    
    env.process(item_generator())
    env.run(until=duration)
    
    return {
        'throughput': line.completed,
        'avg_cycle_time': sum(line.cycle_times) / len(line.cycle_times),
        'bottleneck': identify_bottleneck(line)
    }
```

#### Agent d'optimisation

```python
def optimize_config(base_config, budget):
    """
    Agent qui teste différentes configurations
    et recommande la meilleure dans le budget.
    """
    
    scenarios = [
        {'name': 'Base', 'config': base_config, 'cost': 0},
        {'name': '+1 Machine A', 'config': {**base_config, 'machine_a_capacity': 2}, 'cost': 50000},
        {'name': '+1 Operator', 'config': {**base_config, 'operators': 3}, 'cost': 30000},
        {'name': 'Upgrade Machine B', 'config': {**base_config, 'machine_b_time': 4}, 'cost': 80000},
    ]
    
    results = []
    for scenario in scenarios:
        if scenario['cost'] <= budget:
            sim_result = run_simulation(scenario['config'])
            roi = calculate_roi(sim_result, scenario['cost'])
            results.append({**scenario, **sim_result, 'roi': roi})
    
    # Trier par ROI
    results.sort(key=lambda x: x['roi'], reverse=True)
    
    return results[0]  # Meilleure option
```

#### Identification des goulots

| Indicateur | Calcul | Goulot si... |
|------------|--------|--------------|
| Utilisation | Temps occupé / Temps total | > 85% |
| File d'attente | Nb items en attente | Croissante |
| Temps de cycle | Temps à cette étape | > autres étapes |

#### Visualisation recommandée

- **Gantt chart** : Visualiser les séquences
- **Utilization heatmap** : Voir les goulots
- **Throughput over time** : Évolution de la production

### Critères de réussite
- Modèle de simulation fonctionnel
- Agents d'optimisation testant plusieurs configs
- Visualisation des résultats
- Gains quantifiés

---

## 2. Animation Dojo (éléments clés)

**Durée** : 16h (projet équipe sur 2 jours)

**Déroulé suggéré** :
- Jour 1 matin : Théorie simulation + SimPy
- Jour 1 après-midi : Modélisation ligne de production
- Jour 2 matin : Agent d'optimisation
- Jour 2 après-midi : Visualisation + analyse des résultats
