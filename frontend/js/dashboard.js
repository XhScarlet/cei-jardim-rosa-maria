const DASHBOARD_ENDPOINTS = {
  blogs: `${window.APP_CONFIG.apiBaseUrl}/api/blogs`,
  agenda: `${window.APP_CONFIG.apiBaseUrl}/api/agenda`,
  documentos: `${window.APP_CONFIG.apiBaseUrl}/api/documentos`,
  acessos: `${window.APP_CONFIG.apiBaseUrl}/api/telemetria/resumo`,
};
const WEEKDAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const dashboardNumberFormatter = new Intl.NumberFormat("pt-BR");

const menuItems = document.querySelectorAll(".dashboard-menu [data-panel-target]");
const panelJumps = document.querySelectorAll("[data-panel-jump]");
const panels = document.querySelectorAll("[data-panel]");
let siteAccessChart = null;

function activatePanel(target, activeMenuItem = null) {
  menuItems.forEach((menuItem) => {
    menuItem.classList.toggle(
      "dashboard-menu-active",
      menuItem === activeMenuItem || menuItem.dataset.panelTarget === target,
    );
  });

  panels.forEach((panel) => {
    const isActive = panel.dataset.panel === target;
    panel.hidden = !isActive;
    panel.classList.toggle("dashboard-panel-active", isActive);
  });

  if (target === "acessos") {
    requestAnimationFrame(() => siteAccessChart?.resize());
  }
}

menuItems.forEach((item) => {
  item.addEventListener("click", () => activatePanel(item.dataset.panelTarget, item));
});

panelJumps.forEach((button) => {
  button.addEventListener("click", () => activatePanel(button.dataset.panelJump));
});

const requestedPanel = new URLSearchParams(window.location.search).get("panel")
  || window.location.hash.replace("#", "");
if (requestedPanel && [...panels].some((panel) => panel.dataset.panel === requestedPanel)) {
  activatePanel(requestedPanel);
}

function setText(selector, value) {
  const element = document.getElementById(selector) || document.querySelector(selector);
  if (element) element.textContent = value;
}

function formatNumber(value) {
  return dashboardNumberFormatter.format(Number(value) || 0);
}

function firstValue(record, names, fallback = "") {
  if (!record || typeof record !== "object") return fallback;
  for (const name of names) {
    const value = record[name];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return fallback;
}

function toCalendarDateKey(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return [
      value.getFullYear(),
      String(value.getMonth() + 1).padStart(2, "0"),
      String(value.getDate()).padStart(2, "0"),
    ].join("-");
  }

  const dateText = String(value ?? "").trim();
  const isoDate = dateText.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoDate) {
    const [, year, month, day] = isoDate;
    return isValidCalendarDate(year, month, day) ? `${year}-${month}-${day}` : null;
  }

  const brazilianDate = dateText.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (brazilianDate) {
    const [, day, month, year] = brazilianDate;
    return isValidCalendarDate(year, month, day) ? `${year}-${month}-${day}` : null;
  }

  const parsedDate = new Date(dateText);
  if (Number.isNaN(parsedDate.getTime())) return null;
  return toCalendarDateKey(parsedDate);
}

function isValidCalendarDate(year, month, day) {
  const parsed = new Date(Number(year), Number(month) - 1, Number(day));
  return parsed.getFullYear() === Number(year)
    && parsed.getMonth() === Number(month) - 1
    && parsed.getDate() === Number(day);
}

function normalizeStatus(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();
}

function isActiveAgendaStatus(value) {
  return ["A", "ATIVO", "ACTIVE", "TRUE", "1"].includes(normalizeStatus(value));
}

function isPublishedBlogStatus(value) {
  return ["A", "ATIVO", "ACTIVE", "PUBLICADO", "PUBLISHED", "TRUE", "1"]
    .includes(normalizeStatus(value));
}

function isTodayOrFuture(dateKey) {
  const eventDate = new Date(`${dateKey}T00:00:00`);
  const today = new Date();
  eventDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return !Number.isNaN(eventDate.getTime()) && eventDate >= today;
}

