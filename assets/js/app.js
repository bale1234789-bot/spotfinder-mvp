// ---------- DATA ----------
const SF_SPOTS = [
  {
    id: "tim-hortons-khobar",
    name: "Tim Hortons",
    nameAr: "تيم هورتنز",
    type: "cafe",
    city: "Khobar, Saudi Arabia",
    distanceKm: 0.3,
    match: 98,
    comfort: "4/5",
    wifi: "Fast 5/5",
    outlets: "5/5",
    noise: "Quiet",
    temp: "Cool",
    filters: ["quiet", "strongWifi", "manyOutlets", "ergonomic", "coolTemp"],
    img: "tim-hortons.jpg",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Tim+Hortons+Khobar"
  },
  {
    id: "equal-cafe-khobar",
    name: "Equal Café",
    nameAr: "إيكوال",
    type: "cafe",
    city: "Khobar, Saudi Arabia",
    distanceKm: 2.8,
    match: 92,
    comfort: "4/5",
    wifi: "Fast 4/5",
    outlets: "3/5",
    noise: "Moderate",
    temp: "Cool",
    filters: ["strongWifi", "manyOutlets", "ergonomic"],
    img: "equal.jpg",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Equal+Cafe+Khobar"
  },
  {
    id: "tulum-cafe-khobar",
    name: "Tulum Café",
    nameAr: "كافيه تولوم",
    type: "cafe",
    city: "Khobar, Saudi Arabia",
    distanceKm: 2.7,
    match: 90,
    comfort: "4/5",
    wifi: "Good 4/5",
    outlets: "4/5",
    noise: "Quiet",
    temp: "Normal",
    filters: ["quiet", "manyOutlets", "ergonomic"],
    img: "tulum.jpg",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Tulum+Cafe+Khobar"
  },
  {
    id: "wework-dhahran",
    name: "WeWork Dhahran",
    nameAr: "وي وورك الظهران",
    type: "workspace",
    city: "Dhahran, Saudi Arabia",
    distanceKm: 5.1,
    match: 94,
    comfort: "5/5",
    wifi: "Fiber 5/5",
    outlets: "Every table",
    noise: "Quiet Zone",
    temp: "Balanced",
    filters: ["quiet", "strongWifi", "manyOutlets", "ergonomic"],
    img: "wework.jpg",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=WeWork+Dhahran"
  }
];

// ---------- LIST PAGE (index.html) ----------
function initListPage() {
  const listEl = document.getElementById("sf-spot-list");
  if (!listEl) return; // not on index.html

  let activeCategory = "cafe"; // default to cafés
  const activeFilters = new Set();

  const categoryButtons = document.querySelectorAll(".sf-toggle-btn");
  const chipButtons = document.querySelectorAll(".sf-chip");
  const filtersLabel = document.getElementById("sf-active-filters-label");

  function updateFiltersLabel() {
    if (activeFilters.size === 0) {
      filtersLabel.textContent = "No filters";
    } else if (activeFilters.size === 1) {
      filtersLabel.textContent = "1 filter applied";
    } else {
      filtersLabel.textContent = `${activeFilters.size} filters applied`;
    }
  }

  function renderList() {
    listEl.innerHTML = "";

    const visible = SF_SPOTS.filter((spot) => spot.type === activeCategory);

    const filtered = visible.filter((spot) => {
      for (const f of activeFilters) {
        if (!spot.filters.includes(f)) return false;
      }
      return true;
    });

    filtered.forEach((spot) => {
      const a = document.createElement("a");
      a.href = `spot.html?id=${encodeURIComponent(spot.id)}`;
      a.className = "sf-spot-card";

      a.innerHTML = `
        <div class="sf-spot-img-wrap">
          <img src="assets/img/${spot.img}" alt="${spot.name}" class="sf-spot-img" />
        </div>
        <div class="sf-spot-main">
          <h2 class="sf-spot-name">
            ${spot.name} <span class="sf-spot-name-ar">– ${spot.nameAr}</span>
          </h2>
          <p class="sf-spot-location">
            ${spot.city} • ${spot.distanceKm.toFixed(1)} km
          </p>
          <div class="sf-spot-meta">
            <span class="sf-match-pill">${spot.match}% Match</span>
            <div class="sf-mini-metrics">
              <span>🪑 ${spot.comfort}</span>
              <span>📶 ${spot.wifi}</span>
              <span>🔌 ${spot.outlets}</span>
            </div>
          </div>
        </div>
      `;

      listEl.appendChild(a);
    });

    if (filtered.length === 0) {
      const empty = document.createElement("p");
      empty.className = "sf-empty";
      empty.textContent = "No spots match these filters yet.";
      listEl.appendChild(empty);
    }

    updateFiltersLabel();
  }

  // Category buttons
  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      categoryButtons.forEach((b) =>
        b.classList.remove("sf-toggle-btn-active")
      );
      btn.classList.add("sf-toggle-btn-active");
      activeCategory = btn.dataset.category;
      renderList();
    });
  });

  // Filter chips
  chipButtons.forEach((chip) => {
    chip.addEventListener("click", () => {
      const key = chip.dataset.filter;
      if (activeFilters.has(key)) {
        activeFilters.delete(key);
        chip.classList.remove("sf-chip-active");
      } else {
        activeFilters.add(key);
        chip.classList.add("sf-chip-active");
      }
      renderList();
    });
  });

  renderList();
}

