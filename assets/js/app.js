// =======================================
// SpotFinder data
// =======================================

const SPOTS_DATA = [
  {
    id: "tim-hortons-khobar",
    name: "Tim Hortons – تيم هورتنز",
    type: "cafe",
    city: "Khobar, Saudi Arabia",
    distanceKm: 0.3,
    matchScore: 98,
    image: "assets/img/tim-hortons.jpg", // make sure this file exists
    metrics: {
      comfort: "4/5",
      noise: "Quiet",
      wifi: "Fast",
      outlets: "5/5",
      temperature: "Cool"
    },
    tags: ["quiet", "strong-wifi", "many-outlets", "cool-temp"],
    features: [
      "Plenty of power outlets near almost every table.",
      "Stable WiFi, good enough for video calls.",
      "Comfortable seating for long study sessions.",
      "Usually has a quiet zone at the back."
    ],
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Tim+Hortons,+Khobar,+Saudi+Arabia"
  },
  {
    id: "equal-cafe-khobar",
    name: "Equal Café – إيكوال",
    type: "cafe",
    city: "Khobar, Saudi Arabia",
    distanceKm: 2.8,
    matchScore: 92,
    image: "assets/img/equal-cafe.jpg",
    metrics: {
      comfort: "4/5",
      noise: "Moderate",
      wifi: "Fast",
      outlets: "4/5",
      temperature: "Balanced"
    },
    tags: ["strong-wifi", "ergonomic"],
    features: [
      "Modern interior with ergonomic chairs and big tables.",
      "Good WiFi with many people working on laptops.",
      "Great for small group meetings (2–4 people)."
    ],
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Equal+Cafe,+Khobar,+Saudi+Arabia"
  },
  {
    id: "tulum-cafe-khobar",
    name: "Tulum Café – كافيه تولوم",
    type: "cafe",
    city: "Khobar, Saudi Arabia",
    distanceKm: 2.7,
    matchScore: 90,
    image: "assets/img/tulum-cafe.jpg",
    metrics: {
      comfort: "4/5",
      noise: "Quiet",
      wifi: "Good",
      outlets: "4/5",
      temperature: "Cool"
    },
    tags: ["quiet", "many-outlets", "cool-temp"],
    features: [
      "Calm vibe with music at a low volume.",
      "Plenty of wall outlets around the sides.",
      "Nice lighting for late-night study."
    ],
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Tulum+Cafe,+Khobar,+Saudi+Arabia"
  },
  {
    id: "wework-dhahran",
    name: "WeWork Dhahran",
    type: "workspace",
    city: "Dhahran, Saudi Arabia",
    distanceKm: 6.2,
    matchScore: 94,
    image: "assets/img/workspace.jpg",
    metrics: {
      comfort: "5/5",
      noise: "Quiet",
      wifi: "Enterprise",
      outlets: "Every desk",
      temperature: "Balanced"
    },
    tags: ["quiet", "strong-wifi", "many-outlets", "ergonomic"],
    features: [
      "Dedicated desks and ergonomic chairs.",
      "Meeting rooms for teams and calls.",
      "High-speed enterprise WiFi.",
      "Printer / scanner and other office utilities."
    ],
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=WeWork,+Dhahran,+Saudi+Arabia"
  }
];

// =======================================
// Explore page (list)
// =======================================

