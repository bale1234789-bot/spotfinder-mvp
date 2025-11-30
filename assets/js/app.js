// --- Base data ---------------------------------------------------

const defaultSpots = [
  {
    id: "tim-hortons",
    name: "Tim Hortons – تيم هورتنز",
    type: "cafe",
    city: "Khobar, Saudi Arabia",
    distanceKm: 0.3,
    img: "assets/img/tim.jpg",
    match: 98,
    wifi: "Great",
    noise: "Quiet Zone",
    outlets: "5",
    comfort: "High",
  },
  {
    id: "equal",
    name: "Equal – ايكوال",
    type: "cafe",
    city: "Khobar, Saudi Arabia",
    distanceKm: 2.8,
    img: "assets/img/equal.jpg",
    match: 92,
    wifi: "Great",
    noise: "Moderate",
    outlets: "3",
    comfort: "Medium",
  },
  {
    id: "tulum",
    name: "Tulum Café – كافيه تلم",
    type: "cafe",
    city: "Khobar, Saudi Arabia",
    distanceKm: 2.7,
    img: "assets/img/tulum.jpg",
    match: 90,
    wifi: "Great",
    noise: "Quiet",
    outlets: "4",
    comfort: "High",
  },
];

// --- Local storage helpers --------------------------------------

const STORAGE_KEY = "spotfinder-spots";

function loadSpots() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...defaultSpots];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) return [...defaultSpots];
    return parsed;
  } catch {
    return [...defaultSpots];
  }
}

function saveSpots(spots) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(spots));
  } catch (e) {
    console.warn("Could not save spots to localStorage", e);
  }
}

let spots = loadSpots();

// --- Rendering helpers ------------------------------------------

function createSpotCard(spot) {
  const a = document.createElement("a");
  a.className = "sf-spot-card";
  a.href = "#"; // For MVP no detail page yet

  a.innerHTML = `
    <img class="sf-spot-img" src="${spot.img}" alt="${spot.name}" />
    <div class="sf-spot-main">
      <h2 class="sf-spot-name">${spot.name}</h2>
      <p class="sf-spot-location">${spot.city} • ${spot.distanceKm.toFixed(
    1
  )} km</p>
      <div class="sf-spot-meta">
        <span class="sf-match-pill">${spot.match}% Match</span>
        <div class="sf-mini-metrics">
          <span>📶 ${spot.wifi}</span>
          <span>🔌 ${spot.outlets}</span>
          <span>🪑 ${spot.comfort}</span>
          <span>🔈 ${spot.noise}</span>
        </div>
      </div>
    </div>
  `;

  return a;
}

function renderSpots(listEl, filterType = "all") {
  listEl.innerHTML = "";

  const filtered = spots
    .slice()
    .sort((a, b) => b.match - a.match)
    .filter((s) => (filterType === "all" ? true : s.type === filterType));

  if (!filtered.length) {
    const empty = document.createElement("p");
    empty.className = "sf-body-text";
    empty.textContent =
      "No spots yet for this category. Try adding one from the Add Spot page.";
    listEl.appendChild(empty);
    return;
  }

  filtered.forEach((spot) => listEl.appendChild(createSpotCard(spot)));
}

// --- Page initializers ------------------------------------------

function initSpotsPage() {
  const listEl = document.querySelector("[data-sf-spot-list]");
  if (!listEl) return;

  // Initial filter based on URL hash (#workspaces or #cafes)
  let currentFilter = "all";
  if (location.hash === "#workspaces") currentFilter = "workspace";
  if (location.hash === "#cafes") currentFilter = "cafe";

  const tabEls = document.querySelectorAll("[data-sf-filter]");
  tabEls.forEach((btn) => {
    const type = btn.getAttribute("data-sf-filter");
    if (type === currentFilter) {
      btn.classList.add("sf-filter-tab-active");
    } else if (type === "all" && currentFilter === "all") {
      btn.classList.add("sf-filter-tab-active");
    }

    btn.addEventListener("click", () => {
      tabEls.forEach((b) => b.classList.remove("sf-filter-tab-active"));
      btn.classList.add("sf-filter-tab-active");
      currentFilter = type;
      renderSpots(listEl, currentFilter);
    });
  });

  renderSpots(listEl, currentFilter);
}

function initAddSpotForm() {
  const form = document.querySelector("[data-sf-add-form]");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name").trim();
    const city = formData.get("city").trim();
    const type = formData.get("type");
    const wifi = formData.get("wifi");
    const comfort = formData.get("comfort");
    const noise = formData.get("noise");
    const outlets = formData.get("outlets");

    if (!name || !city || !type) return;

    // Simple match score based on comfort + wifi
    let match = 80;
    const comfortNum = Number(comfort) || 3;
    match += (comfortNum - 3) * 3; // -6 .. +6

    if (wifi === "Great") match += 8;
    else if (wifi === "Good") match += 4;
    else if (wifi === "None") match -= 6;

    match = Math.max(60, Math.min(99, match));

    const newSpot = {
      id: `user-${Date.now()}`,
      name,
      type,
      city,
      distanceKm: 1.0,
      img: type === "workspace" ? "assets/img/workspace.jpg" : "assets/img/cafe.jpg",
      match,
      wifi,
      noise,
      outlets,
      comfort:
        comfortNum >= 4 ? "High" : comfortNum <= 2 ? "Low" : "Medium",
    };

    spots.push(newSpot);
    saveSpots(spots);

    // Simple UX: redirect to spots list
    window.location.href = "spots.html";
  });
}

// --- Boot --------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  initSpotsPage();
  initAddSpotForm();
});
