const BLOG_API_URL = "http://localhost:8080/api/blogs";
 
const blogFilters = document.querySelectorAll("[data-blog-filter]");
const blogSearch = document.querySelector("[data-blog-search]");
const blogList = document.querySelector("[data-blog-list]");
const blogEmptyState = document.querySelector("[data-blog-empty]");
const blogActionsMenu = document.querySelector("[data-blog-menu]");
 
const STATUS_LABEL = { A: "Publicado", I: "Rascunho" };
 
let blogPosts = [];
let activeBlogFilter = "Todos";
let menuPost = null;
 
// ---------- utilitários ----------
 
function normalizeBlogText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
 
function formatBlogDate(value) {
  if (!value) return "--/--/----";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "--/--/----" : date.toLocaleDateString("pt-BR");
}
 
function isPublished(post) {
  return post.statusBlog === "A";
}
 
function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}
 
// ---------- API ----------
 
async function loadBlogPosts() {
  try {
    const response = await fetch(BLOG_API_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    blogPosts = await response.json();
    renderBlog();
  } catch (error) {
    console.error("Erro ao carregar o blog:", error);
    blogPosts = [];
    renderBlog("Não foi possível carregar as publicações. Verifique se o backend está ativo em localhost:8080.");
  }
}
 
// O PUT do backend sobrescreve todos os campos, então reenviamos os dados atuais
// e trocamos só o status. Sem arquivo "imagem", a imagem atual é mantida.
async function updateBlogStatus(post, statusBlog) {
  const formData = new FormData();
  formData.append("idUsuario", post.idUsuario);
  formData.append("tituloBlog", post.tituloBlog);
  formData.append("categoriaBlog", post.categoriaBlog);
  formData.append("resumoBlog", post.resumoBlog);
  formData.append("conteudoBlog", post.conteudoBlog);
  formData.append("statusBlog", statusBlog);
 
  try {
    const response = await fetch(`${BLOG_API_URL}/${post.idBlog}`, { method: "PUT", body: formData });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await loadBlogPosts();
  } catch (error) {
    console.error("Erro ao alterar o status:", error);
    window.alert("Não foi possível alterar o status da publicação.");
  }
}
 
async function deleteBlogPost(post) {
  if (!window.confirm(`Excluir a publicação "${post.tituloBlog}"? Essa ação não pode ser desfeita.`)) return;
 
  try {
    const response = await fetch(`${BLOG_API_URL}/${post.idBlog}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await loadBlogPosts();
  } catch (error) {
    console.error("Erro ao excluir:", error);
    window.alert("Não foi possível excluir a publicação.");
  }
}
 
// ---------- renderização ----------
 
function updateBlogSummary() {
  const published = blogPosts.filter(isPublished);
  const counts = {
    active: published.length,
    drafts: blogPosts.length - published.length,
    comunicados: published.filter((post) => post.categoriaBlog === "Comunicado").length,
    projetos: published.filter((post) => post.categoriaBlog === "Projeto").length,
  };
 
  Object.entries(counts).forEach(([key, value]) => {
    const element = document.querySelector(`[data-blog-summary="${key}"]`);
    if (element) element.textContent = value;
  });
}
 
function createBlogRow(post) {
  const statusLabel = STATUS_LABEL[post.statusBlog] || "Rascunho";
  const row = createElement("article", "blog-post-row");
  row.dataset.blogRow = "";
  row.dataset.id = post.idBlog;
 
  const titleCell = createElement("div", "blog-post-title");
  const thumb = createElement("span", "blog-post-thumb");
  thumb.setAttribute("aria-hidden", "true");
  if (post.imagemBlog) {
    thumb.style.backgroundImage = `url(${JSON.stringify(post.imagemBlog)})`;
    thumb.style.backgroundSize = "cover";
    thumb.style.backgroundPosition = "center";
  }
  const titleText = createElement("div");
  titleText.append(createElement("h3", "", post.tituloBlog), createElement("p", "", post.resumoBlog));
  titleCell.append(thumb, titleText);
 
  const badge = createElement(
    "span",
    `blog-badge blog-badge-${normalizeBlogText(post.categoriaBlog)}`,
    post.categoriaBlog,
  );
 
  const time = createElement("time", "", formatBlogDate(post.dataBlog));
 
  // O banco ainda não guarda visualizações (TB_POST não tem essa coluna).
  const views = createElement("span", "blog-views");
  const eye = document.createElement("img");
  eye.src = "../assets/figma-dashboard/eye.svg";
  eye.alt = "";
  eye.setAttribute("aria-hidden", "true");
  views.append(eye, "—");
 
  const status = createElement(
    "span",
    `blog-status ${isPublished(post) ? "blog-status-published" : "blog-status-draft"}`,
    statusLabel,
  );
 
  const actions = createElement("button", "blog-row-actions");
  actions.type = "button";
  actions.dataset.blogActions = "";
  actions.setAttribute("aria-label", `Ações da publicação ${post.tituloBlog}`);
  const more = document.createElement("img");
  more.src = "../assets/figma-dashboard/more-vertical.svg";
  more.alt = "";
  more.setAttribute("aria-hidden", "true");
  actions.append(more);
  actions.addEventListener("click", (event) => {
    event.stopPropagation();
 
    if (!blogActionsMenu.hidden && menuPost?.idBlog === post.idBlog) {
      closeBlogActionsMenu();
      return;
    }
    openBlogActionsMenu(actions, post);
  });
 
  row.append(titleCell, badge, time, views, status, actions);
  return row;
}
 
function renderBlog(emptyMessage = "Nenhuma publicação encontrada.") {
  const searchTerm = normalizeBlogText(blogSearch?.value || "");
 
  const visiblePosts = blogPosts.filter((post) => {
    const matchesFilter = activeBlogFilter === "Todos" || post.categoriaBlog === activeBlogFilter;
    const matchesSearch = normalizeBlogText(post.tituloBlog).includes(searchTerm);
    return matchesFilter && matchesSearch;
  });
 
  updateBlogSummary();
  blogList.replaceChildren(...visiblePosts.map(createBlogRow), blogEmptyState);
  blogEmptyState.textContent = emptyMessage;
  blogEmptyState.hidden = visiblePosts.length > 0;
  closeBlogActionsMenu();
}
 
// ---------- menu de ações ----------
 
function getActionsByPost(post) {
  if (isPublished(post)) {
    return ["Editar", "Ver no site", "Despublicar", "Excluir"];
  }
  return ["Editar", "Publicar", "Excluir"];
}
 
function closeBlogActionsMenu() {
  if (blogActionsMenu) blogActionsMenu.hidden = true;
  menuPost = null;
}
 
function openBlogActionsMenu(button, post) {
  menuPost = post;
  const buttonRect = button.getBoundingClientRect();
 
  blogActionsMenu.replaceChildren(
    ...getActionsByPost(post).map((action) => {
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
 
blogActionsMenu?.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  const post = menuPost;
  closeBlogActionsMenu();
 
  if (!action || !post) return;
 
  if (action === "Editar") {
    window.location.href = `nova-publicacao.html?id=${post.idBlog}`;
  } else if (action === "Ver no site") {
    window.open(`blog.html#post-${post.idBlog}`, "_blank", "noopener");
  } else if (action === "Publicar") {
    updateBlogStatus(post, "A");
  } else if (action === "Despublicar") {
    updateBlogStatus(post, "I");
  } else if (action === "Excluir") {
    deleteBlogPost(post);
  }
});
 
document.addEventListener("click", (event) => {
  if (blogActionsMenu && !blogActionsMenu.hidden && !blogActionsMenu.contains(event.target)) {
    closeBlogActionsMenu();
  }
});
 
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeBlogActionsMenu();
});
 
// ---------- filtros e busca ----------
 
blogFilters.forEach((button) => {
  button.addEventListener("click", () => {
    activeBlogFilter = button.dataset.blogFilter;
 
    blogFilters.forEach((filter) => {
      filter.classList.toggle("blog-dashboard-filter-active", filter === button);
    });
 
    renderBlog();
  });
});
 
blogSearch?.addEventListener("input", () => renderBlog());
 
loadBlogPosts();