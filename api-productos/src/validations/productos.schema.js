import { z } from "zod";

export const productoSchema = z.object({
    name: z.string()
        .trim()
        .min(1, "El nombre es obligatorio"),

    price: z.number()
        .positive("El precio debe ser mayor que cero"),

    stock: z.number()
        .int("El stock debe ser un número entero")
        .min(0, "El stock no puede ser negativo")
});
