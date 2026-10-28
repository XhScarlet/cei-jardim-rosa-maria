const publicAboutText = document.querySelector("[data-public-about]");
const PUBLIC_UNIT_INFO_API_URL = "http://localhost:8080/api/informacoes-cei/1";

async function carregarSobrePublico() {
  if (!publicAboutText) return;

  try {
    const response = await fetch(PUBLIC_UNIT_INFO_API_URL);
    if (!response.ok) {
      throw new Error(`Não foi possível carregar as informações do CEI (HTTP ${response.status}).`);
    }

    const informacoes = await response.json();
    if (typeof informacoes.sobreCei === "string" && informacoes.sobreCei.trim()) {
      publicAboutText.textContent = informacoes.sobreCei.trim();
    }
  } catch (error) {
    console.error("Falha ao carregar o texto público sobre o CEI:", error);
  }
}

carregarSobrePublico();
