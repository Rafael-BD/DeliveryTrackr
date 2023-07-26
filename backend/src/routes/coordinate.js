const express = require('express');
const router = express.Router();
const Coordinate = require('../models/coordinate');

router.post('/coordinates', async (req, res) => {
  const { deviceId, latitude, longitude } = req.body;

  try {
    const coordinate = new Coordinate({
      deviceId,
      latitude,
      longitude,
    });

    await coordinate.save();
    res.status(201).json({ message: 'Coordenada salva com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar coordenada:', error);
    res.status(500).json({ message: 'Erro ao salvar coordenada' });
  }
});

module.exports = router;
