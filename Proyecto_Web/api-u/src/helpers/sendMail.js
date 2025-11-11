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

// 👉 Función genérica para enviar correos
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

// 👇 ESTA LÍNEA ES CLAVE
export default sendMail;