function formatDate(value) {
  const dateKey = toCalendarDateKey(value);
  if (!dateKey) return "Data não informada";
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR");
}

function formatTime(value) {
  if (!value) return "Horário a definir";
  return String(value).slice(0, 5).replace(":", "h");
}

function showDashboardFeedback(message = "") {
  const feedback = document.querySelector("[data-dashboard-feedback]");
  if (!feedback) return;
  feedback.textContent = message;
  feedback.hidden = !message;
}

function createPublicationItem(post, index) {
  const item = document.createElement("div");
  item.className = "publication-item";

  const thumbnail = document.createElement("img");
  thumbnail.src = [
    "../assets/figma-dashboard/calendario-ii.png",
    "../assets/figma-dashboard/image-62.png",
    "../assets/figma-dashboard/image-58.png",
  ][index % 3];
  thumbnail.alt = "";
  thumbnail.setAttribute("aria-hidden", "true");

  const details = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = post.titulo || "Publicação sem título";
  const category = document.createElement("span");
  category.textContent = post.categoria || "Sem categoria";
  const summary = document.createElement("p");
  summary.textContent = `Publicado em ${formatDate(post.dataPublicacao)} · ${formatNumber(post.visualizacoes)} visualizações`;
  details.append(title, category, summary);

  const actions = document.createElement("button");
  actions.type = "button";
  actions.className = "publication-more-button";
  actions.setAttribute("aria-label", `Abrir ações da publicação ${title.textContent}`);
  const icon = document.createElement("img");
  icon.className = "publication-more";
  icon.src = "../assets/figma-dashboard/more-vertical.svg";
  icon.alt = "";
  icon.setAttribute("aria-hidden", "true");
  actions.appendChild(icon);
  actions.addEventListener("click", async () => {
    activatePanel("blog");
    await window.ceiOpenBlogActions?.(post.id);
  });

  item.append(thumbnail, details, actions);
  return item;
}

function renderPublications(posts) {
  const container = document.getElementById("dashboard-recent-posts")
    || document.querySelector("[data-dashboard-publications]");
  if (!container) return;

  if (!posts.length) {
    const empty = document.createElement("p");
    empty.className = "dashboard-empty-state";
    empty.textContent = "Nenhuma publicação ativa.";
    container.replaceChildren(empty);
    return;
  }
  container.replaceChildren(...posts.map(createPublicationItem));
}

function renderEvents(events) {
  const container = document.getElementById("dashboard-upcoming-events")
    || document.querySelector("[data-dashboard-events]");
  if (!container) return;

  if (!events.length) {
    const empty = document.createElement("p");
    empty.className = "dashboard-empty-state";
    empty.textContent = "Nenhum evento futuro agendado.";
    container.replaceChildren(empty);
    return;
  }

  container.replaceChildren(...events.map((event, index) => {
    const item = document.createElement("div");
    item.className = `date-item${index % 2 === 0 ? " date-item-soft" : ""}`;

    const date = document.createElement("time");
    date.dateTime = event.data;
    const [year, month, day] = event.data.split("-").map(Number);
    const dayLabel = document.createElement("strong");
    dayLabel.textContent = String(day).padStart(2, "0");
    const monthLabel = document.createElement("span");
    monthLabel.textContent = new Date(year, month - 1, day)
      .toLocaleDateString("pt-BR", { month: "short" })
      .replace(".", "")
      .toUpperCase();
    date.append(dayLabel, monthLabel);

    const details = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = event.titulo || "Evento";
    const time = document.createElement("p");
    const alarm = document.createElement("img");
    alarm.src = "../assets/figma-dashboard/alarm.svg";
    alarm.alt = "";
    alarm.setAttribute("aria-hidden", "true");
    time.append(alarm, document.createTextNode(formatTime(event.horario)));
    const location = document.createElement("p");
    const pin = document.createElement("img");
    pin.src = "../assets/figma-dashboard/location-pin.svg";
    pin.alt = "";
    pin.setAttribute("aria-hidden", "true");
    location.append(pin, document.createTextNode(event.local || "CEI"));
    details.append(title, time, location);
    item.append(date, details);
    return item;
  }));
}

