import mongoose from "mongoose";

const resenaSchema = new mongoose.Schema(
  {
    productoId: { type: Number, required: true, index: true },
    usuarioId: { type: Number, required: true },
    autor: { type: String, required: true },
    calificacion: { type: Number, min: 1, max: 5, required: true },
    comentario: { type: String, default: "" },
  },
  { timestamps: true }
);

const Resena = mongoose.models.Resena || mongoose.model("Resena", resenaSchema);

const mapear = (d) => ({
  id: d._id.toString(),
  productoId: d.productoId,
  usuarioId: d.usuarioId,
  autor: d.autor,
  calificacion: d.calificacion,
  comentario: d.comentario,
  createdAt: d.createdAt,
});

export async function connectMongo(url, intentos = 20, pausaMs = 3000) {
  for (let i = 1; i <= intentos; i++) {
    try {
      await mongoose.connect(url);
      console.log("[productos] Conectado a MongoDB");
      return;
    } catch (err) {
      console.log(`[productos] MongoDB no disponible (${i}/${intentos}): ${err.message}`);
      await new Promise((r) => setTimeout(r, pausaMs));
    }
  }
  throw new Error("No se pudo conectar a MongoDB");
}

export const mongoResenaRepository = {
  async create(data) {
    return mapear(await Resena.create(data));
  },
  async findByProducto(productoId) {
    const docs = await Resena.find({ productoId }).sort({ createdAt: -1 });
    return docs.map(mapear);
  },
};
