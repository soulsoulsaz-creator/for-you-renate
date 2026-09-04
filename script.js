/* FOR YOU, RENATE.
   Main content lives in EPISODES, OPEN_WHEN_MESSAGES and STORY in this file.
   Change text here without needing to change the HTML.
*/

const EPISODES = [
  { id:"01", title:"How I Found You", description:"[ADD YOUR EPISODE DESCRIPTION HERE]", audio:"assets/audio/episode-01.mp3", image:"assets/images/episode-01.svg" },
  { id:"02", title:"Things I Love About You", description:"[ADD YOUR EPISODE DESCRIPTION HERE]", audio:"assets/audio/episode-02.mp3", image:"assets/images/episode-02.svg" },
  { id:"03", title:"The Distance Between Us", description:"[ADD YOUR EPISODE DESCRIPTION HERE]", audio:"assets/audio/episode-03.mp3", image:"assets/images/episode-03.svg" },
  { id:"04", title:"Your Kids & Our Future", description:"[ADD YOUR EPISODE DESCRIPTION HERE]", audio:"assets/audio/episode-04.mp3", image:"assets/images/episode-04.svg" },
  { id:"05", title:"The Things You Don't Know About Me", description:"[ADD YOUR EPISODE DESCRIPTION HERE]", audio:"assets/audio/episode-05.mp3", image:"assets/images/episode-05.svg" },
  { id:"06", title:"Questions I'd Ask You If You Were Here", description:"[ADD YOUR EPISODE DESCRIPTION HERE]", audio:"assets/audio/episode-06.mp3", image:"assets/images/episode-06.svg" },
  { id:"07", title:"Our Future", description:"[ADD YOUR EPISODE DESCRIPTION HERE]", audio:"assets/audio/episode-07.mp3", image:"assets/images/episode-07.svg" },
  { id:"08", title:"If You Ever Doubt Us", description:"[ADD YOUR EPISODE DESCRIPTION HERE]", audio:"assets/audio/episode-08.mp3", image:"assets/images/episode-08.svg" }
];

const OPEN_WHEN_MESSAGES = {
  miss: {
    title:"WHEN YOU MISS ME",
    text:"[ADD YOUR MESSAGE HERE]\n\nWrite the words you want Renate to find when the distance feels a little heavier."
  },
  smile: {
    title:"WHEN YOU NEED TO SMILE",
    text:"[ADD YOUR MESSAGE HERE]\n\nThis can be something funny, sweet, or completely ridiculous that belongs only to the two of you."
  },
  sleep: {
    title:"WHEN YOU CAN'T SLEEP",
    text:"[ADD YOUR MESSAGE HERE]\n\nA quiet message for the middle of the night."
  },
  doubt: {
    title:"WHEN YOU DOUBT YOURSELF",
    text:"[ADD YOUR MESSAGE HERE]\n\nA reminder written in your own words."
  }
};

const STORAGE_KEY = "for-you-renate-v1";
const state = {
  currentIndex: 0,
  isPlaying: false,
  durations: {},
  progress: {},
  completed: {},
  audioReady: false
};

const $ = (id) => document.getElementById(id);
const audio = $("audio");
const episodesGrid = $("episodesGrid");

function loadSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (saved.progress) state.progress = saved.progress;
    if (saved.completed) state.completed = saved.completed;
    if (saved.durations) state.durations = saved.durations;
    const theme = saved.theme || localStorage.getItem("for-you-renate-theme");
    if (theme === "day" || theme === "dark") setTheme(theme, false);
  } catch (e) {}
}

function saveState() {
  const data = {
    progress: state.progress,
    completed: state.completed,
    durations: state.durations,
    currentEpisode: EPISODES[state.currentIndex]?.id || "01",
    theme: document.documentElement.dataset.theme || "dark",
    updatedAt: Date.now()
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem("for-you-renate-theme", data.theme);
  } catch (e) {}
  updateContinue();
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const s = Math.floor(seconds);
  const m = Math.floor(s / 60);
  const sec = String(s % 60).padStart(2, "0");
  return `${m}:${sec}`;
}