function initExplorePage() {
  const listEl = document.getElementById("spot-list");
  if (!listEl) return; // not on this page

  const tabCafes = document.getElementById("tab-cafes");
  const tabWorkspaces = document.getElementById("tab-workspaces");
  const filterChips = Array.from(
    document.querySelectorAll(".sf-filter-chip")
  );
  const activeFilterLabel = document.getElementById("active-filter-label");

  let currentCategory = "cafe"; // default: Cafés
  const activeFilters = new Set();

  function updateFilterLabel() {
    if (activeFilters.size === 0) {
      activeFilterLabel.textContent = "No filters";
    } else {
      activeFilterLabel.textContent = Array.from(activeFilters)
        .map((f) => {
          switch (f) {
            case "quiet":
              return "Quiet";
            case "strong-wifi":
              return "Strong WiFi";
            case "many-outlets":
              return "Many outlets";
            case "ergonomic":
              return "Ergonomic seating";
            case "cool-temp":
              return "Cool temp";
            default:
              return f;
          }
        })
        .join(", ");
    }
  }

  function getFilteredSpots() {
    return SPOTS_DATA.filter((spot) => {
      if (spot.type !== currentCategory) return false;
      if (activeFilters.size === 0) return true;
      // every active filter must exist in spot.tags
      for (const filter of activeFilters) {
        if (!spot.tags.includes(filter)) return false;
      }
      return true;
    }).sort((a, b) => b.matchScore - a.matchScore);
  }

  function renderList() {
    const spots = getFilteredSpots();
    listEl.innerHTML = "";

    if (spots.length === 0) {
      listEl.innerHTML =
        '<p class="sf-body-text">No spots match these filters yet.</p>';
      return;
    }

    spots.forEach((spot) => {
      const card = document.createElement("a");
      card.className = "sf-spot-card";
      card.href = `spot.html?id=${encodeURIComponent(spot.id)}`;

      card.innerHTML = `
        <img
          src="${spot.image}"
          alt="${spot.name}"
          class="sf-spot-img"
        />
        <div class="sf-spot-main">
          <p class="sf-spot-name">${spot.name}</p>
          <p class="sf-spot-location">
            ${spot.city} • ${spot.distanceKm.toFixed(1)} km
          </p>
          <div class="sf-spot-meta">
            <span class="sf-match-pill">${spot.matchScore}% Match</span>
            <div class="sf-mini-metrics">
              <span>💺 ${spot.metrics.comfort}</span>
              <span>📶 ${spot.metrics.wifi}</span>
              <span>🔌 ${spot.metrics.outlets}</span>
            </div>
          </div>
        </div>
      `;

      listEl.appendChild(card);
    });
  }

  // category tab handlers
  tabCafes.addEventListener("click", () => {
    currentCategory = "cafe";
    tabCafes.classList.add("sf-category-tab-active");
    tabWorkspaces.classList.remove("sf-category-tab-active");
    renderList();
  });

  tabWorkspaces.addEventListener("click", () => {
    currentCategory = "workspace";
    tabWorkspaces.classList.add("sf-category-tab-active");
    tabCafes.classList.remove("sf-category-tab-active");
    renderList();
  });

  // filter chips toggle
  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter;
      if (activeFilters.has(filter)) {
        activeFilters.delete(filter);
        chip.classList.remove("sf-filter-chip-active");
      } else {
        activeFilters.add(filter);
        chip.classList.add("sf-filter-chip-active");
      }
      updateFilterLabel();
      renderList();
    });
  });

  // initial render
  updateFilterLabel();
  renderList();
}

// =======================================
// Detail page (single spot)
// =======================================

function initDetailPage() {
  const detailContainer = document.getElementById("spot-detail");
  if (!detailContainer) return; // not on this page

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const spot =
    SPOTS_DATA.find((s) => s.id === id) || SPOTS_DATA.find((s) => s.type === "cafe");

  if (!spot) {
    detailContainer.innerHTML =
      '<p class="sf-body-text">Spot not found.</p>';
    return;
  }

  detailContainer.innerHTML = `
    <article class="sf-spot-detail">
      <img
        src="${spot.image}"
        alt="${spot.name}"
        class="sf-detail-img"
      />

      <h1 class="sf-detail-name">${spot.name}</h1>
      <p class="sf-detail-location">
        ${spot.city} • ${spot.distanceKm.toFixed(1)} km
      </p>
      <div class="sf-detail-match">${spot.matchScore}% Match</div>

      <div class="sf-detail-metrics">
        <div class="sf-detail-metric-row">
          <span class="sf-detail-metric-label">Comfort</span>
          <span class="sf-detail-metric-value">${spot.metrics.comfort}</span>
        </div>
        <div class="sf-detail-metric-row">
          <span class="sf-detail-metric-label">Noise</span>
          <span class="sf-detail-metric-value">${spot.metrics.noise}</span>
        </div>
        <div class="sf-detail-metric-row">
          <span class="sf-detail-metric-label">WiFi</span>
          <span class="sf-detail-metric-value">${spot.metrics.wifi}</span>
        </div>
        <div class="sf-detail-metric-row">
          <span class="sf-detail-metric-label">Outlets</span>
          <span class="sf-detail-metric-value">${spot.metrics.outlets}</span>
        </div>
        <div class="sf-detail-metric-row">
          <span class="sf-detail-metric-label">Temperature</span>
          <span class="sf-detail-metric-value">${spot.metrics.temperature}</span>
        </div>
      </div>

      <h2 class="sf-detail-section-title">Why this spot works</h2>
      <ul class="sf-detail-features">
        ${spot.features.map((f) => `<li>${f}</li>`).join("")}
      </ul>

      <div class="sf-bottom-action">
        <button class="sf-primary-btn" id="take-me-btn">
          Take me to the place
        </button>
        <p class="sf-note">
          Opens Google Maps with directions to the spot.
        </p>
      </div>
    </article>
  `;

  const takeMeBtn = document.getElementById("take-me-btn");
  takeMeBtn.addEventListener("click", () => {
    if (spot.mapsUrl) {
      window.open(spot.mapsUrl, "_blank");
    }
  });
}

// =======================================
// Init
// =======================================

document.addEventListener("DOMContentLoaded", () => {
  initExplorePage();
  initDetailPage();
});
