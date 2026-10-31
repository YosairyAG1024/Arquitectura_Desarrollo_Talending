import jwt from "jsonwebtoken";

export function makeTokenService(secret, expiresIn = "2h") {
  return {
    sign: (payload) => jwt.sign(payload, secret, { expiresIn }),
    verify: (token) => jwt.verify(token, secret),
  };
}
