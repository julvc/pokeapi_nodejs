import Trainer from "../models/Trainer.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
    console.log("metodo register");

    try {
        const { username, password, name, email, age } = req.body;
        const newTrainer = await Trainer.create({ username, password, name, email, age });
        res.status(201).json({ message: "Entrenador registrado", trainer: newTrainer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    console.log("metodo login");
    try {
        const { username, password } = req.body;
        const trainer = await Trainer.findOne({ username });
        if (!trainer || !(await bcrypt.compare(password, trainer.password))) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const token = jwt.sign({ id: trainer._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Login exitoso", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};