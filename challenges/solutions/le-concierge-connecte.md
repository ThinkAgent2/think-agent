# Le Concierge Connecté (IT)

## 1. Résolution du Challenge

### Objectif
Créer un assistant qui interagit avec des APIs réelles via function calling (météo, calendrier, etc.).

### Concept : Function Calling

Le function calling permet à un LLM d'appeler des fonctions externes de manière structurée :
1. L'utilisateur pose une question
2. Le LLM décide quelle fonction appeler et avec quels paramètres
3. La fonction s'exécute et retourne un résultat
4. Le LLM formule une réponse naturelle avec ce résultat

### Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Utilisateur │────▶│   LLM avec   │────▶│   APIs       │
│              │◀────│   Functions  │◀────│   externes   │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                     Décide quelle
                     fonction appeler
```

### Étape 1 : Définir les fonctions

**Fonction météo (OpenWeatherMap) :**
```json
{
  "name": "get_weather",
  "description": "Obtient la météo actuelle pour une ville donnée",
  "parameters": {
    "type": "object",
    "properties": {
      "city": {
        "type": "string",
        "description": "Nom de la ville (ex: Paris, Lyon)"
      },
      "units": {
        "type": "string",
        "enum": ["metric", "imperial"],
        "description": "Unités de mesure (metric = Celsius)"
      }
    },
    "required": ["city"]
  }
}
```

**Fonction calendrier (Google Calendar) :**
```json
{
  "name": "get_calendar_events",
  "description": "Récupère les événements du calendrier pour une période",
  "parameters": {
    "type": "object",
    "properties": {
      "start_date": {
        "type": "string",
        "description": "Date de début (format YYYY-MM-DD)"
      },
      "end_date": {
        "type": "string",
        "description": "Date de fin (format YYYY-MM-DD)"
      }
    },
    "required": ["start_date"]
  }
}
```

**Fonction recherche web (Brave/Tavily) :**
```json
{
  "name": "search_web",
  "description": "Recherche sur le web pour des informations actuelles",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "Termes de recherche"
      },
      "num_results": {
        "type": "integer",
        "description": "Nombre de résultats (1-10)"
      }
    },
    "required": ["query"]
  }
}
```

### Étape 2 : Implémenter les handlers

**Python - Handler météo :**
```python
import requests

def get_weather(city: str, units: str = "metric") -> dict:
    """Appelle l'API OpenWeatherMap"""
    api_key = os.environ["OPENWEATHER_API_KEY"]
    url = f"https://api.openweathermap.org/data/2.5/weather"
    
    params = {
        "q": city,
        "appid": api_key,
        "units": units,
        "lang": "fr"
    }
    
    response = requests.get(url, params=params)
    
    if response.status_code != 200:
        return {"error": f"Ville non trouvée: {city}"}
    
    data = response.json()
    return {
        "city": data["name"],
        "temperature": data["main"]["temp"],
        "description": data["weather"][0]["description"],
        "humidity": data["main"]["humidity"],
        "wind_speed": data["wind"]["speed"]
    }
```

**n8n - Workflow avec function calling :**
```json
{
  "nodes": [
    {
      "name": "Chat Trigger",
      "type": "n8n-nodes-base.chatTrigger"
    },
    {
      "name": "AI Agent",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "parameters": {
        "agent": "toolsAgent",
        "tools": ["weatherTool", "calendarTool"]
      }
    },
    {
      "name": "Weather Tool",
      "type": "@n8n/n8n-nodes-langchain.toolHttpRequest",
      "parameters": {
        "name": "get_weather",
        "description": "Obtient la météo pour une ville",
        "url": "https://api.openweathermap.org/data/2.5/weather",
        "authentication": "genericCredentialType"
      }
    }
  ]
}
```

### Étape 3 : Prompt système du concierge

```
Tu es Max, un assistant personnel connecté. Tu as accès à plusieurs outils pour aider l'utilisateur :

## Tes outils disponibles

1. **get_weather(city)** : Météo actuelle d'une ville
2. **get_calendar_events(start_date, end_date)** : Événements du calendrier
3. **search_web(query)** : Recherche web pour infos actuelles

## Ton comportement

- Tu utilises tes outils AVANT de répondre si nécessaire
- Tu ne devines jamais une information que tu peux vérifier
- Tu combines plusieurs outils si utile
- Tu gères gracieusement les erreurs (API down, etc.)

## Exemples d'utilisation

