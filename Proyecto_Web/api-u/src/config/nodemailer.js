// src/config/nodemailer.js
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

// 🔹 Variables de entorno
const { RESEND_API_KEY, URL_BACKEND, URL_FRONTEND, USER_EMAIL } = process.env;

if (!RESEND_API_KEY || !URL_BACKEND || !URL_FRONTEND || !USER_EMAIL) {
  throw new Error("❌ Falta configurar alguna variable de entorno en .env");
}

// 🔹 Inicializamos Resend
const resend = new Resend(RESEND_API_KEY);

// ======================================================
// 🚫 Lista negra de dominios
// ======================================================
const blackListDomains = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com",
  "live.com",
  "aol.com",
  "msn.com",
  "icloud.com",
  "protonmail.com"
];

const isBlackListed = (email) => {
  const domain = email.split("@")[1]?.toLowerCase();
  return blackListDomains.includes(domain);
};

// ======================================================
// 🔹 Función genérica de envío de email
// ======================================================
const sendMail = async (to, subject, html) => {
  if (isBlackListed(to)) {
    console.log(`❌ Correo bloqueado por lista negra: ${to}`);
    throw new Error("Correo no permitido. Usa tu correo institucional.");
  }

  try {
    const res = await resend.emails.send({
      from: `Vibe-U 🎓 <${USER_EMAIL}>`,  // Usamos el correo de usuario
      to,
      subject,
      html
    });
    console.log("📩 Email enviado con Resend:", res.id);
    return res;
  } catch (error) {
    console.error("❌ Error enviando email de registro:", error.response || error.message || error);
    throw error;
  }
};

// ======================================================
// 🟣 CORREO DE CONFIRMACIÓN (Registro)
// ======================================================
const sendMailToRegister = async (userMail, token) => {
  const urlConfirm = `${URL_BACKEND}/confirmar/${token}`;
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
  return sendMail(userMail, "Recupera tu contraseña en Vibe-U 🎓", html);
};

// ======================================================
// 🔹 Exportar funciones
// ======================================================
export {
  sendMail,
  sendMailToRegister,
  sendMailToRecoveryPassword
};
