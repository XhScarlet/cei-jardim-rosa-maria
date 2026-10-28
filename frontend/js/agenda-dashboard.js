const AGENDA_API_URL = "http://localhost:8080/api/agenda";
const agendaCalendar = document.querySelector("[data-agenda-calendar]");
const agendaTitle = document.querySelector("[data-agenda-title]");
const agendaNextList = document.querySelector("[data-agenda-next-list]");
const agendaMenu = document.querySelector("[data-agenda-menu]");
const agendaModal = document.querySelector("[data-agenda-modal]");
const agendaModalTitle = document.querySelector("[data-agenda-modal-title]");
const agendaForm = document.querySelector("[data-agenda-form]");
const agendaUserFeedback = document.querySelector("[data-agenda-user-feedback]");
const agendaSubmitButton = document.querySelector("[data-agenda-submit]");
const agendaAltView = document.querySelector("[data-agenda-alt-view]");
const agendaViewButtons = document.querySelectorAll("[data-agenda-view]");
const agendaFeedback = document.querySelector("[data-agenda-feedback]");
const agendaEvents = [];
const loggedAgendaUser = JSON.parse(localStorage.getItem("ceiDashboardUser") || "null");
const hasAgendaUserIds = Number.isInteger(Number(loggedAgendaUser?.idDirecao))
  && Number(loggedAgendaUser.idDirecao) > 0;
let currentAgendaMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let selectedAgendaEventId = null;
let menuAgendaEventId = null;

const agendaCategoryClass = {
  reuniao: "agenda-event-reuniao",
  projeto: "agenda-event-projeto",
  especial: "agenda-event-especial",
  formacao: "agenda-event-formacao",
  pedagogica: "agenda-event-pedagogica",
  outros: "agenda-event-outros",
};

function getAgendaCategory(type) {
  const normalizedType = (type || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (normalizedType.includes("reuniao")) return "reuniao";
  if (normalizedType.includes("projeto")) return "projeto";
  if (normalizedType.includes("especial") || normalizedType.includes("feriado")) return "especial";
  if (normalizedType.includes("formacao")) return "formacao";
  if (normalizedType.includes("pedagog")) return "pedagogica";
  return "outros";
}

function parseAgendaDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getLocalDateValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatAgendaMonth(date) {
  const label = date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function compareAgendaEvents(first, second) {
  return first.dataAgenda.localeCompare(second.dataAgenda) || first.idAgenda - second.idAgenda;
}

function showAgendaFeedback(message, isError = false) {
  if (!agendaFeedback) return;
  agendaFeedback.textContent = message;
  agendaFeedback.classList.toggle("agenda-feedback-error", isError);
  agendaFeedback.hidden = !message;
}

async function requestAgenda(url = AGENDA_API_URL, options = {}) {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error("Não foi possível conectar à agenda. Verifique se o servidor está em execução.");
  }

  if (!response.ok) {
    const responseText = await response.text();
    let responseMessage = responseText || `A operação falhou (HTTP ${response.status}).`;
    if (responseText) {
      try {
        const errorBody = JSON.parse(responseText);
        responseMessage = errorBody.detail || errorBody.message || errorBody.error || responseText;
      } catch (error) {
        if (!(error instanceof SyntaxError)) throw error;
      }
    }
    throw new Error(responseMessage);
  }

  if (response.status === 204) return null;
  return response.json();
}

function createAgendaEventButton(event) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `agenda-calendar-event ${agendaCategoryClass[getAgendaCategory(event.tipoAgenda)]}`;
  button.dataset.agendaEventId = event.idAgenda;
  button.setAttribute("aria-label", `Editar evento ${event.recadoAgenda}`);

  const marker = document.createElement("span");
  const title = document.createElement("strong");
  title.textContent = event.recadoAgenda;
  button.append(marker, title);
  return button;
}

function getAgendaCalendarCells(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const start = new Date(year, month, 1 - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const cellDate = new Date(start);
    cellDate.setDate(start.getDate() + index);
    return {
      date: cellDate,
      muted: cellDate.getMonth() !== month,
    };
  });
}

