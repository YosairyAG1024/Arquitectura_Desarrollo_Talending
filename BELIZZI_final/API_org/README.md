# Belizzi – Proyecto final (API de productos con microservicios)

BELIZZI es una tienda virtual de ropa y accesorios inspirada en la elegancia y el estilo italiano. Su propósito es ofrecer una experiencia de compra moderna, atractiva, dinámica y fácil de utilizar.

La característica principal de BELIZZI es que su diseño visual se adapta a las diferentes temporadas del año. Esto significa que la página puede cambiar sus colores, banners, imágenes, colecciones destacadas y elementos visuales dependiendo de la temporada vigente.

BELIZZI no será una tienda convencional. Busca transmitir una identidad propia, combinando moda, tecnología y diseño visual.
El nombre BELIZZI está inspirado en Italia, por lo que su identidad estará relacionada con la elegancia, la moda y el estilo. Ademas es un nombre sacado de uno de los proyectos que hice en el colegio con excel.

BELIZZI es una aplicación full stack: frontend en React, API Gateway y tres microservicios en Node/Express, cada uno con su propia base de datos, comunicados por eventos con RabbitMQ y levantados con Docker Compose.

## Tecnologías

Node 22 · Express 5 · SQL Server · MongoDB (Mongoose) · RabbitMQ (amqplib) · JWT + bcrypt · React 18 + Vite · TanStack Query · React Router · Vitest · Supertest · React Testing Library · Docker / Docker Compose · Nginx.

## Arquitectura

```
                       ┌────────────────────────────────────────────┐
 Navegador ──► Frontend│ (nginx :3000)  /api/* ──┐                  │
 (React)               └─────────────────────────┼──────────────────┘
                                                 ▼
                                      API Gateway (:8080)
                       ┌─────────────────────┬────────────────────┬──────────────────────┐
                       ▼ /api/auth           ▼ /api/productos     ▼ /api/notificaciones
                 ┌───────────┐         ┌─────────────┐      ┌────────────────┐
                 │   auth    │         │  productos  │      │ notificaciones │
                 │  (:3001)  │         │   (:3002)   │      │    (:3003)     │
                 └─────┬─────┘         └───┬─────┬───┘      └───────┬────────┘
                       │                   │     │                  │
              SQL Server (BelizziAuthDB)   │     └► MongoDB         └► MongoDB
                       │      SQL Server (BelizziProductosDB)   (reseñas)  (notificaciones)
                       │
                       └──► RabbitMQ  ── usuario.creado ──► notificaciones
```

| Servicio | Responsabilidad | Base de datos propia |
|---|---|---|
| `servicios/auth` | Registro, login, emisión de JWT | SQL Server `BelizziAuthDB` |
| `servicios/productos` | CRUD de productos y reseñas | SQL Server `BelizziProductosDB` (productos) + MongoDB `mongo-productos` (reseñas) |
| `servicios/notificaciones` | Consume `usuario.creado` y guarda una notificación | MongoDB `mongo-notificaciones` |
| `gateway` | Única entrada para el frontend; redirige por prefijo | — |

Ningún servicio lee la base de datos de otro. Nota: por ahorro de recursos, las dos bases de SQL Server (`BelizziAuthDB` y `BelizziProductosDB`) viven en la misma instancia/contenedor, pero son bases distintas y cada servicio solo se conecta a la suya.

Los servicios `productos` y `notificaciones` usan una **arquitectura hexagonal** (`domain` / `application` / `infrastructure` / `http`): los casos de uso no conocen SQL Server, MongoDB ni RabbitMQ, solo puertos que se inyectan (por eso se prueban con repositorios falsos).

## Cómo levantar todo

Requisitos: Docker y Docker Compose.

```bash
cp .env.example .env      # opcional; sin .env se usan valores por defecto
docker compose up --build
```

La primera vez SQL Server tarda ~30–60 s; los servicios reintentan la conexión solos. Después:

