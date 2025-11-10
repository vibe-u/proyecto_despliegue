// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import usuarioRouter from "./routers/usuario_routes.js";

dotenv.config();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB conectado correctamente"))
.catch(err => {
    console.error("❌ Error al conectar MongoDB:", err.message);
    process.exit(1);
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