// Só publicações com Status_Post = 'A' (a API filtra pelo parâmetro status).
const BLOG_PUBLIC_API_URL = "http://localhost:8080/api/blogs?status=A";

// data-filter do botão -> categoria gravada no banco
const FILTER_CATEGORIES = {
  comunicados: "Comunicado",
  eventos: "Evento",
  projetos: "Projeto",
  novidades: "Novidade",
  institucional: "Institucional",
};

// categoria -> classe visual do card
const CARD_CLASSES = {
  Evento: "post-event",
  Projeto: "post-project",
  Comunicado: "post-note",
  Novidade: "post-note",
  Institucional: "post-photo",
};

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const featuredSection = document.querySelector(".blog-featured");
const postGrid = document.querySelector(".post-grid");
const filterButtons = document.querySelectorAll(".blog-filter");
const stateMessages = document.querySelectorAll(".state-message");

let publicPosts = [];
let activeFilter = "todos";

// Remove os cards de exemplo do HTML antes de carregar os reais.
featuredSection.hidden = true;
postGrid.replaceChildren();

// ---------- utilitários ----------

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function formatPostDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { label: "", iso: "" };

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return {
    label: `${day} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`,
    iso: `${date.getFullYear()}-${month}-${day}`,
  };
}

function createTime(post) {
  const { label, iso } = formatPostDate(post.dataBlog);
  const time = createElement("time", "", label);
  time.dateTime = iso;
  return time;
}

function showState(name) {
  stateMessages.forEach((message) => {
    message.hidden = !message.classList.contains(`state-${name}`);
  });
}

// ---------- renderização ----------

function createFeatured(post) {
  const copy = createElement("div", "featured-copy");
  const readLink = createElement("a", "", "Ler publicação");
  readLink.href = `#post-${post.idBlog}`;
  readLink.addEventListener("click", (event) => {
    event.preventDefault();
    openReader(post);
  });
  copy.append(
    createElement("span", "post-category", post.categoriaBlog),
    createTime(post),
    createElement("h2", "", post.tituloBlog),
    createElement("p", "", post.resumoBlog),
    readLink,
  );

  const image = document.createElement("img");
  image.src = post.imagemBlog;
  image.alt = `Imagem da publicação ${post.tituloBlog}`;

  featuredSection.id = `post-${post.idBlog}`;
  featuredSection.replaceChildren(copy, image);
  featuredSection.hidden = false;
}

function createCard(post) {
  const card = createElement("article", `post-card ${CARD_CLASSES[post.categoriaBlog] || "post-note"}`);
  card.id = `post-${post.idBlog}`;
  card.tabIndex = 0;
  card.style.cursor = "pointer";

  const image = document.createElement("img");
  image.src = post.imagemBlog;
  image.alt = `Imagem da publicação ${post.tituloBlog}`;

  const body = createElement("div");
  body.append(
    createElement("span", "post-category", post.categoriaBlog),
    createTime(post),
    createElement("h2", "", post.tituloBlog),
    createElement("p", "", post.resumoBlog),
  );

  card.append(image, body);
  card.addEventListener("click", () => openReader(post));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter") openReader(post);
  });
  return card;
}

function renderPosts() {
  const category = FILTER_CATEGORIES[activeFilter];
  const visible = activeFilter === "todos" ? publicPosts : publicPosts.filter((post) => post.categoriaBlog === category);

  if (visible.length === 0) {
    featuredSection.hidden = true;
    postGrid.replaceChildren();
    showState("empty");
    return;
  }

  showState("none");
  // A mais recente (a API já devolve ordenado) vira destaque; o resto vai para a grade.
  createFeatured(visible[0]);
  postGrid.replaceChildren(...visible.slice(1).map(createCard));
}

// ---------- leitura da publicação ----------

// O editor do dashboard gera um markdown simples: **negrito**, _itálico_, [texto](link) e "- item".
// Tudo é montado com textContent (nunca innerHTML) para evitar injeção de HTML.
function appendInline(parent, text) {
  const pattern = /\*\*(.+?)\*\*|_(.+?)_|\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) parent.append(text.slice(lastIndex, match.index));

    if (match[1] !== undefined) {
      parent.append(createElement("strong", "", match[1]));
    } else if (match[2] !== undefined) {
      parent.append(createElement("em", "", match[2]));
    } else {
      const link = createElement("a", "", match[3]);
      link.href = match[4];
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      parent.append(link);
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) parent.append(text.slice(lastIndex));
}

function renderContent(container, content) {
  let list = null;

  (content || "").split("\n").forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      list = null;
      return;
    }

    if (line.startsWith("- ")) {
      if (!list) {
        list = createElement("ul");
        container.append(list);
      }
      const item = createElement("li");
      appendInline(item, line.slice(2));
      list.append(item);
      return;
    }

    list = null;
    const paragraph = createElement("p");
    appendInline(paragraph, line);
    container.append(paragraph);
  });
}

let readerDialog = null;

function getReader() {
  if (readerDialog) return readerDialog;

  readerDialog = createElement("dialog", "blog-reader");
  Object.assign(readerDialog.style, {
    width: "min(720px, 92vw)",
    maxHeight: "88vh",
    padding: "24px",
    border: "2px solid #b0586a",
    borderRadius: "24px",
    background: "#fff8f5",
    color: "#1f4a6b",
    fontFamily: "Poppins, sans-serif",
    overflowY: "auto",
  });
  readerDialog.addEventListener("click", (event) => {
    if (event.target === readerDialog) readerDialog.close();
  });
  readerDialog.addEventListener("close", () => {
    if (window.location.hash.startsWith("#post-")) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  });
  document.body.append(readerDialog);
  return readerDialog;
}

function openReader(post) {
  const dialog = getReader();

  const closeButton = createElement("button", "", "Fechar");
  closeButton.type = "button";
  closeButton.style.cssText = "float:right;cursor:pointer;border:0;background:none;font:inherit;font-weight:700;color:#b0586a;";
  closeButton.addEventListener("click", () => dialog.close());

  const image = document.createElement("img");
  image.src = post.imagemBlog;
  image.alt = `Imagem da publicação ${post.tituloBlog}`;
  image.style.cssText = "width:100%;max-height:280px;object-fit:cover;border-radius:16px;margin:12px 0;";

  const content = createElement("div");
  renderContent(content, post.conteudoBlog);

  dialog.replaceChildren(
    closeButton,
    createElement("span", "post-category", post.categoriaBlog),
    createTime(post),
    createElement("h2", "", post.tituloBlog),
    image,
    content,
  );

  if (!dialog.open) dialog.showModal();
}

function openPostFromHash() {
  const match = window.location.hash.match(/^#post-(\d+)$/);
  if (!match) return;

  const post = publicPosts.find((item) => String(item.idBlog) === match[1]);
  if (post) openReader(post);
}

// ---------- API ----------

async function loadPublicPosts() {
  showState("loading");

  try {
    const response = await fetch(BLOG_PUBLIC_API_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    publicPosts = await response.json();
    renderPosts();
    openPostFromHash();
  } catch (error) {
    console.error("Erro ao carregar as novidades:", error);
    featuredSection.hidden = true;
    postGrid.replaceChildren();
    showState(navigator.onLine ? "error" : "offline");
  }
}

// ---------- filtros ----------

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;

    filterButtons.forEach((filter) => {
      const isActive = filter === button;
      filter.classList.toggle("blog-filter-active", isActive);
      filter.setAttribute("aria-pressed", String(isActive));
    });

    renderPosts();
  });
});

window.addEventListener("offline", () => showState("offline"));
window.addEventListener("online", loadPublicPosts);

loadPublicPosts();
