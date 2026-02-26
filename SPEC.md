# GAME DESIGN SPECIFICATION: STUDIO LOT

**A Forager-style resource-gathering game set on a studio lot**

---

## Concept

You are a studio executive roaming a studio lot. Gather scripts, ideas, coffee, and contacts scattered around the lot. Craft them into pitches, projects, and completed shows. Resources respawn, items bounce satisfyingly when dropped, and the loop is: gather, craft, profit, repeat.

---

## Design Pillars

| Pillar | Description |
|---|---|
| **Gather Everything** | Walk around the lot, whack resource nodes, and auto-collect the drops. Every resource matters. |
| **Craft Upward** | Combine basic resources into higher-tier items. Scripts + Ideas = Pitches. Pitches + Contacts = Projects. Projects + Coffee = Completed Shows that pay out coins and XP. |
| **Satisfying Loops** | Resources respawn on timers. The world is always full of things to hit. Bouncy item drops feel great. |
| **Studio Theme** | Everything maps to the entertainment industry: script piles, idea boards, coffee machines, networking tables. |

---

## Core Loop

1. **Walk around** the studio lot
2. **Hit resource nodes** — script piles, idea boards, coffee machines, networking spots
3. **Collect drops** — walk over them to auto-pick-up
4. **Craft at your desk** — combine resources into higher-tier items
5. **Complete projects** — earn coins and XP
6. **Resources respawn** — go gather again

---

## Resources

| Resource | Source | Hits to Break | Respawn Time | Drop Count |
|---|---|---|---|---|
| Script | Script Pile | 3 | 15s | 1–2 |
| Idea | Idea Board | 2 | 10s | 1–2 |
| Coffee | Coffee Machine | 1 | 8s | 1 |
| Contact | Networking Spot | 2 | 20s | 1 |
| Coin | Completed Projects | N/A | N/A | 5–15 |

---

## Crafting

Craft at your desk by pressing Space when nearby. Recipes:

| Inputs | Output | Description |
|---|---|---|
| 1 Script + 1 Idea | 1 Pitch | Combine a raw script with inspiration |
| 1 Pitch + 1 Contact | 1 Project | Attach industry contacts to your pitch |
| 1 Project + 1 Coffee | Coins + XP | Complete the project (consumed) |

---

## Controls

| Input | Action |
|---|---|
| WASD / Arrow Keys | Move |
| Space | Hit nearby resource node / Interact with desk |
| E | Open/close crafting panel (when near desk) |
| ESC | Pause menu |

---

## World

The studio lot is a 2400x1600 pixel world divided into themed areas:

- **Office Area** (center) — Your desk (crafting station), script piles nearby
- **Creative Wing** (left) — Idea boards, inspiration zones
- **Cafe** (top-right) — Coffee machines
- **Lobby** (bottom-right) — Networking spots, contact opportunities
- **Paths** — Connect all areas, lined with decorative props

The camera follows the player. The world is larger than the viewport (960x640).

---

## Player

- 16x16 pixel sprite with 4 directional frames
- Moves at 200 px/s using Arcade Physics
- Has a physics body for collision with world edges and resource node overlaps
- Faces in the direction of movement

---

## XP & Leveling

| Level | XP Required |
|---|---|
| 1 | 0 |
| 2 | 20 |
| 3 | 50 |
| 4 | 100 |
| 5 | 200 |

XP comes from completing projects. Each completed project grants 10 XP + bonus coins.

---

## Technical

- **Engine**: Phaser 3 with Arcade Physics
- **Art**: Procedural pixel art, generated at runtime via TextureGenerator
- **Save**: localStorage, single slot, auto-saves periodically
- **Controls**: WASD/Arrows to move, Space to interact, E for crafting, ESC for menu
- **Resolution**: 960x640, pixel-perfect scaling
