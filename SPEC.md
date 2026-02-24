# GAME DESIGN SPECIFICATION: GREENLIGHT

**A script development simulation set in a streaming company's Amsterdam office**

---

## Concept

You are Steve, a content executive at a streaming company's Amsterdam office. Scripts land on your desk. Each one represents someone's dream. Your job is to read them, give notes, and decide which ones to greenlight — all while building relationships with the filmmakers whose work you're shaping.

---

## Design Pillars

| Pillar | Description |
|---|---|
| **The Notes Triangle** | Every note you give navigates tension between creative quality, filmmaker relationship, and commercial viability. There is no single correct approach. |
| **Meaningful Conversations** | Filmmakers and colleagues are real people with distinct personalities. Talk to them. Your dialogue choices shape a social web where pleasing one person can cost you with another. |
| **Idler Progression** | Budget constrains greenlighting, reputation unlocks pipeline slots, and relationships unlock better scripts and stronger notes. More slots = more progress bars = more satisfying idle loops. |
| **Binary Choices** | Every decision is a binary choice — never more than two options. Simple inputs, complex consequences. |

---

## Core Loop

1. **Walk to your desk** — open your inbox, read scripts
2. **Give notes** — choose a focus area and a tone
3. **See the consequences** — script quality shifts, filmmaker relationship shifts
4. **Greenlight or pass** — greenlit scripts enter development
5. **Walk to the cafe** — talk to filmmakers and colleagues
6. **Repeat** — days advance automatically at midnight, new scripts arrive each morning, pipeline processes, released scripts show results

---

## The Notes System

When you give notes on a script, you make two binary choices:

- **A focus** (2 options): The game identifies the script's two weakest attributes and presents them as the focus choices. You pick which weakness to address.
- **A tone** (2 options): Supportive or Direct.

Each filmmaker has a preferred tone. Match it and the relationship grows. Clash and it suffers. Meanwhile, your notes affect the script's quality attributes — but only if you target a genuine weakness. The tension between being honest, being kind, and being commercial is the whole game.

**Trust modifier**: At high relationship (5+ hearts), notes land harder (+1 quality boost, reduced relationship penalty). At very high relationship (8+ hearts), the bonus doubles (+2 quality, further reduced penalty). Investing in relationships makes you a more effective executive.

---

## Locations

| Location | Purpose |
|---|---|
| **Steve's Houseboat** | Your desk (read scripts, give notes, greenlight). Progress auto-saves. |
| **Brown Cafe 't Smalle** | Where everyone hangs out. Talk to filmmakers and colleagues. |

Simple indoor exit connects the two. No travel map.

---

## Characters

**5 Filmmakers** — each with a unique personality and preferred note tone:

- **Katrien van der Berg** — The auteur. Prefers gentle notes. Brilliant if trusted.
- **Marco Rossi** — The newcomer. Prefers supportive notes. Eager and grateful.
- **Helena Johansson** — The veteran. Prefers direct notes. Respects honesty.
- **Jake Morrison** — The hitmaker. Prefers direct notes. Commercially driven, secretly wants art.
- **Yuki Tanaka** — The festival darling. Prefers gentle notes. Critically adored, commercially invisible.

**3 Colleagues** — for fun conversations:

- **Bernie Okafor** — Your VP boss. Demanding but fair.
- **Lena Vogel** — Data analyst. Quantifies everything.
- **Pieter de Jong** — Office manager. Knows everyone's secrets.

All NPCs hang out at the cafe. Conversations are binary dialogue choices — each response affects relationships, sometimes with multiple characters at once. Higher relationships unlock tangible benefits:

**3 Colleagues** — each with a unique perk at high relationship:

- **Bernie Okafor** — Your VP boss. High relationship grants budget bonuses.
- **Lena Vogel** — Data analyst. High relationship reveals commercial scores in your inbox.
- **Pieter de Jong** — Office manager. High relationship reveals filmmakers' preferred note tone.

---

