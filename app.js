const TILE_COUNT = 8;
const FREE_TILES = 4;
const NUDGE_SECONDS = 0.25;
const NUDGE_SECONDS_FAST = 1.0;
const BASE_DIVISION = 16;

const state = {
  bpm: 120,
  division: BASE_DIVISION,
  isPlaying: false,
  isRecording: false,
  globalStep: 0,
  selectedIndex: 0,
  selectedCue: 0,
  selectedStep: null,
  tiles: Array.from({ length: TILE_COUNT }, () => ({
    videoUrl: "",
    videoId: "",
    player: null,
    cues: Array(10).fill(0),
    actions: [],
    muted: false,
    steps: 16,
    division: BASE_DIVISION,
    customCues: false,
  })),
};

const gridEl = document.getElementById("grid");
const bpmInput = document.getElementById("bpm");
const playToggleBtn = document.getElementById("play-toggle");
const loopToggleBtn = document.getElementById("loop-toggle");
const shareBtn = document.getElementById("share");
const helpToggleBtn = document.getElementById("help-toggle");
const helpPanel = document.getElementById("help-panel");
const helpCloseBtn = document.getElementById("help-close");
const statusEl = document.getElementById("status");

const tileEls = [];
const stepEls = [];
let transportTimer = null;

function init() {
  loadFromUrl();
  buildGrid();
  bindGlobalControls();
  updateStatus();
}

