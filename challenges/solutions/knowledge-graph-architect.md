# Knowledge Graph Architect (Architect)

## 1. Résolution du Challenge

### Objectif
Construire un système de gestion des connaissances basé sur les graphes (Obsidian) avec IA pour automatiser le linking, le tagging et faire émerger les connexions cachées.

### Éléments clés

Ce challenge est de niveau ⭐⭐⭐⭐ (4h).

#### Architecture du système

```
┌─────────────────────────────────────────────────────────┐
│                    OBSIDIAN VAULT                        │
├─────────────────────────────────────────────────────────┤
│  Notes                                                   │
│  • Dailies (journal)                                     │
│  • Projects (projets actifs)                             │
│  • Areas (domaines de responsabilité)                    │
│  • Resources (références, docs)                          │
│  • Archives                                              │
├─────────────────────────────────────────────────────────┤
│  Metadata                                                │
│  • Tags (#concept, #action, #person)                     │
│  • Properties (YAML frontmatter)                         │
│  • Links ([[note]])                                      │
└─────────────────────────────────────────────────────────┘
         │                     │
         ▼                     ▼
┌─────────────────┐   ┌─────────────────┐
│  Smart Search   │   │  AI Augmentation │
│  (local)        │   │  (n8n + LLM)     │
│                 │   │                  │
│  • Full-text    │   │  • Auto-tagging  │
│  • Backlinks    │   │  • Link suggest  │
│  • Graph view   │   │  • Summarize     │
└─────────────────┘   └─────────────────┘
```

#### Plugins Obsidian recommandés

| Plugin | Fonction |
|--------|----------|
| **Smart Connections** | Recherche sémantique IA |
| **Dataview** | Requêtes sur les notes |
| **Templater** | Templates automatisés |
| **Graph Analysis** | Analyse du graphe |
| **Excalidraw** | Diagrammes intégrés |

#### Workflow d'augmentation IA (n8n)

```json
{
  "trigger": "Nouvelle note créée",
  "actions": [
    {
      "name": "Analyser contenu",
      "type": "OpenAI",
      "prompt": "Analyse cette note et suggère : 5 tags pertinents, 3 notes existantes à lier, 1 résumé en 2 phrases"
    },
    {
      "name": "Mettre à jour frontmatter",
      "type": "File Update",
      "action": "Ajouter tags et liens suggérés"
    }
  ]
}
```

#### Structure de vault recommandée

```
📁 Vault
├── 00 - Inbox/          # Capture rapide
├── 01 - Daily/          # Notes quotidiennes
├── 10 - Projects/       # Projets actifs
├── 20 - Areas/          # Domaines (santé, finance, travail...)
├── 30 - Resources/      # Références, docs, livres
├── 40 - Archives/       # Projets terminés
├── Templates/           # Templates de notes
└── Attachments/         # Images, fichiers
```

#### Prompt pour auto-linking

```
Voici une nouvelle note :
---
[Contenu de la note]
---

Et voici la liste des notes existantes dans le vault :
[Liste des titres]

Suggère :
1. Les 3-5 notes les plus pertinentes à lier (format [[Note]])
2. Les tags à ajouter (#tag)
3. Un résumé de la note (2 phrases)
4. Une question que cette note soulève (pour exploration future)
```

### Critères de réussite
- Vault Obsidian structuré avec conventions claires
- Plugin ou workflow IA pour auto-tagging/linking
- Démo de recherche sémantique fonctionnelle

---

## 2. Animation Dojo (éléments clés)

**Durée** : 4h (workshop Architect)

**Déroulé suggéré** :
- 1h : Théorie PKM et graphes de connaissances
- 1h : Setup du vault et plugins
- 1h : Configuration du workflow IA
- 1h : Migration de notes existantes et test
