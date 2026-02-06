# ChopTube

ChopTube is a browser-based live remix tool built around a 2x4 grid of YouTube players.

It lets you:
- load up to 8 videos
- define cue points per tile (`0-9`)
- record per-step sequence actions against a global clock
- share full compositions through a single URL hash

No backend is required for core composition and sharing.

## Current Product Model

- Grid: `2 x 4` tiles
- Free tier: first `4` tiles unlocked
- Locked tiles: show upgrade CTA and a "coming soon" flow
- Session persistence: encoded state in URL hash + optional local "My Sessions" list in browser storage

## Tech Stack

- Plain HTML/CSS/JavaScript (no framework)
- YouTube IFrame API for playback/seek/mute/volume/rate controls
- Static hosting compatible (GitHub Pages)

## Repository Layout

- `/Users/gadbaruchhinkis/Documents/New project/index.html`: app shell + modals + top bar
- `/Users/gadbaruchhinkis/Documents/New project/styles.css`: all visual styles and responsive behavior
- `/Users/gadbaruchhinkis/Documents/New project/app.js`: app logic, sequencing, shortcuts, state persistence
- `/Users/gadbaruchhinkis/Documents/New project/assets/`: logo, icon assets

## Run Locally

```bash
cd "/Users/gadbaruchhinkis/Documents/New project"
git switch dev-flow
python3 -m http.server 8011
```

Open:

- [http://localhost:8011](http://localhost:8011)

Notes:
- If a port is busy, use another one (for example `8012`).
- If UI looks stale, hard refresh (`Cmd+Shift+R` on macOS browsers).

## Branch Workflow

Recommended workflow:

1. `main` is production-safe.
2. All active work happens on `dev-flow`.
3. Merge to `main` only after explicit test approval.

Useful commands:

```bash
# move to dev branch
git switch dev-flow

# sync from remote
git pull origin dev-flow

# check active branch
git branch --show-current
```

## Feature Overview

### Top Transport

- Global Play/Stop
- Global Loop Record On/Off
- BPM input + tap tempo
- Metronome click toggle + volume
- Show/Edit mode toggle

### Per Tile

- YouTube URL load
- Random video button
- Tile play/pause trigger
- Master volume and playback speed
- Cue editor (`cue index`, `seconds`, `volume`)
- Sequencer config (`steps`, `time division`, `clear`)
- Step timeline with action indicators

### Session Tools

- Share button copies full state URL
- New session resets app and generates new session key
- My Sessions sidebar stores local links in browser local storage
- Featured Sessions modal lists curated community links

## Keyboard Shortcuts

### Global

- `Space`: global play/stop
- `L`: loop record on/off
- `C`: metronome click on/off
- `Tab`: toggle Show/Edit mode

### Tile Selection and Playback

- `Q W E R T Y U I`: tile play/pause for tiles 1-8
- `Shift + Q..I`: select tile only (no play/pause)

### Cue and Sequencer

- `0-9`: trigger selected cue on selected tile
- `Shift + 0-9`: set selected cue from current playhead
- `Delete`: clear selected step
- `Shift + Delete`: clear current tile sequence
- `M`: write/toggle mute-step action

### Cue Nudging

- `Left/Right`: nudge cue by `0.10s`
- `Shift + Left/Right`: nudge cue by `0.01s`
- `Up/Down`: nudge cue by `10s`
- `Shift + Up/Down`: nudge cue by `1s`
- `Option + Arrows`: adjust cue volume

## Sequencer Timing Model

- Master transport ticks at 16th-note resolution.
- Each tile has its own time division:
  - `16ths`: step every tick
  - `8ths`: step every 2 ticks
  - `beats`: step every 4 ticks
- Step flash and action execution are aligned to each tile's division.

## Session Persistence Model

- The app serializes composition state into URL hash (`#...`).
- `saveToUrl()` runs after most edits.
- Loading a shared URL reconstructs the full grid state via `loadFromUrl()`.

Persisted data includes:
- BPM
- edit mode flag
- selected tile/cue
- per-tile URL
- cue times and cue volumes
- tile master volume and playback rate
- step actions
- steps count and tile time division

Not persisted:
- live YT player object references
- temporary runtime flags

## Undo/Redo

- Uses in-memory snapshots of editable state
- Shortcut keys:
  - `Cmd+Z`: undo
  - `Cmd+Shift+Z`: redo
- History excludes non-editable runtime objects for stability

## Mobile Behavior

- App is desktop-first.
- Mobile clients are blocked with an explanatory overlay.

## Deployment (GitHub Pages)

1. Push branch (`main` or `dev-flow`).
2. In GitHub repo settings, open **Pages**.
3. Set source to **Deploy from a branch**.
4. Choose branch and root folder.
5. Save and wait for publish.

## Troubleshooting

### "Address already in use" when running server

Use another port:

```bash
python3 -m http.server 8012
```

### Local app does not match expected branch

```bash
git branch --show-current
git status -sb
```

### Session buttons not opening modal/sidebar

- hard refresh browser
- verify latest `app.js`/`styles.css` are loaded
- ensure branch is correct (`main` vs `dev-flow`)

### YouTube autoplay quirks

Browsers may block playback until user interaction. Use one click in app before transport playback.

## Security and Data Notes

- Session links can be long because they contain encoded state.
- "My Sessions" is local to current browser/device only.
- For backup, keep important session URLs in external docs.

## Development Notes

- Keep changes incremental and test on `dev-flow` before promoting.
- Prefer small commits grouped by feature/fix.
- Preserve existing keyboard behavior unless intentionally redesigned.

## Near-Term Roadmap

- paid unlock flow with real billing backend
- richer video discovery without leaving page
- stronger session catalog and community curation
- improved audio routing options (subject to browser API constraints)
