# Le Changelog Automatique (IT/Forge)

## 1. Résolution du Challenge

### Objectif
Créer un pipeline qui analyse les Pull Requests pour rédiger automatiquement des notes de mise à jour produit claires et exploitables.

### Architecture du pipeline

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│   GitHub    │───▶│   n8n        │───▶│   LLM       │───▶│   Output     │
│  (webhooks) │    │   (process)  │    │  (rédige)   │    │  (Slack/MD)  │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
                         │
                  Collecte PRs
                  Extrait les infos
```

### Étape 1 : Collecter les données des PRs

**Données à extraire de chaque PR :**
- Titre de la PR
- Description/body
- Labels (bug, feature, breaking change...)
- Fichiers modifiés
- Messages de commits
- Auteur

**Script Python pour GitHub API :**
```python
import requests
from datetime import datetime, timedelta

def get_merged_prs(repo: str, since_days: int = 7) -> list:
    """Récupère les PRs mergées depuis X jours"""
    
    token = os.environ["GITHUB_TOKEN"]
    headers = {"Authorization": f"token {token}"}
    
    since = (datetime.now() - timedelta(days=since_days)).isoformat()
    
    # Recherche les PRs mergées
    url = f"https://api.github.com/repos/{repo}/pulls"
    params = {
        "state": "closed",
        "sort": "updated",
        "direction": "desc",
        "per_page": 50
    }
    
    response = requests.get(url, headers=headers, params=params)
    prs = response.json()
    
    # Filtre les PRs mergées récemment
    merged_prs = []
    for pr in prs:
        if pr.get("merged_at"):
            merged_at = datetime.fromisoformat(pr["merged_at"].replace("Z", ""))
            if merged_at > datetime.fromisoformat(since):
                merged_prs.append({
                    "number": pr["number"],
                    "title": pr["title"],
                    "body": pr["body"] or "",
                    "labels": [l["name"] for l in pr["labels"]],
                    "author": pr["user"]["login"],
                    "merged_at": pr["merged_at"],
                    "url": pr["html_url"]
                })
    
    return merged_prs
```

### Étape 2 : Classifier les changements

**Catégories standard :**
- 🚀 **Nouvelles fonctionnalités** (feature)
- 🐛 **Corrections de bugs** (bug, fix)
- ⚡ **Améliorations** (enhancement, improvement)
- 🔧 **Technique** (tech, refactor, infra)
- ⚠️ **Breaking Changes** (breaking)
- 📚 **Documentation** (docs)
- 🔒 **Sécurité** (security)

**Prompt de classification :**
```
Analyse cette liste de PRs et classe chaque changement dans la bonne catégorie.

PRs à analyser :
{{prs_json}}

Pour chaque PR, détermine :
1. Catégorie : feature | bug | enhancement | tech | breaking | docs | security
2. Impact utilisateur : Oui/Non (visible par l'utilisateur final ?)
3. Résumé : Une phrase claire pour le changelog

Retourne en JSON :
[
  {
    "pr_number": 123,
    "category": "feature",
    "user_facing": true,
    "summary": "Ajout de l'export PDF des rapports"
  }
]
```

### Étape 3 : Générer le changelog

**Prompt de rédaction :**
```
Tu es un rédacteur technique qui écrit des release notes claires et engageantes.

## Contexte
Application : {{app_name}}
Version : {{version}}
Date : {{date}}
Audience : Utilisateurs finaux (pas les développeurs)

## Changements à documenter
{{classified_prs}}

## Consignes
1. Commence par un résumé des points forts (2-3 phrases max)
2. Regroupe par catégorie (emoji + titre)
3. Pour chaque changement visible utilisateur :
   - Phrase simple et actionable
   - Bénéfice concret
   - Pas de jargon technique
4. Section "Sous le capot" pour les changements techniques importants
5. Termine par les remerciements aux contributeurs

## Format
```markdown
# Release Notes - {{app_name}} v{{version}}

📅 {{date}}

## ✨ En bref
[Résumé des points forts]

## 🚀 Nouvelles fonctionnalités
- **[Titre]** : [Description du bénéfice utilisateur]

## 🐛 Corrections
- [Description du problème résolu]

## ⚡ Améliorations
- [Ce qui est mieux maintenant]

## 🔧 Sous le capot
[Changements techniques notables]

---
Merci à [contributeurs] pour leurs contributions !
```
```

### Workflow n8n complet

```json
{
  "name": "Changelog Automatique",
  "nodes": [
    {
      "name": "Schedule Weekly",
      "type": "n8n-nodes-base.scheduleTrigger",
      "parameters": {
        "rule": {
          "interval": [{"field": "weeks", "weeksInterval": 1}]
        }
      }
    },
    {
      "name": "Get Merged PRs",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "GET",
        "url": "https://api.github.com/repos/{{$env.REPO}}/pulls",
        "qs": {
          "state": "closed",
          "sort": "updated",
          "per_page": 50
        },
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth"
      }
    },
    {
      "name": "Filter Merged This Week",
      "type": "n8n-nodes-base.filter",
      "parameters": {
        "conditions": {
          "string": [{
            "value1": "={{$json.merged_at}}",
            "operation": "isNotEmpty"
          }]
        }
      }
    },
    {
      "name": "Classify with AI",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "parameters": {
        "model": "gpt-4",
        "prompt": "Analyse et classifie ces PRs..."
      }
    },
    {
      "name": "Generate Changelog",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "parameters": {
        "model": "gpt-4",
        "prompt": "Génère les release notes..."
      }
    },
    {
      "name": "Post to Slack",
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "channel": "#releases",
        "text": "={{$json.changelog}}"
      }
    },
    {
      "name": "Save to Notion",
      "type": "n8n-nodes-base.notion",
      "parameters": {
        "operation": "create",
        "databaseId": "{{$env.NOTION_DB}}",
        "properties": {
          "Version": "={{$json.version}}",
          "Content": "={{$json.changelog}}"
        }
      }
    }
  ]
}
```

### Exemple de changelog généré

```markdown
# Release Notes - MonApp v2.4.0

