# Veille Augmentée

## 1. Résolution du Challenge

### Objectif
Créer un pipeline n8n de veille automatisée : filtrer les pépites du web, surveiller les mouvements de marché et synthétiser les tendances pertinentes.

### Architecture du workflow

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│ Sources     │───▶│ Agrégation   │───▶│ Filtrage IA │───▶│ Distribution │
│ (RSS, API)  │    │ (n8n)        │    │ (LLM)       │    │ (Slack/Mail) │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
```

### Étape 1 : Identifier les sources

**Veille technologique :**
- Blogs tech : Hacker News, TechCrunch, The Verge
- Newsletters : TLDR, Ben's Bites, The Batch
- RSS spécialisés selon le domaine
- Twitter/X : comptes influenceurs

**Veille concurrentielle :**
- Sites web des concurrents (détection de changements)
- LinkedIn des dirigeants concurrents
- Communiqués de presse (Google Alerts)
- Publications légales (Bodacc, societe.com)

### Étape 2 : Créer le workflow n8n

**Nœuds principaux :**

1. **Trigger Schedule** : Toutes les 4 heures

2. **RSS Feed Read** : Récupérer les articles
   - URL du flux RSS
   - Limiter aux dernières 24h

3. **HTTP Request** (pour les APIs) :
   - Hacker News API
   - Google News API
   - Twitter API (si disponible)

4. **AI Agent / OpenAI** : Filtrer et scorer
   ```
   Analyse cet article et réponds en JSON :
   {
     "pertinence": 1-10,
     "résumé": "2 phrases max",
     "tags": ["tag1", "tag2"],
     "actionable": true/false,
     "raison_pertinence": "pourquoi ce score"
   }
   
   Contexte : Je suis consultant en [domaine]. Je m'intéresse à [sujets].
   Ignore les articles purement promotionnels ou hors sujet.
   ```

5. **IF** : Filtrer si pertinence ≥ 7

6. **Aggregate** : Regrouper les articles retenus

7. **OpenAI** : Synthèse quotidienne
   ```
   Voici les articles pertinents du jour. Génère une synthèse structurée :
   
   ## 🔥 À retenir absolument (1-3 points)
   Les actualités les plus importantes
   
   ## 📊 Tendances observées
   Ce qui émerge des différentes sources
   
   ## 💡 Opportunités identifiées
   Ce que ça peut signifier pour notre activité
   
   ## 📚 Pour aller plus loin
   Les liens vers les articles les plus intéressants
   ```

8. **Slack / Email** : Envoyer la synthèse

### Workflow JSON n8n (structure)

```json
{
  "name": "Veille Augmentée",
  "nodes": [
    {
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "parameters": {
        "rule": {
          "interval": [{"field": "hours", "hoursInterval": 4}]
        }
      }
    },
    {
      "name": "RSS Feed",
      "type": "n8n-nodes-base.rssFeedRead",
      "parameters": {
        "url": "https://hnrss.org/newest?points=100"
      }
    },
    {
      "name": "Score avec IA",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "parameters": {
        "prompt": "..."
      }
    },
    {
      "name": "Filtrer pertinents",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "number": [{"value1": "={{$json.pertinence}}", "value2": 7, "operation": "gte"}]
        }
      }
    },
    {
      "name": "Synthèse quotidienne",
      "type": "@n8n/n8n-nodes-langchain.openAi"
    },
    {
      "name": "Envoyer Slack",
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "channel": "#veille",
        "text": "={{$json.synthese}}"
      }
    }
  ]
}
```

### Critères de réussite
- Workflow n8n fonctionnel
- Au moins 2 sources différentes
- Filtrage par pertinence (pas de spam)
- Livraison automatique (Slack, mail ou Notion)

---

## 2. Animation Dojo Challenge (1h, ~10 personnes)

### Objectifs pédagogiques
À la fin de l'atelier, les participants sauront :
- Identifier les bonnes sources de veille pour leur métier
- Créer un workflow n8n de base (trigger → process → output)
- Utiliser l'IA pour filtrer et synthétiser l'information
- Automatiser une tâche récurrente de bout en bout

### Prérequis participants
- Compte n8n (cloud ou self-hosted)
- Accès aux credentials nécessaires (Slack, OpenAI, etc.)
- Avoir identifié 2-3 thèmes de veille qui les intéressent

### Matériel nécessaire
- Instance n8n partagée ou comptes individuels
- Liste de flux RSS recommandés par domaine
- Template de workflow à importer
- Credentials pré-configurés (si environnement partagé)

### Déroulé minute par minute

| Temps | Activité | Animateur fait | Participants font | Valeur pédagogique |
|-------|----------|----------------|-------------------|-------------------|
| 0-5 | Intro | Montre un exemple de bulletin de veille généré | Découvrent le livrable cible | Motivation |
| 5-15 | Démo workflow | Construit le workflow en live (version simplifiée) | Suivent, posent des questions | Comprendre la logique n8n |
| 15-20 | Setup | Vérifie accès n8n, distribue le template | Importent le template de base | Préparation technique |
| 20-25 | Sources | Aide à identifier les bonnes sources | Choisissent leurs flux RSS | Personnalisation |
| 25-40 | Construction | Circule, debug, partage les astuces | Adaptent le workflow à leur veille | Pratique guidée |
| 40-50 | Test | Fait tourner les workflows, vérifie les outputs | Testent, corrigent | Validation |
| 50-55 | Synthèse | Montre les différentes approches | Partagent leurs choix | Apprentissage par pairs |
| 55-60 | Clôture | Explique comment étendre (plus de sources, alertes...) | Notent les idées | Autonomie |

### Points d'attention animateur

**Pièges courants :**
- Credentials mal configurés → Tester avant l'atelier
- Trop de sources d'un coup → Commencer avec 1, ajouter ensuite
- Prompt de scoring trop vague → Donner le contexte métier précis

**Questions fréquentes :**
- "Comment trouver le flux RSS d'un site ?" → Extensions browser, ajouter /feed ou /rss
- "Mon workflow ne se déclenche pas" → Vérifier le trigger, activer le workflow
- "Les scores sont toujours à 10" → Affiner le prompt, donner des exemples de notes basses

**Tips d'animation :**
- Avoir un workflow de démo prêt à montrer
- Préparer une liste de flux RSS par domaine (tech, RH, finance, etc.)
- Montrer comment debugger avec les logs n8n

### Variantes possibles

**Niveau débutant (45 min) :**
- Workflow pré-construit, juste personnaliser les sources
- 1 seul flux RSS
- Pas de scoring IA, juste agrégation

**Niveau avancé (1h30) :**
- Multi-sources (RSS + API + scraping)
- Stockage en base (Notion, Airtable)
- Alertes conditionnelles (si mention concurrent → notification urgente)

**Format workshop (2h) :**
- 30 min : Cartographie des sources de veille (exercice papier)
- 45 min : Construction workflow
- 30 min : Tests et optimisations
- 15 min : Partage des meilleures configs

**Veille concurrentielle spécifique :**
- Ajouter détection de changements sur sites web (WatchTower)
- Alertes Google News sur noms de concurrents
- Analyse automatique des communiqués de presse
