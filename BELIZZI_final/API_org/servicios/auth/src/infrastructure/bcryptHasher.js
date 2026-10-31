import bcrypt from "bcryptjs";

export const bcryptHasher = {
  hash: (plain) => bcrypt.hash(plain, 10),
  compare: (plain, hash) => bcrypt.compare(plain, hash),
};
