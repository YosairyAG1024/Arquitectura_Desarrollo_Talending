import express from "express";
import { makeAuthMiddleware } from "./authMiddleware.js";

export function createApp({ notificacionRepo, jwtSecret }) {
  const app = express();
  app.use(express.json());
  const requireAuth = makeAuthMiddleware(jwtSecret);

  app.get("/health", (req, res) => res.json({ ok: true, servicio: "notificaciones" }));

  app.get("/api/notificaciones", requireAuth, async (req, res) => {
    res.json(await notificacionRepo.findRecent());
  });

  app.use((err, req, res, next) => {
    console.error("[notificaciones] Error:", err);
    res.status(500).json({ msg: "Error interno del servidor" });
  });
  return app;
}
