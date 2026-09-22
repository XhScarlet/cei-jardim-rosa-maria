/*
  Microinterações do protótipo:
  - filtros do Blog público;
  - mensagens de sucesso para formulários estáticos;
  - feedback visual curto para botões que ainda dependem do backend.
*/

const blogFilters = document.querySelectorAll("[data-filter]");
const blogItems = document.querySelectorAll("[data-category]");

blogFilters.forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    const filter = filterButton.dataset.filter;

    blogFilters.forEach((button) => {
      const isActive = button === filterButton;
      button.classList.toggle("blog-filter-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    blogItems.forEach((item) => {
      const categories = item.dataset.category.split(" ");
      const shouldShow = filter === "todos" || categories.includes(filter);
      item.hidden = !shouldShow;
    });
  });
});

function showSuccessMessage(container, message) {
  let feedback = container.querySelector(".micro-feedback");

  if (!feedback) {
    feedback = document.createElement("p");
    feedback.className = "micro-feedback";
    feedback.setAttribute("role", "status");
    container.appendChild(feedback);
  }

  feedback.textContent = message;
  feedback.hidden = false;
}

document.querySelectorAll(".matricula-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nativeStatus = form.querySelector(".form-message-success");
    if (nativeStatus) {
      nativeStatus.hidden = false;
    }

    showSuccessMessage(form, "Solicitação recebida com sucesso.");
  });
});

document.querySelectorAll(".workspace-form").forEach((form) => {
  const actionButton = form.querySelector("button");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    showSuccessMessage(form, "Informação salva com sucesso.");
  });

  if (actionButton) {
    actionButton.addEventListener("click", () => {
      showSuccessMessage(form, "Informação salva com sucesso.");
    });
  }
});

document.querySelectorAll(".workspace-card:not(.workspace-form) button, .card-heading button").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".workspace-card, .dashboard-card");
    if (card) {
      showSuccessMessage(card, "Ação registrada no protótipo.");
    }
  });
});
