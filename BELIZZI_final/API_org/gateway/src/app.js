import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

/**
 * El gateway NO parsea el body (no usa express.json) para poder reenviarlo intacto.
 * Cada prefijo /api/... se redirige al servicio que le corresponde.
 */
export function createGateway({ authUrl, productosUrl, notificacionesUrl }) {
  const app = express();
  app.use(cors());

  app.get("/health", (req, res) => res.json({ ok: true, servicio: "gateway" }));

  const proxy = (pathFilter, target) =>
    createProxyMiddleware({
      target,
      pathFilter,
      changeOrigin: true,
      on: {
        error: (err, req, res) => {
          console.error(`[gateway] Error hacia ${target}:`, err.message);
          if (!res.headersSent && typeof res.writeHead === "function") {
            res.writeHead(502, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ msg: "Servicio no disponible" }));
          }
        },
      },
    });

  app.use(proxy("/api/auth", authUrl));
  app.use(proxy("/api/productos", productosUrl));
  app.use(proxy("/api/notificaciones", notificacionesUrl));

  app.use((req, res) => res.status(404).json({ msg: "Ruta no encontrada en el gateway" }));
  return app;
}
