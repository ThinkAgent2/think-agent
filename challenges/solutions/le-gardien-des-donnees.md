# Le Gardien des Données

## 1. Résolution du Challenge

### Objectif
Valider sa compréhension des bonnes pratiques de confidentialité avec l'IA et créer une charte personnelle.

### Les règles d'or de la confidentialité IA

#### ❌ Ne JAMAIS partager :
1. **Données personnelles identifiantes** : noms, emails, téléphones, adresses
2. **Données sensibles RGPD** : santé, opinions politiques, orientation sexuelle, origine ethnique
3. **Secrets d'entreprise** : code source propriétaire, stratégies confidentielles, données financières non publiques
4. **Credentials** : mots de passe, tokens API, clés SSH
5. **Données clients** : sauf anonymisation complète

#### ✅ Ce qu'on peut partager :
1. **Données publiques** : informations disponibles sur internet
2. **Données anonymisées** : impossible de remonter à l'individu
3. **Données synthétiques** : données fictives représentatives
4. **Données personnelles avec consentement** : et justification légitime

### Techniques d'anonymisation

| Technique | Description | Exemple |
|-----------|-------------|---------|
| Pseudonymisation | Remplacer par des identifiants | Jean Dupont → User_A42 |
| Généralisation | Réduire la précision | 28 ans → 25-30 ans |
| Suppression | Retirer les champs sensibles | Supprimer la colonne email |
| Bruit | Ajouter des variations | Salaire ± 5% |

### Questions type du quiz

1. Peut-on partager un email client avec ChatGPT pour rédiger une réponse ?
   → ❌ Non, sauf à anonymiser le nom et l'email

2. Peut-on analyser du code open source avec l'IA ?
   → ✅ Oui, c'est public

3. Peut-on partager un extrait de contrat client ?
   → ❌ Non, confidentiel

4. Peut-on utiliser l'IA pour analyser des données de santé anonymisées ?
   → ⚠️ Dépend du contexte et des garanties d'anonymisation

### Ma charte personnelle (template)

```markdown
# Ma Charte IA

## Ce que je ne partage JAMAIS avec une IA publique :
- [ ] Noms et coordonnées de vrais clients
- [ ] Code source propriétaire de mon client
- [ ] Données RH (salaires, évaluations)
- [ ] Mots de passe et tokens
- [ ] [Ajouter selon votre contexte]

## Mes réflexes avant de copier-coller :
1. Est-ce que cette donnée est publique ?
2. Peut-elle identifier une personne ?
3. Est-elle couverte par un NDA ?
4. Mon client autoriserait-il ce partage ?

## Mes techniques d'anonymisation préférées :
- Remplacer les noms par [CLIENT], [PERSONNE]
- Remplacer les emails par xxx@example.com
- Généraliser les chiffres sensibles

## En cas de doute :
- Je demande à mon manager
- Je ne partage pas

Signé : ________________
Date : ________________
```

### Critères de réussite
- Score ≥ 80% au quiz
- Charte personnelle complétée et signée

---

## 2. Animation Dojo Challenge (1h, ~10 personnes)

### Objectifs pédagogiques
À la fin de l'atelier, les participants sauront :
- Identifier les données qu'on peut/ne peut pas partager
- Appliquer les techniques d'anonymisation de base
- Avoir des réflexes de protection systématiques

### Déroulé minute par minute

| Temps | Activité | Description |
|-------|----------|-------------|
| 0-10 | Intro RGPD & risques | Contexte légal et exemples de fuites |
| 10-25 | Quiz interactif | Cas pratiques : "Je partage ou pas ?" |
| 25-40 | Atelier anonymisation | Anonymiser un email et un extrait de données |
| 40-50 | Création charte | Rédaction de la charte personnelle |
| 50-60 | Partage et engagement | Tour de table, signature symbolique |

### Points d'attention
- Éviter le ton moralisateur, être pratique
- Montrer que l'objectif est de pouvoir utiliser l'IA, pas de l'interdire
- Donner des astuces concrètes (extensions d'anonymisation, templates)
