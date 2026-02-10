# Le Regulatory Watch (Fi)

## 1. Résolution du Challenge

### Objectif
Créer un pipeline de veille réglementaire finance (Bâle, MiFID, EMIR) : extraction, résumé des impacts, alertes deadlines.

### Architecture du système

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Sources       │───▶│   Traitement     │───▶│   Outputs       │
│                 │    │                  │    │                 │
│ - Régulateurs   │    │ - Extraction     │    │ - Bulletin      │
│ - ESMA, EBA     │    │ - Résumé IA      │    │ - Alertes       │
│ - AMF, ACPR     │    │ - Classification │    │ - Timeline      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Sources à surveiller

| Régulateur | Type | URL/Flux |
|------------|------|----------|
| **ESMA** | UE - Marchés | esma.europa.eu/press-news |
| **EBA** | UE - Banques | eba.europa.eu/news-press |
| **BCE** | UE - Supervision | bankingsupervision.europa.eu |
| **AMF** | France - Marchés | amf-france.org/actualites |
| **ACPR** | France - Banques | acpr.banque-france.fr/actualites |
| **Comité de Bâle** | International | bis.org/bcbs/publications |

### Prompt système de l'assistant

```
Tu es un expert en conformité réglementaire financière avec 15 ans d'expérience. Tu surveilles les évolutions réglementaires et traduis leur impact pour les équipes opérationnelles.

## Tes domaines d'expertise

### Bâle III/IV
- Ratio de solvabilité (CET1, Tier 1, Total Capital)
- Ratio de levier
- Liquidité (LCR, NSFR)
- Risque de crédit, marché, opérationnel

### MiFID II / MiFIR
- Protection des investisseurs
- Transparence pré/post trade
- Best execution
- Reporting de transactions (RTS 25)

### EMIR / EMIR Refit
- Obligation de compensation (clearing)
- Reporting de dérivés (DTCC, Regis-TR)
- Échange de marges

### DORA (Digital Operational Resilience Act)
- Risque IT et cyber
- Tests de résilience
- Gestion des prestataires IT critiques

### SFDR / Taxonomie
- Reporting ESG
- Classification des produits (Art. 6, 8, 9)

---

## Ton processus de veille

### Étape 1 : Collecte
Récupérer les publications récentes des régulateurs :
- Consultations
- Guidelines
- Q&A
- Textes finaux
- Communiqués

### Étape 2 : Classification
Pour chaque publication :
- **Type** : Consultation / Final / Guidance / Q&A
- **Réglementation** : Bâle, MiFID, EMIR, DORA...
- **Urgence** : Deadline proche / Information / À suivre
- **Impact** : Élevé / Moyen / Faible

### Étape 3 : Résumé
Pour chaque texte pertinent :
- Résumé en 3 phrases
- Points clés (bullet points)
- Impacts opérationnels concrets
- Dates importantes

### Étape 4 : Alerte
Déclencher une alerte si :
- Deadline < 30 jours
- Impact élevé
- Nouveau texte final

---

## Format du bulletin de veille

```markdown
# Bulletin de Veille Réglementaire
## Semaine du [date]

### 🚨 Alertes prioritaires

#### [Titre de la publication]
**Régulateur** : ESMA | **Réglementation** : MiFID II
**Type** : Texte final | **Date limite** : 15/03/2025

**Résumé** :
[3 phrases maximum]

**Impact opérationnel** :
- [Impact 1]
- [Impact 2]

**Action requise** :
[Ce qui doit être fait concrètement]

---

### 📋 Autres publications

| Date | Régulateur | Titre | Type | Deadline |
|------|------------|-------|------|----------|
| [date] | ESMA | [titre] | Consultation | [date] |

### 📅 Calendrier à venir

| Date | Événement | Réglementation |
|------|-----------|----------------|
| 15/01 | Fin consultation XYZ | MiFID II |
| 01/02 | Entrée en vigueur ABC | EMIR |

### 📚 Pour aller plus loin
- [Lien vers le texte complet]
```

---

## Ton style
- Tu priorises par impact et urgence
- Tu traduis le jargon réglementaire en actions concrètes
- Tu alertes sur les deadlines critiques
- Tu proposes des liens vers les sources officielles

Commence par : "Quel est ton périmètre réglementaire ? (Bâle, MiFID, EMIR, DORA, tous...) Et quelle est ton activité principale ?"
```

### Workflow n8n

```json
{
  "name": "Regulatory Watch",
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
      "name": "Fetch ESMA RSS",
      "type": "n8n-nodes-base.rssFeedRead",
      "parameters": {
        "url": "https://www.esma.europa.eu/press-news/esma-news/feed"
      }
    },
    {
      "name": "Fetch EBA RSS",
      "type": "n8n-nodes-base.rssFeedRead",
      "parameters": {
        "url": "https://www.eba.europa.eu/rss/news"
      }
    },
    {
      "name": "Merge Sources",
      "type": "n8n-nodes-base.merge",
      "parameters": {
        "mode": "append"
      }
    },
    {
      "name": "Filter Last Week",
      "type": "n8n-nodes-base.filter",
      "parameters": {
        "conditions": {
          "dateTime": [{
            "value1": "={{$json.pubDate}}",
            "value2": "={{$now.minus({weeks: 1}).toISO()}}",
            "operation": "after"
          }]
        }
      }
    },
    {
      "name": "Classify & Summarize",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "parameters": {
        "model": "gpt-4",
        "prompt": "Analyse cette publication réglementaire et génère :\n1. Classification (réglementation, type, urgence)\n2. Résumé (3 phrases)\n3. Impacts opérationnels\n4. Deadlines\n\nPublication:\n{{$json.content}}"
      }
    },
    {
      "name": "Generate Bulletin",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "parameters": {
        "prompt": "Génère un bulletin de veille réglementaire hebdomadaire avec ces publications..."
      }
    },
    {
      "name": "Send Email",
      "type": "n8n-nodes-base.emailSend",
      "parameters": {
        "to": "compliance@example.com",
        "subject": "Veille Réglementaire - Semaine {{$now.weekNumber}}",
        "html": "={{$json.bulletin}}"
      }
    },
    {
      "name": "Alert if Urgent",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "boolean": [{
            "value1": "={{$json.urgent}}",
            "value2": true,
            "operation": "equal"
          }]
        }
      }
    },
    {
      "name": "Slack Alert",
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "channel": "#compliance-alerts",
        "text": "🚨 Alerte réglementaire : {{$json.title}}"
      }
    }
  ]
}
```

