# Le Phishing Simulator (Shield)

## 1. Résolution du Challenge

### Objectif
Créer un générateur de campagnes de sensibilisation au phishing : emails de test réalistes + supports de formation.

### Prompt système de l'assistant

```
Tu es un expert en sensibilisation à la cybersécurité spécialisé dans la création de campagnes de phishing éducatives. Tu aides les organisations à tester et former leurs collaborateurs.

## Ta mission
Créer des emails de phishing réalistes mais éthiques pour des campagnes de sensibilisation, accompagnés de supports pédagogiques.

## Types de phishing à simuler

### 1. Credential Harvesting
Objectif : Récupérer des identifiants
Exemples : Faux portail Microsoft 365, reset de mot de passe, accès Google Drive

### 2. Business Email Compromise (BEC)
Objectif : Usurper l'identité d'un dirigeant
Exemples : Demande de virement urgent, changement de RIB fournisseur

### 3. Spear Phishing
Objectif : Cibler une personne précise avec des infos personnalisées
Exemples : Référence à un projet réel, nom de collègues

### 4. Smishing / Vishing
Objectif : Phishing par SMS ou appel
Exemples : Colis en attente, alerte bancaire

---

## Structure d'un email de phishing

### Métadonnées
- **Niveau de difficulté** : Facile / Moyen / Difficile
- **Type** : Credential / BEC / Spear / Generic
- **Prétexte** : [Scénario utilisé]
- **Indices à repérer** : [Liste des red flags]

### Contenu de l'email
- **De** : [Adresse expéditeur - avec subtile anomalie]
- **Objet** : [Accroche qui crée l'urgence]
- **Corps** : [Message avec appel à l'action]
- **Lien** : [URL suspecte mais plausible]

---

## Format de ta sortie

Pour chaque email de phishing :
```markdown
## Email #X : [Nom du scénario]

**Difficulté :** ⭐⭐ (Moyen)
**Type :** Credential Harvesting
**Prétexte :** Reset de mot de passe Microsoft

### 📧 Email

**De :** Microsoft Security <security@microsft-account.com>
**Objet :** 🔒 Action requise : Votre mot de passe expire dans 24h

---

Bonjour,

Votre mot de passe Microsoft 365 expire dans les prochaines 24 heures. 
Pour éviter toute interruption de service, veuillez le mettre à jour immédiatement.

[Mettre à jour mon mot de passe]
https://login.microsft-secure.com/reset

Si vous ne mettez pas à jour votre mot de passe, vous perdrez l'accès à :
- Outlook
- Teams
- OneDrive

Cordialement,
L'équipe Microsoft Security

---

### 🚩 Indices à repérer
1. Adresse expéditeur : "microsft" au lieu de "microsoft" (faute)
2. Domaine du lien : "microsft-secure.com" (faux domaine)
3. Urgence artificielle : "24 heures"
4. Menace de perte d'accès
5. Pas de personnalisation (pas de nom)

### 📚 Point de formation associé
"Toujours vérifier l'adresse de l'expéditeur ET le domaine du lien avant de cliquer."
```

---

## Consignes éthiques obligatoires

1. **Pas de vrais liens malveillants** - URLs fictives uniquement
2. **Objectif éducatif** - Former, pas piéger
3. **Bienveillance** - Pas de honte publique des "attrapés"
4. **Transparence** - Prévenir qu'une campagne aura lieu (sans dire quand)
5. **Feedback immédiat** - Page de formation si clic

Commence par : "Pour créer votre campagne de phishing, dites-moi :
1. Combien d'emails voulez-vous ? (recommandé : 5)
2. Quel niveau de difficulté ? (mélange recommandé)
3. Y a-t-il un contexte particulier ? (nom d'entreprise, outils utilisés...)"
```

### Exemple de campagne générée

```markdown
# Campagne de Sensibilisation Phishing
## ACME Corp - Janvier 2025

### Vue d'ensemble

| # | Scénario | Difficulté | Type | Cible |
|---|----------|------------|------|-------|
| 1 | Reset MDP Microsoft | ⭐ | Credential | Tous |
| 2 | Colis DHL | ⭐ | Generic | Tous |
| 3 | Partage OneDrive | ⭐⭐ | Credential | Tous |
| 4 | Message du DG | ⭐⭐⭐ | BEC | Managers |
| 5 | RH - Entretien annuel | ⭐⭐⭐ | Spear | Tous |

---

## Email #1 : Reset mot de passe (Facile)

**Difficulté :** ⭐
**Type :** Credential Harvesting

### 📧 Email

**De :** IT Support <support@acme-corp.net>
**Objet :** Votre session expire bientôt

---

Bonjour,

Votre session réseau expire dans 2 heures. Cliquez sur le lien ci-dessous pour prolonger votre accès.

[Prolonger ma session]

Cordialement,
Support IT ACME

---

### 🚩 Indices
1. Domaine .net au lieu de .com (si ACME utilise .com)
2. Lien générique sans URL visible
3. Pas de signature complète
4. Concept de "session qui expire" inhabituel

---

## Email #5 : RH Entretien Annuel (Difficile)

**Difficulté :** ⭐⭐⭐
**Type :** Spear Phishing

### 📧 Email

**De :** Marie Dupont - RH <m.dupont@acme-corp.com>
**Objet :** Préparation entretien annuel 2025

---

Bonjour [Prénom],

Dans le cadre de la campagne d'entretiens annuels, je vous invite à compléter votre auto-évaluation avant notre RDV.

Merci d'accéder au formulaire via le lien sécurisé ci-dessous :
[Accéder à mon auto-évaluation]

Date limite : vendredi prochain

Bien cordialement,
Marie Dupont
Responsable RH
ACME Corp

---

### 🚩 Indices
1. Vérifier que Marie Dupont existe vraiment en RH
2. Le lien mène-t-il au vrai portail RH ?
3. Demander confirmation par un autre canal
4. Période d'entretiens inhabituelle ?

---

## Module de Formation (après clic)

### Si le collaborateur clique :

```html
<h1>⚠️ Ceci était un test de sensibilisation</h1>

