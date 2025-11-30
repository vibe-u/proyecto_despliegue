// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import usuarioRouter from "./routers/usuario_routes.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const app = express();

// ✅ Middlewares
app.use(cors({
    origin: process.env.URL_FRONTEND // https://proyectovibe.netlify.app
}));
app.use(express.json({ limit: "10mb" })); // aumento límite por si suben imágenes grandes

// ✅ Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Variables globales
app.set("port", process.env.PORT || 3000);

// Rutas
app.get("/", (req, res) => res.send("Server on"));
app.use("/api/usuarios", usuarioRouter);

// Manejo de rutas no encontradas
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"));

// Iniciar servidor
app.listen(app.get("port"), "0.0.0.0", () => {
    console.log(`✅ Servidor corriendo en http://localhost:${app.get("port")}`);
});

export default app;
