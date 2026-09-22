const agendaDashboardMock = {
  monthLabel: "Setembro de 2026",
  today: null,
  events: [
    { day: 4, title: "Indicador de Qualidade", calendarTitle: "Indicador de Qualidade", timeLabel: "8h - 12h00", place: "", category: "reuniao" },
    { day: 7, title: "Feriado Nacional, Independência", calendarTitle: "Feriado Independência", timeLabel: "não haverá atendimento", place: "", category: "projeto" },
    { day: 18, title: "Reunião Pedagógica", calendarTitle: "Reunião pedagógica", timeLabel: "não haverá atendimento", place: "", category: "pedagogica" },
    { day: 19, title: "Projeto Leituraço", calendarTitle: "Projeto Leituraço", timeLabel: "9h - 12h", place: "", category: "outros" },
  ],
};

window.ceiAgendaDashboardMock = agendaDashboardMock;

const agendaCalendar = document.querySelector("[data-agenda-calendar]");
const agendaTitle = document.querySelector("[data-agenda-title]");
const agendaNextList = document.querySelector("[data-agenda-next-list]");
const agendaMenu = document.querySelector("[data-agenda-menu]");
const agendaModal = document.querySelector("[data-agenda-modal]");
const agendaAltView = document.querySelector("[data-agenda-alt-view]");
const agendaViewButtons = document.querySelectorAll("[data-agenda-view]");
let currentAgendaMonth = new Date(2026, 8, 1);

const agendaCategoryClass = {
  reuniao: "agenda-event-reuniao",
  projeto: "agenda-event-projeto",
  especial: "agenda-event-especial",
  formacao: "agenda-event-formacao",
  pedagogica: "agenda-event-pedagogica",
  outros: "agenda-event-outros",
};

function createAgendaEventButton(event) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `agenda-calendar-event ${agendaCategoryClass[event.category] || agendaCategoryClass.outros}`;
  button.innerHTML = `<span></span><strong>${event.calendarTitle || event.title}</strong>`;
  button.dataset.agendaEvent = event.title;
  return button;
}

function formatAgendaMonth(date) {
  const label = date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function getAgendaCalendarCells(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const start = new Date(year, month, 1 - firstDay.getDay());

  return Array.from({ length: 35 }, (_, index) => {
    const cellDate = new Date(start);
    cellDate.setDate(start.getDate() + index);

    return {
      label: cellDate.getDate(),
      month: cellDate.getMonth(),
      year: cellDate.getFullYear(),
      muted: cellDate.getMonth() !== month,
    };
  });
}

function renderAgendaCalendar() {
  if (!agendaCalendar) {
    return;
  }

  agendaCalendar.replaceChildren();

  if (agendaTitle) {
    agendaTitle.textContent = formatAgendaMonth(currentAgendaMonth);
  }

  ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"].forEach((day) => {
    const weekday = document.createElement("div");
    weekday.className = "agenda-weekday";
    weekday.textContent = day;
    agendaCalendar.appendChild(weekday);
  });

  const cells = getAgendaCalendarCells(currentAgendaMonth);

  cells.forEach((cell) => {
    const dayCell = document.createElement("div");
    dayCell.className = "agenda-day";
    dayCell.classList.toggle("agenda-day-muted", cell.muted);
    dayCell.classList.toggle("agenda-day-today", Boolean(agendaDashboardMock.today) && !cell.muted && cell.label === agendaDashboardMock.today);

    const number = document.createElement("span");
    number.className = "agenda-day-number";
    number.textContent = cell.label;
    dayCell.appendChild(number);

    if (!cell.muted && cell.month === 8 && cell.year === 2026) {
      agendaDashboardMock.events
        .filter((event) => event.day === cell.label)
        .forEach((event) => {
          dayCell.appendChild(createAgendaEventButton(event));
        });
    }

    agendaCalendar.appendChild(dayCell);
  });
}

function renderAgendaNextEvents() {
  if (!agendaNextList) {
    return;
  }

  agendaNextList.replaceChildren(
    ...agendaDashboardMock.events.slice(0, 5).map((event) => {
      const item = document.createElement("article");
      item.className = "agenda-next-item";

      const date = document.createElement("time");
      date.className = `agenda-next-date ${agendaCategoryClass[event.category] || agendaCategoryClass.outros}`;
      date.innerHTML = `${String(event.day).padStart(2, "0")}<span>SET</span>`;

      const dot = document.createElement("span");
      dot.className = `agenda-next-dot ${agendaCategoryClass[event.category] || agendaCategoryClass.outros}`;

      const info = document.createElement("div");
      info.className = "agenda-next-info";
      info.innerHTML = `<h4>${event.title}</h4><p>${event.timeLabel}</p>${event.place ? `<p>${event.place}</p>` : ""}`;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "agenda-next-actions";
      button.setAttribute("aria-label", `Ações do evento ${event.title}`);
      button.dataset.agendaAction = event.title;
      button.innerHTML = '<img src="../assets/figma-dashboard/more-vertical.svg" alt="" aria-hidden="true" />';

      item.append(date, dot, info, button);
      return item;
    }),
  );
}

function closeAgendaMenu() {
  if (agendaMenu) {
    agendaMenu.hidden = true;
  }
}

function openAgendaMenu(button) {
  if (!agendaMenu) {
    return;
  }

  const rect = button.getBoundingClientRect();
  agendaMenu.hidden = false;
  agendaMenu.style.left = `${Math.min(rect.left - agendaMenu.offsetWidth + rect.width, window.innerWidth - agendaMenu.offsetWidth - 12)}px`;
  agendaMenu.style.top = `${Math.min(rect.bottom + 6, window.innerHeight - agendaMenu.offsetHeight - 12)}px`;
}

agendaNextList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-agenda-action]");

  if (!button) {
    return;
  }

  event.stopPropagation();
  openAgendaMenu(button);
});

document.querySelector("[data-agenda-prev]")?.addEventListener("click", () => {
  currentAgendaMonth = new Date(currentAgendaMonth.getFullYear(), currentAgendaMonth.getMonth() - 1, 1);
  renderAgendaCalendar();
});

document.querySelector("[data-agenda-next]")?.addEventListener("click", () => {
  currentAgendaMonth = new Date(currentAgendaMonth.getFullYear(), currentAgendaMonth.getMonth() + 1, 1);
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

    if (!isMonth) {
      agendaAltView.textContent =
        button.dataset.agendaView === "week"
          ? "Visualização semanal mockada para futura evolução."
          : "Lista mockada de eventos para futura evolução.";
    }
  });
});

document.querySelector("[data-agenda-new-event]")?.addEventListener("click", () => {
  agendaModal.hidden = false;
});

document.querySelector("[data-agenda-modal-close]")?.addEventListener("click", () => {
  agendaModal.hidden = true;
});

document.querySelector("[data-agenda-view-all]")?.addEventListener("click", () => {
  document.querySelector('[data-agenda-view="list"]')?.click();
});

document.addEventListener("click", (event) => {
  if (agendaMenu && !agendaMenu.hidden && !agendaMenu.contains(event.target)) {
    closeAgendaMenu();
  }

  if (event.target === agendaModal) {
    agendaModal.hidden = true;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAgendaMenu();

    if (agendaModal) {
      agendaModal.hidden = true;
    }
  }
});

renderAgendaCalendar();
renderAgendaNextEvents();
