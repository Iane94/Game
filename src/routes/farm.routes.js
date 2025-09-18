import express from "express";
import Farm from "../models/farm.model.js";
import Player from "../models/player.model.js";

const router = express.Router();

// Crear granja para un jugador
router.post("/:playerId", async (req, res) => {
  try {
    const { playerId } = req.params;
    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ error: "Jugador no encontrado" });

    const farm = new Farm({ playerId });
    await farm.save();
    res.json(farm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener la granja de un jugador
router.get("/:playerId", async (req, res) => {
  try {
    const farm = await Farm.findOne({ playerId: req.params.playerId });
    if (!farm) return res.status(404).json({ error: "Granja no encontrada" });
    res.json(farm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Comprar un animal en la granja
router.post("/:playerId/buy-animal", async (req, res) => {
  try {
    const farm = await Farm.findOne({ playerId: req.params.playerId });
    const player = await Player.findById(req.params.playerId);
    if (!farm || !player) return res.status(404).json({ error: "Jugador o granja no encontrado" });

    if (player.coins < 10) return res.status(400).json({ error: "No tienes suficientes monedas" });

    farm.animals += 1;
    player.coins -= 10;

    await farm.save();
    await player.save();

    res.json({ farm, player });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vender un animal
router.put("/:playerId/sell-animal", async (req, res) => {
  try {
    const farm = await Farm.findOne({ playerId: req.params.playerId });
    const player = await Player.findById(req.params.playerId);
    if (!farm || !player) return res.status(404).json({ error: "Jugador o granja no encontrado" });

    if (farm.animals < 1) return res.status(400).json({ error: "No tienes animales para vender" });

    farm.animals -= 1;
    player.coins += 10; 

    await farm.save();
    await player.save();

    res.json({ farm, player });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Plantar un cultivo
router.post("/:playerId/plant", async (req, res) => {
  try {
    const { type, parcelIndex } = req.body; 
    const farm = await Farm.findOne({ playerId: req.params.playerId });
    if (!farm) return res.status(404).json({ error: "Granja no encontrada" });

    if (!farm.cropsArray) farm.cropsArray = []; 
    farm.cropsArray.push({ type, parcelIndex });
    farm.crops += 1;

    await farm.save();
    res.json(farm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cosechar un cultivo
router.post("/:playerId/harvest-crop", async (req, res) => {
  try {
    const { parcelIndex } = req.body;
    const farm = await Farm.findOne({ playerId: req.params.playerId });
    if (!farm) return res.status(404).json({ error: "Granja no encontrada" });

    if (farm.cropsArray && farm.cropsArray.length > 0) {
      farm.cropsArray = farm.cropsArray.filter(c => c.parcelIndex !== parcelIndex);
      farm.crops -= 1;
    }

    await farm.save();
    res.json(farm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;