## Pipeline

Greenlit scripts enter **development** for 1 game-day (960 game-minutes), progressing through three visible sub-stages:

| Stage | Progress Range | Description |
|---|---|---|
| **Writing** | 0–33% | Script revisions and rewrites |
| **Production** | 33–66% | Filming and principal photography |
| **Post-Production** | 66–100% | Editing, sound, and finishing |

Progress ticks forward in real-time as the game clock runs. On completion, you get a quality-based result message and revenue:

| Result | Quality Threshold | Revenue | XP |
|---|---|---|---|
| Critical Acclaim | avg >= 8 | +$200K | +8 |
| Positive Reviews | avg >= 6 | +$120K | +6 |
| Mixed Reviews | avg >= 4 | +$60K | +4 |
| Poor Reviews | avg < 4 | +$20K | +2 |

Pipeline capacity is limited by your level (see Leveling below). Higher-relationship filmmakers submit better scripts (quality floor +1 at 5 hearts, +2 at 8 hearts).

---

## Budget

Greenlighting costs money. Each script has a production cost ($30K–$150K) based on genre and commercial appeal. Revenue comes from released shows only — no passive income.

| Parameter | Value |
|---|---|
| Starting budget | $300K |
| Script cost | $30K–$150K (genre-based, commercial scripts are cheaper) |
| Revenue | Quality-dependent (see Pipeline table above) |

If you can't afford to greenlight, you must wait for a release or pass on scripts. Budget is displayed in the top bar.

---

## Leveling

Reputation XP earned from releases and relationship milestones. Levels unlock more pipeline slots — the core idler progression.

| Level | Title | Pipeline Slots | XP Required |
|---|---|---|---|
| 1 | Junior Exec | 1 | 0 |
| 2 | Content Lead | 2 | 10 |
| 3 | Senior Executive | 3 | 30 |
| 4 | VP of Content | 4 | 60 |
| 5 | Head of Studio | 5 | 100 |

XP sources: script releases (+2 to +8 based on quality) and relationship milestones (reaching 5 or 10 hearts with any NPC: +3 XP each).

---

## Dialogue Choices

Talking to NPCs at the cafe presents binary dialogue choices. Each option has relationship effects that can target the speaking NPC and/or other characters, creating a social web where office politics matter.

Choices are tiered by current relationship: low (0-2), mid (3-5), high (6-8), max (9-10). Higher tiers unlock deeper, more personal conversations.

Colleague conversations can grant special perks (budget bonuses from Bernie, data insights from Lena, filmmaker preference hints from Pieter).

---

## HUD

The screen has three persistent idler-style overlays that keep the world feeling alive:

| Element | Position | Description |
|---|---|---|
| **Top Bar** | Top edge (full width) | Clock, day counter, budget ($XK), level title, XP bar, and pipeline slot counter (used/max). |
| **Pipeline Panel** | Right edge (~180px wide) | Shows every greenlit show as a card with title, filmmaker, sub-stage label, and a progress bar that fills in real-time. Color-coded by stage (blue/yellow/purple). |
| **Relationship Portraits** | Left edge (~44px wide) | Mini portraits for all 8 NPCs using their portrait colors, with filled hearts (0–10) beneath. Pulses briefly when a relationship changes. |
| **Activity Feed** | Bottom strip | Scrolling ticker showing pipeline milestones, release announcements, revenue notifications, level-ups, and ambient flavor lines. |

---

## Time

Each day runs from 8:00 AM to midnight. Time passes at 20 game-minutes per real second as you read scripts, give notes, and explore. The pipeline progresses continuously while time is running. Days advance automatically at midnight. New scripts arrive each morning.

---

## Technical

- **Engine**: Phaser 3 (browser-based)
- **Art**: Procedural pixel art, generated at runtime
- **Save**: localStorage, single slot, auto-saves on day advance and location change
- **Controls**: WASD/Arrows to move, SPACE to interact, TAB for inbox, ESC for menu
