export function makeFakeUserRepo() {
  const users = [];
  return {
    users,
    async findByEmail(correo) {
      return users.find((u) => u.correo === correo) || null;
    },
    async create({ nombre, correo, passwordHash }) {
      const u = { id: users.length + 1, nombre, correo, passwordHash };
      users.push(u);
      return { id: u.id, nombre, correo };
    },
  };
}

export const fakeHasher = {
  hash: async (p) => `hash:${p}`,
  compare: async (p, h) => h === `hash:${p}`,
};
