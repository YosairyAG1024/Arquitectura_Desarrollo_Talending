export function makeFakeProductoRepo() {
  let seq = 0;
  const items = [];
  return {
    items,
    async findAll() { return [...items]; },
    async findById(id) { return items.find((p) => p.id === Number(id)) || null; },
    async create(data) { const p = { id: ++seq, ...data }; items.push(p); return p; },
    async update(id, data) {
      const p = items.find((x) => x.id === Number(id));
      Object.assign(p, data);
      return p;
    },
    async remove(id) {
      const i = items.findIndex((x) => x.id === Number(id));
      if (i >= 0) items.splice(i, 1);
    },
  };
}

export function makeFakeResenaRepo() {
  const items = [];
  return {
    items,
    async create(data) { const r = { id: String(items.length + 1), ...data }; items.push(r); return r; },
    async findByProducto(id) { return items.filter((r) => r.productoId === id); },
  };
}
