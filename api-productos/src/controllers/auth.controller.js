import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/sqlserver.js"

//post /api/auth/registro
export async function registro(req, res){
    const{nombre, correo, password} = req.body;
    if(!nombre || !correo || !password) {
        return res.status(400).json({msg: "Por favor, complete todos los campos"});
    }

    const hash = await bcrypt.hash(password, 10);
    const r = await pool.request()
        .input("nombre", nombre)
        .input("correo", correo)
        .input("hash", hash)
        .query("INSERT INTO usuarios (nombre, correo, password_hash) output inserted.id,inserted.nombre,inserted.correo VALUES (@nombre, @correo, @hash)");
    res.status(201).json(r.recordset[0]);
    }

//post /api/auth/login
export async function login(req, res){
    const {correo, password } = req.body;
    if(!correo || !password) {
        return res.status(400).json({msg: "Por favor, complete todos los campos"})
    }
    const r = await pool.request()
        .input("correo", correo)
        .query("SELECT * FROM usuarios WHERE correo = @correo");
        const usuarios = r.recordset[0];

        const ok = usuarios && await bcrypt.compare(password, usuarios.password_hash);
        if (!ok) {
            return res.status(401).json({msg: "Credenciales invalidas" });
        }
        const { id, nombre } = usuarios;
        const token = jwt.sign({ id,nombre}, process.env.JWT_SECRET, {expiresIn: "2h"});
        res.json({ token, nombre});

}