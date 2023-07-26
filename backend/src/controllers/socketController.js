const { getLatestCoordinate, saveCoordinate } = require('./coordinateController');

// Função para enviar as coordenadas para um cliente
async function sendCoordinatesToClient(socket, deviceId) {
  try {
    const coordinate = await getLatestCoordinate(deviceId);

    if (coordinate) {
      console.log(`Enviando coordenadas para o cliente ${deviceId}:`, coordinate.latitude, coordinate.longitude);

      // Enviar as coordenadas para o cliente no formato esperado pelo frontend
      socket.emit('coordinate', { deviceId, coordinate: { lat: coordinate.latitude, lng: coordinate.longitude } });
    }
  } catch (error) {
    console.error('Erro ao enviar coordenadas para o cliente:', error);
  }
}

// Função para enviar as últimas coordenadas do banco para o cliente a cada 4 segundos
async function sendLatestCoordinatesToClient(socket, deviceId) {
  try {
    const coordinate = await getLatestCoordinate(deviceId);

    if (coordinate) {
      console.log(`Enviando últimas coordenadas para o cliente ${deviceId}:`, coordinate.latitude, coordinate.longitude);

      // Enviar as coordenadas para o cliente no formato esperado pelo frontend
      socket.emit('coordinate', { deviceId, coordinate: { lat: coordinate.latitude, lng: coordinate.longitude } });
    }
  } catch (error) {
    console.error('Erro ao enviar últimas coordenadas para o cliente:', error);
  }
}

// Receber coordenadas enviadas pelo cliente e gravar no banco de dados
async function receiveCoordinates({ deviceId, coordinate }) {
    try {
      console.log(`Recebendo coordenadas do cliente ${deviceId}:`, coordinate);
  
      // Chamar o método saveCoordinate do coordinateController para salvar no banco de dados
      await saveCoordinate(deviceId, coordinate[0], coordinate[1]);
    } catch (error) {
      console.error('Erro ao gravar coordenada no banco de dados:', error, coordinate);
    }
  }

module.exports = {
    sendCoordinatesToClient,
    sendLatestCoordinatesToClient,
    receiveCoordinates,
};