function artHTML(ep, extraClass="") {
  return `<div class="art-placeholder ${extraClass}" style="background-image:linear-gradient(145deg,rgba(9,11,20,.1),rgba(9,11,20,.6)),url('${ep.image}'),radial-gradient(circle at 65% 25%,rgba(217,167,200,.34),transparent 27%),radial-gradient(circle at 25% 75%,rgba(143,168,216,.28),transparent 35%),linear-gradient(145deg,#151a2d,#090b14);background-size:cover;background-position:center">
    <span class="placeholder-number">${ep.id}</span><span class="placeholder-mark">♡</span>
  </div>`;
}

function renderEpisodes() {
  episodesGrid.innerHTML = EPISODES.map((ep, i) => {
    const duration = state.durations[ep.id] ? formatTime(state.durations[ep.id]) : "COMING SOON";
    return `<button class="episode-card ${i === state.currentIndex ? "active" : ""}" type="button" data-index="${i}">
      ${artHTML(ep, "episode-art")}
      <span class="episode-copy">
        <span class="episode-kicker">EPISODE ${ep.id}</span>
        <h3>${escapeHTML(ep.title)}</h3>
        <p>${duration}</p>
      </span>
      <span class="card-play" aria-hidden="true">${i === state.currentIndex && state.isPlaying ? "Ⅱ" : "▶"}</span>
    </button>`;
  }).join("");

  episodesGrid.querySelectorAll(".episode-card").forEach(card => {
    card.addEventListener("click", () => {
      const index = Number(card.dataset.index);
      if (index === state.currentIndex && state.audioReady) togglePlay();
      else selectEpisode(index, true);
    });
  });
}

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, ch => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[ch]));
}

function applyArtwork(container, ep) {
  if (!container) return;
  const img = new Image();
  img.onload = () => {
    container.style.backgroundImage = `linear-gradient(145deg,rgba(9,11,20,.08),rgba(9,11,20,.55)),url('${ep.image}')`;
    container.style.backgroundSize = "cover";
    container.style.backgroundPosition = "center";
  };
  img.onerror = () => {};
  img.src = ep.image;
}

function selectEpisode(index, autoPlay=false) {
  if (!EPISODES[index]) return;
  state.currentIndex = index;
  const ep = EPISODES[index];
  state.audioReady = false;
  state.isPlaying = false;

  audio.pause();
  audio.src = ep.audio;
  audio.load();

  $("featuredNumber").textContent = ep.id;
  $("featuredKicker").textContent = `EPISODE ${ep.id}`;
  $("featuredTitle").textContent = ep.title;
  $("featuredDescription").textContent = ep.description;
  $("featuredDuration").textContent = state.durations[ep.id] ? formatTime(state.durations[ep.id]) : "Duration will appear when audio is added.";
  $("playerEpisode").textContent = `EPISODE ${ep.id}`;
  $("playerTitle").textContent = ep.title;
  $("playerThumbNumber").textContent = ep.id;
  $("playerStatus").textContent = "Checking audio…";
  $("progressBar").value = 0;
  $("currentTime").textContent = "0:00";
  $("totalTime").textContent = state.durations[ep.id] ? formatTime(state.durations[ep.id]) : "0:00";
  $("mainPlay").setAttribute("aria-pressed","false");
  $("mainPlay").textContent = "▶";
  $("featuredPlay").textContent = "▶";
  applyArtwork($("featuredArt"), ep);
  applyArtwork($("playerThumb"), ep);
  renderEpisodes();
  showPlayer();

  if (autoPlay) {
    audio.addEventListener("canplay", () => audio.play().catch(()=>{}), {once:true});
  }
}

function showPlayer() {
  $("playerShell").classList.add("visible");
}

function togglePlay() {
  if (!state.audioReady) {
    $("playerStatus").textContent = "Add the MP3 file to the matching assets/audio/ folder.";
    return;
  }
  if (audio.paused) audio.play().catch(() => {});
  else audio.pause();
}

