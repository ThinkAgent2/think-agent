# Le Conformity Guardian (Architect - Fi)

## 1. Résolution du Challenge

### Objectif
Concevoir un agent de surveillance réglementaire continue : monitoring des positions vs limites, détection des breaches, génération des reportings (EMIR, MiFID).

### Éléments clés

Ce challenge est de niveau ⭐⭐⭐⭐ (4h).

#### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  CONFORMITY GUARDIAN                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Market    │    │   Positions │    │   Limits    │  │
│  │   Data      │    │   (real-t)  │    │   Config    │  │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘  │
│         │                  │                  │          │
│         └──────────────────┼──────────────────┘          │
│                            ▼                             │
│                   ┌─────────────┐                        │
│                   │   Monitor   │                        │
│                   │   Engine    │                        │
│                   └──────┬──────┘                        │
│                          │                               │
│         ┌────────────────┼────────────────┐              │
│         ▼                ▼                ▼              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │   Alerts    │  │   Reports   │  │   Audit     │      │
│  │   (breach)  │  │   (EMIR...)│  │   Trail     │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### Types de limites à monitorer

| Type | Exemple | Réglementation |
|------|---------|----------------|
| Position limits | Max 10M€ par sous-jacent | MiFID II |
| Concentration | Max 25% d'un émetteur | UCITS |
| VaR limits | VaR < 5% du NAV | Bâle III |
| Leverage | Levier < 3x | AIFMD |
| Margin requirements | Marge initiale couverte | EMIR |

#### Logique de monitoring

```python
def check_limits(positions: list, limits: dict) -> list:
    breaches = []
    
    for pos in positions:
        # Check position limit
        if pos['notional'] > limits['max_position']:
            breaches.append({
                'type': 'POSITION_LIMIT',
                'severity': 'HIGH',
                'position': pos['id'],
                'value': pos['notional'],
                'limit': limits['max_position'],
                'excess': pos['notional'] - limits['max_position']
            })
        
        # Check concentration
        concentration = pos['notional'] / total_portfolio
        if concentration > limits['max_concentration']:
            breaches.append({
                'type': 'CONCENTRATION',
                'severity': 'MEDIUM',
                'issuer': pos['issuer'],
                'concentration': concentration,
                'limit': limits['max_concentration']
            })
    
    return breaches
```

#### Format d'alerte

```markdown
🚨 BREACH ALERT - [TIMESTAMP]

**Type** : Position Limit Exceeded
**Severity** : HIGH
**Portfolio** : Equity Long/Short
**Position** : AAPL Equity
**Current** : 12.5M€
**Limit** : 10M€
**Excess** : 2.5M€ (25%)

**Required Action** : Réduire la position sous le seuil dans les 24h
**Escalation** : Risk Manager, Compliance Officer

**Regulatory Reference** : MiFID II Art. 57
```

#### Templates de reporting

| Report | Fréquence | Contenu |
|--------|-----------|---------|
| EMIR Trade Reporting | T+1 | Transactions OTC |
| MiFID Transaction Reporting | T+1 | Transactions listées |
| Position Reporting | Daily | Positions > seuil |
| Best Execution | Quarterly | Qualité d'exécution |

### Critères de réussite
- Agent de monitoring fonctionnel
- Système d'alertes automatiques
- Templates de reporting générés

---

## 2. Animation Dojo (éléments clés)

**Durée** : 4h (workshop Architect)

**Déroulé suggéré** :
- 1h : Théorie réglementaire (EMIR, MiFID, Bâle)
- 1h30 : Construction du monitoring engine
- 1h : Alerting et reporting
- 30min : Tests et documentation
