import mongoose from "mongoose";

const farmSchema = new mongoose.Schema({
  playerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Player", 
    required: true 
  }, 
  animals: { type: Number, default: 0 }, // Cantidad de animales
  crops: { type: Number, default: 0 }    // Cantidad de cultivos
});

export default mongoose.model("Farm", farmSchema);