const BLOG_API_URL = "http://localhost:8080/api/blogs";

const newPostMock = {
  defaultPreview: {
    title: "Título da sua publicação",
    summary:
      "Aqui aparecerá o resumo da sua publicação. Ele deve ser curto e atrativo para que as famílias se interessem em ler mais.",
    cover: "../assets/figma-dashboard/nova-preview.png",
  },
};

window.ceiNewPostMock = newPostMock;

// Rótulo exibido no formulário -> código gravado em Status_Post (VARCHAR(1))
const STATUS_CODE = { Publicado: "A", Rascunho: "I" };
const STATUS_LABEL = { A: "Publicado", I: "Rascunho" };

const form = document.querySelector("[data-new-post-form]");
const titleInput = document.querySelector("[data-preview-title]");
const categorySelect = document.querySelector("[data-preview-category]");
const dateInput = document.querySelector("[data-preview-date]");
const imageInput = document.querySelector("[data-preview-image]");
const summaryInput = document.querySelector("[data-preview-summary]");
const contentInput = document.querySelector("[data-content-field]");
const summaryCounter = document.querySelector("[data-summary-counter]");
const contentCounter = document.querySelector("[data-content-counter]");
const previewTitle = document.querySelector("[data-preview-title-output]");
const previewSummary = document.querySelector("[data-preview-summary-output]");
const previewDate = document.querySelector("[data-preview-date-output]");
const previewCategory = document.querySelector("[data-preview-category-output]");
const previewCover = document.querySelector("[data-preview-cover]");
const feedback = document.querySelector("[data-form-feedback]");
const saveDraftButton = document.querySelector("[data-save-draft]");
const publishButton = document.querySelector(".new-post-publish");
let uploadedImageUrl = "";
let isSaving = false;

// ?id=15 na URL = modo edição (PUT). Sem id = nova publicação (POST).
const editingId = new URLSearchParams(window.location.search).get("id");
let editingPost = null;

const storedDashboardUser = JSON.parse(localStorage.getItem("ceiDashboardUser") || "null");

if (storedDashboardUser) {
  document.querySelectorAll("[data-dashboard-name]").forEach((element) => {
    element.textContent = storedDashboardUser.name;
  });
  document.querySelectorAll("[data-dashboard-profile]").forEach((element) => {
    element.textContent = "Diretora";
  });
}

// ---------- datas ----------

