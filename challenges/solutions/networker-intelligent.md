# Le Networker Intelligent (Architect - Value)

## 1. Résolution du Challenge

### Objectif
Construire un système de matching sémantique pour connecter les experts de la communauté eXalt via Vector Embeddings.

### Éléments clés

Ce challenge est de niveau ⭐⭐⭐⭐⭐ (16h).

#### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 SEMANTIC MATCHING SYSTEM                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Profiles  │───▶│  Embedding  │───▶│   Vector    │  │
│  │             │    │   (OpenAI)  │    │   DB        │  │
│  │ • Skills    │    │             │    │ (Pinecone)  │  │
│  │ • Interests │    │             │    │             │  │
│  │ • Projects  │    │             │    │             │  │
│  └─────────────┘    └─────────────┘    └─────────────┘  │
│                                               │          │
│                                               ▼          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Query     │───▶│   Search    │───▶│   Matches   │  │
│  │   (besoin)  │    │   (cosine)  │    │   (ranked)  │  │
│  └─────────────┘    └─────────────┘    └─────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### Technologies

| Composant | Options | Recommandation |
|-----------|---------|----------------|
| Embeddings | OpenAI, Cohere, Hugging Face | OpenAI text-embedding-3-small |
| Vector DB | Pinecone, Weaviate, Chroma, Qdrant | Pinecone (managed) ou Chroma (local) |
| Backend | Python, Node.js | Python (langchain) |
| API | FastAPI, Express | FastAPI |

#### Structure de profil

```python
profile = {
    "id": "uuid",
    "name": "Jean Dupont",
    "role": "Data Engineer",
    "skills": ["Python", "Spark", "dbt", "Airflow"],
    "interests": ["MLOps", "Data mesh", "FinOps"],
    "projects": ["Migration BigQuery", "Data platform startup"],
    "certifications": ["GCP Professional Data Engineer"],
    "location": "Paris",
    "availability": "disponible",
    
    # Texte enrichi pour embedding
    "rich_text": """
    Data Engineer senior spécialisé en Python et Spark.
    Expérience en migration BigQuery et construction de data platforms.
    Intérêts : MLOps, Data mesh, optimisation des coûts cloud.
    """
}
```

#### Code Python (éléments clés)

```python
from openai import OpenAI
from pinecone import Pinecone

# Créer l'embedding d'un profil
def embed_profile(profile: dict) -> list[float]:
    client = OpenAI()
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=profile["rich_text"]
    )
    return response.data[0].embedding

# Indexer dans Pinecone
def index_profile(profile: dict):
    embedding = embed_profile(profile)
    index.upsert(vectors=[{
        "id": profile["id"],
        "values": embedding,
        "metadata": {
            "name": profile["name"],
            "skills": profile["skills"],
            "role": profile["role"]
        }
    }])

# Recherche sémantique
def find_experts(query: str, top_k: int = 5) -> list:
    query_embedding = embed_text(query)
    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )
    return results.matches
```

#### Cas d'usage

| Query | Matching |
|-------|----------|
| "Expert Kubernetes pour migration cloud" | DevOps avec XP K8s |
| "Besoin d'un PM qui connaît la fintech" | PM avec projets finance |
| "Quelqu'un pour du pair programming Python" | Dev Python dispo |

### Critères de réussite
- Système de matching fonctionnel
- API de recherche exposée
- Démo avec données réelles ou fictives

---

## 2. Animation Dojo (éléments clés)

**Durée** : 16h (projet équipe sur 2 jours)

**Déroulé suggéré** :
- Jour 1 matin : Théorie embeddings + architecture
- Jour 1 après-midi : Setup vector DB + indexation
- Jour 2 matin : API de recherche
- Jour 2 après-midi : UI + démo
