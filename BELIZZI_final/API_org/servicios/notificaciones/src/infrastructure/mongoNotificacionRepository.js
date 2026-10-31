import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    tipo: { type: String, required: true },
    mensaje: { type: String, required: true },
    datos: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

const Notificacion = mongoose.models.Notificacion || mongoose.model("Notificacion", schema);

const mapear = (d) => ({
  id: d._id.toString(),
  tipo: d.tipo,
  mensaje: d.mensaje,
  datos: d.datos,
  createdAt: d.createdAt,
});

export async function connectMongo(url, intentos = 20, pausaMs = 3000) {
  for (let i = 1; i <= intentos; i++) {
    try {
      await mongoose.connect(url);
      console.log("[notificaciones] Conectado a MongoDB");
      return;
    } catch (err) {
      console.log(`[notificaciones] MongoDB no disponible (${i}/${intentos}): ${err.message}`);
      await new Promise((r) => setTimeout(r, pausaMs));
    }
  }
  throw new Error("No se pudo conectar a MongoDB");
}

export const mongoNotificacionRepository = {
  async create(data) {
    return mapear(await Notificacion.create(data));
  },
  async findRecent(limit = 50) {
    const docs = await Notificacion.find().sort({ createdAt: -1 }).limit(limit);
    return docs.map(mapear);
  },
};