function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function formatPostDate(value) {
  const [year, month, day] = (value || todayIso()).split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

// O backend recebe LocalDateTime (ISO): "2026-10-29T21:39:00"
function buildDateTime() {
  const time = editingPost?.dataBlog?.slice(11, 19) || new Date().toTimeString().slice(0, 8);
  return `${dateInput.value || todayIso()}T${time}`;
}

// ---------- prévia, contadores e validação ----------

function updateCounters() {
  summaryCounter.textContent = `${summaryInput.value.length}/200`;
  contentCounter.textContent = `${contentInput.value.length}/5000`;
}

function updatePreview() {
  previewTitle.textContent = titleInput.value.trim() || newPostMock.defaultPreview.title;
  previewSummary.textContent = summaryInput.value.trim() || newPostMock.defaultPreview.summary;
  previewDate.textContent = formatPostDate(dateInput.value);

  if (categorySelect.value) {
    previewCategory.hidden = false;
    previewCategory.textContent = categorySelect.value;
  } else {
    previewCategory.hidden = true;
  }
}

function setError(field, message = "") {
  const error = document.querySelector(`[data-error-for="${field}"]`);

  if (error) {
    error.textContent = message;
  }
}

function validateForm(statusLabel) {
  const fields = [
    ["title", titleInput.value.trim(), "Informe o título da publicação."],
    ["category", categorySelect.value, "Selecione uma categoria."],
    ["summary", summaryInput.value.trim(), "Escreva o resumo da publicação."],
    ["content", contentInput.value.trim(), "Escreva o conteúdo da publicação."],
    ["status", statusLabel, "Selecione um status."],
  ];
  let isValid = true;

  fields.forEach(([field, value, message]) => {
    const hasValue = Boolean(value);
    setError(field, hasValue ? "" : message);

    if (!hasValue) {
      isValid = false;
    }
  });

  return isValid;
}

function showFeedback(message) {
  feedback.textContent = message;
  feedback.hidden = false;
}

// ---------- envio para a API (POST / PUT) ----------

function setSaving(value) {
  isSaving = value;
  publishButton.disabled = value;
  saveDraftButton.disabled = value;
}

async function saveBlogPost(statusLabel) {
  if (isSaving) return;

  document.querySelector(`[data-status-radio][value="${statusLabel}"]`).checked = true;

  if (!validateForm(statusLabel)) {
    showFeedback("Revise os campos obrigatórios destacados.");
    return;
  }

  const imageFile = imageInput.files?.[0];

  // Imagem_Post é NOT NULL: na criação a capa é obrigatória.
  if (!editingId && !imageFile) {
    showFeedback("Adicione uma imagem de capa para a publicação.");
    return;
  }

  const idUsuario = editingPost?.idUsuario ?? Number(storedDashboardUser?.idUsuario);

  if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
    showFeedback("Não foi possível identificar o usuário. Faça login novamente.");
    return;
  }

  const formData = new FormData();
  formData.append("idUsuario", idUsuario);
  formData.append("tituloBlog", titleInput.value.trim());
  formData.append("categoriaBlog", categorySelect.value);
  formData.append("resumoBlog", summaryInput.value.trim());
  formData.append("conteudoBlog", contentInput.value.trim());
  formData.append("statusBlog", STATUS_CODE[statusLabel]);
  formData.append("dataBlog", buildDateTime());
  if (imageFile) formData.append("imagem", imageFile);

  setSaving(true);
  showFeedback("Salvando publicação...");

  try {
    // Não defina Content-Type: o navegador monta o multipart com o boundary correto.
    const response = await fetch(editingId ? `${BLOG_API_URL}/${editingId}` : BLOG_API_URL, {
      method: editingId ? "PUT" : "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`O servidor respondeu com erro (HTTP ${response.status}).`);
    }

    showFeedback(statusLabel === "Rascunho" ? "Rascunho salvo com sucesso!" : "Publicação salva com sucesso!");
    setTimeout(() => {
      window.location.href = "dashboard.html?panel=blog";
    }, 1200);
  } catch (error) {
    console.error("Erro ao salvar a publicação:", error);
    showFeedback(
      error instanceof TypeError
        ? "Não foi possível conectar ao backend. Verifique se o servidor está ativo em localhost:8080."
        : error.message,
    );
    setSaving(false);
  }
}

// ---------- modo edição: carrega a publicação existente ----------

async function loadPostForEdit() {
  const kicker = document.querySelector(".new-post-kicker");
  if (kicker?.lastChild) kicker.lastChild.textContent = "Editar publicação";
  if (publishButton) publishButton.textContent = "Salvar alterações";

  try {
    const response = await fetch(`${BLOG_API_URL}/${editingId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    editingPost = await response.json();

    titleInput.value = editingPost.tituloBlog || "";
    categorySelect.value = editingPost.categoriaBlog || "";
    dateInput.value = (editingPost.dataBlog || "").slice(0, 10) || todayIso();
    summaryInput.value = editingPost.resumoBlog || "";
    contentInput.value = editingPost.conteudoBlog || "";

    const statusLabel = STATUS_LABEL[editingPost.statusBlog] || "Publicado";
    document.querySelector(`[data-status-radio][value="${statusLabel}"]`).checked = true;

    if (editingPost.imagemBlog) previewCover.src = editingPost.imagemBlog;

    updatePreview();
    updateCounters();
  } catch (error) {
    console.error("Erro ao carregar a publicação:", error);
    showFeedback("Não foi possível carregar a publicação para edição.");
    setSaving(true);
  }
}

// ---------- eventos ----------

[titleInput, categorySelect, dateInput, summaryInput].forEach((field) => {
  field.addEventListener("input", () => {
    updatePreview();
    updateCounters();
  });
});

contentInput.addEventListener("input", updateCounters);

imageInput.addEventListener("change", () => {
  const file = imageInput.files?.[0];
  const fallbackCover = editingPost?.imagemBlog || newPostMock.defaultPreview.cover;

  if (!file) {
    previewCover.src = fallbackCover;
    return;
  }

  const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

  if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
    imageInput.value = "";
    previewCover.src = fallbackCover;
    showFeedback("Use uma imagem PNG, JPG ou WEBP de até 5 MB.");
    return;
  }

  if (uploadedImageUrl) {
    URL.revokeObjectURL(uploadedImageUrl);
  }

  uploadedImageUrl = URL.createObjectURL(file);
  previewCover.src = uploadedImageUrl;
});

function insertInContent(before, after = "") {
  const start = contentInput.selectionStart;
  const end = contentInput.selectionEnd;
  const selectedText = contentInput.value.slice(start, end);
  const nextText = `${contentInput.value.slice(0, start)}${before}${selectedText}${after}${contentInput.value.slice(end)}`;

  contentInput.value = nextText;
  contentInput.focus();
  contentInput.setSelectionRange(start + before.length, start + before.length + selectedText.length);
  contentInput.dispatchEvent(new Event("input", { bubbles: true }));
}

document.querySelectorAll("[data-editor-command]").forEach((button) => {
  button.addEventListener("click", () => {
    const command = button.dataset.editorCommand;

    if (command === "bold") {
      insertInContent("**", "**");
    } else if (command === "italic") {
      insertInContent("_", "_");
    } else if (command === "insertUnorderedList") {
      insertInContent("- ");
    } else if (command === "justifyLeft") {
      insertInContent("\n");
    }
  });
});

document.querySelector("[data-editor-link]")?.addEventListener("click", () => {
  insertInContent("[texto do link](", "https://)");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  saveBlogPost("Publicado");
});

saveDraftButton.addEventListener("click", () => {
  saveBlogPost("Rascunho");
});

// ---------- início ----------

dateInput.value = todayIso();
updatePreview();
updateCounters();

if (editingId) {
  loadPostForEdit();
}