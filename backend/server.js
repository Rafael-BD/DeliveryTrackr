require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const connectDatabase = require('./src/config/database');
const { sendCoordinatesToClient, sendLatestCoordinatesToClient, receiveCoordinates } = require('./src/controllers/socketController');

console.log('TOKEN:', process.env.MONGODB_URI);

// Conectar ao banco de dados MongoDB
connectDatabase();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Configurar o middleware para receber o corpo das requisições em JSON
app.use(express.json());

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

  socket.on('coordinate', receiveCoordinates);

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
