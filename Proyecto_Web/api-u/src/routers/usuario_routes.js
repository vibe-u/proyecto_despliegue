// routers/usuario_routes.js
import express from "express";
import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// POST /api/usuarios/register
router.post("/register", async (req, res) => {
    try {
        const { nombre, correoInstitucional, password } = req.body;

        if (!nombre || !correoInstitucional || !password) {
            return res.status(400).json({ msg: "Todos los campos son obligatorios" });
        }

        const usuarioExistente = await Usuario.findOne({ correoInstitucional });
        if (usuarioExistente) {
            return res.status(400).json({ msg: "El correo ya está registrado" });
        }

        const nuevoUsuario = new Usuario({ nombre, correoInstitucional, password });
        await nuevoUsuario.save();

        res.status(201).json({ msg: "Usuario registrado correctamente" });
    } catch (error) {
    console.error("ERROR EN REGISTER:", error);  // Mostrar error completo
    res.status(500).json({ msg: "Error del servidor", error: error.message });
    }
});

// POST /api/usuarios/login
router.post("/login", async (req, res) => {
    try {
        const { correoInstitucional, password } = req.body;

        if (!correoInstitucional || !password) {
            return res.status(400).json({ msg: "Todos los campos son obligatorios" });
        }

        const usuario = await Usuario.findOne({ correoInstitucional });
        if (!usuario) {
            return res.status(400).json({ msg: "Usuario no encontrado" });
        }

        // Validar contraseña
        if (usuario.password !== password) {
            return res.status(400).json({ msg: "Contraseña incorrecta" });
        }

        // Generar JWT
        const token = jwt.sign(
            { id: usuario._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            token,
            nombre: usuario.nombre,
            correoInstitucional: usuario.correoInstitucional
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error del servidor" });
    }
});

export default router;
