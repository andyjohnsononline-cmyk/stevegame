# GAME DESIGN SPECIFICATION: STUDIO LOT

**A Tap Titans-style idle clicker set on a studio lot**

---

## Concept

You are a studio executive pitching ideas to network executives. Tap to deal pitch damage, defeat executives to advance through stages, hire crew members for passive damage, and prestige by starting a "New Season" for permanent power multipliers.

---

## Design Pillars

| Pillar | Description |
|---|---|
| **Tap to Pitch** | Click/tap on the executive to deal damage. Every tap counts. Satisfying hit effects and floating damage numbers. |
| **Hire Crew** | Spend coins to hire and level up crew members (Intern, Writer, Editor, Director, etc.) who deal passive DPS automatically. |
| **Stage Progression** | Defeat executives to advance through stages. Every 5th stage is a Boss with a 30-second timer and 10x rewards. |
| **Prestige Loop** | At stage 50+, start a "New Season" to reset progress but earn permanent Star Power multipliers on all damage. |

---

## Core Loop

1. **Tap** the executive to deal pitch damage
2. **Defeat** the executive to earn coins and advance to the next stage
3. **Spend coins** to upgrade tap damage or hire crew for passive DPS
4. **Use skills** for temporary power boosts
5. **Prestige** at high stages for permanent multipliers
6. **Return offline** to collect idle earnings

---

## Stage System

| Property | Value |
|---|---|
| Base HP | 10 |
| HP Scaling | base * 1.15^(stage-1) |
| Boss Frequency | Every 5 stages |
| Boss HP Multiplier | 10x normal |
| Boss Timer | 30 seconds |
| Boss Fail | Drop back 1 stage |
| Coin Reward | 1 + floor(stage * 0.5) |
| Boss Coin Multiplier | 10x normal |

---

## Crew Members (Passive DPS)

| Crew | Base DPS | Base Cost | Unlock Stage |
|---|---|---|---|
| Intern | 1 | 10 | 1 |
| Writer | 5 | 50 | 5 |
| Editor | 20 | 250 | 10 |
| Director | 100 | 1,200 | 20 |
| Producer | 400 | 5,000 | 35 |
| Star Actor | 1,500 | 20,000 | 50 |
| Composer | 5,000 | 80,000 | 75 |
| Showrunner | 20,000 | 350,000 | 100 |

All crew costs scale at 1.07x per level. DPS = baseDPS * level * starPower.

---

## Skills

| Skill | Cooldown | Duration | Effect |
|---|---|---|---|
| Coffee Rush | 60s | 30s | 10x all DPS |
| Viral Marketing | 120s | 20s | 4x tap damage |
| Power Pitch | 90s | 15s | 5x critical hits |
| Brainstorm | 300s | Instant | Deal 5 minutes of DPS |

---

## Prestige ("New Season")

| Property | Value |
|---|---|
| Minimum Stage | 50 |
| Star Power Earned | floor(sqrt(maxStage / 50)) |
| Resets | Stage, coins, crew levels, tap level |
| Keeps | Star Power (permanent damage multiplier) |

---

## Tap Damage

- Base damage: 1 per tap
- Upgrade cost: 5 * 1.07^(level-1)
- Damage = tapLevel * starPower * skill multipliers

---

## Offline Progress

- Calculates elapsed time since last save
- Awards totalDPS * seconds * 0.5 (50% efficiency)
- Shown on menu screen as "Welcome back!" message

---

## Controls

| Input | Action |
|---|---|
| Click/Tap | Deal tap damage to executive |
| Click Skill | Activate timed skill |
| Click Hire/Lvl Up | Hire or level up crew member |
| ESC | Pause menu |

---

## Visual Layout (960x640)

- **Top bar**: Stage number, boss indicator, coin count
- **Center**: Executive sprite with HP bar and name
- **Mid**: Skill buttons (4) and DPS display
- **Bottom**: Crew panel (scrollable), tap upgrade button, prestige button

---

## Technical

- **Engine**: Phaser 3 with Arcade Physics
- **Art**: Procedural pixel art, generated at runtime via TextureGenerator
- **Sound**: Web Audio API procedural SFX
- **Save**: localStorage, single slot, auto-saves every 15 seconds
- **Resolution**: 960x640, pixel-perfect scaling
- **Build**: Vite, outputs to docs/ for GitHub Pages
