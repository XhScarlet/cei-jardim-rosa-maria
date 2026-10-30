document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".matricula-form");
    const statusMessage = document.getElementById("matricula-status");

    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = {
            responsavel: document.getElementById("matricula-responsavel").value.trim(),
            crianca: document.getElementById("matricula-crianca").value.trim(),
            nascimento: document.getElementById("matricula-nascimento").value,
            telefone: document.getElementById("matricula-telefone").value.trim(),
        };

        try {
            const response = await fetch("http://localhost:8080/api/matricula", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok || response.status === 201) {
                if (statusMessage) {
                    statusMessage.hidden = false;
                    statusMessage.classList.remove("form-message-error");
                    statusMessage.classList.add("form-message-success");
                    statusMessage.textContent = "Formulário enviado com sucesso. A secretaria entrará em contato.";
                }
                form.reset();
            } else {
                throw new Error("Falha ao salvar dados no servidor.");
            }
        } catch (error) {
            console.error("Erro na integração:", error);
            if (statusMessage) {
                statusMessage.hidden = false;
                statusMessage.classList.remove("form-message-success");
                statusMessage.classList.add("form-message-error");
                statusMessage.textContent = "Ocorreu um erro ao enviar o formulário. Tente novamente.";
            }
        }
    });
});