document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".matricula-form");
    const statusMessage = document.getElementById("matricula-status");
    const submitButton = form?.querySelector('button[type="submit"]');

    if (!form) return;

    let submitting = false;
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (submitting) return;

        submitting = true;
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.setAttribute("aria-busy", "true");
        }

        const formData = {
            responsavel: document.getElementById("matricula-responsavel").value.trim(),
            crianca: document.getElementById("matricula-crianca").value.trim(),
            nascimento: document.getElementById("matricula-nascimento").value,
            telefone: document.getElementById("matricula-telefone").value.trim(),
            consentimentoLgpd: document.getElementById("consentimento-lgpd").checked,
        };

        try {
            const response = await window.apiFetch(`${window.APP_CONFIG.apiBaseUrl}/api/matricula`, {
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
                const message = response.status === 429
                    ? "Muitas tentativas em pouco tempo. Aguarde e tente novamente."
                    : "Não foi possível enviar. Confira os dados e tente novamente.";
                throw new Error(message);
            }
        } catch (error) {
            console.error("Erro na integração:", error);
            if (statusMessage) {
                statusMessage.hidden = false;
                statusMessage.classList.remove("form-message-success");
                statusMessage.classList.add("form-message-error");
                statusMessage.textContent = error.message || "Ocorreu um erro ao enviar o formulário. Tente novamente.";
            }
        } finally {
            submitting = false;
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.removeAttribute("aria-busy");
            }
        }
    });
});