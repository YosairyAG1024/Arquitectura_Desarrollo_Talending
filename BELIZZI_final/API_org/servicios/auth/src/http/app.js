import express from "express";
import { makeAuthMiddleware } from "./authMiddleware.js";

export function createApp({ registerUser, loginUser, tokenService }) {
  const app = express();
  app.use(express.json());

  const requireAuth = makeAuthMiddleware(tokenService);

  app.get("/health", (req, res) => res.json({ ok: true, servicio: "auth" }));

  app.post("/api/auth/register", async (req, res) => {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  });

  app.post("/api/auth/login", async (req, res) => {
    res.json(await loginUser(req.body));
  });

  // Ruta protegida: devuelve los datos del token
  app.get("/api/auth/me", requireAuth, (req, res) => {
    res.json({ id: req.user.id, nombre: req.user.nombre });
  });

  app.use((err, req, res, next) => {
    if (err.status) return res.status(err.status).json({ msg: err.message });
    console.error("[auth] Error:", err);
    res.status(500).json({ msg: "Error interno del servidor" });
  });

  return app;
}
