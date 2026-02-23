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
| **Meaningful Conversations** | Filmmakers and colleagues are real people with distinct personalities. Talk to them. Your relationships evolve based on how you treat their work. |
| **Simple & Focused** | No energy meters, no economy, no career ladder, no gift shop. Just scripts, notes, conversations, and consequences. |

---

## Core Loop

1. **Wake up** on your houseboat
2. **Walk to your desk** — open your inbox, read scripts
3. **Give notes** — choose a focus area and a tone
4. **See the consequences** — script quality shifts, filmmaker relationship shifts
5. **Greenlight or pass** — greenlit scripts enter development
6. **Walk to the cafe** — talk to filmmakers and colleagues
7. **Go home and sleep** — day advances
8. **Repeat** — new scripts arrive, pipeline processes, released scripts show results

---

## The Notes System

When you give notes on a script, you choose:

- **A focus**: Dialogue, Character, Plot, Pacing, Theme, or Commercial
- **A tone**: Supportive, Balanced, or Direct

Each filmmaker has a preferred tone. Match it and the relationship grows. Clash and it suffers. Meanwhile, your notes affect the script's quality attributes — but only if you target a genuine weakness. The tension between being honest, being kind, and being commercial is the whole game.

---

## Locations

| Location | Purpose |
|---|---|
| **Steve's Houseboat** | Your desk (read scripts), your bed (sleep to end the day) |
| **Brown Cafe 't Smalle** | Where everyone hangs out. Talk to filmmakers and colleagues. |

Simple indoor exit connects the two. No travel map.

---

## Characters

**5 Filmmakers** — each with a unique personality and preferred note tone:

- **Katrien van der Berg** — The auteur. Prefers gentle notes. Brilliant if trusted.
- **Marco Rossi** — The newcomer. Prefers balanced notes. Eager and grateful.
- **Helena Johansson** — The veteran. Prefers direct notes. Respects honesty.
- **Jake Morrison** — The hitmaker. Prefers balanced notes. Commercially driven, secretly wants art.
- **Yuki Tanaka** — The festival darling. Prefers gentle notes. Critically adored, commercially invisible.

**3 Colleagues** — for fun conversations:

- **Bernie Okafor** — Your VP boss. Demanding but fair.
- **Lena Vogel** — Data analyst. Quantifies everything.
- **Pieter de Jong** — Office manager. Knows everyone's secrets.

All NPCs hang out at the cafe. Conversations evolve as your relationship (hearts 0-10) changes, driven by how you give notes on filmmakers' scripts.

---

## Pipeline

Greenlit scripts enter **development** for 3 days, then **release**. On release, you get a quality-based result message (critical acclaim, positive reviews, mixed, or poor). No money, no budget, no revenue — just the satisfaction of the work.

---

## Time

Each day runs from 8:00 AM to midnight. Time passes as you read scripts, give notes, and explore. Sleep advances to the next day. New scripts arrive each morning. The pipeline processes daily.

---

## Technical

- **Engine**: Phaser 3 (browser-based)
- **Art**: Procedural pixel art, generated at runtime
- **Save**: localStorage, single slot
- **Controls**: WASD/Arrows to move, SPACE to interact, TAB for inbox, ESC for menu
