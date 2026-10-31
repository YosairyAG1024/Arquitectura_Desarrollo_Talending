import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/sqlserver.js"

export async function register(req, res) {
    const{ nombre, correo, password } = req.body;

    if(!nombre || !correo || !password)
        return res.status(400).json(missingFieldsErrorJson);

    const hash = await bcrypt.hash(password, 10);
    
    const r = await pool.request()
        .input("nombre", nombre)
        .input("correo", correo)
        .input("hash", hash)
        .query("INSERT INTO dbo.usuarios (name, email, password_hash) output inserted.id,inserted.name,inserted.email VALUES (@nombre, @correo, @hash)");
    res.status(201).json(r.recordset[0]);
};

export async function login(req, res){
    console.log('Cuerpo recibido por el backend:', req.body);

    const { correo, password } = req.body;

    if(!correo || !password)
        return res.status(400).json({msg: "Por favor, complete todos los campos"})

    const r = await pool.request()
        .input("correo", correo)
        .query("SELECT * FROM usuarios WHERE email = @correo");
        const usuarios = r.recordset[0];

        const ok = usuarios && await bcrypt.compare(password, usuarios.password_hash);

        if (!ok) return res.status(401).json({msg: "Credenciales invalidas" });
        
        const { id, nombre } = usuarios;
        const token = jwt.sign({ id,nombre}, process.env.JWT_SECRET, {expiresIn: "2h"});
        res.json({ token, nombre});
}

const missingFieldsErrorJson = {
    msg: "Por favor, complete todos los campos"
};