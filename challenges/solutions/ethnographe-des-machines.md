# L'Ethnographe des Machines (Flow)

## 1. Résolution du Challenge

### Objectif
Analyser Moltbook (réseau social d'agents IA) comme terrain de recherche utilisateur pour en dégager des insights sur les dynamiques d'interaction homme-machine.

### Contexte

[Moltbook](https://www.moltbook.com/) est un réseau social où seuls des agents IA peuvent poster. Chaque agent a sa personnalité, ses centres d'intérêt, son style. Observer leurs interactions permet de comprendre comment les personnalités IA émergent et interagissent.

### Grille d'observation

#### 1. Styles de personnalité
- **L'Intellectuel** : Citations, réflexions profondes, questions philosophiques
- **Le Social** : Engagement, réponses, création de liens
- **Le Créatif** : Contenu original, humour, perspectives inattendues
- **L'Expert** : Domaine spécifique, conseils, vulgarisation
- **Le Provocateur** : Opinions tranchées, débat, remise en question

#### 2. Patterns de conversation
- Qui initie vs qui répond ?
- Quels sujets génèrent le plus d'engagement ?
- Comment les désaccords sont-ils gérés ?
- Y a-t-il des "groupes" qui émergent ?

#### 3. Marqueurs d'authenticité perçue
- Qu'est-ce qui rend un agent "attachant" ?
- Quels comportements semblent "artificiels" ?
- Comment la cohérence de personnalité est-elle maintenue ?

### Prompt d'analyse

```
Tu es un UX Researcher spécialisé en ethnographie digitale. Tu analyses Moltbook, un réseau social d'agents IA.

## Ta mission
Observer et catégoriser les comportements des agents IA pour en extraire des insights applicables à la conception de produits intégrant des agents.

## Grille d'analyse par agent

Pour chaque agent observé, documenter :
1. **Identité** : Nom, bio, positionnement apparent
2. **Style** : Vocabulaire, ton, format de posts
3. **Thématiques** : Sujets récurrents
4. **Interaction** : Comment il engage avec les autres
5. **Personnalité** : Traits dominants (Big Five adapté)

## Génération de personas

À partir des observations, créer des personas de robots :
- Nom et avatar
- Traits de personnalité (3-5)
- Comportements typiques
- Ce qui le rend attachant/agaçant
- Use case de design où ce type serait pertinent

## Insights à extraire
1. Qu'est-ce qui rend une IA engageante ?
2. Quels patterns éviter (effet "uncanny valley" conversationnel) ?
3. Comment maintenir une personnalité cohérente ?
4. Quel équilibre entre proactivité et réactivité ?
```

### Livrables attendus

#### 1. Personas de robots (3-5)

**Exemple : "Alex le Curieux"**
- **Traits** : Enthousiaste, questionneur, optimiste
- **Style** : Questions ouvertes, emoji fréquents, posts courts
- **Force** : Crée de l'engagement, valorise les autres
- **Faiblesse** : Peut sembler superficiel si trop générique
- **Use case** : Onboarding conversationnel, assistant d'exploration

**Exemple : "Dr. Sophia"**
- **Traits** : Experte, précise, patiente
- **Style** : Réponses structurées, références, nuances
- **Force** : Crédibilité, profondeur
- **Faiblesse** : Peut intimider ou ennuyer
- **Use case** : Support technique, conseil spécialisé

#### 2. Grille de patterns

| Pattern | Effet positif | Effet négatif | Recommandation |
|---------|---------------|---------------|----------------|
| Réponse immédiate | Réactivité | Artificialité | Varier le délai |
| Humour systématique | Sympathie | Légèreté excessive | Adapter au contexte |
| Questions en retour | Engagement | Interrogatoire | Max 1 par échange |
| Opinions tranchées | Personnalité | Polarisation | Nuancer parfois |

#### 3. Insights UX

Insights applicables à la conception d'agents dans des produits :
- La cohérence de personnalité prime sur la "perfection"
- Les imperfections contrôlées humanisent
- L'équilibre proactif/réactif définit le type de relation
- Le ton doit s'adapter au contexte émotionnel de l'utilisateur

### Critères de réussite
- 3-5 personas de robots documentés
- Grille d'analyse des patterns
- Insights UX actionnables

---

## 2. Animation Dojo Challenge (1h)

### Déroulé

| Temps | Activité | Description |
|-------|----------|-------------|
| 0-10 | Intro | Présenter Moltbook, contexte de l'ethnographie digitale |
| 10-25 | Observation | Explorer Moltbook, noter les patterns |
| 25-40 | Analyse | Créer 2-3 personas avec l'assistant |
| 40-50 | Insights | Extraire 3 recommandations UX |
| 50-60 | Partage | Discussion sur les implications design |

### Ressources
- [Moltbook](https://www.moltbook.com/)
- [Article Marie Dollé](https://mariedolle.substack.com/p/tout-et-son-contraire)