### Exemple de bulletin généré

```markdown
# Bulletin de Veille Réglementaire
## Semaine 3 - Janvier 2025

### 🚨 Alertes prioritaires

#### ESMA publie les standards techniques finaux sur DORA
**Régulateur** : ESMA | **Réglementation** : DORA
**Type** : Texte final | **Entrée en vigueur** : 17/01/2025

**Résumé** :
L'ESMA a publié les standards techniques de niveau 2 pour DORA, détaillant les exigences de tests de résilience opérationnelle numérique. Les entités financières doivent mettre en place un cadre de tests de pénétration basés sur les menaces (TLPT) d'ici janvier 2025.

**Impact opérationnel** :
- Mise à jour du plan de tests de résilience
- Identification des prestataires IT critiques
- Budget à prévoir pour TLPT

**Action requise** :
Contacter l'équipe IT Security pour planifier les tests TLPT Q1 2025.

---

### 📋 Autres publications cette semaine

| Date | Régulateur | Titre | Type |
|------|------------|-------|------|
| 15/01 | EBA | Q&A sur les exigences de reporting Bâle III | Q&A |
| 16/01 | AMF | Mise à jour doctrine best execution | Guidance |
| 17/01 | ESMA | Consultation sur les modifications MiFIR | Consultation |

### 📅 Prochaines deadlines

| Date | Événement | Réglementation |
|------|-----------|----------------|
| 17/01/2025 | Entrée en vigueur DORA | DORA |
| 31/01/2025 | Fin consultation MiFIR | MiFID II |
| 15/02/2025 | Reporting LCR Q4 2024 | Bâle III |
```

### Critères de réussite
- Workflow n8n fonctionnel collectant plusieurs sources
- Bulletin de veille généré automatiquement
- Classification par réglementation et urgence
- Alertes sur les deadlines critiques

---

## 2. Animation Dojo Challenge (1h, ~10 personnes)

### Objectifs pédagogiques
À la fin de l'atelier, les participants sauront :
- Identifier les sources réglementaires clés
- Automatiser la collecte d'informations
- Résumer et classifier les publications
- Mettre en place des alertes pertinentes

### Prérequis participants
- Compte n8n
- Culture réglementaire finance (basique)
- Connaissance des flux RSS

### Matériel nécessaire
- Template de workflow n8n
- Liste des flux RSS des régulateurs
- Prompt de classification/résumé
- Exemple de bulletin

### Déroulé minute par minute

| Temps | Activité | Animateur fait | Participants font | Valeur pédagogique |
|-------|----------|----------------|-------------------|-------------------|
| 0-5 | Intro | Présente l'enjeu de la veille réglementaire | Comprennent l'importance | Contexte |
| 5-10 | Sources | Montre les sites des régulateurs et leurs flux RSS | Découvrent les sources | Connaissance |
| 10-18 | Démo workflow | Construit le workflow en live (collecte + résumé) | Observent | Technique |
| 18-25 | Setup | Aide à configurer n8n et les flux RSS | Importent le template | Préparation |
| 25-40 | Construction | Circule, aide sur les prompts | Personnalisent leur workflow | Production |
| 40-50 | Test | Fait tourner les workflows | Génèrent leur premier bulletin | Validation |
| 50-55 | Alertes | Montre comment configurer les alertes Slack/email | Configurent leurs alertes | Extension |
| 55-60 | Clôture | Planification de l'automatisation | Notent le planning | Autonomie |

### Points d'attention animateur

**Pièges courants :**
- RSS mal formaté → Avoir des alternatives (scraping)
- Trop de bruit → Affiner le filtrage par mots-clés
- Résumés trop génériques → Donner du contexte métier au prompt

**Questions fréquentes :**
- "Comment gérer les PDF ?" → Extraction texte avant analyse
- "Quelle fréquence ?" → Hebdo pour le bulletin, temps réel pour les alertes
- "Comment prioriser ?" → Urgence = deadline, Impact = changement opérationnel

**Tips d'animation :**
- Avoir des exemples de publications récentes à analyser
- Montrer un bulletin réel d'une équipe compliance
- Discuter des cas où l'IA se trompe sur l'impact

### Variantes possibles

**Niveau débutant (45 min) :**
- 1 seul régulateur (ESMA)
- Résumé manuel via chat IA (pas de workflow)
- Focus sur la compréhension des textes

**Niveau avancé (1h30) :**
- Multi-régulateurs (5+)
- Stockage en base + historique
- Dashboard de suivi des deadlines

**Format workshop (2h) :**
- 30 min : Panorama réglementaire (Bâle, MiFID, EMIR, DORA)
- 45 min : Construction workflow
- 30 min : Personnalisation des alertes
- 15 min : Planification de la mise en production

**Avec NotebookLM :**
- Charger les textes réglementaires dans NotebookLM
- Générer un podcast explicatif
- Q&A sur les implications
