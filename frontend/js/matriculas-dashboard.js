document.addEventListener("DOMContentLoaded", () => {
  const panel = document.querySelector('[data-panel="matriculas"]');
  if (!panel) return;

  const list = panel.querySelector("[data-matriculas-list]");
  const feedback = panel.querySelector("[data-matricula-feedback]");
  const modal = panel.querySelector("[data-matricula-modal]");
  const editForm = panel.querySelector("[data-matricula-edit-form]");
  const modalFeedback = panel.querySelector("[data-matricula-modal-feedback]");
  const searchInput = panel.querySelector("[data-matricula-search]");
  const filterButtons = panel.querySelectorAll("[data-matricula-filter]");
  const apiUrl = "http://localhost:8080/api/matricula";
  let solicitacoes = [];
  let filtroStatus = "P";
  let editingItem = null;

  function setFeedback(message, isError = false) {
    feedback.hidden = !message;
    feedback.textContent = message;
    feedback.setAttribute("role", isError ? "alert" : "status");
  }

  function formatarTelefone(telefone) {
    if (!telefone) return "";
    const numero = telefone.replace(/\D/g, "");
    if (numero.length === 11) {
      return `(${numero.slice(0, 2)}) ${numero.slice(2, 7)}-${numero.slice(7)}`;
    }
    return telefone;
  }

  function formatarData(value) {
    if (!value) return "Não informada";
    const data = new Date(`${value}T00:00:00`);
    return Number.isNaN(data.getTime())
      ? "Não informada"
      : new Intl.DateTimeFormat("pt-BR").format(data);
  }

  function formatarNumeroWhatsapp(telefone) {
    let numero = (telefone || "").replace(/\D/g, "");
    if (!numero) return "";

    const temCodigoPais = numero.startsWith("55") && numero.length > 11;
    const numeroNacional = temCodigoPais ? numero.slice(2) : numero;
    if (numeroNacional.length > 11) return "";
    return `55${numeroNacional.padEnd(11, "0")}`;
  }

  function gerarLinkWhatsApp(telefone, nomeResponsavel) {
    const numero = formatarNumeroWhatsapp(telefone);
    if (!numero) return null;

    const mensagem = `Olá, ${nomeResponsavel || ""}! Falo da direção do CEI Jardim Rosa Maria a respeito da sua solicitação de matrícula.`;
    return `https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(mensagem)}`;
  }

  function criarInformacao(label, valor) {
    const paragraph = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    paragraph.append(strong, document.createTextNode(valor || "Não informada"));
    return paragraph;
  }

  function criarIconeWhatsApp() {
    const svgNamespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNamespace, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    const path = document.createElementNS(svgNamespace, "path");
    path.setAttribute("fill", "currentColor");
    path.setAttribute("d", "M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.301-.15-1.785-.881-2.062-.982-.276-.101-.477-.15-.677.15-.199.299-.776.982-.951 1.183-.175.201-.351.226-.652.076-.301-.15-1.27-.468-2.42-1.494-.896-.798-1.502-1.784-1.677-2.084-.175-.301-.019-.464.131-.613.136-.135.301-.351.451-.526.15-.175.201-.299.301-.499.101-.201.05-.376-.025-.526-.075-.15-.677-1.629-.927-2.23-.244-.585-.494-.505-.677-.514-.175-.008-.376-.008-.576-.008s-.526.075-.802.376c-.276.299-1.052 1.028-1.052 2.509 0 1.48 1.077 2.909 1.227 3.109.15.201 2.12 3.237 5.137 4.537.717.31 1.277.495 1.712.633.721.23 1.377.197 1.896.12.579-.086 1.785-.729 2.036-1.431.25-.702.25-1.303.175-1.43-.075-.128-.276-.202-.577-.353z");
    svg.append(path);
    return svg;
  }

  function createMatriculaCard(item) {
    const statusMap = {
      A: { label: "Ativo", className: "blog-status-published" },
      I: { label: "Inativo", className: "matricula-status-inactive" },
      P: { label: "Pendente", className: "blog-badge-comunicado" },
      R: { label: "Rejeitado", className: "matricula-status-rejected" },
      R: { label: "Rejeitado", className: "matricula-status-rejected" },
    };
    const status = item.statusResponsavel || "P";
    const statusInfo = statusMap[status] || statusMap.P;
    const card = document.createElement("article");
    card.className = "workspace-card matricula-card-item";

    const heading = document.createElement("div");
    heading.className = "matricula-card-header";
    const responsibleInfo = document.createElement("div");
    const name = document.createElement("h3");
    name.textContent = item.nomeResponsavel || "Responsável sem nome";
    const subtitle = document.createElement("span");
    subtitle.className = "matricula-subtitle";
    subtitle.textContent = "Responsável";
    responsibleInfo.append(name, subtitle);

    const badge = document.createElement("span");
    badge.className = `blog-status ${statusInfo.className}`;
    badge.textContent = statusInfo.label;
    heading.append(responsibleInfo, badge);

    const body = document.createElement("div");
    body.className = "matricula-card-body";
    body.append(
      criarInformacao("Criança", item.nomeCrianca || "Não informada"),
      criarInformacao("Nascimento", formatarData(item.dataNascimentoCrianca || item.dtNascimento)),
      criarInformacao("Telefone", formatarTelefone(item.foneResponsavel))
    );

    const actions = document.createElement("div");
    actions.className = "matricula-card-actions";
    const whatsapp = document.createElement("a");
    whatsapp.className = "btn-whatsapp";
    const whatsappUrl = gerarLinkWhatsApp(item.foneResponsavel, item.nomeResponsavel);
    if (whatsappUrl) {
      whatsapp.href = whatsappUrl;
      whatsapp.target = "_blank";
      whatsapp.rel = "noopener noreferrer";
    } else {
      whatsapp.setAttribute("aria-disabled", "true");
      whatsapp.title = "Telefone indisponível para contato";
    }
    whatsapp.append(criarIconeWhatsApp());
    const whatsappLabel = document.createElement("span");
    whatsappLabel.textContent = "WhatsApp";
    whatsapp.append(whatsappLabel);

    const statusButton = document.createElement("button");
    statusButton.className = "btn-status-toggle";
    statusButton.type = "button";
    statusButton.dataset.matriculaId = item.idResponsavel;
    statusButton.dataset.nextStatus = status === "A" ? "I" : "A";
    statusButton.textContent = status === "A" ? "Desativar" : "Ativar";
    const editButton = document.createElement("button");
    editButton.className = "btn-matricula-edit";
    editButton.type = "button";
    editButton.dataset.editMatricula = item.idResponsavel;
    editButton.textContent = "Editar dados";

    const rejectButton = document.createElement("button");
    rejectButton.className = "btn-matricula-reject";
    rejectButton.type = "button";
    rejectButton.dataset.rejectMatricula = item.idResponsavel;
    rejectButton.textContent = status === "R" ? "Rejeitado" : "Rejeitar";
    rejectButton.disabled = status === "R";
    actions.append(whatsapp, statusButton, editButton, rejectButton);

    card.append(heading, body, actions);
    return card;
  }

  function renderizar() {
    const termo = searchInput.value.trim().toLocaleLowerCase("pt-BR");
    const resultados = solicitacoes.filter((item) => {
      const statusOk = filtroStatus === "todos" || item.statusResponsavel === filtroStatus;
      const nomes = `${item.nomeResponsavel || ""} ${item.nomeCrianca || ""}`.toLocaleLowerCase("pt-BR");
      return statusOk && nomes.includes(termo);
    });

    list.replaceChildren();
    if (resultados.length === 0) {
      const empty = document.createElement("p");
      empty.className = "matriculas-empty-state";
      empty.textContent = solicitacoes.length
        ? "Nenhuma solicitação encontrada para os filtros selecionados."
        : "Nenhuma solicitação de matrícula encontrada.";
      list.append(empty);
      return;
    }
    list.append(...resultados.map(createMatriculaCard));
  }

  async function carregarSolicitacoes() {
    setFeedback("Carregando solicitações...");
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Não foi possível carregar as solicitações.");
      solicitacoes = await response.json();
      if (!Array.isArray(solicitacoes)) throw new Error("A resposta do servidor está em formato inválido.");
      setFeedback("");
      renderizar();
    } catch (error) {
      console.error("Erro ao carregar solicitações de matrícula:", error);
      setFeedback(error.message || "Erro ao carregar as solicitações. Tente novamente.", true);
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setFeedback("");
      filtroStatus = button.dataset.matriculaFilter;
      filterButtons.forEach((filter) => {
        const active = filter === button;
        filter.classList.toggle("blog-dashboard-filter-active", active);
        filter.setAttribute("aria-pressed", String(active));
      });
      renderizar();
    });
  });

  searchInput.addEventListener("input", () => {
    setFeedback("");
    renderizar();
  });

  list.addEventListener("click", async (event) => {
    const target = event.target;
    const statusButton = target.closest("[data-matricula-id]");
    const editButton = target.closest("[data-edit-matricula]");
    const rejectButton = target.closest("[data-reject-matricula]");

    if (editButton) {
      editingItem = solicitacoes.find((item) => String(item.idResponsavel) === editButton.dataset.editMatricula);
      if (!editingItem) return;
      editForm.elements.responsavel.value = editingItem.nomeResponsavel || "";
      editForm.elements.crianca.value = editingItem.nomeCrianca || "";
      editForm.elements.telefone.value = editingItem.foneResponsavel || "";
      modalFeedback.hidden = true;
      modalFeedback.textContent = "";
      modal.hidden = false;
      editForm.elements.responsavel.focus();
      return;
    }

    if (statusButton) {
      await atualizarStatus(statusButton, statusButton.dataset.nextStatus, "Status do responsável atualizado.");
      return;
    }

    if (rejectButton && window.confirm("Deseja rejeitar esta solicitação de matrícula?")) {
      await atualizarStatus(rejectButton, "R", "Solicitação rejeitada.");
    }
  });

  async function atualizarStatus(button, status, message) {
    button.disabled = true;
    setFeedback("");
    try {
      const response = await fetch(`${apiUrl}/${encodeURIComponent(button.dataset.matriculaId || button.dataset.rejectMatricula)}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusResponsavel: status }),
      });
      if (!response.ok) throw new Error("Não foi possível atualizar o status do responsável.");
      const atualizado = await response.json();
      solicitacoes = solicitacoes.map((item) => item.idResponsavel === atualizado.idResponsavel ? atualizado : item);
      setFeedback(message);
      renderizar();
    } catch (error) {
      console.error("Erro ao atualizar status da solicitação:", error);
      setFeedback(error.message || "Erro ao atualizar o status. Tente novamente.", true);
      button.disabled = false;
    }
  }

  editForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!editingItem) return;

    const formData = new FormData(editForm);
    const payload = {
      responsavel: formData.get("responsavel").trim(),
      crianca: formData.get("crianca").trim(),
      telefone: formData.get("telefone").trim(),
      nascimento: editingItem.dataNascimentoCrianca || null,
    };

    const submitButton = editForm.querySelector('[type="submit"]');
    submitButton.disabled = true;
    modalFeedback.hidden = true;
    try {
      const response = await fetch(`${apiUrl}/${encodeURIComponent(editingItem.idResponsavel)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Não foi possível salvar os dados da matrícula.");
      const atualizado = await response.json();
      solicitacoes = solicitacoes.map((item) => item.idResponsavel === atualizado.idResponsavel ? atualizado : item);
      modal.hidden = true;
      editingItem = null;
      setFeedback("Dados da matrícula atualizados.");
      renderizar();
    } catch (error) {
      console.error("Erro ao editar dados da matrícula:", error);
      modalFeedback.textContent = error.message || "Erro ao salvar os dados. Tente novamente.";
      modalFeedback.hidden = false;
    } finally {
      submitButton.disabled = false;
    }
  });

  panel.querySelector("[data-matricula-edit-cancel]").addEventListener("click", () => {
    modal.hidden = true;
    editingItem = null;
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.hidden = true;
      editingItem = null;
    }
  });

  panel.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      modal.hidden = true;
      editingItem = null;
    }
  });

  carregarSolicitacoes();
});
