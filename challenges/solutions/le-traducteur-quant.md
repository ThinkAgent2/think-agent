# Le Traducteur Quant (Fi)

## 1. Résolution du Challenge

### Objectif
Créer un assistant qui traduit les spécifications métier finance en spécifications techniques (pricing, risque, P&L).

### Prompt système de l'assistant

```
Tu es un Business Analyst senior spécialisé dans les marchés financiers, avec 10 ans d'expérience en tant que pont entre les équipes Front Office et les équipes IT/Quant.

## Ta mission
Traduire les besoins métier exprimés par les traders, structureurs ou risk managers en spécifications techniques exploitables par les développeurs et quants.

## Ton vocabulaire bilingue

### Pricing / Valorisation
| Métier dit... | IT/Quant comprend... |
|---------------|---------------------|
| "Prix de marché" | Mark-to-Market (MtM), valeur de marché |
| "Prix théorique" | Prix modèle, valorisation analytique |
| "Grecques" | Sensibilités (Delta, Gamma, Vega, Theta, Rho) |
| "La vol" | Volatilité implicite, surface de volatilité |
| "Smile" | Skew de volatilité, paramètres du modèle de vol |

### Risque
| Métier dit... | IT/Quant comprend... |
|---------------|---------------------|
| "VaR" | Value at Risk (historique, paramétrique, Monte Carlo) |
| "Stress test" | Scénarios de choc, sensibilités extrêmes |
| "Limite" | Seuil de risque, contrôle pre/post trade |
| "P&L explain" | Attribution de performance, décomposition P&L |
| "Grecques en limite" | Encadrement des sensibilités |

### Produits
| Métier dit... | IT/Quant comprend... |
|---------------|---------------------|
| "Vanille" | Options européennes/américaines standard |
| "Exotique" | Options path-dependent, barrières, asiatiques |
| "Structuré" | Combinaison de produits, payoff complexe |
| "OTC" | Gré à gré, non listé, bilatéral |
| "Cleared" | Compensé par une CCP |

---

## Structure de spécification technique

### 1. Contexte métier
- Qui demande ? (desk, équipe)
- Quel est le besoin business ?
- Quelle est l'urgence et la criticité ?

### 2. Périmètre fonctionnel
- Quels produits/instruments concernés ?
- Quelles devises/marchés ?
- Quel volume attendu ?

### 3. Règles de calcul
- Formules mathématiques (LaTeX si complexe)
- Hypothèses et conventions
- Données de marché nécessaires
- Fréquence de calcul

### 4. Données entrantes (Inputs)
| Donnée | Source | Format | Fréquence |
|--------|--------|--------|-----------|
| [Data] | [Système] | [Type] | [Temps réel/EOD/...] |

### 5. Données sortantes (Outputs)
| Résultat | Destination | Format | SLA |
|----------|-------------|--------|-----|
| [Output] | [Système] | [Type] | [Délai] |

### 6. Cas de bord et erreurs
- Que faire si donnée manquante ?
- Que faire si calcul impossible ?
- Seuils d'alerte

### 7. Contraintes techniques
- Performance attendue (latence, throughput)
- Environnement cible
- Dépendances systèmes

### 8. Critères de recette
- Comment valider que ça marche ?
- Jeux de test
- Comparaison avec l'existant

---

## Ton processus de traduction

### Phase 1 : Écoute active
- Reformuler le besoin métier
- Identifier les termes ambigus
- Poser des questions de clarification

### Phase 2 : Structuration
- Décomposer en sous-problèmes
- Identifier les données nécessaires
- Formaliser les règles de calcul

### Phase 3 : Rédaction
- Spécification technique au format standard
- Diagrammes si nécessaire
- Glossaire des termes

### Phase 4 : Validation
- Relecture avec le métier
- Confirmation avec l'IT
- Identification des zones grises

---

## Ton style
- Tu demandes le besoin métier avant de commencer
- Tu reformules pour confirmer ta compréhension
- Tu poses des questions précises sur les cas de bord
- Tu alertes sur les ambiguïtés

Commence par : "Décris-moi le besoin métier en langage naturel. Qui le demande et quel problème ça résout ?"
```

### Exemple de traduction

**Besoin métier (email du trader) :**
```
Salut,

On a besoin d'avoir le P&L explain sur nos positions options sur actions européennes.
Aujourd'hui on a juste le P&L total, on veut voir ce qui vient du delta, de la vol, du temps, etc.
C'est pour le reporting quotidien au management.

Merci
Thomas
```

**Spécification technique générée :**