function renderTopPages(pages) {
  const container = document.querySelector("[data-dashboard-top-pages]");
  if (!container) return;

  if (!pages.length) {
    const empty = document.createElement("p");
    empty.className = "dashboard-empty-state";
    empty.textContent = "Ainda não há acessos registrados neste mês.";
    container.replaceChildren(empty);
    return;
  }

  container.replaceChildren(...pages.map((page, index) => {
    const item = document.createElement("p");
    const name = document.createElement("span");
    name.textContent = `${index + 1}. ${page.pagina}`;
    const total = document.createElement("strong");
    total.textContent = formatNumber(page.visualizacoes);
    item.append(name, total);
    return item;
  }));
}

function renderSiteAccessChart(values) {
  const canvas = document.getElementById("siteAccessChart");
  if (!canvas || typeof Chart === "undefined") return;

  const chartData = {
    labels: WEEKDAY_LABELS,
    datasets: [{
      data: values,
      backgroundColor: "#cfdee8",
      borderColor: "#ae5864",
      borderWidth: 1,
      borderRadius: 8,
      borderSkipped: false,
      hoverBackgroundColor: "#97c1de",
    }],
  };

  if (siteAccessChart) {
    siteAccessChart.data = chartData;
    siteAccessChart.update();
    return;
  }

  siteAccessChart = new Chart(canvas.getContext("2d"), {
    type: "bar",
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: 120,
      layout: { padding: { top: 6, right: 8, bottom: 8, left: 2 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#224c64",
          titleFont: { family: "Poppins", weight: "800" },
          bodyFont: { family: "Poppins", weight: "700" },
          displayColors: false,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#224c64",
            padding: 6,
            font: { family: "Poppins", size: 12, weight: "800" },
          },
          border: { display: false },
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(34, 76, 100, 0.18)", borderDash: [4, 4] },
          ticks: {
            color: "#224c64",
            maxTicksLimit: 4,
            padding: 4,
            precision: 0,
            font: { family: "Poppins", size: 11, weight: "700" },
          },
          border: { display: false },
        },
      },
    },
  });
}

