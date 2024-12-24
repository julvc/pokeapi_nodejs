import jwt from "jsonwebtoken";
import Trainer from "../models/Trainer.js";

const authMiddleware = async (req, res, next) => {
    console.log("metodo authMiddleware")
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Token no proporcionado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Trainer.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({ error: "Entrenador no encontrado" });
        }
        next();
    } catch (error) {
        res.status(401).json({ error: "Token inválido" });
    }
};

export default authMiddleware;