function buildGrid() {
  gridEl.innerHTML = "";
  tileEls.length = 0;
  stepEls.length = 0;

  state.tiles.forEach((tile) => {
    if (tile.player && tile.player.destroy) {
      tile.player.destroy();
    }
    tile.player = null;
  });

  for (let i = 0; i < TILE_COUNT; i += 1) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.dataset.index = String(i);
    if (i === state.selectedIndex) tile.classList.add("selected");
    if (i >= FREE_TILES) tile.classList.add("locked");

    const frame = document.createElement("div");
    frame.className = "player-frame";
    const playerSlot = document.createElement("div");
    playerSlot.id = `player-${i}`;
    frame.appendChild(playerSlot);

    const controls = document.createElement("div");
    controls.className = "tile-controls";

    const urlRow = document.createElement("div");
    urlRow.className = "url-row";
    const urlInput = document.createElement("input");
    urlInput.placeholder = "Paste YouTube URL";
    urlInput.value = state.tiles[i].videoUrl;
    const loadBtn = document.createElement("button");
    loadBtn.textContent = "Load";
    urlRow.append(urlInput, loadBtn);

    const stepsRow = document.createElement("div");
    stepsRow.className = "status-row";
    const stepsLabel = document.createElement("div");
    stepsLabel.textContent = "Steps";
    const stepsInput = document.createElement("input");
    stepsInput.type = "number";
    stepsInput.min = "4";
    stepsInput.max = "128";
    stepsInput.value = String(state.tiles[i].steps);
    stepsInput.style.width = "70px";
    stepsRow.append(stepsLabel, stepsInput);

    const divisionRow = document.createElement("div");
    divisionRow.className = "status-row";
    const divisionLabel = document.createElement("div");
    divisionLabel.textContent = "Time Div";
    const divisionSelect = document.createElement("select");
    divisionSelect.innerHTML = `
      <option value="16">16ths</option>
      <option value="8">8ths</option>
      <option value="4">Beats</option>
    `;
    divisionSelect.value = String(state.tiles[i].division || BASE_DIVISION);
    divisionRow.append(divisionLabel, divisionSelect);

    const legend = null;

    const liveTitle = document.createElement("div");
    liveTitle.className = "section-title";
    liveTitle.textContent = "Live Performance";

    const cueSection = document.createElement("div");
    cueSection.className = "status-row";
    const cueInfo = document.createElement("div");
    cueInfo.textContent = "Cue 0 @ 0.00s";
    const cueInput = document.createElement("input");
    cueInput.type = "number";
    cueInput.min = "0";
    cueInput.step = "0.01";
    cueInput.value = "0.00";
    cueInput.style.width = "80px";
    cueSection.append(cueInfo, cueInput);

    const cueMeta = document.createElement("div");
    cueMeta.className = "status-row";
    const cueHint = document.createElement("div");
    cueHint.textContent = "Nudge with ← / → (Option=1s, Command=10s)";
    cueMeta.append(cueHint);

    const seqTitle = document.createElement("div");
    seqTitle.className = "section-title";
    seqTitle.textContent = "Sequencer";

    const clearRow = document.createElement("div");
    clearRow.className = "status-row";
    const clearLabel = document.createElement("div");
    clearLabel.textContent = "Loop";
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear";
    clearBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      clearActions(i);
    });
    clearRow.append(clearLabel, clearBtn);

    const stepIndicator = document.createElement("div");
    stepIndicator.className = "step-indicator";
    const stepDots = [];
    const totalSteps = state.tiles[i].steps;
    for (let s = 0; s < totalSteps; s += 1) {
      const dot = document.createElement("div");
      dot.className = "step";
      dot.dataset.step = String(s);
      stepIndicator.appendChild(dot);
      stepDots.push(dot);
    }

    const lockedOverlay = document.createElement("div");
    lockedOverlay.className = "locked-overlay";
    lockedOverlay.innerHTML = `
      <div><strong>Locked</strong></div>
      <div>Upgrade to unlock more tiles.</div>
      <button type="button">Upgrade</button>
    `;

    controls.append(urlRow, liveTitle, cueSection, cueMeta, seqTitle, stepsRow, divisionRow, clearRow, stepIndicator);
    tile.append(frame, controls, lockedOverlay);
    gridEl.appendChild(tile);

    tileEls.push({
      tile,
      urlInput,
      loadBtn,
      stepsInput,
      divisionSelect,
      cueInput,
      cueInfo,
      stepDots,
    });
    stepEls.push(stepDots);

    tile.addEventListener("click", () => selectTile(i));
    loadBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      loadVideo(i, urlInput.value);
    });
    urlInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        loadVideo(i, urlInput.value);
      }
    });
    cueInput.addEventListener("change", () => {
      const tile = state.tiles[i];
      const value = Math.max(0, Number(cueInput.value) || 0);
      tile.cues[state.selectedCue] = value;
      tile.customCues = true;
      cueInput.value = value.toFixed(2);
      updateTileDisplays();
      saveToUrl();
    });
    stepsInput.addEventListener("change", () => {
      const value = clamp(Number(stepsInput.value) || 16, 4, 128);
      stepsInput.value = String(value);
      state.tiles[i].steps = value;
      if (state.selectedStep !== null && state.selectedStep >= value) {
        state.selectedStep = null;
      }
      resizeActions(state.tiles[i]);
      buildGrid();
      if (state.isPlaying) restartTransport();
      saveToUrl();
    });
    divisionSelect.addEventListener("change", () => {
      const value = Number(divisionSelect.value) || BASE_DIVISION;
      state.tiles[i].division = value;
      if (state.isPlaying) restartTransport();
      saveToUrl();
    });
    stepDots.forEach((dot, stepIdx) => {
      dot.addEventListener("click", (event) => {
        event.stopPropagation();
        selectTile(i);
        toggleSelectedStep(stepIdx);
      });
    });
  }

  updateTileDisplays();
  recreatePlayers();
}

function bindGlobalControls() {
  bpmInput.addEventListener("change", () => {
    state.bpm = clamp(Number(bpmInput.value) || 120, 40, 240);
    bpmInput.value = state.bpm;
    if (state.isPlaying) restartTransport();
    saveToUrl();
  });

  playToggleBtn.addEventListener("click", () => togglePlay());

  loopToggleBtn.addEventListener("click", () => toggleLoop());

  shareBtn.addEventListener("click", async () => {
    saveToUrl();
    try {
      await navigator.clipboard.writeText(window.location.href);
      statusEl.textContent = "Share link copied.";
    } catch (error) {
      statusEl.textContent = "Could not copy link. Select the URL manually.";
    }
  });

  helpToggleBtn.addEventListener("click", () => {
    helpPanel.classList.add("show");
    helpPanel.setAttribute("aria-hidden", "false");
  });

  helpCloseBtn.addEventListener("click", () => {
    helpPanel.classList.remove("show");
    helpPanel.setAttribute("aria-hidden", "true");
  });

  helpPanel.addEventListener("click", (event) => {
    if (event.target === helpPanel) {
      helpPanel.classList.remove("show");
      helpPanel.setAttribute("aria-hidden", "true");
    }
  });

  window.addEventListener("keydown", handleKeyDown);
}

