// src/config/nodemailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// 🔹 Verificar variables de entorno
const { USER_EMAIL, USER_PASS, URL_BACKEND, URL_FRONTEND } = process.env;
if (!USER_EMAIL || !USER_PASS || !URL_BACKEND || !URL_FRONTEND) {
  throw new Error("❌ Falta configurar alguna variable de entorno en .env");
}

// 🔹 Transportador SMTP Gmail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true para 465, false para 587
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});


// ======================================================
// 🔹 Función genérica para envíos de registro
// ======================================================
const sendMail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Vibe-U 🎓" <${USER_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log("📩 Email de registro enviado:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error enviando email de registro:", error);
    throw error;
  }
};

// ======================================================
// 🔹 Función genérica para envíos de recuperación
// ======================================================
const sendMailRP = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Vibe-U 🎓" <${USER_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log("📩 Email de recuperación enviado:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error enviando email de recuperación:", error);
    throw error;
  }
};

// ======================================================
// 🟣 CORREO DE CONFIRMACIÓN (Registro)
// ======================================================
const sendMailToRegister = async (userMail, token) => {
  const urlConfirm = `${URL_BACKEND}/api/usuarios/confirmar/${token}`;

  const html = `
    <h1>Bienvenido a Vibe-U 🎓</h1>
    <p>Gracias por registrarte. Confirma tu correo haciendo clic en el siguiente enlace:</p>
    <a href="${urlConfirm}" style="display:inline-block;background:#7c3aed;color:white;
       padding:10px 20px;text-decoration:none;border-radius:8px;font-weight:bold;">
       Confirmar correo
    </a>
    <br><br>
    <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
    <hr>
    <footer>El equipo de Vibe-U 🎓</footer>
  `;

  return sendMail(userMail, "Confirma tu cuenta en VIBE-U 💜", html);
};

// ======================================================
// 🟣 CORREO DE RECUPERACIÓN DE PASSWORD
// ======================================================
const sendMailToRecoveryPassword = async (userMail, token) => {
  // 🔹 Cambiado para coincidir con la ruta de React Router
  const urlRecovery = `${URL_FRONTEND}/recuperarpassword/${token}`;

  const html = `
    <h1>Vibe-U 💜</h1>
    <p>Has solicitado restablecer tu contraseña.</p>
    <a href="${urlRecovery}" style="display:inline-block;background:#7c3aed;color:white;
       padding:10px 20px;text-decoration:none;border-radius:8px;font-weight:bold;">
       Restablecer contraseña
    </a>
    <br><br>
    <p>Si no solicitaste este cambio, ignora este mensaje.</p>
    <hr>
    <footer>El equipo de Vibe-U 💜</footer>
  `;

  return sendMailRP(userMail, "Recupera tu contraseña en Vibe-U 🎓", html);
};

// ======================================================
// 🔹 Exportar funciones
// ======================================================
export {
  sendMail,
  sendMailRP,
  sendMailToRegister,
  sendMailToRecoveryPassword
};
