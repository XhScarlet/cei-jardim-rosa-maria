/*
  Comportamentos do dashboard da direção.
  Os dados mockados do gráfico podem ser substituídos futuramente pela resposta do backend/API.
*/
const siteAccessChartData = {
  labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
  values: [35, 82, 67, 130, 108, 34, 72],
};

window.ceiDashboardAccessChartData = siteAccessChartData;

const storedUser = JSON.parse(localStorage.getItem("ceiDashboardUser") || "null");

if (storedUser) {
  document.querySelectorAll("[data-dashboard-name]").forEach((element) => {
    element.textContent = storedUser.name;
  });
  document.querySelectorAll("[data-dashboard-profile]").forEach((element) => {
    element.textContent = "Diretora";
  });
  document.querySelector("[data-dashboard-greeting]").textContent = `Olá, ${storedUser.name}!`;
}

const menuItems = document.querySelectorAll(".dashboard-menu [data-panel-target]");
const panelJumps = document.querySelectorAll("[data-panel-jump]");
const panels = document.querySelectorAll("[data-panel]");

function activatePanel(target, activeMenuItem = null) {
  menuItems.forEach((menuItem) => {
    menuItem.classList.toggle("dashboard-menu-active", menuItem === activeMenuItem || menuItem.dataset.panelTarget === target);
  });

  panels.forEach((panel) => {
    const isActive = panel.dataset.panel === target;
    panel.hidden = !isActive;
    panel.classList.toggle("dashboard-panel-active", isActive);
  });
}

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    activatePanel(item.dataset.panelTarget, item);
  });
});

panelJumps.forEach((button) => {
  button.addEventListener("click", () => {
    activatePanel(button.dataset.panelJump);
  });
});

const requestedPanel = new URLSearchParams(window.location.search).get("panel") || window.location.hash.replace("#", "");

if (requestedPanel && document.querySelector(`[data-panel="${requestedPanel}"]`)) {
  activatePanel(requestedPanel);
}

function createSiteAccessChart() {
  const canvas = document.getElementById("siteAccessChart");

  if (!canvas || typeof Chart === "undefined") {
    return;
  }

  const context = canvas.getContext("2d");

  new Chart(context, {
    type: "bar",
    data: {
      labels: window.ceiDashboardAccessChartData.labels,
      datasets: [
        {
          data: window.ceiDashboardAccessChartData.values,
          backgroundColor: "#cfdee8",
          borderColor: "#ae5864",
          borderWidth: 1,
          borderRadius: 8,
          borderSkipped: false,
          hoverBackgroundColor: "#97c1de",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: 120,
      layout: {
        padding: {
          top: 6,
          right: 8,
          bottom: 8,
          left: 2,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#224c64",
          titleFont: {
            family: "Poppins",
            weight: "800",
          },
          bodyFont: {
            family: "Poppins",
            weight: "700",
          },
          displayColors: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#224c64",
            padding: 6,
            font: {
              family: "Poppins",
              size: 12,
              weight: "800",
            },
          },
          border: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(34, 76, 100, 0.18)",
            borderDash: [4, 4],
          },
          ticks: {
            color: "#224c64",
            maxTicksLimit: 4,
            padding: 4,
            precision: 0,
            font: {
              family: "Poppins",
              size: 11,
              weight: "700",
            },
          },
          border: {
            display: false,
          },
        },
      },
    },
  });
}

createSiteAccessChart();

window.ceiDashboardReady = true;