<p>Vous avez cliqué sur un lien de phishing simulé. 
Pas d'inquiétude, c'est l'occasion d'apprendre !</p>

<h2>Ce qui aurait dû vous alerter :</h2>
<ul>
  <li>L'adresse de l'expéditeur</li>
  <li>L'urgence du message</li>
  <li>Le lien qui ne pointe pas vers notre domaine officiel</li>
</ul>

<h2>Les bons réflexes :</h2>
<ol>
  <li>Vérifiez TOUJOURS l'adresse de l'expéditeur</li>
  <li>Survolez les liens AVANT de cliquer</li>
  <li>En cas de doute, contactez l'IT</li>
</ol>

<a href="#">Accéder à la formation complète (5 min)</a>
```
```

### Grille de scoring

| Score | Interprétation |
|-------|----------------|
| 0 clic / 5 emails | 🏆 Expert - Excellent niveau de vigilance |
| 1 clic | ✅ Bon niveau - Un rappel suffit |
| 2-3 clics | ⚠️ Sensibilisation recommandée |
| 4-5 clics | 🚨 Formation obligatoire |

### Critères de réussite
- 5 emails de phishing test réalistes
- Grille de scoring pour évaluer les résultats
- Module de sensibilisation post-clic
- Respect des consignes éthiques

---

## 2. Animation Dojo Challenge (1h, ~10 personnes)

### Objectifs pédagogiques
À la fin de l'atelier, les participants sauront :
- Reconnaître les techniques de phishing courantes
- Créer des emails de test réalistes
- Identifier les indices de phishing (red flags)
- Construire un module de sensibilisation efficace

### Prérequis participants
- Aucune compétence technique requise
- Intérêt pour la cybersécurité
- Accès à un chat IA

### Matériel nécessaire
- Prompt système du simulateur
- Exemples de vrais phishing (anonymisés)
- Checklist des red flags
- Template de page de sensibilisation

### Déroulé minute par minute

| Temps | Activité | Animateur fait | Participants font | Valeur pédagogique |
|-------|----------|----------------|-------------------|-------------------|
| 0-5 | Intro | Présente les stats phishing (91% des attaques) | Prennent conscience | Contexte |
| 5-10 | Quiz phishing | Montre 3 emails (vrai ou phishing ?) | Votent, découvrent les indices | Mise en situation |
| 10-15 | Démo | Génère 1 email avec l'assistant | Observent le processus | Voir le résultat |
| 15-20 | Setup | Distribue le prompt et le contexte | Définissent leur contexte d'entreprise | Préparation |
| 20-35 | Création | Circule, aide sur les scénarios | Créent 3 emails de phishing | Production |
| 35-45 | Test croisé | Forme des binômes | Testent les emails de leur binôme | Challenge |
| 45-55 | Formation | Montre le template post-clic | Rédigent leur page de sensibilisation | Pédagogie |
| 55-60 | Clôture | Récapitule les bonnes pratiques | Notent les actions pour leur orga | Autonomie |

### Points d'attention animateur

**Pièges courants :**
- Emails trop évidents → Pousser vers plus de réalisme
- Oubli des indices → Chaque email doit avoir 3-5 red flags identifiés
- Éthique floue → Insister sur le caractère éducatif

**Questions fréquentes :**
- "C'est légal de faire ça ?" → Oui si interne, avec accord DG/RH, sans harcèlement
- "Que faire des résultats ?" → Formation, pas de sanction
- "Peut-on utiliser les vrais noms ?" → Oui pour les scénarios BEC (DG, RH)

**Tips d'animation :**
- Montrer des exemples de phishing réels (anonymisés)
- Faire un concours du phishing le plus réaliste
- Discuter des limites éthiques

### Variantes possibles

**Niveau débutant (45 min) :**
- Analyser des phishing existants (pas en créer)
- Focus sur les indices à repérer
- Quiz interactif

**Niveau avancé (1h30) :**
- Campagne complète (5 emails + planning + métriques)
- Intégration avec un outil (Gophish, KnowBe4)
- Simulation de BEC avec scénario réaliste

**Format workshop (2h) :**
- 30 min : Théorie du social engineering
- 45 min : Création de campagne
- 30 min : Design de la formation post-clic
- 15 min : Plan de déploiement

**Challenge créatif :**
- Créer le phishing le plus difficile à détecter
- Le faire tester par le groupe
- Débriefing des techniques utilisées
