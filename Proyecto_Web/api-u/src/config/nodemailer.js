// src/config/nodemailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS
    }
});

const sendMail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: '"Vibe-U 🎓" <noreply@vibeu.com>',
            to,
            subject,
            html
        });
        console.log("✅ Email enviado:", info.messageId);
    } catch (error) {
        console.error("❌ Error enviando email:", error.message);
    }
};

const sendMailToRegister = async (userMail, token) => {
    const urlConfirm = `${process.env.URL_BACKEND}/api/usuarios/confirmar/${token}`;
    return sendMail(
        userMail,
        "Confirma tu cuenta en VIBE-U 💜",
        `
            <h1>Bienvenido a Vibe-U 🎓</h1>
            <p>Gracias por registrarte. Confirma tu correo haciendo clic en el siguiente enlace:</p>
            <a href="${urlConfirm}">Confirmar correo</a>
            <hr>
            <footer>El equipo de Vibe-U 🎓</footer>
        `
    );
};

const sendMailToRecoveryPassword = async (userMail, token) => {
    const urlRecovery = `${process.env.URL_BACKEND}/api/usuarios/recuperarpassword/${token}`;
    return sendMail(
        userMail,
        "Recupera tu contraseña en Vibe-U 🎓",
        `
            <h1>Vibe-U</h1>
            <p>Has solicitado restablecer tu contraseña.</p>
            <a href="${urlRecovery}">Clic para restablecer tu contraseña</a>
            <hr>
            <footer>El equipo de Vibe-U 💜</footer>
        `
    );
};

export {
    sendMail,
    sendMailToRegister,
    sendMailToRecoveryPassword
};
