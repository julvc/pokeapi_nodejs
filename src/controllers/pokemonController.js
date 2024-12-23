import Pokemon from "../models/Pokemon.js";
import axios from 'axios';
import mongoose from 'mongoose';
import AppError from "../utils/appError.js";

export const createPokemon = async (req, res) => {
    try {
        const { name, type, level } = req.body;

        if (!name || !type || level === undefined) {
            return res.status(400).json({ error: "Faltan parámetros necesarios: name, type, o level." });
        }

        const trainerId = req.user;
        // const trainerId = req.user._id;
        console.log("VALORES DE REQ.USER " , req.user)
        // Llamada a PokeAPI para obtener los datos del Pokémon
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);

        if (!response || !response.data || !response.data.types) {
            return res.status(404).json({ error: "Pokémon no encontrado en la PokeAPI." });
        }

        const types = response.data.types.map((typeInfo) => typeInfo.type.name);

        const newPokemon = new Pokemon({
            name,
            type: types,
            level,
            trainer: trainerId,
        });

        await newPokemon.save();

        res.status(201).json(newPokemon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creando el Pokémon o no encontrado en PokeAPI." });
    }
};



// Listar todos los Pokémon
export const listPokemons = async (req, res) => {
    try {
        const pokemons = await Pokemon.find();
        res.json(pokemons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Ver detalles de un Pokémon específico (usando PokeAPI)
export const getPokemon = async (req, res) => {
    try {
        console.log("metodo getPokemon " , req.params)
        const { id } = req.params;
        console.log("metodo getPokemon " , id)
        const pokemon = await Pokemon.findById(id);
        console.log("metodo getPokemon " , pokemon)

        if (!pokemon) return res.status(404).json({ message: "Pokémon no encontrado en la base de datos" });

        // Obtener más detalles desde PokeAPI
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name.toLowerCase()}`);
        const details = {
            name: pokemon.name,
            types: pokemon.type,
            abilities: response.data.abilities.map((a) => a.ability.name),
            base_experience: response.data.base_experience,
            stats: response.data.stats.map((stat) => ({
                name: stat.stat.name,
                value: stat.base_stat,
            })),
        };

        res.json(details);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar información de un Pokémon (solo el dueño)
export const updatePokemon = async (req, res, next) => {
    try {
        const { id } = req.params;
        const pokemon = await Pokemon.findById(id);

        if (!pokemon) {
            return next(new AppError("Pokémon no encontrado", 404));
        }

        if (pokemon.trainer.toString() !== req.user._id.toString()) {
            return next(new AppError("No autorizado para actualizar este Pokémon", 403));
        }

        const updated = await Pokemon.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

// Eliminar un Pokémon (solo el dueño)
export const deletePokemon = async (req, res, next) => {
    try {
        const { id } = req.params;
        const pokemon = await Pokemon.findById(id);

        if (!pokemon) {
            return next(new AppError("Pokémon no encontrado", 404));
        }

        if (pokemon.trainer.toString() !== req.user._id.toString()) {
            return next(new AppError("No autorizado para eliminar este Pokémon", 403));
        }

        await Pokemon.findByIdAndDelete(id);
        res.json({ message: "Pokémon eliminado" });
    } catch (error) {
        next(error);
    }
};


export const getPokemonsByTrainer = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
            return next(new AppError('ID de entrenador inválido', 400));
        }
        
        const trainerId = new mongoose.Types.ObjectId(req.user._id);
        const pokemons = await Pokemon.find({ trainer: trainerId }).populate('trainer');
        
        if (!pokemons || pokemons.length === 0) {
            return next(new AppError('No existen pokemones asociados a algún entrenador', 404));
        }

        res.json(pokemons);
    } catch (error) {
        next(error);
    }
};