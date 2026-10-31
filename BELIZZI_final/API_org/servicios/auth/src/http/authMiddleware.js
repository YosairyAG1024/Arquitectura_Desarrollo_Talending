export function makeAuthMiddleware(tokenService) {
  return function requireAuth(req, res, next) {
    const header = req.headers.authorization || "";
    const [tipo, token] = header.split(" ");
    if (tipo !== "Bearer" || !token) {
      return res.status(401).json({ msg: "Token requerido" });
    }
    try {
      req.user = tokenService.verify(token);
      next();
    } catch {
      res.status(401).json({ msg: "Token inválido o expirado" });
    }
  };
}
