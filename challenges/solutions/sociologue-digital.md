# Le Sociologue Digital (Architect - Value)

## 1. Résolution du Challenge

### Objectif
Analyser les dynamiques sociales d'une organisation via l'Organizational Network Analysis (ONA) : silos, connecteurs clés, risques. Privacy by Design obligatoire.

### Éléments clés

Ce challenge est de niveau ⭐⭐⭐⭐⭐ (16h).

#### Qu'est-ce que l'ONA ?

L'Organizational Network Analysis cartographie les relations réelles (pas l'organigramme) pour identifier :
- **Connecteurs** : Personnes clés qui font circuler l'info
- **Silos** : Groupes isolés
- **Bottlenecks** : Points de congestion
- **Risques** : Personnes critiques (bus factor)

#### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   ONA ANALYSIS SYSTEM                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Data      │───▶│  Anonymize  │───▶│   Graph     │  │
│  │   (raw)     │    │   (RGPD)    │    │   (NetworkX)│  │
│  └─────────────┘    └─────────────┘    └─────────────┘  │
│                                               │          │
│  ┌─────────────┐    ┌─────────────┐          ▼          │
│  │   Insights  │◀───│   Analyze   │◀──────────┘         │
│  │   (rapport) │    │   (metrics) │                     │
│  └─────────────┘    └─────────────┘                     │
│                                                          │
│  ⚠️ PRIVACY BY DESIGN                                    │
│  • Anonymisation avant analyse                          │
│  • Pas de surveillance individuelle                     │
│  • Résultats agrégés uniquement                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### Sources de données (anonymisées)

| Source | Données | Risque privacy |
|--------|---------|----------------|
| Email metadata | Qui→Qui (pas le contenu) | Moyen |
| Calendrier | Participants réunions | Moyen |
| Slack/Teams | Canaux, mentions | Moyen |
| Survey | Relations déclarées | Faible |

⚠️ **Jamais le contenu des messages, uniquement les métadonnées relationnelles.**

#### Métriques de graphe

| Métrique | Définition | Insight |
|----------|------------|---------|
| **Degree centrality** | Nombre de connexions | Qui est bien connecté |
| **Betweenness centrality** | Nb chemins passant par le nœud | Qui fait le pont |
| **Clustering coefficient** | Connexion des voisins entre eux | Silos |
| **PageRank** | Importance pondérée | Influenceurs |

#### Code Python (éléments clés)

```python
import networkx as nx
import pandas as pd

# Construire le graphe à partir des interactions
def build_graph(interactions: pd.DataFrame) -> nx.Graph:
    G = nx.Graph()
    for _, row in interactions.iterrows():
        G.add_edge(
            row['from_id'],  # ID anonyme
            row['to_id'],
            weight=row['count']
        )
    return G

# Calculer les métriques
def analyze_network(G: nx.Graph) -> dict:
    return {
        'degree_centrality': nx.degree_centrality(G),
        'betweenness_centrality': nx.betweenness_centrality(G),
        'clustering': nx.clustering(G),
        'pagerank': nx.pagerank(G),
        'communities': list(nx.community.louvain_communities(G))
    }

# Identifier les risques
def identify_risks(G: nx.Graph, metrics: dict) -> list:
    risks = []
    
    # Personnes critiques (betweenness élevé)
    for node, score in metrics['betweenness_centrality'].items():
        if score > 0.3:  # Seuil à ajuster
            risks.append({
                'type': 'key_connector',
                'node': node,
                'risk': 'Bus factor - personne critique pour la circulation de l\'info'
            })
    
    return risks
```

#### Visualisation

```python
import matplotlib.pyplot as plt

def visualize_network(G: nx.Graph, communities: list):
    pos = nx.spring_layout(G)
    colors = [i for i, com in enumerate(communities) for _ in com]
    
    nx.draw(G, pos, 
            node_color=colors, 
            node_size=[G.degree(n)*100 for n in G.nodes()],
            cmap=plt.cm.Set3)
    plt.savefig('network.png')
```

#### Considérations éthiques (obligatoires)

1. **Consentement** : Informer les participants
2. **Anonymisation** : IDs randomisés, pas de noms
3. **Agrégation** : Résultats par groupe, pas individuel
4. **Finalité** : Amélioration collective, pas surveillance
5. **Droit d'accès** : Permettre de se retirer

### Critères de réussite
- Pipeline d'analyse fonctionnel
- Visualisation du graphe
- Rapport avec insights actionnables
- Guide RGPD intégré

---

## 2. Animation Dojo (éléments clés)

**Durée** : 16h (projet équipe sur 2 jours)

**Déroulé suggéré** :
- Jour 1 matin : Théorie ONA + éthique
- Jour 1 après-midi : Setup données + anonymisation
- Jour 2 matin : Analyse et métriques
- Jour 2 après-midi : Visualisation + rapport
