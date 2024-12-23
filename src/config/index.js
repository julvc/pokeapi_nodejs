import dotenv from "dotenv";
dotenv.config();
import connectDB from './/database.js';
import express from "express";
import cors from "cors";
import pokemonRoutes from "../routes/pokemonRoutes.js";
import authRoutes from "../routes/authRoutes.js";
import errorHandler from "../middlewares/errorHandler.js";


const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/pokemons", pokemonRoutes);
app.use("/api/auth", authRoutes);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

app.use(errorHandler);