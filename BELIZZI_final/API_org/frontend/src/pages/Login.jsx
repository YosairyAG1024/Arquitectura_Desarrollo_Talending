import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [modo, setModo] = useState("login");
  const [form, setForm] = useState({ nombre: "", correo: "", password: "" });
  const [info, setInfo] = useState("");

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const mutation = useMutation({
    mutationFn: async () => {
      if (modo === "registro") {
        await register(form.nombre, form.correo, form.password);
        setInfo("Cuenta creada. Ahora inicia sesión.");
        setModo("login");
        return;
      }
      await login(form.correo, form.password);
      navigate("/productos");
    },
  });

  const enviar = (e) => {
    e.preventDefault();
    setInfo("");
    mutation.mutate();
  };

  return (
    <div className="card auth">
      <h2>{modo === "login" ? "Iniciar sesión" : "Crear cuenta"}</h2>
      <form onSubmit={enviar} className="form">
        {modo === "registro" && (
          <label>
            Nombre
            <input name="nombre" value={form.nombre} onChange={cambiar} />
          </label>
        )}
        <label>
          Correo
          <input name="correo" type="email" value={form.correo} onChange={cambiar} />
        </label>
        <label>
          Contraseña
          <input name="password" type="password" value={form.password} onChange={cambiar} />
        </label>
        {info && <p className="ok">{info}</p>}
        {mutation.isError && <p role="alert" className="error">{mutation.error.message}</p>}
        <button type="submit" disabled={mutation.isPending}>
          {modo === "login" ? "Entrar" : "Registrarme"}
        </button>
      </form>
      <button className="link" onClick={() => setModo(modo === "login" ? "registro" : "login")}>
        {modo === "login" ? "¿No tienes cuenta? Regístrate" : "Ya tengo cuenta"}
      </button>
    </div>
  );
}
