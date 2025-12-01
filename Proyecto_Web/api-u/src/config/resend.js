// src/config/resend.js
import { Resend } from "@resend/email";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY); // Usar la API key que obtuviste

const sendMail = async (to, subject, html) => {
    try {
        const response = await resend.sendEmail({
        from: process.env.USER_EMAIL, // Tu correo de envío
        to: to,
        subject: subject,
        html: html,
        });

        console.log("📩 Email enviado:", response);
        return response;
    } catch (error) {
        console.error("❌ Error enviando email:", error);
        throw error;
    }
};

export { sendMail };
