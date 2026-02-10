# La BD dont vous êtes le PO (Flow)

## 1. Résolution du Challenge

### Objectif
Transformer des entretiens utilisateurs ou workflows abstraits en storyboards visuels impactants.

### Quand utiliser cette approche

- **User research** : Illustrer des verbatims utilisateurs
- **Workshop de cadrage** : Visualiser un parcours client
- **Présentation COMEX** : Rendre concret un concept abstrait
- **Spécifications** : Clarifier un workflow complexe

### Processus de création

#### Étape 1 : Extraire les scènes clés

**Prompt pour découper en scènes :**
```
Analyse ce verbatim d'entretien utilisateur et découpe-le en 6-8 scènes pour un storyboard.

Pour chaque scène, décris :
- Le contexte visuel (où, quand)
- Les personnages présents
- L'action principale
- L'émotion dominante
- Le dialogue/pensée clé (bulle)

Verbatim :
[Coller l'entretien]
```

#### Étape 2 : Générer les images

**Prompt Midjourney/DALL-E par scène :**
```
[Style] illustration style, simple lines, business context

Scene: [Description de la scène]
Characters: [Description des personnages]
Action: [Ce qui se passe]
Mood: [Émotion]

--ar 16:9 --style raw
```

**Styles recommandés :**
- `clean line illustration` : Pro, épuré
- `comic book style` : Dynamique
- `storyboard sketch` : Brouillon volontaire
- `flat design illustration` : Corporate

#### Étape 3 : Assembler dans Figma

1. Créer un frame par planche (ex: 1920x1080)
2. Grille 2x3 ou 3x2 pour 6 cases
3. Ajouter les images générées
4. Ajouter les bulles de dialogue
5. Numéroter les cases

### Exemple : Parcours de demande de congés

**Verbatim source :**
"Quand je veux poser mes congés, je dois d'abord vérifier le planning de l'équipe, puis remplir un formulaire papier, le faire signer par mon manager qui n'est jamais là, le scanner et l'envoyer aux RH..."

**Découpage en scènes :**

| # | Scène | Émotion | Bulle |
|---|-------|---------|-------|
| 1 | Marie devant le planning mural, cherche une date | Concentration | "Voyons voir..." |
| 2 | Marie remplit un formulaire papier | Ennui | "Encore ce formulaire..." |
| 3 | Marie devant le bureau vide du manager | Frustration | "Pas encore là !" |
| 4 | Marie laisse le formulaire sur le bureau | Résignation | "Je reviendrai..." |
| 5 | Marie au scanner, pile de documents | Lassitude | "Bientôt fini..." |
| 6 | Marie envoie un email aux RH | Soulagement | "Enfin !" |

### Livrables

- **Storyboard complet** : 6-10 planches illustrées
- **Version présentable** : Export PDF/PNG pour présentation
- **Fichier source Figma** : Pour itérations

### Critères de réussite
- Storyboard de 6-10 planches
- Fidèle au verbatim/workflow source
- Visuellement cohérent
- Exploitable en présentation

---

## 2. Animation Dojo Challenge (1h)

### Déroulé

| Temps | Activité | Description |
|-------|----------|-------------|
| 0-10 | Intro | Montrer exemples de storyboards UX |
| 10-20 | Découpage | Chacun découpe son verbatim en scènes |
| 20-40 | Génération | Créer les images (Midjourney/DALL-E) |
| 40-55 | Assemblage | Mise en page dans Figma |
| 55-60 | Galerie | Partage des créations |

### Alternatives si pas d'accès Midjourney
- **Canva** : Templates de storyboard + illustrations
- **Excalidraw** : Dessins rapides
- **Stock photos** : Unsplash + montage