// ---------- DETAIL PAGE (spot.html) ----------
function initDetailPage() {
  const container = document.getElementById("sf-spot-detail");
  if (!container) return; // not on spot.html

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const spot =
    SF_SPOTS.find((s) => s.id === id) ||
    SF_SPOTS[0]; // simple fallback if id missing

  container.innerHTML = `
    <section class="sf-hero-spot">
      <img src="assets/img/${spot.img}" alt="${spot.name}" class="sf-hero-img" />
      <div class="sf-hero-overlay"></div>
      <div class="sf-hero-spot-content">
        <h1>${spot.name}</h1>
        <p>${spot.city} • ${spot.distanceKm.toFixed(1)} km away</p>
        <span class="sf-match-pill">${spot.match}% Match</span>
      </div>
    </section>

    <section class="sf-spot-section">
      <h2 class="sf-section-title">Work metrics</h2>
      <div class="sf-metric">
        <div class="sf-metric-main">
          <span class="sf-metric-label">Seating &amp; desk comfort</span>
          <span class="sf-metric-value">🪑 ${spot.comfort}</span>
        </div>
      </div>
      <div class="sf-metric">
        <div class="sf-metric-main">
          <span class="sf-metric-label">WiFi</span>
          <span class="sf-metric-value">📶 ${spot.wifi}</span>
        </div>
      </div>
      <div class="sf-metric">
        <div class="sf-metric-main">
          <span class="sf-metric-label">Outlets</span>
          <span class="sf-metric-value">🔌 ${spot.outlets}</span>
        </div>
      </div>
      <div class="sf-metric">
        <div class="sf-metric-main">
          <span class="sf-metric-label">Noise level</span>
          <span class="sf-metric-value">🔈 ${spot.noise}</span>
        </div>
      </div>
      <div class="sf-metric">
        <div class="sf-metric-main">
          <span class="sf-metric-label">Temperature</span>
          <span class="sf-metric-value">🌡️ ${spot.temp}</span>
        </div>
      </div>
    </section>

    <section class="sf-spot-section">
      <h2 class="sf-section-title">Why this spot works</h2>
      <p class="sf-body-text">
        This place scored highly on the criteria you usually care about:
        comfort, WiFi, outlets, and overall study/work environment.
      </p>
    </section>

    <section class="sf-bottom-action">
      <button id="sf-open-maps" class="sf-primary-btn">
        Take me to the place
      </button>
      <p class="sf-note">
        This will open Google Maps with directions to ${spot.name}.
      </p>
    </section>
  `;

  const backBtn = document.getElementById("sf-back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "index.html";
      }
    });
  }

  const mapsBtn = document.getElementById("sf-open-maps");
  if (mapsBtn) {
    mapsBtn.addEventListener("click", () => {
      window.open(spot.mapsUrl, "_blank");
    });
  }
}

// ---------- INIT ----------
document.addEventListener("DOMContentLoaded", () => {
  initListPage();
  initDetailPage();
});
