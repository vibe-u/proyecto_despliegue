import express from "express";
import {registro,confirmarMail,recuperarPassword,comprobarTokenPassword,crearNuevoPassword,loginUsuario,perfil,actualizarUsuario,actualizarPassword} from "../controllers/usuario_controller.js";
import { verificarTokenJWT } from "../middlewares/JWT.js";

const router = express.Router();

// 🔵 Registro
router.post("/register", registro);

// 🔵 Confirmar Email
router.get("/confirmar/:token", confirmarMail);

// 🔵 Login
router.post("/login", loginUsuario);

// 🔵 Recuperar contraseña
router.post("/olvide-password", recuperarPassword);
router.get("/olvide-password/:token", comprobarTokenPassword);
router.post("/reset-password/:token", crearNuevoPassword);

// 🔵 Perfil protegido
router.get("/perfil", verificarTokenJWT, perfil);

// 🔵 Actualizar información
router.put("/actualizar", verificarTokenJWT, actualizarUsuario);
// 🔵 Actualizar contraseña
// 🔵 Actualizar contraseña
router.put("/actualizar/password", verificarTokenJWT, actualizarPassword);
// =========================================================

/* ---------------------------------------------------
    🟣 FRASE MOTIVADORA
---------------------------------------------------- */
router.get("/frase", async (req, res) => {
    try {
        const response = await fetch("https://zenquotes.io/api/random");
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error al obtener la frase:", error);
        res.status(500).json({ error: "No se pudo obtener la frase motivadora" });
    }
});
export default router;