function renderDashboard(summary) {
  const { posts, events, documents, accesses } = summary;
  const publishedPosts = Array.isArray(posts)
    ? posts.map((post) => ({
      id: firstValue(post, ["idBlog", "id_blog", "idPost", "id_post", "id"]),
      titulo: firstValue(post, ["tituloBlog", "titulo_blog", "tituloPost", "titulo_post", "title", "titulo"], "Publicação sem título"),
      categoria: firstValue(post, ["categoriaBlog", "categoria_blog", "categoriaPost", "categoria_post", "category", "categoria"], "Sem categoria"),
      dataPublicacao: firstValue(post, ["dataBlog", "data_blog", "dtPost", "dt_post", "dataPublicacao", "data_publicacao"]),
      status: firstValue(post, ["statusBlog", "status_blog", "statusPost", "status_post", "status"]),
    }))
      .filter((post) => isPublishedBlogStatus(post.status))
    .sort((first, second) => String(toCalendarDateKey(second.dataPublicacao) || "")
      .localeCompare(String(toCalendarDateKey(first.dataPublicacao) || "")))
    : [];
  const upcomingEvents = Array.isArray(events)
    ? events.map((event) => {
      const tipo = firstValue(event, ["tipoAgenda", "tipo_agenda", "tipoEvento", "tipo_evento"]);
      return {
        data: toCalendarDateKey(firstValue(event, [
          "dataAgenda", "data_agenda", "dataEvento", "data_evento", "data",
        ])),
        titulo: firstValue(event, [
          "recadoAgenda", "recado_agenda", "tituloAgenda", "titulo_agenda",
          "tituloEvento", "titulo_evento", "titulo", "nome",
        ], tipo || "Evento"),
        horario: firstValue(event, ["horaAgenda", "hora_agenda", "horario", "hora"]),
        local: firstValue(event, ["localAgenda", "local_agenda", "localEvento", "local_evento", "local"]),
        status: firstValue(event, ["statusAgenda", "status_agenda", "ativo", "status"], null),
      };
    })
      .filter((event) => {
        if (!event.data) {
          console.warn("[Dashboard] Evento ignorado: formato de data inválido.", event);
          return false;
        }
        return isActiveAgendaStatus(event.status) && isTodayOrFuture(event.data);
      })
      .sort((first, second) => first.data.localeCompare(second.data)
        || String(first.horario).localeCompare(String(second.horario)))
    : [];
  const viewsByPost = accesses?.visualizacoesPorPost || {};

  setText("dashboard-posts-count", formatNumber(publishedPosts.length));
  setText("dashboard-events-count", formatNumber(upcomingEvents.length));
  setText("dashboard-documents-count", formatNumber(Array.isArray(documents) ? documents.length : 0));
  renderPublications(publishedPosts.slice(0, 3).map((post) => ({
    id: post.id,
    titulo: post.titulo,
    categoria: post.categoria,
    dataPublicacao: post.dataPublicacao,
    visualizacoes: viewsByPost[String(post.id)] || 0,
  })));
  renderEvents(upcomingEvents.slice(0, 3));

  setText("dashboard-access-week", formatNumber(accesses?.totalSemana));
  const weekChartValues = Array.isArray(accesses?.semana) ? accesses.semana : Array(7).fill(0);
  setText("dashboard-week-total", formatNumber(weekChartValues.reduce(
    (total, value) => total + Number(value || 0),
    0,
  )));
  setText("dashboard-today-total", formatNumber(accesses?.hoje));
  setText("dashboard-month-total", formatNumber(accesses?.mes));
  const variation = document.querySelector("[data-dashboard-access-variation]");
  if (variation) {
    const percentage = accesses?.variacaoSemana;
    if (percentage === null || percentage === undefined) {
      variation.textContent = "0%";
      variation.removeAttribute("data-trend");
    } else {
      const rounded = Math.round(percentage);
      variation.dataset.trend = rounded < 0 ? "down" : "up";
      variation.textContent = `${rounded < 0 ? "↓" : "↑"} ${Math.abs(rounded)}%`;
    }
  }

  renderTopPages(Array.isArray(accesses?.paginasMaisAcessadas) ? accesses.paginasMaisAcessadas : []);
  renderSiteAccessChart(weekChartValues);
}

async function requestJson(url, label, expectedType) {
  const response = await window.apiFetch(url, { credentials: "include" });
  const rawBody = await response.text();
  console.log(`[Dashboard] Resposta bruta ${url} (HTTP ${response.status}):`, rawBody);
  if (!response.ok) {
    throw new Error(`${label}: a API respondeu HTTP ${response.status}.`);
  }
  let data;
  try {
    data = JSON.parse(rawBody);
  } catch (error) {
    throw new TypeError(`${label}: a resposta não contém JSON válido.`, { cause: error });
  }
  if (expectedType === "list" && !Array.isArray(data)) {
    throw new TypeError(`${label}: a API não retornou uma lista JSON.`);
  }
  if (expectedType === "object" && (!data || typeof data !== "object" || Array.isArray(data))) {
    throw new TypeError(`${label}: a API não retornou um objeto JSON.`);
  }
  return data;
}

async function loadDashboardOverview() {
  const results = await Promise.all([
    requestJson(DASHBOARD_ENDPOINTS.blogs, "Publicações", "list")
      .catch((error) => {
        console.error("Erro ao carregar as publicações recentes:", error);
        return null;
      }),
    requestJson(DASHBOARD_ENDPOINTS.agenda, "Agenda", "list")
      .catch((error) => {
        console.error("Erro ao carregar os próximos eventos:", error);
        return null;
      }),
    requestJson(DASHBOARD_ENDPOINTS.documentos, "Documentos", "list")
      .catch((error) => {
        console.error("Erro ao carregar a contagem de documentos:", error);
        return null;
      }),
    requestJson(DASHBOARD_ENDPOINTS.acessos, "Telemetria", "object")
      .catch((error) => {
        console.error("Erro ao carregar as métricas de acesso:", error);
        return null;
      }),
  ]);
  const [posts, events, documents, accesses] = results;
  renderDashboard({
    posts: posts || [],
    events: events || [],
    documents: documents || [],
    accesses: accesses || {
      semana: Array(7).fill(0),
      totalSemana: 0,
      variacaoSemana: null,
      hoje: 0,
      mes: 0,
      paginasMaisAcessadas: [],
      visualizacoesPorPost: {},
    },
  });

  if (results.some((result) => result === null)) {
    showDashboardFeedback("Alguns dados não puderam ser carregados. As seções afetadas foram exibidas com valores zerados.");
  } else {
    showDashboardFeedback();
  }
}

