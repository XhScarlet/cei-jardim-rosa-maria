const infoCeiMock = {
  unidade: {
    nome: "CEI Jardim Rosa Maria",
    telefone: "(11) 5893-0232",
    email: "ceijrmaria@sme.prefeitura.sp.gov.br",
  },
  atendimento: {
    dias: "Segunda à sexta-feira",
    horario: "07h00 às 16h30",
  },
  turmas: [
    { nome: "Berçário I", faixa: "3 meses a 1 ano" },
    { nome: "Berçário II", faixa: "2 anos a 3" },
    { nome: "Mini Grupo I", faixa: "3 anos a 4 anos" },
    { nome: "Mini Grupo II", faixa: "4 anos a 5 anos" },
  ],
};

window.infoCeiMock = infoCeiMock;

const infoCeiModal = document.querySelector("[data-info-modal]");
const infoCeiModalTitle = document.querySelector("[data-info-modal-title]");

function openInfoCeiModal(sectionName) {
  if (!infoCeiModal) return;

  if (infoCeiModalTitle) {
    infoCeiModalTitle.textContent = `Editar ${sectionName}`;
  }

  infoCeiModal.hidden = false;
}

function closeInfoCeiModal() {
  if (!infoCeiModal) return;
  infoCeiModal.hidden = true;
}

document.querySelectorAll("[data-info-edit]").forEach((button) => {
  button.addEventListener("click", () => {
    openInfoCeiModal(button.dataset.infoEdit || "Informações");
  });
});

document.querySelector("[data-info-modal-close]")?.addEventListener("click", closeInfoCeiModal);
document.querySelector("[data-info-modal-cancel]")?.addEventListener("click", closeInfoCeiModal);

infoCeiModal?.addEventListener("click", (event) => {
  if (event.target === infoCeiModal) {
    closeInfoCeiModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeInfoCeiModal();
  }
});
