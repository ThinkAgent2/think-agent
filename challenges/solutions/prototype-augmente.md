# Le Prototype Augmenté (Flow)

## 1. Résolution du Challenge

### Objectif
Enrichir un prototype Figma statique avec du contenu réel généré par IA pour des tests utilisateurs plus immersifs.

### Cas d'usage

1. **Lorem ipsum → Contenu réaliste** : Remplacer les textes génériques par des données crédibles
2. **Données de démo** : Générer des jeux de données cohérents pour les dashboards
3. **Personnalisation** : Adapter le contenu au profil du testeur
4. **Edge cases** : Tester les cas limites (noms longs, nombres élevés...)

### Méthode 1 : Génération de contenu par batch

**Prompt pour générer du contenu :**
```
Génère du contenu réaliste pour un prototype d'application [type].

## Besoins :
- 10 noms de produits avec descriptions (50 mots max)
- 5 profils utilisateurs avec photo placeholder, nom, email, rôle
- 15 notifications types (succès, erreur, info)
- 8 éléments de menu avec icônes suggérées
- 20 titres d'articles de blog avec dates

## Format : JSON structuré
```

**Sortie :**
```json
{
  "products": [
    {
      "name": "AirPods Pro Max",
      "description": "Casque audio premium avec réduction de bruit active",
      "price": "549€",
      "category": "Audio"
    }
  ],
  "users": [
    {
      "name": "Marie Dubois",
      "email": "m.dubois@example.com",
      "role": "Product Manager",
      "avatar": "initials:MD"
    }
  ],
  "notifications": [
    {
      "type": "success",
      "message": "Votre commande a été confirmée"
    }
  ]
}
```

### Méthode 2 : Plugin Figma + IA

**Plugins recommandés :**
- **Content Reel** : Génère du contenu contextuel
- **Stark AI** : Vérifie l'accessibilité
- **Magician** : Génération IA intégrée

**Workflow avec Magician :**
1. Sélectionner les blocs de texte
2. Décrire le contexte ("emails de confirmation e-commerce")
3. Générer et appliquer

### Méthode 3 : Variables Figma + JSON

1. **Créer les variables Figma** :
   - Mode "Demo" avec contenu générique
   - Mode "Test User A" avec contenu personnalisé
   - Mode "Edge Case" avec cas limites

2. **Importer le JSON généré** :
   - Plugin "JSON to Figma Variables"
   - Mapper les champs aux composants

3. **Switcher entre les modes** :
   - Un clic pour passer d'un persona à l'autre
   - Tester différents scénarios

### Méthode 4 : Contenu dynamique pour tests

**Pour tests utilisateurs personnalisés :**
```
Génère du contenu pour un test utilisateur avec ce persona :
- Prénom : [Prénom du testeur]
- Secteur : [Secteur du testeur]
- Niveau : [Débutant/Expert]

Le prototype est une app de [type]. Personnalise :
- Les exemples utilisés (pertinents pour son secteur)
- Le niveau de complexité des données
- Les références (entreprises de son domaine)
```

### Exemple : Dashboard financier

**Avant (lorem ipsum) :**
- "Lorem ipsum dolor..."
- Graphique avec données aléatoires
- KPIs sans sens

**Après (contenu généré) :**
```json
{
  "kpis": [
    {"label": "Chiffre d'affaires", "value": "2.4M€", "trend": "+12%"},
    {"label": "Marge brute", "value": "42%", "trend": "-2pts"},
    {"label": "Clients actifs", "value": "1,847", "trend": "+156"}
  ],
  "chart_data": {
    "labels": ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"],
    "revenue": [180000, 195000, 210000, 198000, 225000, 240000],
    "target": [200000, 200000, 200000, 220000, 220000, 220000]
  },
  "alerts": [
    "Objectif Q2 atteint avec 3 semaines d'avance",
    "3 clients grands comptes en phase de négociation"
  ]
}
```

### Critères de réussite
- Prototype enrichi avec contenu réaliste
- Documentation du processus
- Comparaison avant/après
- Réutilisabilité du workflow

---

## 2. Animation Dojo Challenge (1h)

### Déroulé

| Temps | Activité | Description |
|-------|----------|-------------|
| 0-10 | Intro | Pourquoi le contenu compte pour les tests UX |
| 10-20 | Génération | Créer un jeu de données pour un prototype |
| 20-35 | Application | Intégrer dans Figma (copier-coller ou plugin) |
| 35-50 | Personnalisation | Créer une variante "edge case" |
| 50-60 | Partage | Avant/après, discussion |

### Prérequis
- Fichier Figma avec textes à remplacer
- Accès à un chat IA
- Optionnel : plugins Figma (Magician, Content Reel)
