
import { createContext, useContext, useState } from "react";
import { api, clearSession, getToken, setSession } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [nombre, setNombre] = useState(
    localStorage.getItem("nombre")
  );
  const [email, setEmail] = useState(
    localStorage.getItem("correo")
  );

  const login = async (correo, password) => {
    const data = await api("/auth/login", {
      method: "POST",
      body: { correo, password }
    });

    setSession(data);
    setToken(data.token);
    setNombre(data.nombre);
    setEmail(data.correo || correo);

    localStorage.setItem("correo", data.correo || correo);

    return data;
  };

  const register = async (nombre, correo, password) => {
    const data = await api("/auth/register", {
      method: "POST",
      body: { nombre, correo, password }
    });

    // Si el registro devuelve un token, iniciar sesión.
    if (data.token) {
      setSession(data);
      setToken(data.token);
      setNombre(data.nombre || nombre);
      setEmail(data.correo || correo);

      localStorage.setItem("correo", data.correo || correo);
    }

    return data;
  };

  const logout = () => {
    clearSession();
    setToken(null);
    setNombre(null);
    setEmail(null);
    localStorage.removeItem("correo");
  };

  return (
    <AuthContext.Provider
      value={{ token, nombre, email, login, register, logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
