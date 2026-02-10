# Mood Board 2026 (Flow)

## 1. Résolution du Challenge

### Objectif
Construire un workflow de création de mood boards prospectifs assisté par IA.

### Processus de création

#### Étape 1 : Définir la direction créative

**Prompt de brief créatif :**
```
Je crée un mood board pour [projet/marque].

Contexte :
- Secteur : [industrie]
- Cible : [audience]
- Valeurs : [3-5 valeurs clés]
- Positionnement : [premium/accessible/innovant/traditionnel...]

Génère :
1. 5 mots-clés visuels qui capturent l'essence
2. 3 palettes de couleurs possibles (avec codes hex)
3. 3 styles typographiques recommandés
4. 5 références visuelles (artistes, marques, mouvements)
5. 3 textures/matières évocatrices
```

#### Étape 2 : Générer les visuels

**Prompts Midjourney par catégorie :**

**Ambiance générale :**
```
[Mood keywords] aesthetic, editorial photography, soft lighting, 
[color palette], minimalist composition --ar 3:2 --style raw
```

**Textures :**
```
Close-up texture of [material], macro photography, 
[color] tones, high detail --ar 1:1
```

**Typographie en contexte :**
```
[Font style] typography on [surface], editorial design, 
brand identity mockup, [color scheme] --ar 4:5
```

**Lifestyle :**
```
[Target persona] in [context], candid moment, 
[aesthetic style], natural lighting --ar 16:9
```

#### Étape 3 : Composer le mood board

**Dans Figma :**
1. Créer un frame (ex: 1920x1080 ou A3)
2. Grille asymétrique (pas régulière = plus créatif)
3. Mélanger les tailles d'images
4. Ajouter les palettes de couleurs
5. Intégrer les mots-clés en typo

**Composition type :**
```
┌─────────────┬───────┐
│   Grande    │  Med  │
│   image     ├───────┤
│   (hero)    │ Small │
├─────┬───────┼───────┤
│ Med │ Small │  Med  │
├─────┴───────┴───────┤
│   Palette + Typo    │
└─────────────────────┘
```

#### Étape 4 : Note d'intention

**Prompt pour la note :**
```
À partir de ce mood board [décrire les visuels], rédige une note d'intention créative de 150 mots qui explique :
- La direction artistique choisie
- L'émotion visée
- La cohérence avec les valeurs de la marque
- Comment ça se décline sur différents supports
```

### Exemple : Mood Board "Future of Wellness 2026"

**Brief :**
- Secteur : Bien-être / Santé
- Cible : Millennials urbains stressés
- Valeurs : Sérénité, Technologie douce, Nature
- Positionnement : Premium accessible

**Mots-clés visuels :**
1. Biophilic design
2. Soft tech
3. Mindful minimalism
4. Organic geometry
5. Warm neutrals

**Palette :**
- `#E8DFD5` Sable doux
- `#4A6741` Vert sauge
- `#B8860B` Or doux
- `#F5F5F0` Blanc cassé

**Visuels générés :**
- Hero : Espace de méditation avec plantes et lumière naturelle
- Texture : Pierre naturelle polie
- Lifestyle : Personne méditant avec wearable discret
- Detail : Interface d'app minimaliste

### Critères de réussite
- Mood board visuel cohérent
- Note d'intention articulée
- Workflow réutilisable et documenté

---

## 2. Animation Dojo Challenge (1h)

### Déroulé

| Temps | Activité | Description |
|-------|----------|-------------|
| 0-10 | Inspiration | Montrer des mood boards professionnels |
| 10-20 | Brief | Chacun définit son brief avec l'IA |
| 20-40 | Génération | Créer les visuels (Midjourney/DALL-E) |
| 40-55 | Composition | Assembler dans Figma |
| 55-60 | Galerie | Partage et vote |

### Alternatives sans Midjourney
- **Unsplash + Muzli** : Curation de visuels existants
- **Canva** : Templates et génération IA intégrée
- **Pinterest + IA** : Collection augmentée par génération
