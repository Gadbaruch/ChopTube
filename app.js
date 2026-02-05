const TILE_COUNT = 8;
const FREE_TILES = 4;
const NUDGE_LR = 0.1;
const NUDGE_UD = 10;
const NUDGE_LR_FINE = 0.01;
const NUDGE_UD_FINE = 1;
const BASE_DIVISION = 16;
const TILE_PLAY_KEYS = ["q", "w", "e", "r", "t", "y", "u", "i"];
const PLAY_RETRY_DELAY_MS = 250;
const PLAY_RETRY_COUNT = 8;

const state = {
  bpm: 120,
  division: BASE_DIVISION,
  isPlaying: false,
  isRecording: false,
  isEditMode: true,
  globalStep: 0,
  selectedIndex: 0,
  selectedCue: 0,
  selectedStep: null,
  tiles: Array.from({ length: TILE_COUNT }, () => ({
    videoUrl: "",
    videoId: "",
    player: null,
    cues: Array(10).fill(0),
    cueVolumes: Array(10).fill(100),
    masterVolume: 100,
    playbackRate: 1,
    isClipPlaying: false,
    desiredClipPlaying: null,
    actions: [],
    muted: false,
    steps: 16,
    division: BASE_DIVISION,
    customCues: false,
  })),
};

const gridEl = document.getElementById("grid");
const appEl = document.querySelector(".app");
const bpmInput = document.getElementById("bpm");
const presentModeBtn = document.getElementById("present-mode");
const editModeBtn = document.getElementById("edit-mode");
const playToggleBtn = document.getElementById("play-toggle");
const loopToggleBtn = document.getElementById("loop-toggle");
const tapTempoBtn = document.getElementById("tap-tempo");
const newSessionBtn = document.getElementById("new-session");
const shareBtn = document.getElementById("share");
const helpToggleBtn = document.getElementById("help-toggle");
const helpPanel = document.getElementById("help-panel");
const helpCloseBtn = document.getElementById("help-close");
const statusEl = document.getElementById("status");

const tileEls = [];
const stepEls = [];
let transportTimer = null;
let shareResetTimer = null;
let tapTimes = [];

