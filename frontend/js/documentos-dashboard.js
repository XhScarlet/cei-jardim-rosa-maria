const API_URL = "http://localhost:8080/api/documentos";
let documentosLista = [];

const documentosList = document.querySelector("[data-documentos-list]");
const documentosSearch = document.querySelector("[data-documentos-search]");
const documentosCategory = document.querySelector("[data-documentos-category]");
const documentosStatus = document.querySelector("[data-documentos-status]");
const documentosEmpty = document.querySelector("[data-documentos-empty]");
const documentosMenu = document.querySelector("[data-documentos-menu]");
const documentosNewButton = document.querySelector("[data-documentos-new]");
const documentosModal = document.querySelector("[data-documentos-modal]");
const documentosForm = document.querySelector("[data-documentos-form]");
const documentosModalFeedback = document.querySelector("[data-documentos-modal-feedback]");
const documentosFeedback = document.querySelector("[data-documentos-feedback]");
const documentosSubmitButton = document.querySelector("[data-documentos-submit]");
const documentosUser = JSON.parse(localStorage.getItem("ceiDashboardUser") || "null");

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

async function carregarDocumentosDoBanco() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Não foi possível carregar os documentos (HTTP ${response.status}).`);
    documentosLista = await response.json();
    renderDocumentos();
    showDocumentosFeedback("");
    return true;
  } catch (error) {
    console.error("Falha na integração:", error);
    showDocumentosFeedback(error.message, true);
    return false;
  }
}

function showDocumentosFeedback(message, isError = false, modal = false) {
  const feedback = modal ? documentosModalFeedback : documentosFeedback;
  if (!feedback) return;
  feedback.textContent = message;
  feedback.classList.toggle("documentos-feedback-error", isError);
  feedback.hidden = !message;
}

function getFilteredDocumentos() {
  const searchValue = (documentosSearch?.value || "").trim().toLowerCase();
  const categoryValue = documentosCategory?.value || "todos";
  const statusValue = documentosStatus?.value || "todos";

  return documentosLista.filter((documento) => {
    const matchesSearch = documento.title.toLowerCase().includes(searchValue);
    const matchesCategory = categoryValue === "todos" || documento.category === categoryValue;
    const matchesStatus = statusValue === "todos" || documento.status === statusValue;
    return matchesSearch && matchesCategory && matchesStatus;
  });
}

function createDocumentoRow(documento) {
  const row = document.createElement("article");
  row.className = "documentos-row";

  const ext = documento.fileUrl ? documento.fileUrl.split(".").pop().toLowerCase() : "doc";
  const dataFormatada = documento.date ? new Date(documento.date).toLocaleDateString("pt-BR") : "";

  const name = document.createElement("div");
  name.className = "documentos-name-cell";
  const icon = document.createElement("img");
  icon.className = "documentos-file-icon";
  icon.src = documentosIconByType[ext] || documentosIconByType.doc;
  icon.alt = "";
  icon.setAttribute("aria-hidden", "true");
  const info = document.createElement("div");
  const title = document.createElement("h3");
  const link = document.createElement("a");
  link.href = `${API_URL}/${documento.id}/arquivo`;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = documento.title;
  const description = document.createElement("p");
  description.textContent = documento.description;
  title.appendChild(link);
  info.append(title, description);
  name.append(icon, info);

  const category = document.createElement("span");
  category.className = "documentos-category-cell";
  const dot = document.createElement("span");
  dot.className = `documentos-dot ${documentosCategoryClass[documento.category] || documentosCategoryClass.Outros}`;
  category.append(dot, document.createTextNode(documento.category));

  const date = document.createElement("span");
  date.className = "documentos-date-cell";
  date.textContent = dataFormatada;

  const size = document.createElement("span");
  size.className = "documentos-size-cell";
  size.textContent = documento.size || "—";

  const actions = document.createElement("button");
  actions.type = "button";
  actions.className = "documentos-actions-button";
  actions.dataset.documentosAction = documento.id;
  actions.setAttribute("aria-label", `Ações do documento ${documento.title}`);
  actions.innerHTML = '<img src="../assets/figma-dashboard/more-vertical.svg" alt="" aria-hidden="true" />';

  row.append(name, category, date, size, actions);
  return row;
}

function closeDocumentosMenu() {
  if (!documentosMenu) return;
  documentosMenu.hidden = true;
  documentosMenu.replaceChildren();
}

function openDocumentosModal(documento = null) {
  documentosForm.reset();
  const fileField = documentosForm.querySelector("[data-documentos-file-field]");
  const fileInput = documentosForm.elements.arquivo;
  documentosForm.dataset.editingId = documento ? String(documento.id) : "";
  fileField.hidden = Boolean(documento);
  fileInput.required = !documento;
  if (documento) {
    documentosForm.elements.nomeDocumento.value = documento.title;
    documentosForm.elements.descDocumento.value = documento.description;
    documentosForm.elements.tipoDocumento.value = documento.category;
    documentosForm.elements.statusDocumento.value = documento.status === "Publicado" ? "A" : "I";
  }
  documentosSubmitButton.disabled = !documento && (!Number.isInteger(Number(documentosUser?.idUsuario))
    || Number(documentosUser.idUsuario) <= 0);
  showDocumentosFeedback(
    documentosSubmitButton.disabled
      ? "A sessão não contém o ID do usuário. Reinicie o backend atualizado e faça login novamente."
      : "",
    false,
    true,
  );
  documentosModal.hidden = false;
  documentosForm.elements.nomeDocumento.focus();
}

function renderDocumentos() {
  if (!documentosList) return;
  closeDocumentosMenu();
  const filtered = getFilteredDocumentos();
  documentosList.replaceChildren(...filtered.map(createDocumentoRow));

  if (documentosEmpty) {
    documentosEmpty.hidden = filtered.length > 0;
  }
}

[documentosSearch, documentosCategory, documentosStatus].forEach((control) => {
  control?.addEventListener("input", renderDocumentos);
  control?.addEventListener("change", renderDocumentos);
});

documentosNewButton?.addEventListener("click", () => {
  closeDocumentosMenu();
  openDocumentosModal();
});

function openDocumentosMenu(button, documento) {
  if (!documentosMenu) return;
  const rect = button.getBoundingClientRect();
  documentosMenu.replaceChildren(
    ...["Editar", "Baixar", "Visualizar", "Excluir"].map((action) => {
      const item = document.createElement("button");
      item.type = "button";
      item.textContent = action;
      item.dataset.documentosMenuAction = action.toLowerCase();
      item.dataset.documentoId = String(documento.id);
      return item;
    }),
  );
  documentosMenu.hidden = false;
  const menuWidth = documentosMenu.offsetWidth;
  const menuHeight = documentosMenu.offsetHeight;
  documentosMenu.style.left = `${Math.max(12, Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 12))}px`;
  documentosMenu.style.top = `${Math.max(12, Math.min(rect.bottom + 6, window.innerHeight - menuHeight - 12))}px`;
}

documentosList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-documentos-action]");
  if (!button) return;
  event.stopPropagation();
  const documento = documentosLista.find((item) => String(item.id) === button.dataset.documentosAction);
  if (documento) openDocumentosMenu(button, documento);
});

documentosMenu?.addEventListener("click", async (event) => {
  const item = event.target.closest("[data-documentos-menu-action]");
  if (!item) return;
  const documento = documentosLista.find((entry) => String(entry.id) === item.dataset.documentoId);
  if (!documento) {
    closeDocumentosMenu();
    return;
  }
  const action = item.dataset.documentosMenuAction;
  closeDocumentosMenu();

  if (action === "editar") {
    openDocumentosModal(documento);
    return;
  }
  if (action === "visualizar") {
    window.open(`${API_URL}/${documento.id}/arquivo?visualizar=true`, "_blank", "noopener");
    return;
  }
  if (action === "baixar") {
    const link = document.createElement("a");
    link.href = `${API_URL}/${documento.id}/arquivo`;
    link.download = documento.fileUrl;
    link.click();
    return;
  }
  if (action === "excluir") {
    if (!window.confirm(`Excluir o documento "${documento.title}"?`)) return;
    try {
      const response = await fetch(`${API_URL}/${documento.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(`Não foi possível excluir o documento (HTTP ${response.status}).`);
      documentosLista = documentosLista.filter((entry) => String(entry.id) !== String(documento.id));
      renderDocumentos();
      showDocumentosFeedback("Documento excluído com sucesso.");
    } catch (error) {
      showDocumentosFeedback(error.message, true);
    }
  }
});

