import express from "express";
import {
    createPokemon,
    listPokemons,
    getPokemon,
    updatePokemon,
    deletePokemon,
    getPokemonsByTrainer,
} from "../controllers/pokemonController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rutas públicas (sin autenticación)
router.get("/", listPokemons); // Obtener todos los Pokémon

// Rutas privadas (requieren autenticación)
router.post("/", authMiddleware, createPokemon); // Crear un nuevo Pokémon (solo autenticados)
router.get("/trainer", authMiddleware, getPokemonsByTrainer); // Obtener los Pokémon del entrenador autenticado
router.put("/:id", authMiddleware, updatePokemon); // Actualizar un Pokémon (solo el dueño)
router.delete("/:id", authMiddleware, deletePokemon); // Eliminar un Pokémon (solo el dueño)

// Mover esta ruta al final para que las específicas tengan prioridad
router.get("/:id", getPokemon); // Obtener un Pokémon por ID

export default router;