function createAgendaListItem(event) {
  const category = getAgendaCategory(event.tipoAgenda);
  const item = document.createElement("article");
  item.className = "agenda-next-item";

  const date = document.createElement("time");
  date.className = `agenda-next-date ${agendaCategoryClass[category]}`;
  date.dateTime = event.dataAgenda;
  date.append(
    document.createTextNode(String(parseAgendaDate(event.dataAgenda).getDate()).padStart(2, "0")),
  );
  const monthLabel = document.createElement("span");
  monthLabel.textContent = parseAgendaDate(event.dataAgenda)
    .toLocaleDateString("pt-BR", { month: "short" })
    .replace(".", "")
    .toUpperCase();
  date.appendChild(monthLabel);

  const dot = document.createElement("span");
  dot.className = `agenda-next-dot ${agendaCategoryClass[category]}`;

  const info = document.createElement("div");
  info.className = "agenda-next-info";
  const title = document.createElement("h4");
  title.textContent = event.recadoAgenda;
  const details = document.createElement("p");
  details.textContent = `${event.tipoAgenda} · ${parseAgendaDate(event.dataAgenda).toLocaleDateString("pt-BR")}`;
  const status = document.createElement("p");
  status.textContent = event.statusAgenda;
  info.append(title, details, status);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "agenda-next-actions";
  button.setAttribute("aria-label", `Ações do evento ${event.recadoAgenda}`);
  button.dataset.agendaAction = event.idAgenda;
  const icon = document.createElement("img");
  icon.src = "../assets/figma-dashboard/more-vertical.svg";
  icon.alt = "";
  icon.setAttribute("aria-hidden", "true");
  button.appendChild(icon);

  item.append(date, dot, info, button);
  return item;
}

function renderAgendaSummary() {
  const year = currentAgendaMonth.getFullYear();
  const month = currentAgendaMonth.getMonth();
  const monthEvents = agendaEvents.filter((event) => {
    const date = parseAgendaDate(event.dataAgenda);
    return date.getFullYear() === year && date.getMonth() === month;
  });
  const meetingCount = monthEvents.filter((event) => getAgendaCategory(event.tipoAgenda) === "reuniao").length;
  const specialCount = monthEvents.filter((event) => getAgendaCategory(event.tipoAgenda) === "especial").length;
  const otherCount = monthEvents.length - meetingCount - specialCount;

  document.querySelector('[data-agenda-count="month"]').textContent = monthEvents.length;
  document.querySelector('[data-agenda-count="meetings"]').textContent = meetingCount;
  document.querySelector('[data-agenda-count="special"]').textContent = specialCount;
  document.querySelector('[data-agenda-count="other"]').textContent = otherCount;
}

function renderAgendaCalendar() {
  if (!agendaCalendar) return;

  agendaCalendar.replaceChildren();
  if (agendaTitle) agendaTitle.textContent = formatAgendaMonth(currentAgendaMonth);

  ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"].forEach((day) => {
    const weekday = document.createElement("div");
    weekday.className = "agenda-weekday";
    weekday.textContent = day;
    agendaCalendar.appendChild(weekday);
  });

  getAgendaCalendarCells(currentAgendaMonth).forEach(({ date, muted }) => {
    const dayCell = document.createElement("div");
    dayCell.className = "agenda-day";
    dayCell.classList.toggle("agenda-day-muted", muted);
    dayCell.classList.toggle(
      "agenda-day-today",
      date.toDateString() === new Date().toDateString(),
    );

    const number = document.createElement("span");
    number.className = "agenda-day-number";
    number.textContent = date.getDate();
    dayCell.appendChild(number);

    const dayEvents = agendaEvents
      .filter((event) => parseAgendaDate(event.dataAgenda).toDateString() === date.toDateString())
      .sort(compareAgendaEvents);
    if (dayEvents[0]) dayCell.appendChild(createAgendaEventButton(dayEvents[0]));
    if (dayEvents.length > 1) {
      const more = document.createElement("button");
      more.type = "button";
      more.className = "agenda-calendar-more";
      more.dataset.agendaDayEvents = getLocalDateValue(date);
      more.textContent = `+${dayEvents.length - 1}`;
      more.setAttribute("aria-label", `Ver os outros ${dayEvents.length - 1} eventos do dia`);
      dayCell.appendChild(more);
    }

    agendaCalendar.appendChild(dayCell);
  });

  renderAgendaSummary();
}