function handleKeyDown(event) {
  if (event.target instanceof HTMLInputElement) return;
  if (event.shiftKey && (event.key === "Delete" || event.key === "Backspace")) {
    clearActions(state.selectedIndex);
    event.preventDefault();
    return;
  }
  if (event.shiftKey && (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "ArrowDown")) {
    event.preventDefault();
    moveTileSelection(event.key);
    return;
  }
  if (event.code === "Space") {
    event.preventDefault();
    togglePlay();
    return;
  }
  if (event.key.toLowerCase() === "r") {
    event.preventDefault();
    toggleLoop();
    return;
  }
  if (event.key === "Delete" || event.key === "Backspace") {
    if (state.selectedStep !== null) {
      clearStep(state.selectedIndex, state.selectedStep);
    } else if (state.isRecording) {
      const tile = state.tiles[state.selectedIndex];
      const localStep = getLocalStep(tile);
      clearStep(state.selectedIndex, localStep);
    }
    event.preventDefault();
    return;
  }
  if (state.selectedStep !== null && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
    event.preventDefault();
    const delta = event.key === "ArrowLeft" ? -1 : 1;
    moveSelectedStep(delta);
    return;
  }
  if (state.selectedStep !== null && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
    event.preventDefault();
    state.selectedStep = null;
    updateStepIndicators();
    return;
  }
  const numberKey = getNumberKey(event);
  if (numberKey !== null) {
    if (event.shiftKey) {
      if (state.selectedStep === null) {
        setCue(state.selectedIndex, numberKey);
      } else {
        setStepAction(state.selectedIndex, state.selectedStep, { type: "seek", cueIndex: numberKey });
        selectCue(numberKey);
      }
    } else {
      if (state.selectedStep !== null) {
        setStepAction(state.selectedIndex, state.selectedStep, { type: "seek", cueIndex: numberKey });
        selectCue(numberKey);
      } else {
        triggerAction(state.selectedIndex, { type: "seek", cueIndex: numberKey }, state.isRecording);
        selectCue(numberKey);
      }
    }
    event.preventDefault();
    return;
  }

  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    const delta = event.key === "ArrowLeft" ? -1 : 1;
    let step = NUDGE_SECONDS;
    if (event.altKey) step = NUDGE_SECONDS_FAST;
    if (event.metaKey) step = 10.0;
    nudgeCue(state.selectedIndex, state.selectedCue, delta * step);
    event.preventDefault();
  }

  if (event.key.toLowerCase() === "m") {
    if (state.selectedStep !== null) {
      toggleMuteStep(state.selectedIndex, state.selectedStep);
    } else if (state.isRecording) {
      triggerAction(state.selectedIndex, { type: "mute-step" }, true);
    }
    event.preventDefault();
  }
}

function selectTile(index) {
  state.selectedIndex = index;
  state.selectedStep = null;
  tileEls.forEach((entry, idx) => {
    entry.tile.classList.toggle("selected", idx === index);
  });
  updateStepIndicators();
  updateStatus();
}

function toggleSelectedStep(stepIdx) {
  if (state.selectedStep === stepIdx) {
    state.selectedStep = null;
  } else {
    state.selectedStep = stepIdx;
  }
  updateStepIndicators();
}

function moveSelectedStep(delta) {
  const tile = state.tiles[state.selectedIndex];
  const totalSteps = tile.steps;
  if (totalSteps <= 0) return;
  const next = (state.selectedStep + delta + totalSteps) % totalSteps;
  state.selectedStep = next;
  updateStepIndicators();
}

function moveTileSelection(direction) {
  const cols = 4;
  let next = state.selectedIndex;
  if (direction === "ArrowLeft") next -= 1;
  if (direction === "ArrowRight") next += 1;
  if (direction === "ArrowUp") next -= cols;
  if (direction === "ArrowDown") next += cols;
  next = Math.max(0, Math.min(TILE_COUNT - 1, next));
  selectTile(next);
}

