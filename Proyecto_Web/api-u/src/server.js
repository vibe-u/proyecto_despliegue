// INTENTOS DL DSPLIEGUE
// server.js
import mongoose from "mongoose";
import usuarioRouter from "./routers/usuario_routes.js";
import { v2 as cloudinary } from "cloudinary";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// =============================
// 🔥 CORS CONFIG CORRECTA
// =============================
const allowedOrigins = [
    process.env.URL_FRONTEND,
    "http://localhost:5173",
    "https://proyectovibe-u.netlify.app"
];

app.use(
    cors({
        origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            console.log("❌ Origen bloqueado por CORS:", origin);
            return callback(new Error("Not allowed by CORS"));
        }
        },
        credentials: true,
    })
);

// =============================
// 🔥 MIDDLEWARES
// =============================
app.use(express.json({ limit: "10mb" }));

// Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// =============================
// 🔥 RUTAS
// =============================
app.get("/", (req, res) => res.json({ 
    msg: "VIBE-U API funcionando ✅",
    version: "1.0.0"
}));

app.use("/api/usuarios", usuarioRouter);

// 404
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"));

// =============================
// 🔥 SERVER
// =============================
app.listen(app.get("port"), "0.0.0.0", () => {
    console.log(`✅ Servidor corriendo en http://localhost:${app.get("port")}`);
});

export default app;