- Frontend: http://localhost:3000
- API Gateway: http://localhost:8080
- Panel de RabbitMQ: http://localhost:15672 (guest / guest)

### Frontend en modo desarrollo (opcional)

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173, /api se envía al gateway en :8080
```

## Pruebas

Cada paquete se prueba con `npm test` (Vitest):

```bash
cd servicios/auth && npm install && npm test
cd servicios/productos && npm install && npm test
cd servicios/notificaciones && npm install && npm test
cd gateway && npm install && npm test
cd frontend && npm install && npm test
# o todo junto:
./scripts/test-all.sh
```

Cobertura pedida:
- **Unitarias (casos de uso):** `registerUser`, casos de uso de productos, `handleUsuarioCreado`.
- **Integración con Supertest:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` (401 sin token / 200 con token), CRUD de `/api/productos` (protegido), `/api/notificaciones` y el gateway.
- **React Testing Library:** `ProductoForm` y `ProtectedRoute`.

## Endpoints principales (a través del gateway, `http://localhost:8080`)

| Método | Ruta | Token | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | No | Registra usuario (publica `usuario.creado`) |
| POST | `/api/auth/login` | No | Devuelve `{ token, nombre }` |
| GET | `/api/auth/me` | **Sí** | Datos del usuario del token |
| GET | `/api/productos` | **Sí** | Lista productos |
| POST | `/api/productos` | **Sí** | Crea producto |
| GET | `/api/productos/:id` | **Sí** | Detalle |
| PUT | `/api/productos/:id` | **Sí** | Actualiza |
| DELETE | `/api/productos/:id` | **Sí** | Elimina |
| GET | `/api/productos/:id/resenas` | **Sí** | Lista reseñas (MongoDB) |
| POST | `/api/productos/:id/resenas` | **Sí** | Agrega reseña `{ calificacion 1-5, comentario }` |
| GET | `/api/notificaciones` | **Sí** | Notificaciones guardadas por el evento |

Las rutas protegidas responden `401` sin token (`Authorization: Bearer <token>`). Cada servicio verifica el JWT con el mismo `JWT_SECRET`.

## Evento de mensajería

- **Evento:** `usuario.creado` (exchange `eventos`, tipo `topic`).
- **Publica:** servicio `auth`, al registrar un usuario. Si RabbitMQ falla, el registro no falla (se registra el error en consola).
- **Consume:** servicio `notificaciones`, cola `notificaciones.usuario_creado`. Muestra un aviso en consola y guarda una notificación en su MongoDB.
- **Para verlo en la demo:** registra un usuario en el frontend, luego mira `docker compose logs -f notificaciones` o la página **Notificaciones** del frontend.

## Estructura

```
├── gateway/                 API Gateway (Express + http-proxy-middleware)
├── servicios/
│   ├── auth/                Registro / login / JWT  (SQL Server + publica evento)
│   ├── productos/           Productos (SQL Server) y reseñas (MongoDB)
│   └── notificaciones/      Consume usuario.creado (MongoDB)
├── frontend/                React + Vite
├── docker-compose.yml
├── .env.example
└── src/                     API monolítica del primer avance (se conserva sin cambios)
```

> La carpeta `src/` con su `Dockerfile` y `package.json` en la raíz corresponde al primer avance (API única). Se conservó intacta; la arquitectura final está en `gateway/` y `servicios/`, y `docker compose` no usa la API de la raíz.

## Limitaciones conocidas / notas

- Las dos bases SQL Server comparten instancia (ver arriba).
- La API del primer avance (`src/`) no se modificó: por ejemplo, escucha en el puerto 1234 fijo y no usa el evento. El servicio `servicios/auth` contiene la versión corregida y completa de esa lógica.
- Las pruebas se escribieron sin acceso al registro npm en el entorno de desarrollo del asistente; ejecútalas con `./scripts/test-all.sh` y revisa cualquier ajuste menor de versiones.
