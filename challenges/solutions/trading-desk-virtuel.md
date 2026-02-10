# Le Trading Desk Virtuel (Architect - Fi)

## 1. Résolution du Challenge

### Objectif
Construire un système de backtesting de stratégies avec agents IA : un agent analyse les signaux, un autre gère le risque, un troisième exécute.

### Éléments clés

Ce challenge est de niveau ⭐⭐⭐⭐⭐ (16h).

#### Architecture multi-agents

```
┌─────────────────────────────────────────────────────────┐
│                  VIRTUAL TRADING DESK                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Signal    │    │    Risk     │    │  Execution  │  │
│  │   Analyst   │───▶│   Manager   │───▶│   Agent     │  │
│  │             │    │             │    │             │  │
│  │ • Génère    │    │ • Valide    │    │ • Exécute   │  │
│  │   signaux   │    │ • Size      │    │ • Log       │  │
│  │ • Score     │    │ • Stop-loss │    │ • P&L       │  │
│  └─────────────┘    └─────────────┘    └─────────────┘  │
│         ▲                                      │         │
│         │              ┌─────────────┐         │         │
│         └──────────────│   Market    │─────────┘         │
│                        │   Data      │                   │
│                        └─────────────┘                   │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │                    BACKTEST ENGINE                   ││
│  │  • Historical data                                   ││
│  │  • Order simulation                                  ││
│  │  • Performance metrics                               ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### Rôle de chaque agent

| Agent | Input | Output | Décision |
|-------|-------|--------|----------|
| **Signal Analyst** | Market data, indicators | Signal (long/short/flat), score | Quoi acheter/vendre |
| **Risk Manager** | Signal, portfolio, limits | Approved/Rejected, position size | Combien, avec quel stop |
| **Execution Agent** | Order approved | Execution report, fills | Comment exécuter |

#### Prompts des agents

**Signal Analyst :**
```
Tu es un analyste quantitatif. Analyse les données de marché et génère des signaux de trading.

Input : Données OHLCV + indicateurs techniques
Output : 
{
  "signal": "LONG" | "SHORT" | "FLAT",
  "score": 0-100,
  "entry_price": X,
  "rationale": "..."
}

Règles :
- Score > 70 pour générer un signal
- Confluence de plusieurs indicateurs
```

**Risk Manager :**
```
Tu es le risk manager du desk. Tu valides ou rejettes les signaux.

Input : Signal + Portfolio + Limits
Output :
{
  "approved": true/false,
  "position_size": X,
  "stop_loss": X,
  "take_profit": X,
  "reason": "..."
}

Règles :
- Max 2% risque par trade
- Max 10% exposition par asset
- Corrélation avec positions existantes
```

**Execution Agent :**
```
Tu es l'agent d'exécution. Tu simules l'exécution des ordres.

Input : Approved order + Market conditions
Output :
{
  "filled": true/false,
  "fill_price": X,
  "slippage": X,
  "timestamp": X
}

Règles :
- Slippage réaliste (0.1% - 0.5%)
- Market impact pour gros ordres
```

#### Métriques de backtest

| Métrique | Formule | Interprétation |
|----------|---------|----------------|
| Total Return | (Pf final - Pf initial) / Pf initial | Performance absolue |
| Sharpe Ratio | (Return - Rf) / Volatility | Return ajusté du risque |
| Max Drawdown | Max peak-to-trough | Pire perte |
| Win Rate | Trades gagnants / Total | Taux de succès |
| Profit Factor | Gains / Pertes | Qualité de la stratégie |

#### Structure de données

```python
# Trade log
trade = {
    "id": "T001",
    "timestamp": "2024-01-15T10:30:00Z",
    "signal_score": 85,
    "direction": "LONG",
    "asset": "AAPL",
    "entry_price": 185.50,
    "size": 100,
    "stop_loss": 182.00,
    "take_profit": 195.00,
    "exit_price": 192.00,
    "exit_timestamp": "2024-01-17T14:00:00Z",
    "pnl": 650.00,
    "pnl_pct": 3.5
}
```

### Critères de réussite
- Système multi-agents fonctionnel
- Backtests sur données historiques
- Dashboard de performance

---

## 2. Animation Dojo (éléments clés)

**Durée** : 16h (projet équipe sur 2 jours)

**Déroulé suggéré** :
- Jour 1 matin : Théorie trading + architecture multi-agents
- Jour 1 après-midi : Signal Analyst + Risk Manager
- Jour 2 matin : Execution Agent + Backtest engine
- Jour 2 après-midi : Tests + Dashboard
