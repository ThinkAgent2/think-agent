# Modèle en Local (Forge)

## 1. Résolution du Challenge

### Objectif
Déployer et opérer un LLM local : installation, conteneurisation, exposition API, intégration dans un workflow.

### Architecture cible

```
┌─────────────────────────────────────────────────────┐
│                    Docker Host                       │
│  ┌─────────────────┐    ┌─────────────────┐         │
│  │     Ollama      │    │      n8n        │         │
│  │   (LLM local)   │◀───│   (workflow)    │         │
│  │   Port 11434    │    │   Port 5678     │         │
│  └─────────────────┘    └─────────────────┘         │
│           ▲                                          │
│           │ API REST                                 │
│           ▼                                          │
│  ┌─────────────────┐                                │
│  │   Application   │                                │
│  │   (votre app)   │                                │
│  └─────────────────┘                                │
└─────────────────────────────────────────────────────┘
```

### Étape 1 : Installer Ollama

**Option A : Installation directe (recommandé pour débuter)**
```bash
# Linux/Mac
curl -fsSL https://ollama.com/install.sh | sh

# Vérifier l'installation
ollama --version

# Télécharger un modèle
ollama pull llama3.2  # ~2GB, performant
ollama pull mistral   # Alternative légère
ollama pull phi3      # Microsoft, très léger

# Tester en local
ollama run llama3.2 "Bonjour, comment ça va ?"
```

**Option B : Docker (recommandé pour prod)**
```bash
# CPU uniquement
docker run -d \
  --name ollama \
  -p 11434:11434 \
  -v ollama:/root/.ollama \
  ollama/ollama

# Avec GPU NVIDIA
docker run -d \
  --name ollama \
  --gpus all \
  -p 11434:11434 \
  -v ollama:/root/.ollama \
  ollama/ollama

# Télécharger le modèle dans le container
docker exec ollama ollama pull llama3.2
```

### Étape 2 : Tester l'API REST

```bash
# Test simple
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Explique le machine learning en une phrase",
  "stream": false
}'

# Chat avec historique
curl http://localhost:11434/api/chat -d '{
  "model": "llama3.2",
  "messages": [
    {"role": "user", "content": "Quelle est la capitale de la France ?"}
  ],
  "stream": false
}'
```

### Étape 3 : Conteneurisation avec Docker Compose

**docker-compose.yml :**
```yaml
version: '3.8'

services:
  ollama:
    image: ollama/ollama
    container_name: ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    restart: unless-stopped
    # GPU NVIDIA (décommenter si dispo)
    # deploy:
    #   resources:
    #     reservations:
    #       devices:
    #         - driver: nvidia
    #           count: 1
    #           capabilities: [gpu]

  n8n:
    image: n8nio/n8n
    container_name: n8n
    ports:
      - "5678:5678"
    volumes:
      - n8n_data:/home/node/.n8n
    environment:
      - N8N_HOST=0.0.0.0
      - OLLAMA_HOST=http://ollama:11434
    depends_on:
      - ollama
    restart: unless-stopped

volumes:
  ollama_data:
  n8n_data:
```

**Lancement :**
```bash
docker-compose up -d

# Télécharger le modèle
docker exec ollama ollama pull llama3.2

# Vérifier que tout fonctionne
curl http://localhost:11434/api/tags  # Liste des modèles
```

### Étape 4 : Intégration n8n

**Workflow n8n simple :**
```json
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "chat",
        "method": "POST"
      }
    },
    {
      "name": "Ollama Chat",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "http://ollama:11434/api/chat",
        "body": {
          "model": "llama3.2",
          "messages": [
            {
              "role": "system",
              "content": "Tu es un assistant utile et concis."
            },
            {
              "role": "user", 
              "content": "={{ $json.body.message }}"
            }
          ],
          "stream": false
        }
      }
    },
    {
      "name": "Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ { response: $json.message.content } }}"
      }
    }
  ]
}
```

### Étape 5 : Script d'intégration Python

```python
import requests

class OllamaClient:
    def __init__(self, host="http://localhost:11434"):
        self.host = host
    
    def chat(self, message: str, model: str = "llama3.2", system: str = None) -> str:
        """Envoie un message au modèle local"""
        messages = []
        
        if system:
            messages.append({"role": "system", "content": system})
        
        messages.append({"role": "user", "content": message})
        
        response = requests.post(
            f"{self.host}/api/chat",
            json={
                "model": model,
                "messages": messages,
                "stream": False
            }
        )
        
        if response.status_code == 200:
            return response.json()["message"]["content"]
        else:
            raise Exception(f"Erreur Ollama: {response.text}")
    
    def list_models(self) -> list:
        """Liste les modèles disponibles"""
        response = requests.get(f"{self.host}/api/tags")
        return [m["name"] for m in response.json()["models"]]

# Utilisation
client = OllamaClient()
print(client.list_models())
print(client.chat("Résume le RGPD en 3 points"))
```

