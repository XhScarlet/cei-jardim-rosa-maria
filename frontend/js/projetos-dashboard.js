const projetosDashboardMock = [
  {
    titulo: "Projeto Horta",
    descricao: "Aprendendo sobre natureza e alimentação saudável.",
    categoria: "Meio ambiente",
    status: "Em andamento",
    periodoInicio: "01/08/2026",
    periodoFim: "02/09/2026",
    responsavel: "Márcia",
    imagem: "../assets/figma-dashboard/projetos/projeto-horta.png",
  },
  {
    titulo: "Leitura em Casa",
    descricao: "Incentivando a leitura e imaginação dentro de casa.",
    categoria: "Educação",
    status: "Em andamento",
    periodoInicio: "01/08/2026",
    periodoFim: "02/09/2026",
    responsavel: "Marta",
    imagem: "../assets/figma-dashboard/projetos/leitura-em-casa.png",
  },
  {
    titulo: "Festa Cultural",
    descricao: "Festa cultural do CEI Rosa Maria ganhou destaque esse ano.",
    categoria: "Cultura",
    status: "Planejamento",
    periodoInicio: "01/08/2026",
    periodoFim: "02/09/2026",
    responsavel: "Daiane",
    imagem: "../assets/figma-dashboard/projetos/festa-cultural.png",
  },
  {
    titulo: "Famílias no CEI",
    descricao: "Integração com as famílias e comunidades.",
    categoria: "Comunidade",
    status: "Em andamento",
    periodoInicio: "01/08/2026",
    periodoFim: "02/09/2026",
    responsavel: "Fábia",
    imagem: "../assets/figma-dashboard/projetos/familias-no-cei.png",
  },
  {
    titulo: "Projeto Leituraço",
    descricao: "Escolhemos 4 livros para tornar esse momento...",
    categoria: "Cultura e comunidade",
    status: "Concluído",
    periodoInicio: "01/08/2026",
    periodoFim: "02/09/2026",
    responsavel: "Daiane",
    imagem: "../assets/figma-dashboard/projetos/projeto-leituraco.png",
  },
  {
    titulo: "Indicador de Qualidade",
    descricao: "As metas continuam sendo alcançadas no CEI...",
    categoria: "Outros",
    status: "Em andamento",
    periodoInicio: "01/08/2026",
    periodoFim: "02/09/2026",
    responsavel: "Fábia",
    imagem: "../assets/figma-dashboard/projetos/indicador-qualidade.png",
  },
];

window.ceiProjetosDashboardMock = projetosDashboardMock;

const projetosList = document.querySelector("[data-projetos-list]");
const projetosSearch = document.querySelector("[data-projetos-search]");
const projetosCategory = document.querySelector("[data-projetos-category]");
const projetosStatus = document.querySelector("[data-projetos-status]");
const projetosSort = document.querySelector("[data-projetos-sort]");
const projetosEmpty = document.querySelector("[data-projetos-empty]");
const projetosMenu = document.querySelector("[data-projetos-menu]");

const categoriaClasses = {
  "Meio ambiente": "meio",
  Educação: "educacao",
  Cultura: "cultura",
  Comunidade: "comunidade",
  "Cultura e comunidade": "cultura-comunidade",
  Outros: "outros",
};

const statusClasses = {
  "Em andamento": "andamento",
  Planejamento: "planejamento",
  Concluído: "concluido",
};

function normalizeProjetosText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function sortProjetos(items) {
  const sortValue = projetosSort?.value || "Mais recentes";
  const sorted = [...items];

  if (sortValue === "Mais antigos") {
    return sorted.reverse();
  }

  if (sortValue === "A-Z") {
    return sorted.sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"));
  }

  if (sortValue === "Z-A") {
    return sorted.sort((a, b) => b.titulo.localeCompare(a.titulo, "pt-BR"));
  }

  return sorted;
}

function getProjetoActions(status) {
  if (status === "Concluído") {
    return ["Visualizar", "Editar", "Reabrir projeto", "Excluir"];
  }

  return ["Visualizar", "Editar", "Marcar como concluído", "Excluir"];
}

