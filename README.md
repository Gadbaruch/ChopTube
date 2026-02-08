# ChopTube

ChopTube is a browser-based YouTube chop sequencer.

Load videos into 8 tiles, trigger cues (`0-9`), record cue performance into per-tile step sequencers, and arrange playback across multi-part song sections.

## Product State

- 8 tiles active (no locked tiles)
- Desktop-focused UX (mobile is blocked)
- Session persistence fallback in URL hash
- Optional backend for short URLs + published sessions
- Branch workflow:
  - `dev-flow` = active development
  - `main` = live (GitHub Pages)

## Core Features

### Tile Engine

- Per tile:
  - Video style dropdown
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

### Sessions + Community

- `Share` copies URL for the current session
- With backend enabled: share URL is short (`?s=<id>`)
- Without backend: full session is stored in URL hash
- `+ New` creates fresh random-style session
- `My Sessions` is local browser storage
- `Featured sessions` shows hardcoded showcases plus backend-published sessions
- `Publish Current Session` appears in featured popup when backend is configured

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

### 1) Frontend only

```bash
cd "/Users/gadbaruchhinkis/Documents/New Project"
git switch dev-flow
python3 -m http.server 8011
```

Open:

- [http://localhost:8011](http://localhost:8011)

### 2) Frontend + backend (short links + publish)

Terminal A:

```bash
cd "/Users/gadbaruchhinkis/Documents/New Project"
node backend/server.js
```

Terminal B:

```bash
cd "/Users/gadbaruchhinkis/Documents/New Project"
python3 -m http.server 8011
```

Then open:

- [http://localhost:8011](http://localhost:8011)

The frontend auto-detects backend at `http://localhost:8787` when running on localhost.

## Backend API (MVP)

Base URL default (local): `http://localhost:8787`

- `GET /api/health`
- `POST /api/sessions`
  - body: `{ "payload": <sessionState> }`
  - returns: `{ id, payload, createdAt, updatedAt, url? }`
- `GET /api/sessions/:id`
  - returns session payload for short link loading
- `GET /api/published`
  - returns `{ items: [{ id, name, createdAt, url? }] }`
- `POST /api/published`
  - body: `{ "name": "My Session", "payload": <sessionState> }` OR `{ "id": "abc123", "name": "My Session" }`

Data is stored in:

- `backend/data/sessions.json`

## Config

You can force a backend URL by editing `index.html`:

```html
<meta name="choptube-api" content="https://your-backend-domain" />
```

If this meta tag is empty, the app uses `http://localhost:8787` only on localhost.

## Release Workflow

### Push dev changes

```bash
git switch dev-flow
git add app.js index.html styles.css README.md backend/*
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
