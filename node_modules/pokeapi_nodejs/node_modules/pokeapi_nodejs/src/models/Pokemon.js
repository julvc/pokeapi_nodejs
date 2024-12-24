import mongoose from "mongoose";

const pokemonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: [String], required: true },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    level: { type: Number, required: true, default: 1 },
}, { timestamps: true });

const Pokemon = mongoose.model("Pokemon", pokemonSchema);
export default Pokemon;