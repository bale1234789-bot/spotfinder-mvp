// === Spot data ===================================================

const spotsData = [
  {
    id: "tim-hortons",
    name: "Tim Hortons – تيم هورتنز",
    type: "cafe",
    image: "assets/img/tim-hortons.jpg", // make sure this file exists
    location: "Khobar, Saudi Arabia • 0.3 km",
    comfort: 4,
    noise: 2, // 1 = very quiet, 5 = very noisy
    wifi: 5,
    outlets: 4,
    temp: 3, // 1 = cold, 3 = balanced, 5 = hot
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Tim+Hortons+Khobar+Saudi+Arabia"
  },
  {
    id: "equal",
    name: "Equal Café – إيكوال",
    type: "cafe",
    image: "assets/img/equal.jpg",
    location: "Khobar, Saudi Arabia • 2.8 km",
    comfort: 4,
    noise: 3,
    wifi: 4,
    outlets: 3,
    temp: 3,
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Equal+Cafe+Khobar+Saudi+Arabia"
  },
  {
    id: "tulum",
    name: "Tulum Café – تولوم",
    type: "cafe",
    image: "assets/img/tulum.jpg",
    location: "Khobar, Saudi Arabia • 2.7 km",
    comfort: 5,
    noise: 2,
    wifi: 4,
    outlets: 4,
    temp: 2,
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Tulum+Cafe+Khobar+Saudi+Arabia"
  },
  {
    id: "wework",
    name: "WeWork – Shared Office",
    type: "workspace",
    image: "assets/img/workspace.jpg",
    location: "Dhahran Techno Valley • 1.4 km",
    comfort: 5,
    noise: 2,
    wifi: 5,
    outlets: 5,
    temp: 3,
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=WeWork+Dhahran+Techno+Valley"
  },
  {
    id: "library",
    name: "KFUPM Library Study Hall",
    type: "workspace",
    image: "assets/img/library.jpg",
    location: "KFUPM Campus • 0.6 km",
    comfort: 4,
    noise: 1,
    wifi: 4,
    outlets: 4,
    temp: 3,
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=KFUPM+Library+Dhahran"
  }
];

// === State =======================================================

let activeCategory = "cafe"; // default: Cafés
const activeFilters = {
  quiet: false,
  strongWifi: false,
  manyOutlets: false,
  ergonomic: false,
  coolTemp: false
};

// === Utility: compute match % based on activeFilters ==============

function computeMatch(spot) {
  // base score; we want it to look nice even with no filters
  let score = 88;

  // Quiet
  if (activeFilters.quiet) {
    score += spot.noise <= 2 ? 7 : -7;
  }

  // Strong WiFi
  if (activeFilters.strongWifi) {
    score += spot.wifi >= 4 ? 6 : -6;
  }

  // Many outlets
  if (activeFilters.manyOutlets) {
    score += spot.outlets >= 4 ? 5 : -5;
  }

  // Ergonomic seating (comfort)
  if (activeFilters.ergonomic) {
    score += spot.comfort >= 4 ? 5 : -5;
  }

  // Cool temperature (slightly on the cold side)
  if (activeFilters.coolTemp) {
    score += spot.temp <= 2 ? 5 : -5;
  }

  if (!Object.values(activeFilters).some(Boolean)) {
    // No filters → just show a nice range
    score += (spot.comfort - 3) * 2;
  }

  // clamp
  score = Math.max(60, Math.min(99, score));
  return Math.round(score);
}

function describeFilters() {
  const active = Object.entries(activeFilters)
    .filter(([, v]) => v)
    .map(([key]) => {
      switch (key) {
        case "quiet":
          return "Quiet";
        case "strongWifi":
          return "Strong WiFi";
        case "manyOutlets":
          return "Many outlets";
        case "ergonomic":
          return "Ergonomic seating";
        case "coolTemp":
          return "Cool temp";
        default:
          return key;
      }
    });

  if (active.length === 0) return "No filters";
  if (active.length === 1) return active[0];
  if (active.length === 2) return active.join(" • ");
  return `${active[0]} + ${active.length - 1} more`;
}

// === Rendering ===================================================

const listEl = document.getElementById("sf-spot-list");
const filterLabelEl = document.getElementById("sf-active-filters-label");

function renderList() {
  if (!listEl) return;

  listEl.innerHTML = "";

  const visibleSpots = spotsData.filter(
    (spot) => spot.type === activeCategory
  );

  visibleSpots.forEach((spot) => {
    const match = computeMatch(spot);

    const card = document.createElement("article");
    card.className = "sf-spot-card";

    const img = document.createElement("img");
    img.className = "sf-spot-img";
    img.src = spot.image;
    img.alt = spot.name;

    const main = document.createElement("div");
    main.className = "sf-spot-main";

    const nameEl = document.createElement("h2");
    nameEl.className = "sf-spot-name";
    nameEl.textContent = spot.name;

    const locEl = document.createElement("p");
    locEl.className = "sf-spot-location";
    locEl.textContent = spot.location;

    const meta = document.createElement("div");
    meta.className = "sf-spot-meta";

    const matchPill = document.createElement("span");
    matchPill.className = "sf-match-pill";
    matchPill.textContent = `${match}% Match`;

    const mini = document.createElement("div");
    mini.className = "sf-mini-metrics";
    mini.innerHTML = `
      <span>☕ Comfort ${spot.comfort}/5</span>
      <span>📶 WiFi ${spot.wifi}/5</span>
      <span>🔌 Outlets ${spot.outlets}/5</span>
    `;

    meta.appendChild(matchPill);
    meta.appendChild(mini);

    // --- NEW: "Open in Maps" button -----------------------------
    const mapBtn = document.createElement("a");
    mapBtn.className = "sf-map-btn";
    mapBtn.href = spot.mapUrl;
    mapBtn.target = "_blank"; // open Google Maps in new tab / app
    mapBtn.rel = "noopener";
    mapBtn.innerHTML = "Open in Maps";

    // -------------------------------------------------------------

    main.appendChild(nameEl);
    main.appendChild(locEl);
    main.appendChild(meta);
    main.appendChild(mapBtn);

    card.appendChild(img);
    card.appendChild(main);

    listEl.appendChild(card);
  });

  if (filterLabelEl) {
    filterLabelEl.textContent = describeFilters();
  }
}

// === Event wiring =================================================

// Category tabs (Cafés / Workspaces)
document.querySelectorAll(".sf-category-tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    const category = btn.getAttribute("data-category");
    if (!category || category === activeCategory) return;

    activeCategory = category;

    document
      .querySelectorAll(".sf-category-tab")
      .forEach((b) => b.classList.remove("sf-category-tab-active"));
    btn.classList.add("sf-category-tab-active");

    renderList();
  });
});

// Filter chips
document.querySelectorAll("[data-filter-chip]").forEach((chip) => {
  chip.addEventListener("click", () => {
    const key = chip.getAttribute("data-filter-chip");
    if (!key || !(key in activeFilters)) return;

    activeFilters[key] = !activeFilters[key];
    chip.classList.toggle("sf-filter-chip-active", activeFilters[key]);

    renderList();
  });
});

// Initial render
renderList();
