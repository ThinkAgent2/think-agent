# Boucle Ralph Wiggum

## 1. Résolution du Challenge

### Objectif
Mettre en place une auto-correction itérative forcée : l'IA critique et améliore sa propre sortie en plusieurs passes.

### Concept

Le nom fait référence à Ralph Wiggum des Simpsons qui se corrige constamment. L'idée : forcer l'IA à évaluer son propre travail et l'améliorer, créant une boucle de qualité.

```
Génération → Critique → Amélioration → Critique → Amélioration (x N)
    ↑                                                      │
    └──────────────────────────────────────────────────────┘
```

### Méthode 1 : Prompt en une seule passe

```
Tu vas répondre à cette demande en 3 étapes :

## ÉTAPE 1 : Première réponse
[Génère ta réponse initiale]

## ÉTAPE 2 : Auto-critique
Analyse ta réponse selon ces critères :
- Clarté (1-10) : Est-ce compréhensible ?
- Complétude (1-10) : Ai-je tout couvert ?
- Exactitude (1-10) : Y a-t-il des erreurs ?
- Style (1-10) : Le ton est-il approprié ?
Liste les points faibles identifiés.

## ÉTAPE 3 : Version améliorée
Réécris ta réponse en corrigeant les faiblesses identifiées.

---
DEMANDE : [La demande originale]
```

### Méthode 2 : Prompt en multi-tours

**Tour 1 - Génération :**
```
[Demande originale]
```

**Tour 2 - Critique :**
```
Évalue ta réponse précédente selon ces critères :
1. Points forts (liste)
2. Points faibles (liste)
3. Ce qui manque
4. Note globale /10

Sois impitoyable dans ta critique.
```

**Tour 3 - Amélioration :**
```
Réécris ta réponse en tenant compte de ta critique.
Focus sur les points faibles identifiés.
```

**Tour 4 (optionnel) - Validation :**
```
Compare la version 1 et la version 2.
- Qu'est-ce qui s'est amélioré ?
- Y a-t-il des régressions ?
- Score V1 vs Score V2 ?
```

### Méthode 3 : Workflow n8n automatisé

```json
{
  "nodes": [
    {
      "name": "Génération initiale",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "parameters": {
        "prompt": "={{$json.demande}}"
      }
    },
    {
      "name": "Auto-critique",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "parameters": {
        "prompt": "Critique cette réponse sur 10. Liste les faiblesses.\n\n{{$json.reponse}}"
      }
    },
    {
      "name": "Amélioration",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "parameters": {
        "prompt": "Améliore cette réponse selon la critique.\n\nRéponse: {{$json.reponse}}\nCritique: {{$json.critique}}"
      }
    },
    {
      "name": "Boucle si score < 8",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "number": [{
            "value1": "={{$json.score}}",
            "value2": 8,
            "operation": "lt"
          }]
        }
      }
    }
  ]
}
```

### Exemple concret

**Demande :** "Explique le machine learning en 3 phrases pour un enfant de 10 ans."

**V1 (brute) :**
"Le machine learning est une branche de l'intelligence artificielle qui permet aux ordinateurs d'apprendre à partir de données. Les algorithmes analysent des patterns pour faire des prédictions. C'est utilisé dans la reconnaissance d'images et le traitement du langage."

**Critique :**
- Clarté : 5/10 - Trop de jargon (algorithmes, patterns, IA)
- Complétude : 7/10 - Couvre l'essentiel
- Adaptation : 4/10 - Pas adapté à un enfant de 10 ans
- Points faibles : vocabulaire technique, pas d'exemple concret

**V2 (améliorée) :**
"Le machine learning, c'est quand on apprend à un ordinateur à reconnaître des choses tout seul, comme toi tu as appris à reconnaître un chat d'un chien. On lui montre plein de photos, et petit à petit, il devient meilleur. C'est comme ça que ton téléphone peut reconnaître ton visage !"

**Score V1 → V2 : 5/10 → 9/10**

### Critères de réussite
- Prompt ou workflow avec boucle de feedback
- Comparaison avant/après montrant une amélioration mesurable
- Au moins 2 itérations de critique/amélioration

---

## 2. Animation Dojo Challenge (1h, ~10 personnes)

### Objectifs pédagogiques
À la fin de l'atelier, les participants sauront :
- Forcer l'IA à s'auto-évaluer
- Créer des boucles d'amélioration
- Mesurer la progression de qualité

### Déroulé minute par minute

| Temps | Activité | Description |
|-------|----------|-------------|
| 0-5 | Intro concept | Pourquoi l'auto-correction améliore la qualité |
| 5-15 | Démo live | Montrer la différence V1 vs V2 sur un exemple |
| 15-25 | Méthode 1 | Chacun teste le prompt "une passe" |
| 25-40 | Méthode 2 | Chacun teste la méthode multi-tours |
| 40-50 | Comparaison | Partager les gains observés |
| 50-60 | Extension | Montrer comment automatiser avec n8n |

### Points d'attention
- L'IA peut être "trop gentille" dans sa critique → Demander d'être impitoyable
- Parfois la V2 régresse sur certains points → Faire une comparaison explicite
- Plus de 3 itérations = rendements décroissants généralement
