// SpotFinder MVP logic
// - Stores user preferences in localStorage
// - Computes match % for each spot
// - Renders spots list
// - Highlights active nav item

const STORAGE_KEY = "sfPreferences";

/**
 * Default preferences (1–3 scale)
 */
const defaultPreferences = {
  wifi: 2,
  noise: 2,
  temp: 2,
  outlets: 2,
  comfort: 2,
};

/**
 * Hard-coded spots data for MVP
 * metrics are on the same 1–3 scale
 */
const spotsData = [
  {
    id: "tim",
    name: "Tim Hortons – تيم هورتنز",
    location: "Khobar, Saudi Arabia • 0.3 km",
    type: "cafe",
    img: "assets/img/tim.jpg",
    metrics: {
      wifi: 3,
      noise: 1, // quieter
      temp: 2,
      outlets: 3,
      comfort: 3,
    },
    link: "spot-tim-hortons.html",
    mini: {
      wifi: "📶 Great",
      noise: "🔈 Quiet Zone",
      outlets: "🔌 5",
    },
  },
  {
    id: "equal",
    name: "Equal – ايكوال",
    location: "Khobar, Saudi Arabia • 2.8 km",
    type: "cafe",
    img: "assets/img/equal.jpg",
    metrics: {
      wifi: 3,
      noise: 2,
      temp: 2,
      outlets: 2,
      comfort: 2,
    },
    link: "spot-equal.html",
    mini: {
      wifi: "📶 Great",
      noise: "🔈 Moderate",
      outlets: "🔌 3",
    },
  },
  {
    id: "tulum",
    name: "Tulum Café – كافيه تلم",
    location: "Khobar, Saudi Arabia • 2.7 km",
    type: "cafe",
    img: "assets/img/tulum.jpg",
    metrics: {
      wifi: 3,
      noise: 1,
      temp: 2,
      outlets: 3,
      comfort: 3,
    },
    link: "spot-tulum.html",
    mini: {
      wifi: "📶 Great",
      noise: "🔈 Quiet",
      outlets: "🔌 4",
    },
  },
];

/**
 * Read preferences from localStorage
 */
function getPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultPreferences };
    const parsed = JSON.parse(raw);
    return { ...defaultPreferences, ...parsed };
  } catch (e) {
    console.warn("Failed to read preferences, using defaults", e);
    return { ...defaultPreferences };
  }
}

/**
 * Save preferences to localStorage
 */
function savePreferences(prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.warn("Failed to save preferences", e);
  }
}

/**
 * Simple match score (0–100)
 * smaller difference between spot and preferences => higher score
 */
function calculateMatch(spotMetrics, prefs) {
  let totalDiff = 0;
  let count = 0;

  for (const key of Object.keys(defaultPreferences)) {
    if (spotMetrics[key] == null) continue;
    const diff = Math.abs((spotMetrics[key] || 2) - (prefs[key] || 2));
    totalDiff += diff;
    count++;
  }

  const maxDiffPerMetric = 2; // scale 1–3 => max diff = 2
  const maxDiff = maxDiffPerMetric * count || 1;
  const closeness = 1 - totalDiff / maxDiff; // 0..1

  // Base between 60% and 100%
  const score = Math.round(60 + closeness * 40);
  return Math.max(40, Math.min(100, score));
}

/**
 * Init preferences form on home page
 */
function initPreferencesForm() {
  const form = document.getElementById("sf-preferences-form");
  if (!form) return;

  const prefs = getPreferences();

  // Fill current values
  for (const [key, value] of Object.entries(prefs)) {
    const field = form.elements.namedItem(key);
    if (field) field.value = String(value);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const newPrefs = { ...defaultPreferences };

    for (const key of Object.keys(defaultPreferences)) {
      const raw = formData.get(key);
      if (raw != null) newPrefs[key] = Number(raw);
    }

    savePreferences(newPrefs);

    // Simple feedback + go to Spots page
    alert("Preferences saved! We’ll adjust matches for you.");
    window.location.href = "spots.html";
  });
}

/**
 * Render spots on Spots page
 */
function renderSpots() {
  const list = document.getElementById("sf-spot-list");
  if (!list) return;

  const prefs = getPreferences();
  let currentFilter = "all";

  function draw() {
    list.innerHTML = "";
    spotsData.forEach((spot) => {
      if (currentFilter !== "all" && spot.type !== currentFilter) return;

      const match = calculateMatch(spot.metrics, prefs);

      const card = document.createElement("a");
      card.href = spot.link;
      card.className = "sf-spot-card";
      card.innerHTML = `
        <img class="sf-spot-img" src="${spot.img}" alt="${spot.name}" />
        <div class="sf-spot-main">
          <h2 class="sf-spot-name">${spot.name}</h2>
          <p class="sf-spot-location">${spot.location}</p>
          <div class="sf-spot-meta">
            <span class="sf-match-pill">${match}% Match</span>
            <div class="sf-mini-metrics">
              <span>${spot.mini.wifi}</span>
              <span>${spot.mini.noise}</span>
              <span>${spot.mini.outlets}</span>
            </div>
          </div>
        </div>
      `;
      list.appendChild(card);
    });
  }

  // Filters
  const tabs = document.querySelectorAll(
    "#sf-filter-tabs .sf-filter-tab"
  );
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs.forEach((b) => b.classList.remove("sf-filter-tab-active"));
      btn.classList.add("sf-filter-tab-active");
      currentFilter = btn.dataset.filter || "all";
      draw();
    });
  });

  draw();
}

/**
 * Highlight active nav item based on body[data-page]
 */
function highlightNav() {
  const page = document.body.dataset.page;
  const nav = document.querySelector(".sf-nav");
  if (!nav || !page) return;

  nav.querySelectorAll(".sf-nav-item").forEach((item) => {
    const target = item.dataset.nav;
    item.classList.toggle("sf-nav-item-active", target === page);
  });
}

// ===== Bootstrapping =====
document.addEventListener("DOMContentLoaded", () => {
  highlightNav();

  const page = document.body.dataset.page;
  if (page === "home") initPreferencesForm();
  if (page === "spots") renderSpots();
});