function getNumberKey(event) {
  if (event.code && event.code.startsWith("Digit")) {
    const digit = Number(event.code.replace("Digit", ""));
    return Number.isNaN(digit) ? null : digit;
  }
  if (event.code && event.code.startsWith("Numpad")) {
    const digit = Number(event.code.replace("Numpad", ""));
    return Number.isNaN(digit) ? null : digit;
  }
  const fallback = Number(event.key);
  return Number.isNaN(fallback) ? null : fallback;
}

function selectCue(cueIndex) {
  state.selectedCue = cueIndex;
  updateTileDisplays();
  updateStatus();
}

function setCue(index, cueIndex) {
  const tile = state.tiles[index];
  const player = tile.player;
  if (!player) return;
  const currentTime = player.getCurrentTime?.() ?? 0;
  tile.cues[cueIndex] = currentTime;
  tile.customCues = true;
  state.selectedCue = cueIndex;
  updateTileDisplays();
  saveToUrl();
}

function nudgeCue(index, cueIndex, delta) {
  const tile = state.tiles[index];
  tile.cues[cueIndex] = Math.max(0, tile.cues[cueIndex] + delta);
  updateTileDisplays();
  saveToUrl();
}

function jumpToCue(index, cueIndex) {
  state.selectedCue = cueIndex;
  const tile = state.tiles[index];
  const player = tile.player;
  if (!player) return;
  const time = tile.cues[cueIndex] || 0;
  player.seekTo(time, true);
  updateTileDisplays();
}

function loadVideo(index, url) {
  const videoId = parseVideoId(url.trim());
  if (!videoId) {
    statusEl.textContent = "Invalid YouTube URL.";
    return;
  }

  const tile = state.tiles[index];
  tile.videoUrl = url.trim();
  tile.videoId = videoId;
  tile.customCues = false;
  tile.cues = Array(10).fill(0);

  if (tile.player) {
    tile.player.loadVideoById(videoId);
  } else if (window.YT && window.YT.Player) {
    tile.player = new window.YT.Player(`player-${index}`, {
      videoId,
      playerVars: {
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
      },
      events: {
        onReady: () => maybeSetDefaultCues(index),
      },
    });
  }

  updateTileDisplays();
  saveToUrl();
}

function triggerAction(index, action, addToLoop) {
  const tile = state.tiles[index];
  const player = tile.player;
  if (!player) return;

  performAction(tile, action);

  if (state.isRecording && addToLoop) {
    const localStep = getLocalStep(tile);
    tile.actions[localStep] = [action];
    updateTileDisplays();
    saveToUrl();
  }
}

function performAction(tile, action) {
  const player = tile.player;
  if (!player) return;

  switch (action.type) {
    case "play":
      player.playVideo();
      break;
    case "pause":
      player.pauseVideo();
      break;
    case "mute":
      player.mute();
      tile.muted = true;
      break;
    case "unmute":
      player.unMute();
      tile.muted = false;
      break;
    case "mute-step": {
      player.mute();
      tile.muted = true;
      const duration = getStepDurationMs(tile);
      if (tile.muteTimeout) clearTimeout(tile.muteTimeout);
      tile.muteTimeout = setTimeout(() => {
        player.unMute();
        tile.muted = false;
      }, duration);
      break;
    }
    case "seek": {
      const time = tile.cues[action.cueIndex] || 0;
      player.seekTo(time, true);
      break;
    }
    default:
      break;
  }
}

function clearActions(index) {
  const tile = state.tiles[index];
  tile.actions = Array.from({ length: tile.steps }, () => []);
  updateTileDisplays();
  saveToUrl();
}

function clearStep(index, stepIdx) {
  const tile = state.tiles[index];
  tile.actions[stepIdx] = [];
  updateTileDisplays();
  saveToUrl();
}

function setStepAction(index, stepIdx, action) {
  const tile = state.tiles[index];
  tile.actions[stepIdx] = [action];
  updateTileDisplays();
  saveToUrl();
}

