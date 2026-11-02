window.APP_CONFIG = Object.freeze({
  apiBaseUrl: ["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? "http://localhost:8080"
    : "https://cei-jdrosamaria-backend.onrender.com"
});

let csrfToken;

async function carregarTokenCsrf() {
  const response = await fetch(`${window.APP_CONFIG.apiBaseUrl}/api/auth/csrf`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Não foi possível iniciar a sessão protegida (HTTP ${response.status}).`);
  }
  const data = await response.json();
  csrfToken = data.token;
}

window.apiFetch = async function (url, options = {}) {
  const isBootstrapRequest = String(url).includes("/api/auth/session");
  if (window.ceiDashboardAuth && !isBootstrapRequest) {
    const autenticado = await window.ceiDashboardAuth;
    if (!autenticado) {
      throw new Error("Sessão administrativa inválida.");
    }
  }

  const requestOptions = { ...options, credentials: "include" };
  const method = (requestOptions.method || "GET").toUpperCase();
  const headers = new Headers(requestOptions.headers || {});
  if (!["GET", "HEAD", "OPTIONS", "TRACE"].includes(method)) {
    if (!csrfToken) await carregarTokenCsrf();
    headers.set("X-XSRF-TOKEN", csrfToken);
  }
  requestOptions.headers = headers;

  const response = await fetch(url, requestOptions);
  if (response.status === 401 && window.ceiDashboardAuth) {
    localStorage.removeItem("ceiDashboardUser");
    window.location.replace("login.html");
  }
  return response;
};