function closeProjetosMenu() {
  if (projetosMenu) {
    projetosMenu.hidden = true;
    projetosMenu.replaceChildren();
  }
}

function openProjetosMenu(button, projeto) {
  if (!projetosMenu) {
    return;
  }

  const actions = getProjetoActions(projeto.status);
  const rect = button.getBoundingClientRect();

  projetosMenu.replaceChildren(
    ...actions.map((action) => {
      const item = document.createElement("button");
      item.type = "button";
      item.textContent = action;
      item.dataset.action = action;
      return item;
    }),
  );

  projetosMenu.hidden = false;
  projetosMenu.style.left = `${Math.min(rect.left - projetosMenu.offsetWidth + rect.width, window.innerWidth - projetosMenu.offsetWidth - 12)}px`;
  projetosMenu.style.top = `${Math.min(rect.bottom + 6, window.innerHeight - projetosMenu.offsetHeight - 12)}px`;
}

function createProjetoRow(projeto) {
  const row = document.createElement("article");
  row.className = "projetos-row";
  row.dataset.projetoTitle = projeto.titulo;

  const categoryClass = categoriaClasses[projeto.categoria] || "outros";
  const statusClass = statusClasses[projeto.status] || "andamento";
  const initial = projeto.responsavel.slice(0, 1).toUpperCase();

  row.innerHTML = `
    <div class="projetos-title-cell">
      <img class="projetos-thumb" src="${projeto.imagem}" alt="" aria-hidden="true" />
      <div>
        <h3>${projeto.titulo}</h3>
        <p>${projeto.descricao}</p>
      </div>
    </div>
    <span class="projeto-dot projeto-dot-${categoryClass}" aria-label="${projeto.categoria}"></span>
    <span class="projetos-status projetos-status-${statusClass}">${projeto.status}</span>
    <span class="projetos-periodo">${projeto.periodoInicio} a<br />${projeto.periodoFim}</span>
    <span class="projetos-owner"><span class="projetos-owner-avatar" aria-hidden="true">${initial}</span><span>${projeto.responsavel}</span></span>
  `;

  const actionsButton = document.createElement("button");
  actionsButton.className = "projetos-actions-button";
  actionsButton.type = "button";
  actionsButton.setAttribute("aria-label", `Ações do projeto ${projeto.titulo}`);
  actionsButton.innerHTML = '<img src="../assets/figma-dashboard/more-vertical.svg" alt="" aria-hidden="true" />';
  actionsButton.addEventListener("click", (event) => {
    event.stopPropagation();
    openProjetosMenu(actionsButton, projeto);
  });
  row.append(actionsButton);

  return row;
}

function renderProjetos() {
  if (!projetosList) {
    return;
  }

  const searchTerm = normalizeProjetosText(projetosSearch?.value || "");
  const categoryValue = projetosCategory?.value || "Todas as categorias";
  const statusValue = projetosStatus?.value || "Todos os status";

  const filtered = projetosDashboardMock.filter((projeto) => {
    const matchesSearch = normalizeProjetosText(projeto.titulo).includes(searchTerm);
    const matchesCategory = categoryValue === "Todas as categorias" || projeto.categoria === categoryValue;
    const matchesStatus = statusValue === "Todos os status" || projeto.status === statusValue;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const visibleProjetos = sortProjetos(filtered);
  projetosList.replaceChildren(...visibleProjetos.map(createProjetoRow));

  if (projetosEmpty) {
    projetosEmpty.hidden = visibleProjetos.length > 0;
  }

  closeProjetosMenu();
}

[projetosSearch, projetosCategory, projetosStatus, projetosSort].forEach((control) => {
  control?.addEventListener("input", renderProjetos);
  control?.addEventListener("change", renderProjetos);
});

document.addEventListener("click", (event) => {
  if (projetosMenu && !projetosMenu.hidden && !projetosMenu.contains(event.target)) {
    closeProjetosMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProjetosMenu();
  }
});

renderProjetos();
