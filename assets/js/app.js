/* ============================
   SpotFinder MVP – Data + Logic
   ============================ */

// Default spots (hard-coded)
const defaultSpots = [
  {
    name: "Tim Hortons – تيم هورتنز",
    type: "cafe",
    location: "Khobar, Saudi Arabia",
    distance: "0.3 km",
    match: 98,
    image: "assets/img/tim.jpg",
    metrics: {
      comfort: "High",
      temperature: "Balanced",
      noise: "Quiet Zone",
      wifi: "Stable WiFi",
      outlets: "5"
    }
  },
  {
    name: "Equal – إيكوال",
    type: "cafe",
    location: "Khobar, Saudi Arabia",
    distance: "2.8 km",
    match: 92,
    image: "assets/img/equal.jpg",
    metrics: {
      comfort: "Medium",
      temperature: "Warm",
      noise: "Moderate",
      wifi: "Available",
      outlets: "3"
    }
  },
  {
    name: "Tulum Café – كافيه تولوم",
    type: "cafe",
    location: "Khobar, Saudi Arabia",
    distance: "2.7 km",
    match: 90,
    image: "assets/img/tulum.jpg",
    metrics: {
      comfort: "High",
      temperature: "Cold",
      noise: "Quiet",
      wifi: "Available",
      outlets: "4"
    }
  }
];

/* ================
   LocalStorage utils
   ================ */

const STORAGE_KEY = "spotfinder_custom_spots";

function getStoredSpots() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Could not read stored spots", e);
    return [];
  }
}

function saveStoredSpots(spots) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(spots));
  } catch (e) {
    console.warn("Could not save spots", e);
  }
}

/* ====================
   Rendering spot cards
   ==================== */

function renderSpots(filterType = "all", data = []) {
  const listEl = document.getElementById("sf-spot-list");
  if (!listEl) return;

  listEl.innerHTML = "";

  const filtered = data.filter((spot) =>
    filterType === "all" ? true : spot.type === filterType
  );

  filtered.forEach((spot) => {
    const card = document.createElement("a");
    card.href = "#"; // later: link to detail page
    card.className = "sf-spot-card";

    const imgSrc = spot.image || "assets/img/cafe.jpg";

    card.innerHTML = `
      <img src="${imgSrc}" alt="${spot.name}" class="sf-spot-img" />
      <div class="sf-spot-main">
        <h2 class="sf-spot-name">${spot.name}</h2>
        <p class="sf-spot-location">
          ${spot.location || ""} ${spot.distance ? "• " + spot.distance : ""}
        </p>
        <div class="sf-spot-meta">
          <span class="sf-match-pill">${spot.match || 90}% Match</span>
          <div class="sf-mini-metrics">
            <span>🪑 ${spot.metrics?.comfort || "-"}</span>
            <span>🔇 ${spot.metrics?.noise || "-"}</span>
            <span>🔌 ${spot.metrics?.outlets || "-"}</span>
          </div>
        </div>
      </div>
    `;

    listEl.appendChild(card);
  });
}

/* ==========
   Filters
   ========== */

function initFilters(allSpots) {
  const tabs = document.querySelectorAll(".sf-filter-tab");
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("sf-filter-tab-active"));
      tab.classList.add("sf-filter-tab-active");

      const type = tab.getAttribute("data-type") || "all";
      renderSpots(type, allSpots);
    });
  });
}

/* ====================
   Add-Spot form handler
   ==================== */

function initAddSpotForm() {
  const form = document.querySelector(".sf-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const type = formData.get("type") || "cafe";
    const comfortNum = formData.get("comfort") || "";
    const outletsNum = formData.get("outlets") || "";

    const newSpot = {
      name: formData.get("name") || "Unnamed spot",
      type,
      location: formData.get("location") || "",
      distance: "", // we don't calculate for MVP
      match: 90, // default match score for custom spots
      image: type === "workspace" ? "assets/img/workspace.jpg" : "assets/img/cafe.jpg",
      metrics: {
        comfort: comfortNum ? `${comfortNum}/5` : "",
        temperature: formData.get("temperature") || "",
        noise: formData.get("noise") || "",
        wifi: formData.get("wifi") || "",
        outlets: outletsNum || ""
      }
    };

    const stored = getStoredSpots();
    stored.push(newSpot);
    saveStoredSpots(stored);

    form.reset();
    alert("Spot saved! You can see it now in the Spots page.");
  });
}

/* ==========
   Init
   ========== */

document.addEventListener("DOMContentLoaded", () => {
  const storedSpots = getStoredSpots();
  const allSpots = [...defaultSpots, ...storedSpots];

  // If we're on spots.html, we have a list container
  if (document.getElementById("sf-spot-list")) {
    renderSpots("all", allSpots);
    initFilters(allSpots);
  }

  // If we're on add-spot.html, we have the form
  initAddSpotForm();
});

