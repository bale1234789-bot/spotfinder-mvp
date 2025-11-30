/* SpotFinder MVP Data + Rendering */

// Dummy spots data for MVP
const spots = [
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
      outlets: 5
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
      outlets: 3
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
      outlets: 4
    }
  }
];

/* Render Cards on spots.html */
function loadSpotCards(filterType = "all") {
  const list = document.getElementById("sf-spot-list");
  if (!list) return;

  list.innerHTML = ""; // Clear existing cards

  const filtered = filterType === "all"
    ? spots
    : spots.filter(s => s.type === filterType);

  filtered.forEach(spot => {
    const card = document.createElement("a");
    card.href = "#"; // detail page future
    card.className = "sf-spot-card";

    card.innerHTML = `
      <img src="${spot.image}" class="sf-spot-img" />
      <div class="sf-spot-main">
        <h3 class="sf-spot-name">${spot.name}</h3>
        <p class="sf-spot-location">${spot.location} • ${spot.distance}</p>
        <div class="sf-spot-meta">
          <span class="sf-match-pill">${spot.match}% Match</span>
          <div class="sf-mini-metrics">
            <span>🪑 ${spot.metrics.comfort}</span>
            <span>🔇 ${spot.metrics.noise}</span>
            <span>🔌 ${spot.metrics.outlets}</span>
          </div>
        </div>
      </div>
    `;

    list.appendChild(card);
  });
}

/* Filters */
function setupFilters() {
  const tabs = document.querySelectorAll(".sf-filter-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("sf-filter-tab-active"));
      tab.classList.add("sf-filter-tab-active");

      const type = tab.dataset.type;
      loadSpotCards(type);
    });
  });
}

// Auto-run on spots.html
window.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("sf-spot-list")) {
    loadSpotCards("all");
    setupFilters();
  }
});
