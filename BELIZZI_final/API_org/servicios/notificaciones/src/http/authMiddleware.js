import jwt from "jsonwebtoken";

export function makeAuthMiddleware(secret) {
  return function requireAuth(req, res, next) {
    const [tipo, token] = (req.headers.authorization || "").split(" ");
    if (tipo !== "Bearer" || !token) {
      return res.status(401).json({ msg: "Token requerido" });
    }
    try {
      req.user = jwt.verify(token, secret);
      next();
    } catch {
      res.status(401).json({ msg: "Token inválido o expirado" });
    }
  };
}
