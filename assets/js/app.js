// Basic SPA-ish navigation and simple countdown for the waiting screen

function showScreen(id) {
  const screens = document.querySelectorAll(".sf-screen");
  screens.forEach((s) => s.classList.remove("sf-screen-active"));
  const target = document.getElementById("screen-" + id);
  if (target) {
    target.classList.add("sf-screen-active");
  }
}

// Modals
function openModal(type) {
  const modal = document.getElementById(type + "-modal");
  if (modal) modal.classList.add("sf-modal-active");
}

function closeModal(type) {
  const modal = document.getElementById(type + "-modal");
  if (modal) modal.classList.remove("sf-modal-active");
}

document.addEventListener("DOMContentLoaded", () => {
  // Sort / Filter buttons
  const btnSort = document.getElementById("btn-open-sort");
  const btnFilter = document.getElementById("btn-open-filter");

  if (btnSort) {
    btnSort.addEventListener("click", () => openModal("sort"));
  }
  if (btnFilter) {
    btnFilter.addEventListener("click", () => openModal("filter"));
  }

  // Modal close buttons
  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-close-modal");
      closeModal(type);
    });
  });

  // Clicking backdrop closes modal
  document
    .querySelectorAll(".sf-modal-backdrop")
    .forEach((backdrop) =>
      backdrop.addEventListener("click", () => {
        const parent = backdrop.closest(".sf-modal");
        if (!parent) return;
        parent.classList.remove("sf-modal-active");
      })
    );

  // Home -> Details (Tim Hortons)
  document.querySelectorAll(".js-view-details").forEach((btn) => {
    btn.addEventListener("click", () => {
      showScreen("details");
    });
  });

  // Back buttons
  document.querySelectorAll(".sf-back").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-nav-target");
      if (target) showScreen(target);
    });
  });

  // Details -> Confirm
  const btnOpenConfirm = document.getElementById("btn-open-confirm");
  if (btnOpenConfirm) {
    btnOpenConfirm.addEventListener("click", () => {
      showScreen("confirm");
    });
  }

  // Confirm -> Payment
  const btnConfirmYes = document.getElementById("btn-confirm-yes");
  if (btnConfirmYes) {
    btnConfirmYes.addEventListener("click", () => {
      showScreen("payment");
    });
  }

  // Payment -> Waiting
  const btnGoWaiting = document.getElementById("btn-go-waiting");
  if (btnGoWaiting) {
    btnGoWaiting.addEventListener("click", () => {
      showScreen("waiting");
      startWaitingCountdown();
    });
  }
});

let waitingInterval = null;

function startWaitingCountdown() {
  const timerEl = document.getElementById("waiting-timer");
  if (!timerEl) return;

  // Clear any existing timer
  if (waitingInterval) {
    clearInterval(waitingInterval);
    waitingInterval = null;
  }

  let remaining = 60;
  timerEl.textContent = remaining + "s";

  waitingInterval = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(waitingInterval);
      waitingInterval = null;
      // Auto-move to success screen once time is up
      showScreen("success");
      return;
    }
    timerEl.textContent = remaining + "s";
  }, 1000);
}