window.ceiDashboardAuth = window.apiFetch(
  `${window.APP_CONFIG.apiBaseUrl}/api/auth/session`,
).then(async (response) => {
  if (!response.ok) {
    throw new Error(response.status === 401 ? "Sessão administrativa expirada." : `Falha ao validar a sessão (HTTP ${response.status}).`);
  }
  const user = await response.json();
  localStorage.setItem("ceiDashboardUser", JSON.stringify(user));
  document.querySelectorAll("[data-dashboard-name]").forEach((element) => {
    element.textContent = user.name;
  });
  document.querySelectorAll("[data-dashboard-profile]").forEach((element) => {
    element.textContent = user.profile || "Administrador";
  });
  setText("[data-dashboard-greeting]", `Olá, ${user.name}!`);
  return user;
}).catch((error) => {
  localStorage.removeItem("ceiDashboardUser");
  if (error.message === "Sessão administrativa expirada.") {
    window.location.replace("login.html");
  } else {
    console.error("Não foi possível validar a sessão administrativa:", error);
    showDashboardFeedback("Não foi possível validar sua sessão. Verifique a conexão e tente novamente.");
  }
  return false;
});

window.ceiDashboardAuth.then(async (authenticated) => {
  if (!authenticated || typeof authenticated !== "object") return;
  setText("dashboard-access-week", "0");
  setText("dashboard-posts-count", "0");
  setText("dashboard-events-count", "0");
  setText("dashboard-documents-count", "0");
  setText("dashboard-access-variation", "0%");
  setText("dashboard-week-total", "0");
  setText("dashboard-today-total", "0");
  setText("dashboard-month-total", "0");
  renderPublications([]);
  renderEvents([]);
  renderTopPages([]);
  renderSiteAccessChart(Array(7).fill(0));
  try {
    await loadDashboardOverview();
  } catch (error) {
    console.error("Erro não tratado ao carregar a Visão Geral:", error);
    showDashboardFeedback("Não foi possível carregar a Visão Geral. Os indicadores foram zerados.");
  }
});

document.querySelector("[data-dashboard-logout]")?.addEventListener("click", async (event) => {
  event.preventDefault();
  try {
    const response = await window.apiFetch(`${window.APP_CONFIG.apiBaseUrl}/api/auth/logout`, { method: "POST" });
    if (!response.ok) throw new Error(`O servidor respondeu HTTP ${response.status}.`);
  } catch (error) {
    console.error("Não foi possível encerrar a sessão no servidor:", error);
  } finally {
    localStorage.removeItem("ceiDashboardUser");
    window.location.replace("login.html");
  }
});

document.querySelectorAll("[data-dashboard-action]").forEach((button) => {
  button.addEventListener("click", async () => {
    if (!(await window.ceiDashboardAuth)) return;
    const action = button.dataset.dashboardAction;
    const destination = {
      blog: "blog",
      agenda: "agenda",
      documento: "documentos",
      informacoes: "informacoes-cei",
    }[action];
    if (!destination) return;

    activatePanel(destination);
    const actionSelector = {
      blog: "[data-blog-new-publication]",
      agenda: "[data-agenda-new-event]",
      documento: "[data-documentos-new]",
      informacoes: "[data-info-edit]",
    }[action];
    document.querySelector(actionSelector)?.click();
  });
});