function toggleMuteStep(index, stepIdx) {
  const tile = state.tiles[index];
  const current = tile.actions[stepIdx] || [];
  const hasMute = current.some((action) => action.type === "mute-step");
  tile.actions[stepIdx] = hasMute ? [] : [{ type: "mute-step" }];
  updateTileDisplays();
  saveToUrl();
}

function startTransport() {
  if (transportTimer) clearInterval(transportTimer);
  state.globalStep = -1;
  const interval = (60 / state.bpm) * (4 / BASE_DIVISION) * 1000;
  transportTimer = setInterval(tick, interval);
  updateStatus();
}

function restartTransport() {
  stopTransport();
  if (state.isPlaying) startTransport();
}

function stopTransport() {
  if (transportTimer) {
    clearInterval(transportTimer);
    transportTimer = null;
  }
  pauseAllVideos();
  updateStatus();
}

function tick() {
  state.globalStep += 1;
  state.tiles.forEach((tile) => {
    const stepAdvance = getStepAdvance(tile);
    const localStep = getLocalStep(tile);
    if (state.globalStep % stepAdvance === 0) {
      const actions = tile.actions[localStep] || [];
      actions.forEach((action) => performAction(tile, action));
    }
  });
  updateStepIndicators();
}

function updateStepIndicators() {
  stepEls.forEach((dots, idx) => {
    const tile = state.tiles[idx];
    const localStep = getLocalStep(tile);
    const stepAdvance = getStepAdvance(tile);
    dots.forEach((dot, stepIdx) => {
      const isActive = stepIdx === localStep;
      if (isActive && state.isPlaying && state.globalStep % stepAdvance === 0) {
        flashStep(dot);
      }
      const hasAction = (state.tiles[idx].actions[stepIdx] || []).length > 0;
      dot.classList.toggle("has-action", hasAction);
      dot.textContent = "";
      const cueAction = (state.tiles[idx].actions[stepIdx] || []).find(
        (action) => action.type === "seek"
      );
      const muteAction = (state.tiles[idx].actions[stepIdx] || []).find(
        (action) => action.type === "mute-step"
      );
      if (cueAction) dot.textContent = String(cueAction.cueIndex);
      if (muteAction) dot.textContent = "M";
      dot.classList.toggle(
        "selected-step",
        idx === state.selectedIndex && stepIdx === state.selectedStep
      );
    });
  });
}

function updateTileDisplays() {
  tileEls.forEach((entry, idx) => {
    const tile = state.tiles[idx];
    entry.urlInput.value = tile.videoUrl;
    entry.stepsInput.value = String(tile.steps);
    entry.divisionSelect.value = String(tile.division || BASE_DIVISION);
    const cueIndex = idx === state.selectedIndex ? state.selectedCue : 0;
    const cueTime = tile.cues[cueIndex] || 0;
    entry.cueInfo.textContent = `Cue ${cueIndex} @ ${cueTime.toFixed(2)}s`;
    entry.cueInput.value = cueTime.toFixed(2);
  });

  updateStepIndicators();
  updateStatus();
}

function updateTransportButton() {
  playToggleBtn.textContent = state.isPlaying ? "■ Stop (Space)" : "▶ Play (Space)";
  playToggleBtn.classList.toggle("active", state.isPlaying);
}

function updateStatus() {
  const tile = state.tiles[state.selectedIndex];
  const loopLabel = state.isRecording ? "Loop On" : "Loop Off";
  const playLabel = state.isPlaying ? "Playing" : "Stopped";
  statusEl.textContent = `Selected tile ${state.selectedIndex + 1} • Cue ${state.selectedCue} • BPM ${state.bpm} • ${playLabel} • ${loopLabel}`;
  loopToggleBtn.classList.toggle("active", state.isRecording);
}

function togglePlay() {
  state.isPlaying = !state.isPlaying;
  if (state.isPlaying) {
    startTransport();
    playAllVideos();
  } else {
    stopTransport();
  }
  updateTransportButton();
}

function toggleLoop() {
  state.isRecording = !state.isRecording;
  loopToggleBtn.classList.toggle("active", state.isRecording);
  updateStatus();
}

function pauseAllVideos() {
  state.tiles.forEach((tile) => {
    if (tile.player && tile.player.pauseVideo) {
      tile.player.pauseVideo();
    }
  });
}