Utilisateur : "Il fait beau à Paris ?"
→ Tu appelles get_weather("Paris") puis tu réponds

Utilisateur : "J'ai quoi demain ?"
→ Tu appelles get_calendar_events avec la date de demain

Utilisateur : "Quel temps pour ma réunion de demain à Lyon ?"
→ Tu appelles get_calendar_events PUIS get_weather("Lyon")

## Format de réponse

- Réponse naturelle et concise
- Cite la source des données quand pertinent
- Propose des actions suivantes si utile
```

### Critères de réussite
- Assistant avec 2+ fonctions connectées et opérationnelles
- Démo montrant l'appel de fonction en action
- Gestion des erreurs propre (API indisponible, paramètres manquants)

---

## 2. Animation Dojo Challenge (1h, ~10 personnes)

### Objectifs pédagogiques
À la fin de l'atelier, les participants sauront :
- Comprendre le concept de function calling
- Définir une fonction appelable par un LLM
- Connecter un LLM à une API externe
- Gérer les erreurs dans les appels d'API

### Prérequis participants
- Compte n8n ou environnement Python basique
- Clé API OpenWeatherMap (gratuite, 5 min à créer)
- Notions de base sur les APIs REST

### Matériel nécessaire
- Template n8n avec structure de base
- Liste d'APIs gratuites et simples (météo, blagues, citations...)
- Guide "créer une clé API" pas à pas
- Prompt système du concierge

### Déroulé minute par minute

| Temps | Activité | Animateur fait | Participants font | Valeur pédagogique |
|-------|----------|----------------|-------------------|-------------------|
| 0-5 | Intro concept | Explique le function calling avec schéma | Comprennent le flux | Théorie |
| 5-12 | Démo live | Construit un agent météo en live (n8n ou code) | Observent le processus | Voir ça marche |
| 12-18 | Setup API keys | Aide ceux qui n'ont pas leur clé | Créent leur compte OpenWeatherMap | Préparation |
| 18-25 | Première fonction | Guide la création de la fonction météo | Implémentent get_weather | Base fonctionnelle |
| 25-35 | Deuxième fonction | Présente d'autres APIs possibles | Ajoutent une 2e fonction au choix | Extension |
| 35-45 | Tests | Fait tester avec différentes requêtes | Testent, débuggent | Validation |
| 45-55 | Gestion erreurs | Montre comment gérer les erreurs | Ajoutent la gestion d'erreur | Robustesse |
| 55-60 | Clôture | Partage des idées d'APIs à connecter | Notent les prochaines étapes | Inspiration |

### Points d'attention animateur

**Pièges courants :**
- Clé API non configurée → Avoir des clés de backup à partager temporairement
- Erreurs de syntaxe JSON → Valider avec un JSON linter
- L'IA n'utilise pas la fonction → Vérifier le prompt système et la description de fonction

**Questions fréquentes :**
- "Pourquoi l'IA n'appelle pas ma fonction ?" → La description doit être claire et le cas d'usage évident
- "Comment je sais que la fonction a été appelée ?" → Logs n8n ou mode debug
- "Je peux connecter n'importe quelle API ?" → Oui si elle est accessible (authentification gérée)

**Tips d'animation :**
- Avoir une liste d'APIs gratuites prêtes (voir ci-dessous)
- Tester tous les workflows avant l'atelier
- Prévoir un "plan B" si les APIs sont lentes

### APIs gratuites recommandées

| API | Description | Clé requise |
|-----|-------------|-------------|
| OpenWeatherMap | Météo | Oui (gratuite) |
| JokeAPI | Blagues | Non |
| QuotableAPI | Citations | Non |
| RestCountries | Info pays | Non |
| RandomUser | Utilisateurs fictifs | Non |
| CatFacts | Fun facts chats | Non |

### Variantes possibles

**Niveau débutant (45 min) :**
- 1 seule fonction (météo)
- Template pré-configuré
- Focus sur le test et la compréhension

**Niveau avancé (1h30) :**
- 3-4 fonctions interconnectées
- Chaînage de fonctions (calendrier → météo du lieu de l'événement)
- Mise en production (webhook accessible)

**Format workshop (2h) :**
- 30 min : Théorie function calling + architecture
- 45 min : Implémentation 2 fonctions
- 30 min : Scénario complexe (multi-fonctions)
- 15 min : Démo croisée

**Challenge créatif :**
- Choisir une API originale
- Créer un concierge thématique (sport, cuisine, voyage...)
- Présenter au groupe
