const acessosDashboardMock = {
  periodo: "01/09/2026 - 30/09/2026",
  visitantes: {
    labels: ["01/09", "03/09", "05/09", "07/09", "10/09", "12/09", "15/09", "18/09", "20/09", "22/09", "25/09", "27/09", "30/09"],
    values: [165, 145, 190, 178, 210, 185, 250, 170, 315, 220, 185, 230, 295],
  },
  origem: {
    labels: ["Busca Orgânica", "Acesso Rápido", "Redes Sociais", "Sites de Referência", "Outros"],
    values: [42, 28, 18, 8, 4],
  },
};

window.acessosDashboardMock = acessosDashboardMock;

let acessosLineChart = null;
let acessosOriginChart = null;

function createAcessosLineChart() {
  const canvas = document.getElementById("acessosLineChart");

  if (!canvas || typeof Chart === "undefined" || acessosLineChart) {
    return;
  }

  const context = canvas.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, 0, 230);
  gradient.addColorStop(0, "rgba(255, 79, 134, 0.42)");
  gradient.addColorStop(1, "rgba(255, 79, 134, 0.03)");

  acessosLineChart = new Chart(context, {
    type: "line",
    data: {
      labels: acessosDashboardMock.visitantes.labels,
      datasets: [
        {
          data: acessosDashboardMock.visitantes.values,
          borderColor: "#ff4f86",
          backgroundColor: gradient,
          borderWidth: 4,
          pointBackgroundColor: "#ff4f86",
          pointBorderColor: "#ff4f86",
          pointRadius: 4,
          pointHoverRadius: 5,
          fill: true,
          tension: 0.28,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#224c64",
          displayColors: false,
          titleFont: { family: "Poppins", weight: "800" },
          bodyFont: { family: "Poppins", weight: "700" },
        },
      },
      scales: {
        x: {
          grid: { color: "rgba(43, 92, 125, 0.09)" },
          ticks: {
            color: "#2b5c7d",
            maxRotation: 0,
            autoSkip: false,
            font: { family: "Poppins", size: 13, weight: "700" },
          },
          border: { display: false },
        },
        y: {
          min: 0,
          max: 400,
          ticks: {
            stepSize: 100,
            color: "#2b5c7d",
            font: { family: "Poppins", size: 13, weight: "700" },
          },
          grid: { color: "rgba(43, 92, 125, 0.1)" },
          border: { display: false },
        },
      },
    },
  });
}

function createAcessosOriginChart() {
  const canvas = document.getElementById("acessosOriginChart");

  if (!canvas || typeof Chart === "undefined" || acessosOriginChart) {
    return;
  }

  acessosOriginChart = new Chart(canvas.getContext("2d"), {
    type: "doughnut",
    data: {
      labels: acessosDashboardMock.origem.labels,
      datasets: [
        {
          data: acessosDashboardMock.origem.values,
          backgroundColor: ["#ff4f86", "#52b6e9", "#9369ff", "#f4e319", "#36d28c"],
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "55%",
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#224c64",
          displayColors: false,
          callbacks: {
            label: (context) => `${context.label}: ${context.parsed}%`,
          },
          titleFont: { family: "Poppins", weight: "800" },
          bodyFont: { family: "Poppins", weight: "700" },
        },
      },
    },
  });
}

function resizeAcessosCharts() {
  requestAnimationFrame(() => {
    acessosLineChart?.resize();
    acessosOriginChart?.resize();
  });
}

createAcessosLineChart();
createAcessosOriginChart();

document.querySelector('[data-panel-target="acessos"]')?.addEventListener("click", () => {
  setTimeout(resizeAcessosCharts, 80);
});

window.addEventListener("resize", resizeAcessosCharts);
setTimeout(resizeAcessosCharts, 150);