function playAllVideos() {
  state.tiles.forEach((tile) => {
    if (tile.player && tile.player.playVideo) {
      tile.player.playVideo();
    }
  });
}

function saveToUrl() {
  const payload = {
    bpm: state.bpm,
    selectedIndex: state.selectedIndex,
    selectedCue: state.selectedCue,
    tiles: state.tiles.map((tile) => ({
      videoUrl: tile.videoUrl,
      cues: tile.cues,
      actions: tile.actions,
      steps: tile.steps,
      division: tile.division,
      customCues: tile.customCues,
    })),
  };
  const encoded = btoa(encodeURIComponent(JSON.stringify(payload)));
  window.history.replaceState({}, "", `#${encoded}`);
}

function loadFromUrl() {
  const hash = window.location.hash.replace("#", "");
  if (!hash) return;
  try {
    const decoded = decodeURIComponent(atob(hash));
    const payload = JSON.parse(decoded);
    if (payload && payload.tiles) {
      state.bpm = payload.bpm || 120;
      state.selectedIndex = payload.selectedIndex || 0;
      state.selectedCue = payload.selectedCue || 0;
      state.tiles = payload.tiles.map((tile) => ({
        videoUrl: tile.videoUrl || "",
        videoId: parseVideoId(tile.videoUrl || "") || "",
        player: null,
        cues: tile.cues || Array(10).fill(0),
        actions: tile.actions || Array.from({ length: tile.steps || 16 }, () => []),
        muted: false,
        steps: tile.steps || 16,
        division: tile.division || BASE_DIVISION,
        customCues: tile.customCues || false,
      }));
      state.tiles = state.tiles.concat(
        Array.from({ length: TILE_COUNT - state.tiles.length }, () => ({
          videoUrl: "",
          videoId: "",
          player: null,
          cues: Array(10).fill(0),
          actions: Array.from({ length: 16 }, () => []),
          muted: false,
          steps: 16,
          division: BASE_DIVISION,
          customCues: false,
        }))
      );
    }
  } catch (error) {
    console.warn("Failed to load state from URL", error);
  }

  bpmInput.value = state.bpm;
  state.division = state.division || BASE_DIVISION;
}

function parseVideoId(url) {
  if (!url) return "";
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{6,})/);
  return match ? match[1] : "";
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

window.onYouTubeIframeAPIReady = () => {
  recreatePlayers();
};

init();

function recreatePlayers() {
  if (!window.YT || !window.YT.Player) return;
  state.tiles.forEach((tile, idx) => {
    if (tile.videoId) {
      tile.player = new window.YT.Player(`player-${idx}`, {
        videoId: tile.videoId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: () => maybeSetDefaultCues(idx),
        },
      });
    }
  });
}

function maybeSetDefaultCues(index) {
  const tile = state.tiles[index];
  const player = tile.player;
  if (!player || tile.customCues) return;
  if (tile.cues.some((cue) => cue > 0)) return;
  const duration = player.getDuration?.() || 0;
  if (duration <= 0) return;
  for (let i = 0; i < 10; i += 1) {
    tile.cues[i] = (duration / 9) * i;
  }
  updateTileDisplays();
  saveToUrl();
}

function resizeActions(tile) {
  const totalSteps = tile.steps;
  const next = Array.from({ length: totalSteps }, (_, idx) => tile.actions[idx] || []);
  tile.actions = next;
}

function getLocalStep(tile) {
  const totalSteps = tile.steps;
  const stepAdvance = getStepAdvance(tile);
  if (totalSteps <= 0) return 0;
  return Math.floor(state.globalStep / stepAdvance) % totalSteps;
}

function getStepDurationMs(tile) {
  const baseInterval = (60 / state.bpm) * (4 / BASE_DIVISION) * 1000;
  const stepAdvance = getStepAdvance(tile);
  return baseInterval * stepAdvance;
}

function flashStep(dot) {
  dot.classList.add("flash");
  setTimeout(() => {
    dot.classList.remove("flash");
  }, 200);
}

function getStepAdvance(tile) {
  return BASE_DIVISION / (tile.division || BASE_DIVISION);
}
