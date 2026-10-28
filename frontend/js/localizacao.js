const locationButton = document.querySelector("[data-location-button]");
const UNIT_INFO_API_URL = "http://localhost:8080/api/informacoes-cei/1";

locationButton?.addEventListener("click", async (event) => {
  event.preventDefault();

  const mapWindow = window.open("about:blank", "_blank");
  if (!mapWindow) {
    window.alert("Permita a abertura de pop-ups para abrir a localização no Google Maps.");
    return;
  }
  mapWindow.opener = null;

  try {
    const response = await fetch(UNIT_INFO_API_URL);
    if (!response.ok) {
      throw new Error(`Não foi possível consultar o endereço cadastrado (HTTP ${response.status}).`);
    }

    const unidade = await response.json();
    const endereco = [
      unidade.enderUnidade,
      unidade.bairroUnidade,
      unidade.cidadeUnidade,
      unidade.estadoUnidade,
      unidade.cepUnidade,
    ].filter((parte) => typeof parte === "string" && parte.trim()).join(", ");

    if (!endereco) {
      throw new Error("Não há endereço cadastrado para esta unidade.");
    }

    mapWindow.location.replace(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`,
    );
  } catch (error) {
    mapWindow.close();
    console.error("Não foi possível abrir a localização da unidade:", error);
    window.alert(error.message || "Não foi possível abrir o Google Maps.");
  }
});