### Documentation du déploiement

**README.md à produire :**
```markdown
# LLM Local - Documentation

## Prérequis
- Docker & Docker Compose
- 8 GB RAM minimum (16 GB recommandé)
- 10 GB espace disque par modèle

## Installation
\`\`\`bash
git clone [repo]
cd llm-local
docker-compose up -d
docker exec ollama ollama pull llama3.2
\`\`\`

## API Endpoints
| Endpoint | Méthode | Description |
|----------|---------|-------------|
| /api/generate | POST | Génération simple |
| /api/chat | POST | Chat avec historique |
| /api/tags | GET | Liste des modèles |

## Modèles recommandés
| Modèle | Taille | RAM | Usage |
|--------|--------|-----|-------|
| phi3 | 2.3 GB | 4 GB | Léger, rapide |
| mistral | 4 GB | 8 GB | Polyvalent |
| llama3.2 | 4.7 GB | 8 GB | Performant |
| llama3.2:70b | 40 GB | 48 GB | Maximum qualité |

## Troubleshooting
- Port 11434 occupé → Changer le port dans docker-compose
- OOM (mémoire) → Utiliser un modèle plus petit
- Lent → Vérifier GPU disponible
```

### Critères de réussite
- LLM déployé en Docker
- API accessible et testée
- Intégration fonctionnelle (n8n ou script)
- Documentation complète

---

## 2. Animation Dojo Challenge (1h, ~10 personnes)

### Objectifs pédagogiques
À la fin de l'atelier, les participants sauront :
- Installer et configurer Ollama
- Déployer un LLM local avec Docker
- Appeler l'API REST du modèle
- Comprendre les trade-offs local vs cloud

### Prérequis participants
- Docker installé sur leur machine
- 8 GB RAM minimum
- Connexion internet pour télécharger le modèle
- Notions de base Docker (docker run, docker-compose)

### Matériel nécessaire
- docker-compose.yml préparé
- Scripts de test (curl, Python)
- Modèle pré-téléchargé sur une machine (en cas de réseau lent)
- Tableau comparatif local vs cloud

### Déroulé minute par minute

| Temps | Activité | Animateur fait | Participants font | Valeur pédagogique |
|-------|----------|----------------|-------------------|-------------------|
| 0-5 | Intro | Présente les avantages du local (privacy, coût, latence) | Comprennent le contexte | Motivation |
| 5-10 | Démo | Montre Ollama en action sur sa machine | Observent la rapidité | Preuve de concept |
| 10-20 | Installation | Guide l'installation Docker | Lancent docker-compose | Setup |
| 20-25 | Pull modèle | Explique les différents modèles | Téléchargent phi3 (rapide) | Configuration |
| 25-35 | Test API | Montre les appels curl | Testent l'API | Validation |
| 35-45 | Intégration | Montre l'intégration n8n | Créent un workflow simple | Application |
| 45-55 | Benchmark | Compare vitesse/qualité des modèles | Testent différents modèles | Évaluation |
| 55-60 | Clôture | Récapitule use cases (audit, POC, dev) | Notent les applications | Projection |

### Points d'attention animateur

**Pièges courants :**
- RAM insuffisante → Avoir phi3 en backup (plus léger)
- Téléchargement lent → Prévoir un modèle sur clé USB
- Port 11434 pris → Expliquer le changement de port
- Pas de GPU → Ça marche en CPU, juste plus lent

**Questions fréquentes :**
- "C'est aussi bien que ChatGPT ?" → Non pour GPT-4, comparable à GPT-3.5 pour les bons modèles
- "C'est légal ?" → Oui, modèles open source avec licences permissives
- "Ça marche hors ligne ?" → Oui, une fois le modèle téléchargé

**Tips d'animation :**
- Avoir une machine avec GPU pour montrer la différence de vitesse
- Préparer un use case concret (anonymisation de données, audit interne)
- Montrer le monitoring RAM pendant l'inférence

### Variantes possibles

**Niveau débutant (45 min) :**
- Installation directe Ollama (pas Docker)
- Test en ligne de commande uniquement
- Un seul modèle (phi3)

**Niveau avancé (1h30) :**
- Déploiement multi-modèles
- Load balancing avec plusieurs instances
- Fine-tuning avec données custom
- Exposition sécurisée (HTTPS, auth)

**Format workshop (2h) :**
- 30 min : Théorie (architectures LLM, quantization)
- 45 min : Déploiement complet
- 30 min : Intégration applicative
- 15 min : Benchmark et comparaison

**Use case spécifique :**
- RAG local (Ollama + ChromaDB)
- Agent autonome local
- Analyse de documents sensibles
