import Usuario from "../models/Usuario.js";
import { sendMailToRegister, sendMailToRecoveryPassword } from "../config/nodemailer.js";

// --- Registro ---
const registro = async (req, res) => {
    try {
        console.log("📩 Body recibido:", req.body);

        const { correoInstitucional, password } = req.body;
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Debes llenar todos los campos." });
        }

        const verificarEmailBDD = await Usuario.findOne({ correoInstitucional });
        if (verificarEmailBDD)
            return res.status(400).json({ msg: "El correo institucional ya está registrado." });

        const nuevoUsuario = new Usuario(req.body);
        nuevoUsuario.password = await nuevoUsuario.encryptPassword(password);
        const token = nuevoUsuario.createToken();
        nuevoUsuario.token = token;

        await sendMailToRegister(correoInstitucional, token);
        await nuevoUsuario.save();

        res.status(200).json({ msg: "Revisa tu correo institucional para confirmar tu cuenta." });

    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor: ${error.message}` });
    }
};

// --- Confirmar correo ---
const confirmarMail = async (req, res) => {
    try {
        const { token } = req.params;
        const usuarioBDD = await Usuario.findOne({ token });

        if (!usuarioBDD) {
            // 🔴 Token inválido: redirige a interfaz de error
            return res.redirect(`${process.env.URL_FRONTEND}/confirmar/error`);
        }

        usuarioBDD.token = null;
        usuarioBDD.confirmEmail = true;
        await usuarioBDD.save();

        // 🟢 Redirige a interfaz de éxito
        return res.redirect(`${process.env.URL_FRONTEND}/confirmar/exito`);
    } catch (error) {
        console.error(error);
        // 🔴 Si algo falla, redirige también a error
        return res.redirect(`${process.env.URL_FRONTEND}/confirmar/error`);
    }
};

// --- Recuperar contraseña ---
const recuperarPassword = async (req, res) => {
    try {
        const { correoInstitucional } = req.body;
        if (!correoInstitucional)
            return res.status(400).json({ msg: "Debes ingresar un correo electrónico" });

        const usuarioBDD = await Usuario.findOne({ correoInstitucional });
        if (!usuarioBDD)
            return res.status(404).json({ msg: "El usuario no se encuentra registrado" });

        const token = usuarioBDD.createToken();
        usuarioBDD.token = token;
        await sendMailToRecoveryPassword(correoInstitucional, token);
        await usuarioBDD.save();

        res.status(200).json({ msg: "Revisa tu correo electrónico para restablecer tu contraseña" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
    }
};

// --- Comprobar token de recuperación ---
const comprobarTokenPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const usuarioBDD = await Usuario.findOne({ token });

        if (!usuarioBDD || usuarioBDD.token !== token) {
            return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" });
        }

        res.status(200).json({ msg: "Token confirmado, ya puedes crear tu nuevo password" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
    }
};

// --- Crear nuevo password ---
const crearNuevoPassword = async (req, res) => {
    try {
        const { password, confirmpassword } = req.body;
        const { token } = req.params;

        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Debes llenar todos los campos" });
        }
        if (password !== confirmpassword) {
            return res.status(400).json({ msg: "Los passwords no coinciden" });
        }

        const usuarioBDD = await Usuario.findOne({ token });
        if (!usuarioBDD)
            return res.status(404).json({ msg: "No se puede validar la cuenta" });

        usuarioBDD.password = await usuarioBDD.encryptPassword(password);
        usuarioBDD.token = null;
        await usuarioBDD.save();

        res.status(200).json({ msg: "Felicitaciones, ya puedes iniciar sesión con tu nuevo password" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
    }
};

// --- LOGIN USUARIO ---
const loginUsuario = async (req, res) => {
    try {
        const { correoInstitucional, password } = req.body;

        const usuarioBDD = await Usuario.findOne({ correoInstitucional });
        if (!usuarioBDD)
            return res.status(404).json({ msg: "Usuario no registrado" });

        const match = await usuarioBDD.matchPassword(password);
        if (!match)
            return res.status(400).json({ msg: "Contraseña incorrecta" });

        if (!usuarioBDD.confirmEmail)
            return res.status(400).json({ msg: "Debes confirmar tu correo primero" });

        res.status(200).json({
            msg: "Inicio de sesión exitoso",
            token: usuarioBDD.createToken(),
            nombre: usuarioBDD.nombre,
            apellido: usuarioBDD.apellido,
            rol: usuarioBDD.rol
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: `Error en el servidor: ${error.message}` });
    }
};

// --- EXPORT ---
export {
    registro,
    confirmarMail,
    recuperarPassword,
    comprobarTokenPassword,
    crearNuevoPassword,
    loginUsuario
};
