import express from "express";
import { body, validationResult } from "express-validator";
import Player from "../models/player.model.js";

const router = express.Router();

// Crear un nuevo jugador
router.post(
  "/", 
  body("name").isString().notEmpty(), // Valida que el nombre sea un string y no esté vacío
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


router.get("/", async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;