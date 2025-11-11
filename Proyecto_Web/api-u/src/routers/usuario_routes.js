import express from "express";
import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";
import { sendMailToRegister } from "../config/nodemailer.js";

const router = express.Router();

// --- REGISTRO ---
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

    // Generar token de confirmación
    const token = jwt.sign({ id: nuevoUsuario._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    nuevoUsuario.token = token;
    await nuevoUsuario.save();

    // Enviar correo con el token
    await sendMailToRegister(correoInstitucional, token);

    res.status(201).json({
      msg: "Usuario registrado correctamente. Revisa tu correo para confirmar tu cuenta.",
    });
  } catch (error) {
    console.error("ERROR EN REGISTER:", error);
    res.status(500).json({ msg: "Error del servidor", error: error.message });
  }
});

// --- CONFIRMAR CORREO ---
router.get("/confirmar/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const usuario = await Usuario.findOne({ token });
    if (!usuario) {
      return res.status(404).json({ msg: "Token inválido o ya confirmado." });
    }

    usuario.token = null;
    usuario.confirmEmail = true;
    await usuario.save();

    // ✅ Responder con JSON, no redirigir
    res.status(200).json({ msg: "Cuenta confirmada correctamente." });
  } catch (error) {
    console.error("ERROR EN CONFIRMAR:", error);
    res.status(500).json({ msg: "Error del servidor", error: error.message });
  }
});

// --- LOGIN ---
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

    if (usuario.password !== password) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    if (!usuario.confirmEmail) {
      return res.status(400).json({
        msg: "Debes confirmar tu cuenta por correo antes de iniciar sesión.",
      });
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      nombre: usuario.nombre,
      correoInstitucional: usuario.correoInstitucional,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

export default router;
