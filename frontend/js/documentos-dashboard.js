const documentosDashboardMock = [
  {
    title: "Regimento Interno",
    description: "Documento institucional do CEI.",
    category: "Institucional",
    date: "01/08/2026 a 02/09/2026",
    size: "2,4 MB",
    type: "pdf",
    status: "Publicado",
  },
  {
    title: "Calendário escolar 2026",
    description: "Datas importantes e eventos.",
    category: "Calendário",
    date: "01/08/2026 a 02/09/2026",
    size: "2,4 MB",
    type: "doc",
    status: "Publicado",
  },
  {
    title: "Lista de Materiais",
    description: "Materiais por turma",
    category: "Formulários",
    date: "01/08/2026 a 02/09/2026",
    size: "2,4 MB",
    type: "xls",
    status: "Publicado",
  },
  {
    title: "Projeto Político Pedagógico",
    description: "Diretrizes e objetivos do CEI.",
    category: "Pedagógico",
    date: "01/08/2026 a 02/09/2026",
    size: "2,4 MB",
    type: "doc",
    status: "Publicado",
  },
  {
    title: "Autorização de saídas",
    description: "Modelo de autorização para famílias.",
    category: "Formulários",
    date: "01/08/2026 a 02/09/2026",
    size: "2,4 MB",
    type: "pdf",
    status: "Rascunho",
  },
  {
    title: "Cardápio Mensal",
    description: "Alimentação saudável e equilibrada, acompanhamento nutrologo",
    category: "Alimentação",
    date: "01/08/2026 a 02/09/2026",
    size: "2,4 MB",
    type: "doc",
    status: "Publicado",
  },
];

window.ceiDocumentosDashboardMock = documentosDashboardMock;

const documentosList = document.querySelector("[data-documentos-list]");
const documentosSearch = document.querySelector("[data-documentos-search]");
const documentosCategory = document.querySelector("[data-documentos-category]");
const documentosStatus = document.querySelector("[data-documentos-status]");
const documentosEmpty = document.querySelector("[data-documentos-empty]");
const documentosMenu = document.querySelector("[data-documentos-menu]");

const documentosCategoryClass = {
  Institucional: "documentos-dot-institucional",
  Pedagógico: "documentos-dot-pedagogico",
  Formulários: "documentos-dot-formularios",
  Calendário: "documentos-dot-calendario",
  Alimentação: "documentos-dot-alimentacao",
  Saúde: "documentos-dot-saude",
  Financeiro: "documentos-dot-financeiro",
  Outros: "documentos-dot-outros",
};

const documentosIconByType = {
  pdf: "../assets/PDF.svg",
  doc: "../assets/doc.svg",
  xls: "../assets/xls.svg",
};

function closeDocumentosMenu() {
  if (documentosMenu) {
    documentosMenu.hidden = true;
  }
}

function openDocumentosMenu(button) {
  if (!documentosMenu) {
    return;
  }

  documentosMenu.replaceChildren(
    ...["Visualizar", "Baixar", "Editar", "Excluir"].map((label) => {
      const item = document.createElement("button");
      item.type = "button";
      item.textContent = label;
      return item;
    }),
  );

  const rect = button.getBoundingClientRect();
  documentosMenu.hidden = false;
  documentosMenu.style.left = `${Math.min(rect.left - documentosMenu.offsetWidth + rect.width, window.innerWidth - documentosMenu.offsetWidth - 12)}px`;
  documentosMenu.style.top = `${Math.min(rect.bottom + 6, window.innerHeight - documentosMenu.offsetHeight - 12)}px`;
}

function getFilteredDocumentos() {
  const searchValue = (documentosSearch?.value || "").trim().toLowerCase();
  const categoryValue = documentosCategory?.value || "todos";
  const statusValue = documentosStatus?.value || "todos";

  return documentosDashboardMock.filter((documento) => {
    const matchesSearch = documento.title.toLowerCase().includes(searchValue);
    const matchesCategory = categoryValue === "todos" || documento.category === categoryValue;
    const matchesStatus = statusValue === "todos" || documento.status === statusValue;
    return matchesSearch && matchesCategory && matchesStatus;
  });
}

function createDocumentoRow(documento) {
  const row = document.createElement("article");
  row.className = "documentos-row";

  const name = document.createElement("div");
  name.className = "documentos-name-cell";
  name.innerHTML = `
    <img class="documentos-file-icon" src="${documentosIconByType[documento.type] || documentosIconByType.doc}" alt="" aria-hidden="true" />
    <div>
      <h3>${documento.title}</h3>
      <p>${documento.description}</p>
    </div>
  `;

  const category = document.createElement("span");
  category.className = "documentos-category-cell";
  category.innerHTML = `<span class="documentos-dot ${documentosCategoryClass[documento.category] || documentosCategoryClass.Outros}"></span>${documento.category}`;

  const date = document.createElement("span");
  date.className = "documentos-date-cell";
  date.innerHTML = documento.date.replace(" a ", " a<br />");

  const size = document.createElement("span");
  size.className = "documentos-size-cell";
  size.textContent = documento.size;

  const actions = document.createElement("button");
  actions.type = "button";
  actions.className = "documentos-actions-button";
  actions.dataset.documentosAction = documento.title;
  actions.setAttribute("aria-label", `Ações do documento ${documento.title}`);
  actions.innerHTML = '<img src="../assets/figma-dashboard/more-vertical.svg" alt="" aria-hidden="true" />';

  row.append(name, category, date, size, actions);
  return row;
}

function renderDocumentos() {
  if (!documentosList) {
    return;
  }

  const filtered = getFilteredDocumentos();
  documentosList.replaceChildren(...filtered.map(createDocumentoRow));

  if (documentosEmpty) {
    documentosEmpty.hidden = filtered.length > 0;
  }
}

documentosList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-documentos-action]");

  if (!button) {
    return;
  }

  event.stopPropagation();
  openDocumentosMenu(button);
});

[documentosSearch, documentosCategory, documentosStatus].forEach((control) => {
  control?.addEventListener("input", renderDocumentos);
  control?.addEventListener("change", renderDocumentos);
});

document.querySelector("[data-documentos-new]")?.addEventListener("click", () => {
  closeDocumentosMenu();
});

document.addEventListener("click", (event) => {
  if (documentosMenu && !documentosMenu.hidden && !documentosMenu.contains(event.target)) {
    closeDocumentosMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDocumentosMenu();
  }
});

renderDocumentos();