function renderAgendaNextEvents() {
  if (!agendaNextList) return;
  const today = getLocalDateValue();
  const upcomingEvents = [...agendaEvents]
    .filter((event) => event.dataAgenda >= today)
    .sort(compareAgendaEvents)
    .slice(0, 5);

  if (upcomingEvents.length === 0) {
    const empty = document.createElement("p");
    empty.className = "agenda-empty";
    empty.textContent = "Nenhum evento futuro.";
    agendaNextList.replaceChildren(empty);
    return;
  }
  agendaNextList.replaceChildren(...upcomingEvents.map(createAgendaListItem));
}

function renderAgendaAlternateView(view, dateFilter = null) {
  if (!agendaAltView) return;
  agendaAltView.replaceChildren();

  let events = [...agendaEvents].sort(compareAgendaEvents);
  if (dateFilter) events = events.filter((event) => event.dataAgenda === dateFilter);
  if (view === "week") {
    const referenceDate = new Date();
    if (
      referenceDate.getFullYear() !== currentAgendaMonth.getFullYear() ||
      referenceDate.getMonth() !== currentAgendaMonth.getMonth()
    ) {
      referenceDate.setFullYear(currentAgendaMonth.getFullYear(), currentAgendaMonth.getMonth(), 1);
    }
    const weekStart = new Date(referenceDate);
    weekStart.setDate(referenceDate.getDate() - referenceDate.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    events = events.filter((event) => {
      const date = parseAgendaDate(event.dataAgenda);
      return date >= weekStart && date <= weekEnd;
    });
  }

  if (events.length === 0) {
    const empty = document.createElement("p");
    empty.className = "agenda-empty";
    empty.textContent = view === "week" ? "Nenhum evento nesta semana." : "Nenhum evento cadastrado.";
    agendaAltView.appendChild(empty);
    return;
  }

  agendaAltView.append(...events.map(createAgendaListItem));
}

function closeAgendaMenu() {
  if (agendaMenu) agendaMenu.hidden = true;
  menuAgendaEventId = null;
}

function openAgendaMenu(button) {
  if (!agendaMenu) return;
  const rect = button.getBoundingClientRect();
  agendaMenu.hidden = false;
  menuAgendaEventId = button.dataset.agendaAction;
  agendaMenu.style.left = `${Math.max(12, Math.min(rect.left - agendaMenu.offsetWidth + rect.width, window.innerWidth - agendaMenu.offsetWidth - 12))}px`;
  agendaMenu.style.top = `${Math.min(rect.bottom + 6, window.innerHeight - agendaMenu.offsetHeight - 12)}px`;
}

function openAgendaModal(eventToEdit = null) {
  selectedAgendaEventId = eventToEdit?.idAgenda ?? null;
  agendaModalTitle.textContent = eventToEdit ? "Editar evento" : "Novo evento";
  agendaForm.elements.recadoAgenda.value = eventToEdit?.recadoAgenda ?? "";
  agendaForm.elements.dataAgenda.value = eventToEdit?.dataAgenda ?? getLocalDateValue();
  agendaForm.elements.tipoAgenda.value = eventToEdit?.tipoAgenda ?? "Outros";
  agendaForm.elements.statusAgenda.value = eventToEdit?.statusAgenda ?? "Ativo";
  agendaForm.elements.idDirecao.value = loggedAgendaUser?.idDirecao ?? "";
  agendaUserFeedback.textContent = hasAgendaUserIds
    ? ""
    : "Não foi possível identificar a direção vinculada a este login. Saia e entre novamente para atualizar seus dados.";
  agendaUserFeedback.hidden = hasAgendaUserIds;
  agendaSubmitButton.disabled = !hasAgendaUserIds;
  agendaModal.hidden = false;
  agendaForm.elements.recadoAgenda.focus();
}

async function loadAgendaEvents() {
  try {
    const events = await requestAgenda();
    if (!Array.isArray(events)) throw new Error("A resposta da agenda está em formato inválido.");
    agendaEvents.splice(0, agendaEvents.length, ...events);
    agendaEvents.sort(compareAgendaEvents);
    renderAgendaCalendar();
    renderAgendaNextEvents();
    const activeView = document.querySelector("[data-agenda-view].agenda-view-active")?.dataset.agendaView;
    if (activeView && activeView !== "month") renderAgendaAlternateView(activeView);
    showAgendaFeedback("");
    return true;
  } catch (error) {
    showAgendaFeedback(error.message, true);
    return false;
  }
}

agendaNextList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-agenda-action]");
  if (!button) return;
  event.stopPropagation();
  openAgendaMenu(button);
});