document.querySelector("[data-documentos-modal-close]")?.addEventListener("click", () => {
  documentosModal.hidden = true;
  documentosForm.dataset.editingId = "";
  documentosForm.querySelector("[data-documentos-file-field]").hidden = false;
  documentosForm.elements.arquivo.required = true;
});

documentosModal?.addEventListener("click", (event) => {
  if (event.target === documentosModal) documentosModal.hidden = true;
});

documentosForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const editingId = documentosForm.dataset.editingId;
  const idUsuario = Number(documentosUser?.idUsuario);
  if (!editingId && (!Number.isInteger(idUsuario) || idUsuario <= 0)) {
    showDocumentosFeedback("A sessão não contém o ID do usuário. Reinicie o backend atualizado e faça login novamente.", true, true);
    documentosSubmitButton.disabled = true;
    return;
  }

  documentosSubmitButton.disabled = true;
  showDocumentosFeedback("");
  const formData = editingId ? {
    title: documentosForm.elements.nomeDocumento.value,
    description: documentosForm.elements.descDocumento.value,
    category: documentosForm.elements.tipoDocumento.value,
    status: documentosForm.elements.statusDocumento.value,
  } : new FormData(documentosForm);
  if (formData instanceof FormData) formData.append("idUsuario", idUsuario);

  try {
    const response = await fetch(editingId ? `${API_URL}/${editingId}` : `${API_URL}/upload`, {
      method: editingId ? "PUT" : "POST",
      ...(editingId
        ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) }
        : { body: formData }),
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new Error(errorBody?.detail || errorBody?.message || `Não foi possível enviar o documento (HTTP ${response.status}).`);
    }

    documentosModal.hidden = true;
    documentosForm.reset();
    documentosForm.dataset.editingId = "";
    documentosForm.querySelector("[data-documentos-file-field]").hidden = false;
    documentosForm.elements.arquivo.required = true;
    if (await carregarDocumentosDoBanco()) {
      showDocumentosFeedback(editingId ? "Documento atualizado com sucesso." : "Documento enviado com sucesso.");
    }
  } catch (error) {
    showDocumentosFeedback(error.message, true, true);
  } finally {
    documentosSubmitButton.disabled = !documentosForm.dataset.editingId
      && (!Number.isInteger(Number(documentosUser?.idUsuario)) || Number(documentosUser.idUsuario) <= 0);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDocumentosMenu();
  if (event.key === "Escape" && documentosModal && !documentosModal.hidden) {
    documentosModal.hidden = true;
  }
});

document.addEventListener("click", (event) => {
  if (documentosMenu && !documentosMenu.hidden
      && !documentosMenu.contains(event.target)
      && !event.target.closest("[data-documentos-action]")) {
    closeDocumentosMenu();
  }
});

// Inicialização da busca no banco
carregarDocumentosDoBanco();