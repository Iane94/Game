import express from "express";
import { body, validationResult } from "express-validator";
import Player from "../models/player.model.js";
import Farm from "../models/farm.model.js"; 

const router = express.Router();

// Crear un nuevo jugador
router.post(
  "/", 
  body("name").isString().notEmpty(), 
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const player = new Player(req.body);
      await player.save();
      res.json(player);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Obtener todos los jugadores
router.get("/", async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Editar la cantidad de monedas de un jugador
router.put("/:playerId/coins", async (req, res) => {
  try {
    const { coins } = req.body; // nueva cantidad de monedas
    const player = await Player.findById(req.params.playerId);
    if (!player) return res.status(404).json({ error: "Jugador no encontrado" });

    player.coins = coins;
    await player.save();

    res.json({ success: true, player });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un jugador y su granja
router.delete("/:playerId", async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.playerId);
    if (!player) return res.status(404).json({ error: "Jugador no encontrado" });

    // Borrar la granja
    await Farm.findOneAndDelete({ playerId: req.params.playerId });

    res.json({ success: true, message: "Jugador y granja eliminados" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;