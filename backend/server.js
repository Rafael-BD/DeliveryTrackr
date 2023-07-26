require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const connectDatabase = require('./src/config/database');
const coordinateRouter = require('./src/routes/coordinate');
const Coordinate = require('./src/models/coordinate');

console.log('TOKEN:', process.env.MONGODB_URI);

// Conectar ao banco de dados MongoDB
connectDatabase();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Configurar o middleware para receber o corpo das requisições em JSON
app.use(express.json());

// Rota para as coordenadas
app.use('/api', coordinateRouter);

// Função para enviar as coordenadas para um cliente
async function sendCoordinatesToClient(socket, deviceId) {
  try {
    // Recuperar as coordenadas mais recentes do banco de dados para o deviceId específico
    const coordinate = await Coordinate.findOne({ deviceId }).sort({ timestamp: -1 });

    if (coordinate) {
      const { latitude, longitude } = coordinate;
      console.log(`Enviando coordenadas para o cliente ${deviceId}:`, latitude, longitude);

      // Enviar as coordenadas para o cliente no formato esperado pelo frontend
      socket.emit('coordinate', { deviceId, coordinate: { lat: latitude, lng: longitude } });
    }
  } catch (error) {
    console.error('Erro ao enviar coordenadas para o cliente:', error);
  }
}

// Enviar as últimas coordenadas do banco para o cliente a cada 4 segundos
async function sendLatestCoordinatesToClient(socket, deviceId) {
  try {
    const coordinate = await Coordinate.findOne({ deviceId }).sort({ timestamp: -1 });

    if (coordinate) {
      const { latitude, longitude } = coordinate;
      console.log(`Enviando últimas coordenadas para o cliente ${deviceId}:`, latitude, longitude);

      // Enviar as coordenadas para o cliente no formato esperado pelo frontend
      socket.emit('coordinate', { deviceId, coordinate: { lat: latitude, lng: longitude } });
    }
  } catch (error) {
    console.error('Erro ao enviar últimas coordenadas para o cliente:', error);
  }
}

// Iniciar o servidor e enviar as coordenadas para o cliente quando ele se conectar
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });

  // Aqui, você pode definir os IDs dos dispositivos que serão usados para gerar rotas fakes
  const deviceIds = ['device1', 'device2', 'device3'];

  // Enviar as coordenadas mais recentes do banco para o cliente quando ele se conectar
  for (const deviceId of deviceIds) {
    sendCoordinatesToClient(socket, deviceId);
  }

  // Enviar as últimas coordenadas do banco para o cliente periodicamente
  const intervalId = setInterval(() => {
    for (const deviceId of deviceIds) {
      sendLatestCoordinatesToClient(socket, deviceId);
    }
  }, 4000);

  // Receber coordenadas enviadas pelo cliente e gravar no banco de dados
  socket.on('coordinate', async ({ deviceId, coordinate }) => {
    try {
      console.log(`Recebendo coordenadas do cliente ${deviceId}:`, coordinate);

      // Deletar as coordenadas antigas para o deviceId antes de salvar a nova coordenada
      await Coordinate.deleteMany({ deviceId });

      // Gravar a coordenada no banco de dados MongoDB
      const newCoordinate = new Coordinate({
        deviceId,
        latitude: coordinate[0],
        longitude: coordinate[1],
      });
      await newCoordinate.save();
    } catch (error) {
      console.error('Erro ao gravar coordenada no banco de dados:', error, coordinate);
    }
  });

  // Desconectar-se do servidor e limpar o intervalo ao desmontar o componente
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
    clearInterval(intervalId);
  });
});

const port = 4000;
server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
