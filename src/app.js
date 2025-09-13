import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import logger from "./middlewares/logger.js";
import playerRoutes from "./routes/player.routes.js";
import farmRoutes from "./routes/farm.routes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(logger);
app.use(cors());

// Rutas
app.use("/players", playerRoutes);
app.use("/farm", farmRoutes);

// Conexión a Mongo
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.error(err));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));