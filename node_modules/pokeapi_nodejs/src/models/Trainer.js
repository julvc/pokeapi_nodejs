import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const trainerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: false }
    }, { timestamps: true });

trainerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const Trainer = mongoose.models.Trainer || mongoose.model('Trainer', trainerSchema);

export default Trainer;
