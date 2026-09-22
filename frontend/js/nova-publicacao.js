const newPostMock = {
  defaultDate: "2026-09-11",
  defaultPreview: {
    title: "Título da sua publicação",
    summary:
      "Aqui aparecerá o resumo da sua publicação. Ele deve ser curto e atrativo para que as famílias se interessem em ler mais.",
    cover: "../assets/figma-dashboard/nova-preview.png",
  },
};

window.ceiNewPostMock = newPostMock;

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
let uploadedImageUrl = "";

const storedDashboardUser = JSON.parse(localStorage.getItem("ceiDashboardUser") || "null");

if (storedDashboardUser) {
  document.querySelectorAll("[data-dashboard-name]").forEach((element) => {
    element.textContent = storedDashboardUser.name;
  });
  document.querySelectorAll("[data-dashboard-profile]").forEach((element) => {
    element.textContent = "Diretora";
  });
}

function formatPostDate(value) {
  if (!value) {
    return "11 de setembro de 2026";
  }

  const [year, month, day] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

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

function validateForm(statusOverride = "") {
  const selectedStatus = statusOverride || document.querySelector("[data-status-radio]:checked")?.value || "";
  const fields = [
    ["title", titleInput.value.trim(), "Informe o título da publicação."],
    ["category", categorySelect.value, "Selecione uma categoria."],
    ["summary", summaryInput.value.trim(), "Escreva o resumo da publicação."],
    ["content", contentInput.value.trim(), "Escreva o conteúdo da publicação."],
    ["status", selectedStatus, "Selecione um status."],
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

function simulateSave(status) {
  if (!validateForm(status)) {
    showFeedback("Revise os campos obrigatórios destacados.");
    return;
  }

  showFeedback(status === "Rascunho" ? "Rascunho salvo no protótipo." : "Publicação registrada no protótipo.");
}

[titleInput, categorySelect, dateInput, summaryInput].forEach((field) => {
  field.addEventListener("input", () => {
    updatePreview();
    updateCounters();
  });
});

contentInput.addEventListener("input", updateCounters);

imageInput.addEventListener("change", () => {
  const file = imageInput.files?.[0];

  if (!file) {
    previewCover.src = newPostMock.defaultPreview.cover;
    return;
  }

  const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

  if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
    imageInput.value = "";
    previewCover.src = newPostMock.defaultPreview.cover;
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
  simulateSave("Publicado");
});

saveDraftButton.addEventListener("click", () => {
  document.querySelector('[data-status-radio][value="Rascunho"]').checked = true;
  simulateSave("Rascunho");
});

updatePreview();
updateCounters();
