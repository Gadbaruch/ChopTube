# ChopTube

ChopTube is a browser-based live YouTube chop sequencer.

You load videos into a 2x4 tile grid, trigger cues (`0-9`), and record those cue triggers into a step sequencer synced to a global transport.

## What It Does

- 8-tile performance grid (all tiles currently free)
- Per-tile video loading with:
  - style pool dropdown
  - random video from selected style
  - back to previous video
  - URL popup editor
  - video clear (`x`) on hover
- Per-tile cue system (`0-9`), each cue has:
  - timestamp (seconds)
  - volume (%)
  - shift (%) for micro-timing feel in sequencer playback
- Per-tile sequencer:
  - steps
  - time division (`16ths`, `8ths`, `beats`)
  - clear loop
  - step click/edit
- Global transport:
  - play/stop
  - loop record on/off
  - BPM + tap tempo
  - metronome click + volume
  - show/edit mode toggle
- URL-based session persistence (no backend required)
- Local "My Sessions" panel (saved in browser storage)
- Featured sessions modal
- Undo/redo for sequencer/cue edits

## Current Model

- Grid: `2 x 4`
- Access: all 8 tiles enabled
- Sharing: full session state stored in URL hash
- Backend: none (static-site friendly)

## Stack

- HTML
- CSS
- Vanilla JavaScript
- YouTube IFrame API

## Run Locally

```bash
cd "/Users/gadbaruchhinkis/Documents/New project"
git switch dev-flow
python3 -m http.server 8011
```

Open:

- [http://localhost:8011](http://localhost:8011)

If port is busy, use another:

```bash
python3 -m http.server 8012
```

If UI looks stale, hard refresh:

- macOS browsers: `Cmd+Shift+R`

## Branch Workflow

- `main`: production/live branch
- `dev-flow`: active development branch

Useful commands:

```bash
git branch --show-current
git pull origin dev-flow
git push origin dev-flow
```

## Keyboard Shortcuts

### Global

- `Space`: global play/stop
- `L`: loop record on/off
- `C`: metronome click on/off
- `Tab`: toggle Show/Edit
- `Cmd+Z`: undo
- `Cmd+Shift+Z`: redo

### Tile Playback / Selection

- `Q W E R T Y U I`: play/pause tiles 1-8
- `Shift + Q..I`: select tile only

### Cue / Sequencer

- `0-9`: trigger cue on selected tile
- `Cmd + 0-9`: set cue from current playhead
- `Delete`: clear selected step
- `Shift + Delete`: clear selected tile loop
- `M`: toggle mute step (selected step or recording mode)

### Cue Nudging

- `Left/Right`: ±0.10s
- `Shift + Left/Right`: ±0.01s
- `Up/Down`: ±10s
- `Shift + Up/Down`: ±1s
- `Option + Arrows`: cue volume adjustment

## Session Data (URL)

ChopTube stores composition state in the URL hash.

Persisted fields include:

- BPM
- show/edit mode
- selected tile/cue
- per-tile video URL + style + history
- cue timestamps, cue volumes, cue shift (%)
- tile master volume and playback rate
- sequencer actions, steps, division

Not persisted:

- live player object references
- temporary runtime timers/flags

## Notes

- Mobile is currently blocked (desktop-focused UX).
- YouTube autoplay behavior can vary by browser policy.
- "My Sessions" is local to that browser/device only.

## Deployment (GitHub Pages)

1. Push branch (`main` for live)
2. In GitHub repo, open **Settings -> Pages**
3. Source: **Deploy from a branch**
4. Pick branch + root
5. Save and wait for publish