function updatePlayUI() {
  const playing = !audio.paused && !audio.ended;
  state.isPlaying = playing;
  $("mainPlay").textContent = playing ? "Ⅱ" : "▶";
  $("featuredPlay").textContent = playing ? "Ⅱ" : "▶";
  $("mainPlay").setAttribute("aria-label", playing ? "Pause" : "Play");
  $("mainPlay").setAttribute("aria-pressed", String(playing));
  $("playerStatus").textContent = playing ? "NOW PLAYING" : "PAUSED";
  renderEpisodes();
}

function updateProgress() {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
  const current = audio.currentTime;
  const percent = (current / audio.duration) * 100;
  $("progressBar").value = percent;
  $("currentTime").textContent = formatTime(current);
  $("totalTime").textContent = formatTime(audio.duration);
  $("featuredDuration").textContent = formatTime(audio.duration);
  state.durations[EPISODES[state.currentIndex].id] = audio.duration;
  state.progress[EPISODES[state.currentIndex].id] = current;
  if (current > 2 && current < audio.duration - 2) scheduleSave();
  updateContinue();
}

let saveTimer = null;
function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveState, 700);
}

function updateContinue() {
  const entries = Object.entries(state.progress)
    .filter(([id, seconds]) => Number(seconds) > 2 || state.completed[id])
    .sort((a,b) => Number(b[1]) - Number(a[1]));
  const latest = entries[0];
  if (!latest) {
    $("continueSection").classList.add("is-hidden");
    return;
  }
  const ep = EPISODES.find(e => e.id === latest[0]);
  if (!ep) return;
  const duration = Number(state.durations[ep.id]) || 0;
  const current = Number(latest[1]) || 0;
  const percent = duration ? Math.min(100, current / duration * 100) : 0;
  $("continueSection").classList.remove("is-hidden");
  $("continueEpisodeNumber").textContent = `EPISODE ${ep.id}`;
  $("continueEpisodeTitle").textContent = ep.title;
  $("continueTime").textContent = duration ? `${formatTime(current)} / ${formatTime(duration)}` : `${formatTime(current)} / —`;
  $("continueProgress").style.width = `${percent}%`;
  applyArtwork($("continueArt"), ep);
}

function restoreSavedPosition() {
  const ep = EPISODES[state.currentIndex];
  const saved = Number(state.progress[ep.id] || 0);
  if (saved > 0 && Number.isFinite(audio.duration) && saved < audio.duration - 1) {
    audio.currentTime = saved;
  }
}

function setTheme(theme, persist=true) {
  document.documentElement.dataset.theme = theme;
  const isDay = theme === "day";
  $("themeLabel").textContent = isDay ? "NIGHT" : "DAY";
  $("themeIcon").textContent = isDay ? "☾" : "☼";
  $("themeToggle").setAttribute("aria-label", isDay ? "Switch to dark mode" : "Switch to day mode");
  if (persist) saveState();
}

$("themeToggle").innerHTML = `<span class="theme-icon" id="themeIcon" aria-hidden="true">☼</span><span class="theme-label" id="themeLabel">DAY</span>`;
$("themeToggle").addEventListener("click", () => {
  const current = document.documentElement.dataset.theme || "dark";
  setTheme(current === "dark" ? "day" : "dark");
});

$("startListening").addEventListener("click", () => {
  $("podcast").scrollIntoView({behavior:"smooth",block:"start"});
  selectEpisode(state.currentIndex, false);
});

$("featuredPlay").addEventListener("click", () => {
  if (!state.audioReady) {
    $("playerStatus").textContent = "Add the MP3 file to the matching assets/audio/ folder.";
    return;
  }
  togglePlay();
});
$("mainPlay").addEventListener("click", togglePlay);