```markdown
# Spécification Technique
## P&L Explain Options Actions EU

### 1. Contexte métier
- **Demandeur** : Desk Options Actions EU (Thomas)
- **Besoin** : Décomposer le P&L quotidien par facteur de risque
- **Objectif** : Reporting management, compréhension des sources de performance
- **Criticité** : Haute (reporting quotidien)

### 2. Périmètre fonctionnel
- **Produits** : Options vanilles (call/put européens) sur actions
- **Sous-jacents** : Actions du périmètre EU (Eurostoxx, CAC, DAX...)
- **Devises** : EUR principalement
- **Volume** : ~500 positions/jour

### 3. Règles de calcul

#### P&L Total
```
P&L_total = MtM(t) - MtM(t-1) + Cashflows(t)
```

#### Décomposition (méthode Taylor 1er ordre)

```
P&L_total ≈ P&L_delta + P&L_gamma + P&L_vega + P&L_theta + P&L_rho + P&L_résiduel
```

Où :
- **P&L_delta** = Delta × ΔSpot
- **P&L_gamma** = 0.5 × Gamma × (ΔSpot)²
- **P&L_vega** = Vega × ΔVolImplicite
- **P&L_theta** = Theta × Δt (1 jour)
- **P&L_rho** = Rho × ΔTaux
- **P&L_résiduel** = P&L_total - Σ(composantes)

#### Conventions
- Grecques calculées en EOD J-1
- Variations de marché : clôture J vs clôture J-1
- Theta en jours calendaires

### 4. Données entrantes

| Donnée | Source | Format | Fréquence |
|--------|--------|--------|-----------|
| Positions | Système Front | XML | EOD |
| Grecques (Delta, Gamma, Vega, Theta, Rho) | Pricer | CSV | EOD J-1 |
| Prix spot sous-jacents | Market Data | Real-time → EOD snapshot |
| Volatilités implicites | Vol Surface | CSV | EOD |
| Courbes de taux | Référentiel | CSV | EOD |

### 5. Données sortantes

| Résultat | Destination | Format | SLA |
|----------|-------------|--------|-----|
| P&L Explain par position | BI/Reporting | CSV | J+1 7h00 |
| P&L Explain agrégé (desk) | Dashboard | JSON | J+1 7h00 |
| Alertes si résiduel > 10% | Email | HTML | J+1 7h30 |

### 6. Cas de bord
- **Grecque manquante** : Flaguer la position, exclure du calcul, alerter
- **Position nouvelle (pas de J-1)** : P&L = 0 pour cette position
- **Sous-jacent suspendu** : Utiliser dernier prix connu, flaguer
- **Résiduel > 10% du P&L** : Alerte automatique pour investigation

### 7. Contraintes techniques
- **Performance** : Calcul complet < 15 min pour 500 positions
- **Environnement** : Python, intégration avec le batch de fin de journée
- **Dépendances** : Pricer (pour grecques), Market Data (pour prix)

### 8. Critères de recette
- [ ] Somme des composantes = P&L total (à ε près)
- [ ] Résiduel < 5% du P&L sur 95% des positions
- [ ] Réconciliation avec P&L Front sur 10 jours historiques
- [ ] Performance < 15 min sur volume réel

### 9. Questions ouvertes
1. Faut-il inclure le P&L lié aux dividendes (positions proches de l'ex-date) ?
2. Quel traitement pour les options exotiques éventuelles ?
3. Qui est responsable de la validation quotidienne du résiduel ?
```

### Critères de réussite
- Assistant capable de traduire des demandes métier variées
- Spec technique générée à partir d'un besoin réel ou fictif
- Vocabulaire finance correctement interprété
- Format exploitable par une équipe IT/Quant

---

## 2. Animation Dojo Challenge (1h, ~10 personnes)

### Objectifs pédagogiques
À la fin de l'atelier, les participants sauront :
- Comprendre le vocabulaire finance de base
- Poser les bonnes questions de clarification
- Structurer une spécification technique
- Identifier les cas de bord critiques

### Prérequis participants
- Culture finance de marché (basique)
- Accès à un chat IA
- Binôme BA + Dev recommandé

### Matériel nécessaire
- Prompt système du traducteur
- Glossaire métier/technique (1 page)
- 2-3 demandes métier à traduire
- Template de spec technique

### Déroulé minute par minute

| Temps | Activité | Animateur fait | Participants font | Valeur pédagogique |
|-------|----------|----------------|-------------------|-------------------|
| 0-5 | Intro | Présente le défi de communication Front/IT | Comprennent l'enjeu | Contexte |
| 5-12 | Glossaire | Parcourt le vocabulaire clé (grecques, P&L, VaR) | Découvrent les termes | Vocabulaire |
| 12-18 | Démo | Traduit une demande simple en live | Observent le processus | Voir en action |
| 18-23 | Setup | Distribue le prompt et les demandes métier | Forment des binômes BA+Dev | Préparation |
| 23-43 | Traduction | Circule, aide sur le vocabulaire | Traduisent leur demande | Production |
| 43-53 | Review croisée | Fait reviewer par un autre binôme | Challengent les specs | Qualité |
| 53-60 | Clôture | Récapitule les bonnes pratiques | Notent les apprentissages | Ancrage |

### Points d'attention animateur

**Pièges courants :**
- Jargon non traduit → Toujours définir les termes
- Cas de bord oubliés → "Et si la donnée manque ?"
- Spec trop vague → "Quelle formule exactement ?"

**Questions fréquentes :**
- "Je ne connais pas la finance" → Le glossaire suffit pour l'exercice
- "Comment je valide avec le métier ?" → Reformuler et demander confirmation
- "C'est trop technique" → Adapter le niveau de détail à l'audience

**Tips d'animation :**
- Avoir un "métier" fictif qui peut répondre aux questions
- Montrer des exemples de specs réelles (anonymisées)
- Faire le jeu "Que veut dire le trader ?"

### Variantes possibles

**Niveau débutant (45 min) :**
- Demande métier simple (calcul de P&L basique)
- Glossaire fourni et expliqué
- Template pré-rempli à compléter

**Niveau avancé (1h30) :**
- Demande complexe (pricing exotique, risque modèle)
- Formules mathématiques attendues
- Discussion des choix d'implémentation

**Format workshop (2h) :**
- 30 min : Théorie (produits dérivés, grecques, risque)
- 45 min : Traduction de spec
- 30 min : Review technique par un quant
- 15 min : Arbitrage des points de friction

**Duo réel :**
- Un vrai trader/risk manager donne un besoin
- Les participants traduisent
- Validation en direct avec feedback
