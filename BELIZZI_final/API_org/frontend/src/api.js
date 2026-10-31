
const TOKEN_KEY = "token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setSession = ({ token, nombre, correo }) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  if (nombre) {
    localStorage.setItem("nombre", nombre);
  }

  if (correo) {
    localStorage.setItem("correo", correo);
  }
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("nombre");
  localStorage.removeItem("correo");
};

/* Todas las peticiones pasan por /api */
export async function api(path, { method = "GET", body } = {}) {
  const headers = {
    "Content-Type": "application/json"
  };

  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res;

  try {
    res = await fetch(`/api${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch (error) {
    console.error("Error de conexión con el servidor:", error);

    throw new Error(
      "No se pudo conectar con el servidor. Verifica que el backend esté funcionando."
    );
  }

  if (res.status === 401 && token) {
    clearSession();
    window.location.href = "/login";
    throw new Error("Tu sesión ha expirado.");
  }

  if (res.status === 204) {
    return null;
  }

  const contentType = res.headers.get("content-type") || "";

  let data;

  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = { msg: await res.text() };
  }

  if (!res.ok) {
    throw new Error(
      data.msg || data.message || `Error del servidor: ${res.status}`
    );
  }

  return data;
}
