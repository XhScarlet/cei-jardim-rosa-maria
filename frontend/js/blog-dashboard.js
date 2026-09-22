const blogDashboardMock = {
  summary: {
    active: 12,
    drafts: 3,
    comunicados: 4,
    projetos: 2,
  },
  posts: [
    {
      title: "Reunião com as famílias",
      category: "Comunicado",
      date: "28/08/2026",
      views: 100,
      status: "Publicado",
      description: "Contamos com a presença de todos para conversarmos sobre o desenvolvimento...",
    },
    {
      title: "Projeto no CEI",
      category: "Projeto",
      date: "28/08/2026",
      views: 82,
      status: "Publicado",
      description: "Nossas crianças estão aprendendo sobre natureza e alimentação saudável...",
    },
    {
      title: "Semana da criança",
      category: "Evento",
      date: "28/08/2026",
      views: 0,
      status: "Rascunho",
      description: "Uma semana inteira de atividades e brincadeiras especiais para celebrar o dia...",
    },
    {
      title: "Dicas de leitura infantil",
      category: "Novidade",
      date: "28/08/2026",
      views: 23,
      status: "Publicado",
      description: "Selecionamos algumas sugestões de livros para essa fase...",
    },
    {
      title: "Nosso espaço, nossa história",
      category: "Institucional",
      date: "28/08/2026",
      views: 0,
      status: "Rascunho",
      description: "Conheça um pouco mais sobre o CEI Jardim Rosa Maria...",
    },
  ],
};

window.ceiBlogDashboardMock = blogDashboardMock;

const blogFilters = document.querySelectorAll("[data-blog-filter]");
const blogSearch = document.querySelector("[data-blog-search]");
const blogRows = document.querySelectorAll("[data-blog-row]");
const blogEmptyState = document.querySelector("[data-blog-empty]");
const blogActionsMenu = document.querySelector("[data-blog-menu]");
const blogActionButtons = document.querySelectorAll("[data-blog-actions]");
let activeBlogFilter = "Todos";

function normalizeBlogText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function applyBlogFilters() {
  const searchTerm = normalizeBlogText(blogSearch?.value || "");
  let visibleRows = 0;

  blogRows.forEach((row) => {
    const matchesFilter = activeBlogFilter === "Todos" || row.dataset.category === activeBlogFilter;
    const matchesSearch = normalizeBlogText(row.dataset.title || "").includes(searchTerm);
    const isVisible = matchesFilter && matchesSearch;

    row.hidden = !isVisible;

    if (isVisible) {
      visibleRows += 1;
    }
  });

  if (blogEmptyState) {
    blogEmptyState.hidden = visibleRows > 0;
  }
}

blogFilters.forEach((button) => {
  button.addEventListener("click", () => {
    activeBlogFilter = button.dataset.blogFilter;

    blogFilters.forEach((filter) => {
      filter.classList.toggle("blog-dashboard-filter-active", filter === button);
    });

    applyBlogFilters();
  });
});

blogSearch?.addEventListener("input", applyBlogFilters);

function getActionsByStatus(status) {
  if (status === "Rascunho") {
    return ["Editar", "Pré-visualizar", "Publicar", "Duplicar", "Excluir"];
  }

  return ["Editar", "Ver no site", "Duplicar", "Despublicar", "Excluir"];
}

function closeBlogActionsMenu() {
  if (blogActionsMenu) {
    blogActionsMenu.hidden = true;
  }
}

function openBlogActionsMenu(button) {
  if (!blogActionsMenu) {
    return;
  }

  const row = button.closest("[data-blog-row]");
  const actions = getActionsByStatus(row?.dataset.status);
  const buttonRect = button.getBoundingClientRect();

  blogActionsMenu.replaceChildren(
    ...actions.map((action) => {
      const menuButton = document.createElement("button");
      menuButton.type = "button";
      menuButton.textContent = action;
      menuButton.dataset.action = action;
      return menuButton;
    }),
  );

  blogActionsMenu.hidden = false;
  blogActionsMenu.style.left = `${Math.min(buttonRect.left - blogActionsMenu.offsetWidth + buttonRect.width, window.innerWidth - blogActionsMenu.offsetWidth - 12)}px`;
  blogActionsMenu.style.top = `${Math.min(buttonRect.bottom + 6, window.innerHeight - blogActionsMenu.offsetHeight - 12)}px`;
}

blogActionButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    if (!blogActionsMenu?.hidden && blogActionsMenu.dataset.activeButton === button.getAttribute("aria-label")) {
      closeBlogActionsMenu();
      return;
    }

    blogActionsMenu.dataset.activeButton = button.getAttribute("aria-label");
    openBlogActionsMenu(button);
  });
});

document.addEventListener("click", (event) => {
  if (!blogActionsMenu || blogActionsMenu.hidden) {
    return;
  }

  if (!blogActionsMenu.contains(event.target)) {
    closeBlogActionsMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeBlogActionsMenu();
  }
});

applyBlogFilters();
