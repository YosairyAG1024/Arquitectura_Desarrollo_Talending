import { createGateway } from "./app.js";

const port = Number(process.env.PORT || 8080);

const app = createGateway({
  authUrl: process.env.AUTH_URL || "http://localhost:3001",
  productosUrl: process.env.PRODUCTOS_URL || "http://localhost:3002",
  notificacionesUrl: process.env.NOTIFICACIONES_URL || "http://localhost:3003",
});

app.listen(port, () => console.log(`[gateway] Escuchando en el puerto ${port}`));
