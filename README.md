# ChopTube

ChopTube is a browser-based YouTube chop sequencer.

Load videos into 8 tiles, trigger cues (`0-9`), record cue performance into per-tile step sequencers, and arrange playback across multi-part song sections.

## Current Product State

- Frontend-only app (no backend)
- 8 tiles active (no locked tiles)
- Session persistence in URL hash
- Desktop-focused UX (mobile is blocked)
- Branch workflow:
  - `dev-flow` = active development
  - `main` = live (GitHub Pages)

## Core Features

### Tile Engine

- Per tile:
  - Video source pool dropdown
  - Random video picker
  - Back to previous video
  - URL popup editor
  - Hover `x` clear button on videos
- Cue system (`0-9`) per tile:
  - Time in seconds
  - Cue volume
  - Cue shift (%) for timing offset in sequencer
- Tile controls:
  - Play/pause
  - Master volume
  - Playback rate

### Sequencer

- Per tile step sequencer:
  - Steps (`1..128`)
  - Division (`16ths`, `8ths`, `beats`)
  - Step click-to-edit
  - Clear loop
- Sequencer action types:
  - `seek` cue trigger
  - `mute-step`

### Arrangement

- Bottom arrangement row of parts
- Each part stores active tile play-state snapshot
- Part length units: `bars`, `beats`, `seconds`
- Autoplay + arrangement loop
- Step-quantized part transitions synced to global transport

### Global Transport

- Global play/stop
- Loop record toggle
- BPM input
- Tap tempo
- Metronome toggle + volume
- Top bar collapse/expand (also drives compact tile view)

### Session / Sharing

- URL hash stores full session state
- `Share` copies current URL
- `+ New` creates fresh random-style session
- "My Sessions" is local browser storage
- "Featured sessions" is hardcoded list in code

## Keyboard Shortcuts

### Global

- `Space`: play/stop transport
- `L`: loop record toggle
- `C`: metronome on/off
- `Tab`: collapse/expand top bar + compact/expanded tile mode
- `Cmd+Z`: undo
- `Cmd+Shift+Z`: redo

### Tile Select / Playback

- `Q W E R T Y U I`: toggle tile play/pause
- `Shift + Q..I`: select tile only

### Cue + Sequencer

- `0-9`: trigger selected cue
- `Cmd + 0-9`: set cue at current playhead
- `Delete`: clear selected step
- `Shift + Delete`: clear selected tile loop
- `M`: toggle mute-step (selected step or live record)

### Cue Nudge

- `Left/Right`: `±0.10s`
- `Shift + Left/Right`: `±0.01s`
- `Up/Down`: `±10s`
- `Shift + Up/Down`: `±1s`
- `Option + arrows`: cue volume adjust

## Local Development

```bash
cd "/Users/gadbaruchhinkis/Documents/New Project"
git switch dev-flow
python3 -m http.server 8011
```

Open:

- [http://localhost:8011](http://localhost:8011)

If the port is busy:

```bash
python3 -m http.server 8012
```

Hard refresh on macOS browsers:

- `Cmd+Shift+R`

## Release Workflow

### Push dev changes

```bash
git switch dev-flow
git add app.js index.html styles.css README.md assets/*
git commit -m "Your change summary"
git push origin dev-flow
```

### Merge to live

Option A (GitHub UI):

1. Open PR: `dev-flow` -> `main`
2. Merge PR

Option B (local git):

```bash
git switch main
git pull --ff-only origin main
git merge --no-ff dev-flow
git push origin main
```

GitHub Pages updates shortly after `main` push.

## Architecture Notes

- Main logic is in `app.js`:
  - Transport clock
  - Tile playback
  - Sequencer action execution
  - Arrangement transitions
  - URL serialization/hydration
- UI is static HTML + CSS (`index.html`, `styles.css`)
- YouTube playback via IFrame API

## Session Data Notes

Persisted (URL hash):

- BPM, topbar mode, selection state
- Arrangement parts + autoplay/loop + length defaults
- Per-tile video URL, pool, cue config, actions, steps/division
- Desired tile play state and sequence phase anchor

Not persisted:

- Runtime player objects
- Runtime timers/timeouts

## Troubleshooting

### `OSError: [Errno 48] Address already in use`

Your local server port is taken. Start with a different port:

```bash
python3 -m http.server 8012
```

### UI looks stale after pull

Hard refresh (`Cmd+Shift+R`) to clear cached JS/CSS.

### Live differs from local

Check branch and commit:

```bash
git branch --show-current
git log --oneline -n 5
```

Make sure you pushed `main` for live updates.