$("backBtn").addEventListener("click", () => {
  audio.currentTime = Math.max(0, audio.currentTime - 15);
  scheduleSave();
});
$("forwardBtn").addEventListener("click", () => {
  audio.currentTime = Math.min(audio.duration || audio.currentTime + 15, audio.currentTime + 15);
  scheduleSave();
});
$("prevBtn").addEventListener("click", () => selectEpisode(Math.max(0, state.currentIndex - 1), true));
$("nextBtn").addEventListener("click", () => selectEpisode(Math.min(EPISODES.length - 1, state.currentIndex + 1), true));

$("progressBar").addEventListener("input", e => {
  if (!Number.isFinite(audio.duration)) return;
  audio.currentTime = (Number(e.target.value) / 100) * audio.duration;
  updateProgress();
});
$("continueCard").addEventListener("click", () => {
  const ids = Object.keys(state.progress).filter(id => Number(state.progress[id]) > 2);
  if (!ids.length) return;
  const id = ids.sort((a,b) => Number(state.progress[b]) - Number(state.progress[a]))[0];
  const index = EPISODES.findIndex(e => e.id === id);
  if (index >= 0) {
    selectEpisode(index, true);
    document.querySelector("#podcast").scrollIntoView({behavior:"smooth"});
  }
});

audio.addEventListener("loadedmetadata", () => {
  state.audioReady = true;
  state.durations[EPISODES[state.currentIndex].id] = audio.duration;
  restoreSavedPosition();
  $("playerStatus").textContent = "READY TO PLAY";
  updateProgress();
  renderEpisodes();
  saveState();
});
audio.addEventListener("canplay", () => {
  state.audioReady = true;
  $("playerStatus").textContent = "READY TO PLAY";
});
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("play", updatePlayUI);
audio.addEventListener("pause", () => { updatePlayUI(); scheduleSave(); });
audio.addEventListener("error", () => {
  state.audioReady = false;
  state.isPlaying = false;
  $("playerStatus").textContent = "COMING SOON — add this episode's MP3 file.";
  $("mainPlay").textContent = "▶";
  $("featuredPlay").textContent = "▶";
});
audio.addEventListener("ended", () => {
  const id = EPISODES[state.currentIndex].id;
  state.completed[id] = true;
  state.progress[id] = audio.duration || state.progress[id] || 0;
  saveState();
  updatePlayUI();
  const next = state.currentIndex + 1;
  if (next < EPISODES.length) {
    selectEpisode(next, false);
    $("playerStatus").textContent = "CHAPTER COMPLETE — NEXT CHAPTER READY";
  } else {
    $("playerStatus").textContent = "ALL CHAPTERS COMPLETE";
  }
});
window.addEventListener("pagehide", saveState);
document.addEventListener("visibilitychange", () => { if (document.hidden) saveState(); });

document.addEventListener("keydown", e => {
  if (e.target.matches("input,textarea,button,a")) return;
  if (e.code === "Space") { e.preventDefault(); togglePlay(); }
  if (e.key === "ArrowLeft") { e.preventDefault(); audio.currentTime = Math.max(0, audio.currentTime - 15); scheduleSave(); }
  if (e.key === "ArrowRight") { e.preventDefault(); audio.currentTime = Math.min(audio.duration || audio.currentTime + 15, audio.currentTime + 15); scheduleSave(); }
});

const modal = $("messageModal");
const modalTitle = $("modalTitle");
const modalMessage = $("modalMessage");
let lastFocused = null;
document.querySelectorAll(".open-card").forEach(card => {
  card.addEventListener("click", () => {
    const msg = OPEN_WHEN_MESSAGES[card.dataset.messageKey];
    if (!msg) return;
    lastFocused = document.activeElement;
    modalTitle.textContent = msg.title;
    modalMessage.textContent = msg.text;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    setTimeout(() => $("modalClose").focus(), 30);
  });
});
function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
}
$("modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

loadSaved();
renderEpisodes();
updateContinue();
const savedData = (() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch(e){ return {}; } })();
const savedId = savedData.currentEpisode;
const savedIndex = EPISODES.findIndex(e => e.id === savedId);
selectEpisode(savedIndex >= 0 ? savedIndex : 0, false);