function init() {
  loadFromUrl();
  buildGrid();
  bindGlobalControls();
  updateTransportButton();
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
    if (!state.isEditMode) tile.classList.add("collapsed");
    if (i >= FREE_TILES) tile.classList.add("locked");

    const frame = document.createElement("div");
    frame.className = "player-frame";
    const playerSlot = document.createElement("div");
    playerSlot.id = `player-${i}`;
    frame.appendChild(playerSlot);

    const controls = document.createElement("div");
    controls.className = "tile-controls";

    const urlRow = document.createElement("div");
    urlRow.className = "url-row editable-only";
    const urlInput = document.createElement("input");
    urlInput.placeholder = "Paste YouTube URL";
    urlInput.value = state.tiles[i].videoUrl;
    const loadBtn = document.createElement("button");
    loadBtn.textContent = "Load";
    loadBtn.className = "load-btn";
    urlRow.append(urlInput, loadBtn);

    const perfRow = document.createElement("div");
    perfRow.className = "status-row cue-row editable-only";
    const perfPlayBtn = document.createElement("button");
    perfPlayBtn.className = "perf-play-btn";
    perfPlayBtn.textContent = `▶ (${TILE_PLAY_KEYS[i].toUpperCase()})`;
    const perfVolLabel = document.createElement("div");
    perfVolLabel.className = "mini-label";
    perfVolLabel.textContent = "Master Vol";
    const perfVolInput = document.createElement("input");
    perfVolInput.className = "perf-vol-input";
    perfVolInput.type = "range";
    perfVolInput.min = "0";
    perfVolInput.max = "100";
    perfVolInput.step = "1";
    perfVolInput.value = String(state.tiles[i].masterVolume ?? 100);
    const perfSpeedSelect = document.createElement("select");
    perfSpeedSelect.className = "perf-speed-select";
    perfSpeedSelect.innerHTML = `
      <option value="0.5">0.5x</option>
      <option value="0.75">0.75x</option>
      <option value="1">1x</option>
      <option value="1.25">1.25x</option>
      <option value="1.5">1.5x</option>
      <option value="2">2x</option>
    `;
    perfSpeedSelect.value = String(state.tiles[i].playbackRate ?? 1);
    perfRow.append(perfPlayBtn, perfVolLabel, perfVolInput, perfSpeedSelect);

    const stepsRow = document.createElement("div");
    stepsRow.className = "status-row editable-only seq-config-row";
    const stepsLabel = document.createElement("div");
    stepsLabel.textContent = "Steps";
    const stepsInput = document.createElement("input");
    stepsInput.className = "tile-num-input";
    stepsInput.type = "number";
    stepsInput.min = "4";
    stepsInput.max = "128";
    stepsInput.value = String(state.tiles[i].steps);
    stepsRow.append(stepsLabel, stepsInput);

    const divisionRow = document.createElement("div");
    divisionRow.className = "status-row editable-only seq-config-row";
    const divisionLabel = document.createElement("div");
    divisionLabel.className = "time-div-label";
    divisionLabel.textContent = "Time Div";
    const divisionSelect = document.createElement("select");
    divisionSelect.className = "tile-select-input";
    divisionSelect.innerHTML = `
      <option value="16">16ths</option>
      <option value="8">8ths</option>
      <option value="4">Beats</option>
    `;
    divisionSelect.value = String(state.tiles[i].division || BASE_DIVISION);
    divisionRow.append(divisionLabel, divisionSelect);

    const legend = null;

    const liveTitle = document.createElement("div");
    liveTitle.className = "section-title editable-only";
    liveTitle.textContent = "Current Cue Point";

    const cueSection = document.createElement("div");
    cueSection.className = "status-row cue-row editable-only";
    const cueSelect = document.createElement("select");
    cueSelect.className = "cue-select tile-select-input";
    for (let c = 0; c <= 9; c += 1) {
      const option = document.createElement("option");
      option.value = String(c);
      option.textContent = String(c);
      cueSelect.appendChild(option);
    }

    const cueSecLabel = document.createElement("div");
    cueSecLabel.className = "mini-label";
    cueSecLabel.textContent = "Sec";
    const cueSecInput = document.createElement("input");
    cueSecInput.className = "tile-num-input";
    cueSecInput.type = "number";
    cueSecInput.min = "0";
    cueSecInput.step = "0.01";

    const cueVolLabel = document.createElement("div");
    cueVolLabel.className = "mini-label";
    cueVolLabel.textContent = "Vol";
    const cueVolInput = document.createElement("input");
    cueVolInput.className = "tile-num-input";
    cueVolInput.type = "number";
    cueVolInput.min = "0";
    cueVolInput.max = "100";
    cueVolInput.step = "1";

    cueSection.append(cueSelect, cueSecLabel, cueSecInput, cueVolLabel, cueVolInput);

    const seqTitle = document.createElement("div");
    seqTitle.className = "section-title editable-only";
    seqTitle.textContent = "Sequencer";

    const clearRow = document.createElement("div");
    clearRow.className = "status-row editable-only seq-config-row";
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear";
    clearBtn.className = "clear-btn";
    clearBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      clearActions(i);
    });
    clearRow.append(stepsLabel, stepsInput, divisionLabel, divisionSelect, clearBtn);

    const stepIndicator = document.createElement("div");
    stepIndicator.className = "step-indicator";
    const totalSteps = state.tiles[i].steps;
    stepIndicator.style.gridTemplateColumns = `repeat(${totalSteps}, minmax(0, 1fr))`;
    const stepDots = [];
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
    const upgradeBtn = lockedOverlay.querySelector("button");
    upgradeBtn?.addEventListener("click", (event) => {
      event.stopPropagation();
      window.alert("We are working on this expansion. Coming soon.");
    });

    controls.append(urlRow, perfRow, liveTitle, cueSection, seqTitle, clearRow, stepIndicator);
    tile.append(frame, controls, lockedOverlay);
    gridEl.appendChild(tile);

    tileEls.push({
      tile,
      urlInput,
      loadBtn,
      perfPlayBtn,
      perfVolInput,
      perfSpeedSelect,
      stepsInput,
      divisionSelect,
      cueSelect,
      cueSecInput,
      cueVolInput,
      clearBtn,
      stepIndicator,
      stepDots,
    });
    stepEls.push(stepDots);

    tile.addEventListener("click", () => selectTile(i));
    loadBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      loadVideo(i, urlInput.value);
    });
    perfPlayBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleTilePlayPause(i, false);
    });
    perfVolInput.addEventListener("input", (event) => {
      event.stopPropagation();
      state.tiles[i].masterVolume = clamp(Number(perfVolInput.value) || 100, 0, 100);
      applySelectedCueVolume(i);
      saveToUrl();
    });
    perfSpeedSelect.addEventListener("change", (event) => {
      event.stopPropagation();
      state.tiles[i].playbackRate = Number(perfSpeedSelect.value) || 1;
      state.tiles[i].player?.setPlaybackRate?.(state.tiles[i].playbackRate);
      saveToUrl();
    });
    urlInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        loadVideo(i, urlInput.value);
      }
    });
    cueSelect.addEventListener("change", (event) => {
      event.stopPropagation();
      selectTile(i);
      selectCue(Number(cueSelect.value));
    });
    cueSecInput.addEventListener("input", () => {
      const tile = state.tiles[i];
      const parsed = Number(cueSecInput.value);
      if (Number.isNaN(parsed)) return;
      const value = Math.max(0, parsed);
      tile.cues[state.selectedCue] = value;
      tile.customCues = true;
      saveToUrl();
    });
    cueSecInput.addEventListener("change", () => updateTileDisplays());
    cueVolInput.addEventListener("input", () => {
      const tile = state.tiles[i];
      const parsed = Number(cueVolInput.value);
      if (Number.isNaN(parsed)) return;
      tile.cueVolumes[state.selectedCue] = clamp(parsed, 0, 100);
      applySelectedCueVolume(i);
      saveToUrl();
    });
    cueVolInput.addEventListener("change", () => updateTileDisplays());
    stepsInput.addEventListener("change", () => {
      const value = clamp(Number(stepsInput.value) || 16, 4, 128);
      stepsInput.value = String(value);
      state.tiles[i].steps = value;
      if (state.selectedStep !== null && state.selectedStep >= value) {
        state.selectedStep = null;
      }
      resizeActions(state.tiles[i]);
      rebuildTileSteps(i);
      saveToUrl();
    });
    divisionSelect.addEventListener("change", () => {
      const value = Number(divisionSelect.value) || BASE_DIVISION;
      state.tiles[i].division = value;
      updateStepIndicators();
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
    if (state.isPlaying) restartTransport(false);
    saveToUrl();
  });

  playToggleBtn.addEventListener("click", () => togglePlay());

  presentModeBtn.addEventListener("click", () => {
    state.isEditMode = false;
    tileEls.forEach((entry) => entry.tile.classList.add("collapsed"));
    updateTransportButton();
  });

  editModeBtn.addEventListener("click", () => {
    state.isEditMode = true;
    tileEls.forEach((entry) => entry.tile.classList.remove("collapsed"));
    updateTransportButton();
  });

  loopToggleBtn.addEventListener("click", () => toggleLoop());
  tapTempoBtn?.addEventListener("click", () => tapTempo());

  newSessionBtn.addEventListener("click", () => startNewSession());

  shareBtn.addEventListener("click", async () => {
    saveToUrl();
    try {
      await navigator.clipboard.writeText(window.location.href);
      shareBtn.classList.add("copied");
      shareBtn.textContent = "Copied ✓";
      clearTimeout(shareResetTimer);
      shareResetTimer = setTimeout(() => {
        shareBtn.classList.remove("copied");
        shareBtn.textContent = "Copy Share Link";
      }, 1300);
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
  if (
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLSelectElement ||
    event.target instanceof HTMLTextAreaElement
  ) {
    return;
  }
  const tileHotkeyIndex = TILE_PLAY_KEYS.indexOf(event.key.toLowerCase());
  if (tileHotkeyIndex !== -1) {
    event.preventDefault();
    if (event.repeat) return;
    selectTile(tileHotkeyIndex);
    if (!event.shiftKey) {
      toggleTilePlayPause(tileHotkeyIndex, false);
    }
    return;
  }
  if (event.shiftKey && (event.key === "Delete" || event.key === "Backspace")) {
    clearActions(state.selectedIndex);
    event.preventDefault();
    return;
  }
  if (event.code === "Space") {
    event.preventDefault();
    togglePlay();
    return;
  }
  if (event.key.toLowerCase() === "l") {
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
    let step = event.shiftKey ? NUDGE_LR_FINE : NUDGE_LR;
    if (event.altKey) {
      adjustCueVolumeFromArrow(event.key);
      event.preventDefault();
      return;
    }
    nudgeCue(state.selectedIndex, state.selectedCue, delta * step);
    event.preventDefault();
    return;
  }

  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    const delta = event.key === "ArrowUp" ? 1 : -1;
    if (event.altKey) {
      adjustCueVolumeFromArrow(event.key);
      event.preventDefault();
      return;
    }
    const step = event.shiftKey ? NUDGE_UD_FINE : NUDGE_UD;
    nudgeCue(state.selectedIndex, state.selectedCue, delta * step);
    event.preventDefault();
    return;
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
  applySelectedCueVolume(state.selectedIndex);
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
  tile.cueVolumes = Array(10).fill(100);

  if (tile.player) {
    tile.player.loadVideoById(videoId);
    queueDefaultCues(index);
  } else if (window.YT && window.YT.Player) {
    tile.player = new window.YT.Player(`player-${index}`, {
      videoId,
      playerVars: {
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        controls: 0,
        disablekb: 1,
      },
      events: {
        onReady: () => maybeSetDefaultCues(index),
        onStateChange: (event) => handlePlayerState(index, event),
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
      tile.isClipPlaying = true;
      tile.desiredClipPlaying = true;
      break;
    case "pause":
      player.pauseVideo();
      tile.isClipPlaying = false;
      tile.desiredClipPlaying = false;
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
      const cueVolume = clamp(tile.cueVolumes[action.cueIndex] ?? 100, 0, 100);
      const master = clamp(tile.masterVolume ?? 100, 0, 100);
      player.setVolume?.(clamp((cueVolume * master) / 100, 0, 100));
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

function restartTransport(pauseVideos = true) {
  stopTransport(pauseVideos);
  if (state.isPlaying) startTransport();
}

function stopTransport(pauseVideos = true) {
  if (transportTimer) {
    clearInterval(transportTimer);
    transportTimer = null;
  }
  if (pauseVideos) pauseAllVideos();
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
    if (document.activeElement !== entry.urlInput) {
      entry.urlInput.value = tile.videoUrl;
    }
    entry.stepsInput.value = String(tile.steps);
    entry.divisionSelect.value = String(tile.division || BASE_DIVISION);
    entry.perfVolInput.value = String(clamp(tile.masterVolume ?? 100, 0, 100));
    entry.perfSpeedSelect.value = String(tile.playbackRate ?? 1);
    entry.perfPlayBtn.textContent = tile.isClipPlaying
      ? `❚❚ (${TILE_PLAY_KEYS[idx].toUpperCase()})`
      : `▶ (${TILE_PLAY_KEYS[idx].toUpperCase()})`;
    const cueIndex = idx === state.selectedIndex ? state.selectedCue : 0;
    const cueTime = tile.cues[cueIndex] || 0;
    entry.cueSelect.value = String(cueIndex);
    if (document.activeElement !== entry.cueSecInput) {
      entry.cueSecInput.value = cueTime.toFixed(2);
    }
    if (document.activeElement !== entry.cueVolInput) {
      entry.cueVolInput.value = String(clamp(tile.cueVolumes[cueIndex] ?? 100, 0, 100));
    }
    const hasLoop = tile.actions.some((step) => step.length > 0);
    entry.clearBtn.classList.toggle("has-content", hasLoop);
  });

  updateStepIndicators();
  updateStatus();
}

function updateTransportButton() {
  playToggleBtn.innerHTML = state.isPlaying
    ? '<span class="transport-icon">■</span><span class="transport-label">Stop (Space)</span>'
    : '<span class="transport-icon">▶</span><span class="transport-label">Play (Space)</span>';
  playToggleBtn.classList.toggle("active", state.isPlaying);
  loopToggleBtn.innerHTML =
    '<span class="transport-icon">⟲</span><span class="transport-label">Loop (L)</span>';
  presentModeBtn.classList.toggle("active", !state.isEditMode);
  editModeBtn.classList.toggle("active", state.isEditMode);
  appEl?.classList.toggle("performance", !state.isEditMode);
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

function toggleTilePlayPause(index, shouldRecord) {
  const tile = state.tiles[index];
  const player = tile?.player;
  if (!player) return;
  const current =
    typeof tile.desiredClipPlaying === "boolean" ? tile.desiredClipPlaying : Boolean(tile.isClipPlaying);
  const next = !current;
  const action = next ? { type: "play" } : { type: "pause" };
  tile.desiredClipPlaying = next;
  triggerAction(index, action, shouldRecord);
  tile.isClipPlaying = next;
  updateTileDisplays();
}

function applySelectedCueVolume(index) {
  const tile = state.tiles[index];
  const player = tile?.player;
  if (!player) return;
  const cueIndex = index === state.selectedIndex ? state.selectedCue : 0;
  const cueVolume = clamp(tile.cueVolumes[cueIndex] ?? 100, 0, 100);
  const master = clamp(tile.masterVolume ?? 100, 0, 100);
  const volume = clamp((cueVolume * master) / 100, 0, 100);
  player.setVolume?.(volume);
}

function pauseAllVideos() {
  state.tiles.forEach((tile) => {
    if (tile.player && tile.player.pauseVideo) {
      tile.player.pauseVideo();
      tile.isClipPlaying = false;
      tile.desiredClipPlaying = false;
    }
  });
  updateTileDisplays();
}

function playAllVideos() {
  state.tiles.forEach((tile, idx) => {
    if (tile.player && tile.player.playVideo) {
      tile.player.playVideo();
      tile.isClipPlaying = true;
      tile.desiredClipPlaying = true;
      ensureTilePlaying(idx, PLAY_RETRY_COUNT);
    }
  });
  updateTileDisplays();
}

function saveToUrl() {
  const payload = {
    bpm: state.bpm,
    isEditMode: state.isEditMode,
    selectedIndex: state.selectedIndex,
    selectedCue: state.selectedCue,
    tiles: state.tiles.map((tile) => ({
      videoUrl: tile.videoUrl,
      cues: tile.cues,
      cueVolumes: tile.cueVolumes,
      masterVolume: tile.masterVolume,
      playbackRate: tile.playbackRate,
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
      state.isEditMode = payload.isEditMode !== false;
      state.selectedIndex = payload.selectedIndex || 0;
      state.selectedCue = payload.selectedCue || 0;
      state.tiles = payload.tiles.map((tile) => ({
        videoUrl: tile.videoUrl || "",
        videoId: parseVideoId(tile.videoUrl || "") || "",
        player: null,
        cues: tile.cues || Array(10).fill(0),
        cueVolumes: tile.cueVolumes || Array(10).fill(100),
        masterVolume: tile.masterVolume ?? 100,
        playbackRate: tile.playbackRate ?? 1,
        isClipPlaying: false,
        desiredClipPlaying: null,
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
          cueVolumes: Array(10).fill(100),
          masterVolume: 100,
          playbackRate: 1,
          isClipPlaying: false,
          desiredClipPlaying: null,
          actions: Array.from({ length: 16 }, () => []),
          muted: false,
          steps: 16,
          division: BASE_DIVISION,
          customCues: false,
        }))
      );
      const hasComposition = state.tiles.some(
        (tile) => tile.videoUrl || tile.actions.some((step) => (step || []).length > 0)
      );
      if (hasComposition) {
        state.isEditMode = false;
      }
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

function adjustCueVolumeFromArrow(key) {
  const tile = state.tiles[state.selectedIndex];
  const cueIndex = state.selectedCue;
  const current = clamp(tile.cueVolumes[cueIndex] ?? 100, 0, 100);
  let delta = 0;
  if (key === "ArrowLeft") delta = -1;
  if (key === "ArrowRight") delta = 1;
  if (key === "ArrowUp") delta = 10;
  if (key === "ArrowDown") delta = -10;
  tile.cueVolumes[cueIndex] = clamp(current + delta, 0, 100);
  updateTileDisplays();
  saveToUrl();
}

function startNewSession() {
  stopTransport();
  state.bpm = 120;
  state.isPlaying = false;
  state.isRecording = false;
  state.isEditMode = true;
  state.globalStep = 0;
  state.selectedIndex = 0;
  state.selectedCue = 0;
  state.selectedStep = null;
  state.tiles = Array.from({ length: TILE_COUNT }, () => ({
    videoUrl: "",
    videoId: "",
    player: null,
    cues: Array(10).fill(0),
    cueVolumes: Array(10).fill(100),
    masterVolume: 100,
    playbackRate: 1,
    isClipPlaying: false,
    desiredClipPlaying: null,
    actions: Array.from({ length: 16 }, () => []),
    muted: false,
    steps: 16,
    division: BASE_DIVISION,
    customCues: false,
  }));
  bpmInput.value = "120";
  window.history.pushState({}, "", `?s=${Math.random().toString(36).slice(2, 10)}`);
  buildGrid();
  updateTransportButton();
  saveToUrl();
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
          controls: 0,
          disablekb: 1,
        },
        events: {
          onReady: () => maybeSetDefaultCues(idx),
          onStateChange: (event) => handlePlayerState(idx, event),
        },
      });
    }
  });
}

function maybeSetDefaultCues(index) {
  const tile = state.tiles[index];
  const player = tile.player;
  if (!player) return;
  tile.player?.setPlaybackRate?.(tile.playbackRate ?? 1);
  applySelectedCueVolume(index);
  queueDefaultCues(index);
}

function queueDefaultCues(index, triesLeft = 30) {
  const tile = state.tiles[index];
  const player = tile?.player;
  if (!tile || !player) return;
  if (tile.customCues) return;
  if (tile.cues.some((cue) => cue > 0)) return;

  const duration = player.getDuration?.() || 0;
  if (duration > 0) {
    const slice = duration / 10;
    for (let i = 0; i < 10; i += 1) {
      tile.cues[i] = slice * i;
    }
    updateTileDisplays();
    saveToUrl();
    return;
  }

  if (triesLeft > 0) {
    setTimeout(() => queueDefaultCues(index, triesLeft - 1), 150);
  }
}

function handlePlayerState(index, event) {
  const tile = state.tiles[index];
  if (!tile) return;
  const ytState = event?.data;
  if (ytState === window.YT?.PlayerState?.PLAYING) {
    tile.isClipPlaying = true;
    if (tile.desiredClipPlaying === true) tile.desiredClipPlaying = null;
    tile.player?.setPlaybackRate?.(tile.playbackRate ?? 1);
  } else if (
    ytState === window.YT?.PlayerState?.PAUSED ||
    ytState === window.YT?.PlayerState?.ENDED
  ) {
    tile.isClipPlaying = false;
    if (tile.desiredClipPlaying === false) tile.desiredClipPlaying = null;
  }
  updateTileDisplays();
}

function tapTempo() {
  const now = performance.now();
  tapTimes = tapTimes.filter((t) => now - t < 3000);
  tapTimes.push(now);
  if (tapTimes.length < 2) return;
  const intervals = [];
  for (let i = 1; i < tapTimes.length; i += 1) {
    intervals.push(tapTimes[i] - tapTimes[i - 1]);
  }
  const avg = intervals.reduce((sum, value) => sum + value, 0) / intervals.length;
  if (!Number.isFinite(avg) || avg <= 0) return;
  state.bpm = clamp(Math.round(60000 / avg), 40, 240);
  bpmInput.value = String(state.bpm);
  if (state.isPlaying) restartTransport(false);
  saveToUrl();
  updateStatus();
}

function rebuildTileSteps(index) {
  const entry = tileEls[index];
  const tileState = state.tiles[index];
  if (!entry || !tileState) return;
  const { stepIndicator } = entry;
  stepIndicator.innerHTML = "";
  stepIndicator.style.gridTemplateColumns = `repeat(${tileState.steps}, minmax(0, 1fr))`;
  const stepDots = [];
  for (let s = 0; s < tileState.steps; s += 1) {
    const dot = document.createElement("div");
    dot.className = "step";
    dot.dataset.step = String(s);
    dot.addEventListener("click", (event) => {
      event.stopPropagation();
      selectTile(index);
      toggleSelectedStep(s);
    });
    stepIndicator.appendChild(dot);
    stepDots.push(dot);
  }
  entry.stepDots = stepDots;
  stepEls[index] = stepDots;
  updateTileDisplays();
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

function ensureTilePlaying(index, triesLeft) {
  if (!state.isPlaying || triesLeft <= 0) return;
  const tile = state.tiles[index];
  const player = tile?.player;
  if (!player) return;
  const playerState = player.getPlayerState?.();
  const isPlaying =
    playerState === window.YT?.PlayerState?.PLAYING || playerState === window.YT?.PlayerState?.BUFFERING;
  if (isPlaying) return;
  setTimeout(() => {
    if (!state.isPlaying) return;
    player.playVideo?.();
    ensureTilePlaying(index, triesLeft - 1);
  }, PLAY_RETRY_DELAY_MS);
}
