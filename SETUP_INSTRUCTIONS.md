# 🚀 Instructions Setup Supabase

## Étape à faire au réveil (2 min)

La connexion Supabase fonctionne, mais les tables n'existent pas encore. 

### 1. Exécuter le Schema SQL

1. Va sur https://supabase.com/dashboard/project/szvtfhhrfdaepfhsywhq
2. Clique sur **SQL Editor** (menu gauche)
3. Clique **+ New query**
4. Copie-colle TOUT le contenu de `supabase/schema.sql`
5. Clique **Run** (ou Cmd+Enter)

### 2. Vérifier

Après exécution, tu devrais voir dans **Table Editor** :
- ✅ users
- ✅ challenges (9 challenges pré-remplis)
- ✅ participations
- ✅ solutions
- ✅ badges (7 badges)
- ✅ user_badges
- ✅ evenements_dojo (3 événements)
- ✅ marques (7 marques eXalt)
- ✅ metiers (20 métiers)

### 3. Lancer l'app

```bash
cd think-agent-app
npm run dev
```

→ http://localhost:3000

---

## Ce que j'ai préparé pendant que tu dormais

- ✅ Schema SQL complet avec données initiales
- ✅ Toutes les tables du PRD
- ✅ 9 challenges (Explorer, Crafter, Architecte)
- ✅ 7 badges gamification
- ✅ 3 événements Dojo
- ✅ Triggers updated_at automatiques
- ✅ Fonction leaderboard
- ✅ Row Level Security configuré

Une fois le SQL exécuté, tout sera fonctionnel !
