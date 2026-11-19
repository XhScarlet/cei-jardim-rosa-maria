const ACCESS_API_URL = `${window.APP_CONFIG.apiBaseUrl}/api/telemetria/acessos`;
const currentPageName = {
  "index.html": "Início",
  "sobre.html": "Sobre o CEI",
  "blog.html": "Blog",
  "matricula.html": "Matrícula",
}[window.location.pathname.split("/").pop()];

window.registrarAcessoCei = async function (pagina, idPost = null) {
  try {
    const response = await window.apiFetch(ACCESS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagina, idPost }),
    });
    if (!response.ok) {
      throw new Error(`O registro do acesso falhou (HTTP ${response.status}).`);
    }
  } catch (error) {
    console.warn("Não foi possível registrar o acesso ao site:", error.message);
  }
};

if (currentPageName) {
  window.registrarAcessoCei(currentPageName);
}
