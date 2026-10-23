import { Resena } from "../models/resena.model.js";

//get /api/resenas
export async function listarResenas(req, res) {
    const filtro = {};
    if(req.query.productoId) {
        filtro.productoId = Number(req.query.productoId);
    }
    const resenas = await Resena.find(filtro).sort({createdAt: -1});
    res.json(resenas);
}

//post /api/resenas
export async function  crearResenas(req, res) {
    const resena = await Resena.create(req.body);
    res.status(201).json(resena);
}