📅 15 janvier 2025

## ✨ En bref
Cette mise à jour apporte l'export PDF tant demandé, corrige le bug de déconnexion sur mobile, et améliore significativement les performances de chargement.

## 🚀 Nouvelles fonctionnalités
- **Export PDF** : Exportez vos rapports en un clic depuis le tableau de bord. Parfait pour partager avec vos équipes !
- **Filtres sauvegardés** : Vos filtres préférés sont maintenant mémorisés entre les sessions.

## 🐛 Corrections
- Résolu : Déconnexion intempestive sur l'app mobile après mise en veille
- Résolu : Les notifications n'apparaissaient pas sur Firefox

## ⚡ Améliorations
- Temps de chargement du dashboard réduit de 40%
- Meilleure lisibilité des graphiques en mode sombre

## 🔧 Sous le capot
- Migration vers PostgreSQL 15 pour de meilleures performances
- Refactoring du système de cache

---
Merci à @alice, @bob et @charlie pour leurs contributions ! 🙏
```

### Critères de réussite
- Workflow n8n ou script fonctionnel
- Classification automatique des PRs par type
- Changelog lisible et orienté utilisateur
- Publication automatique (Slack, Notion, fichier MD)

---

## 2. Animation Dojo Challenge (1h, ~10 personnes)

### Objectifs pédagogiques
À la fin de l'atelier, les participants sauront :
- Automatiser la collecte d'infos depuis GitHub
- Utiliser l'IA pour classifier et rédiger
- Créer des release notes orientées utilisateur
- Mettre en place un pipeline reproductible

### Prérequis participants
- Compte GitHub avec accès à un repo (perso ou orga)
- Token GitHub (Settings → Developer settings → Personal access tokens)
- Compte n8n ou environnement Python

### Matériel nécessaire
- Template de workflow n8n
- Prompts de classification et rédaction
- Exemple de changelog bien rédigé
- Repo exemple avec quelques PRs

### Déroulé minute par minute

| Temps | Activité | Animateur fait | Participants font | Valeur pédagogique |
|-------|----------|----------------|-------------------|-------------------|
| 0-5 | Intro | Montre un exemple de bon changelog vs mauvais | Comprennent l'objectif | Motivation |
| 5-10 | Démo | Exécute le workflow complet sur un repo exemple | Voient le résultat final | Vision |
| 10-15 | Setup | Aide à configurer le token GitHub | Créent leur token si nécessaire | Préparation |
| 15-25 | Collecte | Guide la partie "récupérer les PRs" | Configurent l'appel API GitHub | Première partie |
| 25-35 | Classification | Montre le prompt de classification | Adaptent le prompt à leur contexte | Intelligence |
| 35-45 | Rédaction | Guide la génération du changelog | Testent la génération | Finalisation |
| 45-55 | Publication | Montre les différentes sorties (Slack, MD, Notion) | Choisissent et configurent leur output | Distribution |
| 55-60 | Clôture | Récapitule et planifie l'automatisation | Notent la prochaine étape | Autonomie |

### Points d'attention animateur

**Pièges courants :**
- Token GitHub avec mauvais scopes → Vérifier `repo` scope
- Pas de PRs récentes → Avoir un repo exemple prêt
- Changelog trop technique → Insister sur l'audience utilisateur

**Questions fréquentes :**
- "On peut utiliser les commits au lieu des PRs ?" → Oui, mais PRs donnent plus de contexte
- "Comment gérer les repos privés ?" → Token avec scope `repo` suffit
- "Quelle fréquence ?" → Hebdo ou à chaque release

**Tips d'animation :**
- Montrer des exemples de changelogs de produits connus
- Faire voter pour le meilleur résumé
- Discuter de l'équilibre technique/utilisateur

### Variantes possibles

**Niveau débutant (45 min) :**
- PRs manuellement sélectionnées (pas d'API)
- Focus sur le prompt de rédaction
- Output simple (fichier Markdown)

**Niveau avancé (1h30) :**
- Multi-repos (monorepo ou plusieurs projets)
- Versioning automatique (semantic versioning)
- Génération de fichier CHANGELOG.md dans le repo

**Format workshop (2h) :**
- 30 min : Théorie des bonnes release notes
- 45 min : Construction du pipeline
- 30 min : Personnalisation du style
- 15 min : Planification cron

**Extension :**
- Traduction automatique (FR/EN)
- Version courte pour Twitter/LinkedIn
- Email aux utilisateurs
