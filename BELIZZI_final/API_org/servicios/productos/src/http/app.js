import express from "express";
import { makeAuthMiddleware } from "./authMiddleware.js";

export function createApp({ casos, jwtSecret }) {
  const app = express();
  app.use(express.json());

  const requireAuth = makeAuthMiddleware(jwtSecret);

  app.get("/health", (req, res) => res.json({ ok: true, servicio: "productos" }));

  // Todas las rutas de productos requieren token
  const router = express.Router();
  router.use(requireAuth);

  router.get("/", async (req, res) => res.json(await casos.listar()));
  router.post("/", async (req, res) => res.status(201).json(await casos.crear(req.body, req.user)));
  router.get("/:id", async (req, res) => res.json(await casos.obtener(req.params.id)));
  router.put("/:id", async (req, res) => res.json(await casos.actualizar(req.params.id, req.body)));
  router.delete("/:id", async (req, res) => {
    await casos.eliminar(req.params.id);
    res.status(204).end();
  });

  router.get("/:id/resenas", async (req, res) => res.json(await casos.listarResenas(req.params.id)));
  router.post("/:id/resenas", async (req, res) =>
    res.status(201).json(await casos.agregarResena(req.params.id, req.body, req.user))
  );

  app.use("/api/productos", router);

  app.use((err, req, res, next) => {
    if (err.status) return res.status(err.status).json({ msg: err.message });
    console.error("[productos] Error:", err);
    res.status(500).json({ msg: "Error interno del servidor" });
  });

  return app;
}
