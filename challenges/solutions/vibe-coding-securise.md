# Vibe Coding Sécurisé (IT)

## 1. Résolution du Challenge

### Objectif
Prototyper une application en low-code/no-code avec audit de sécurité intégré.

### Concept : Vibe Coding

Le "vibe coding" consiste à décrire ce qu'on veut en langage naturel et laisser l'IA générer le code. L'enjeu : ne pas sacrifier la sécurité pour la vitesse.

### Outils recommandés

| Outil | Type | Forces | Sécurité |
|-------|------|--------|----------|
| **Cursor** | IDE IA | Contrôle total, code visible | ⭐⭐⭐⭐ |
| **Replit Agent** | Cloud IDE | Déploiement intégré | ⭐⭐⭐ |
| **Bolt.new** | Web builder | Ultra rapide | ⭐⭐ |
| **v0.dev** | UI generator | Composants React | ⭐⭐⭐ |

### Checklist sécurité obligatoire

#### 1. Authentification
- [ ] Pas de credentials en dur dans le code
- [ ] Tokens/sessions sécurisés
- [ ] Rate limiting sur les endpoints auth
- [ ] Validation des entrées utilisateur

#### 2. Données
- [ ] Pas de données sensibles dans le frontend
- [ ] HTTPS obligatoire
- [ ] Validation côté serveur
- [ ] Sanitisation des inputs

#### 3. APIs
- [ ] Authentification sur chaque endpoint
- [ ] Pas d'exposition de données internes
- [ ] CORS correctement configuré
- [ ] Pas de secrets dans les URLs

#### 4. Dépendances
- [ ] Packages à jour
- [ ] Pas de vulnérabilités connues (npm audit)
- [ ] Sources de confiance uniquement

### Workflow sécurisé

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Prompt    │───▶│   Code       │───▶│   Audit     │
│   (besoin)  │    │   (généré)   │    │   (sécu)    │
└─────────────┘    └──────────────┘    └─────────────┘
                          │                    │
                          ▼                    ▼
                   ┌──────────────┐    ┌─────────────┐
                   │   Review     │◀───│  Correctifs │
                   │   (humain)   │    │   (IA+dev)  │
                   └──────────────┘    └─────────────┘
```

### Prompt d'audit sécurité

```
Analyse ce code pour des vulnérabilités de sécurité.

Vérifie spécifiquement :
1. Injection (SQL, XSS, Command)
2. Authentification / Autorisation
3. Exposition de données sensibles
4. Configuration de sécurité
5. Dépendances vulnérables

Pour chaque problème trouvé :
- Sévérité (Critique/Haute/Moyenne/Basse)
- Localisation (fichier, ligne)
- Description du risque
- Code corrigé proposé

Code à auditer :
[Coller le code]
```

### Exemple d'audit

**Code généré :**
```javascript
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.query(`SELECT * FROM users WHERE username = '${username}'`);
  if (user.password === password) {
    res.json({ token: user.id });
  }
});
```

**Audit :**
```
🔴 CRITIQUE - Injection SQL
Ligne 3 : Concaténation directe dans la requête
→ Utiliser des requêtes préparées

🔴 CRITIQUE - Stockage mot de passe
Ligne 4 : Comparaison en clair
→ Utiliser bcrypt pour hash/compare

🟠 HAUTE - Token prédictible
Ligne 5 : User ID comme token
→ Utiliser JWT ou session sécurisée
```

**Code corrigé :**
```javascript
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await db.query(
    'SELECT * FROM users WHERE username = ?', 
    [username]
  );
  if (user && await bcrypt.compare(password, user.passwordHash)) {
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ token });
  }
});
```

### Critères de réussite
- Prototype fonctionnel créé en vibe coding
- Checklist sécurité passée
- Corrections documentées

---

## 2. Animation Dojo Challenge (1h)

### Déroulé

| Temps | Activité | Description |
|-------|----------|-------------|
| 0-10 | Intro | Démo de vibe coding + risques |
| 10-15 | Setup | Choisir l'outil (Cursor/Replit/Bolt) |
| 15-30 | Prototypage | Créer une mini-app par prompt |
| 30-45 | Audit | Passer la checklist sécurité |
| 45-55 | Correction | Corriger les vulnérabilités trouvées |
| 55-60 | Partage | Retour d'expérience |

### Points d'attention
- Le vibe coding est puissant mais dangereux sans review
- Toujours auditer avant de déployer
- Préférer Cursor (code visible) à Bolt (boîte noire)
