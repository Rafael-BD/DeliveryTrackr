const Coordinate = require('../models/coordinate');

// Função para recuperar as coordenadas mais recentes do banco de dados para um deviceId específico
async function getLatestCoordinate(deviceId) {
  try {
    const coordinate = await Coordinate.findOne({ deviceId }).sort({ timestamp: -1 });

    if (coordinate) {
      return { latitude: coordinate.latitude, longitude: coordinate.longitude };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erro ao recuperar coordenadas do banco de dados:', error);
    return null;
  }
}

// Função para salvar uma nova coordenada no banco de dados para um deviceId específico
async function saveCoordinate(deviceId, latitude, longitude) {
  try {
    await Coordinate.deleteMany({ deviceId });

    const newCoordinate = new Coordinate({
      deviceId,
      latitude,
      longitude,
    });
    await newCoordinate.save();
  } catch (error) {
    console.error('Erro ao gravar coordenada no banco de dados:', error);
  }
}

module.exports = {
  getLatestCoordinate,
  saveCoordinate,
};