agendaAltView?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-agenda-action]");
  if (!button) return;
  event.stopPropagation();
  openAgendaMenu(button);
});

agendaCalendar?.addEventListener("click", (event) => {
  const moreButton = event.target.closest("[data-agenda-day-events]");
  if (moreButton) {
    agendaViewButtons.forEach((button) => {
      const isList = button.dataset.agendaView === "list";
      button.classList.toggle("agenda-view-active", isList);
    });
    agendaCalendar.hidden = true;
    agendaAltView.hidden = false;
    renderAgendaAlternateView("list", moreButton.dataset.agendaDayEvents);
    return;
  }

  const button = event.target.closest("[data-agenda-event-id]");
  if (!button) return;
  const selectedEvent = agendaEvents.find((item) => String(item.idAgenda) === button.dataset.agendaEventId);
  if (selectedEvent) openAgendaModal(selectedEvent);
});

document.querySelector("[data-agenda-prev]")?.addEventListener("click", () => {
  currentAgendaMonth = new Date(currentAgendaMonth.getFullYear(), currentAgendaMonth.getMonth() - 1, 1);
  renderAgendaCalendar();
});

document.querySelector("[data-agenda-next]")?.addEventListener("click", () => {
  currentAgendaMonth = new Date(currentAgendaMonth.getFullYear(), currentAgendaMonth.getMonth() + 1, 1);
  renderAgendaCalendar();
});

document.querySelector("[data-agenda-today]")?.addEventListener("click", () => {
  const today = new Date();
  currentAgendaMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  renderAgendaCalendar();
});

agendaViewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    agendaViewButtons.forEach((viewButton) => {
      viewButton.classList.toggle("agenda-view-active", viewButton === button);
    });
    const isMonth = button.dataset.agendaView === "month";
    agendaCalendar.hidden = !isMonth;
    agendaAltView.hidden = isMonth;
    if (!isMonth) renderAgendaAlternateView(button.dataset.agendaView);
  });
});

document.querySelector("[data-agenda-new-event]")?.addEventListener("click", () => openAgendaModal());

document.querySelector("[data-agenda-modal-close]")?.addEventListener("click", () => {
  agendaModal.hidden = true;
});

agendaForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = {
    recadoAgenda: agendaForm.elements.recadoAgenda.value.trim(),
    dataAgenda: agendaForm.elements.dataAgenda.value,
    tipoAgenda: agendaForm.elements.tipoAgenda.value,
    idDirecao: Number(loggedAgendaUser.idDirecao),
    statusAgenda: agendaForm.elements.statusAgenda.value,
  };
  const isEditing = selectedAgendaEventId !== null;

  try {
    await requestAgenda(
      isEditing ? `${AGENDA_API_URL}/${selectedAgendaEventId}` : AGENDA_API_URL,
      {
        method: isEditing ? "PUT" : "POST",
        body: JSON.stringify(payload),
      },
    );
    agendaModal.hidden = true;
    if (await loadAgendaEvents()) {
      showAgendaFeedback(isEditing ? "Evento atualizado." : "Evento criado.");
    }
  } catch (error) {
    showAgendaFeedback(error.message, true);
  }
});

agendaMenu?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-agenda-action]");
  const action = button?.dataset.agendaAction;
  const selectedEvent = agendaEvents.find((item) => String(item.idAgenda) === menuAgendaEventId);
  if (!action || !selectedEvent) return;

  closeAgendaMenu();
  if (action === "editar") {
    openAgendaModal(selectedEvent);
    return;
  }
  if (action !== "excluir") return;
  if (!window.confirm(`Excluir o evento "${selectedEvent.recadoAgenda}"?`)) return;

  try {
    await requestAgenda(`${AGENDA_API_URL}/${selectedEvent.idAgenda}`, { method: "DELETE" });
    if (await loadAgendaEvents()) showAgendaFeedback("Evento excluído.");
  } catch (error) {
    showAgendaFeedback(error.message, true);
  }
});

document.addEventListener("click", (event) => {
  if (agendaMenu && !agendaMenu.hidden && !agendaMenu.contains(event.target)) closeAgendaMenu();
  if (event.target === agendaModal) agendaModal.hidden = true;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAgendaMenu();
    if (agendaModal) agendaModal.hidden = true;
  }
});

loadAgendaEvents();
