const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const Axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

require('dotenv').config();

// Função para obter as coordenadas da rota do OpenRouteService
async function getRouteCoordinates() {
  const start = '-45.893876,-23.221070'; // Coordenadas de partida
  const end = '-45.890856,-23.221954'; // Coordenadas de destino

  const apiKey = process.env.TOKEN;
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start}&end=${end}`;

  try {
    const response = await Axios.get(url);
    const data = response.data;

    // Extrair as coordenadas do caminho
    const coordinates = data.features[0].geometry.coordinates;

    return coordinates;
  } catch (error) {
    console.error('Erro ao obter as coordenadas do caminho:', error);
    return [];
  }
}

// Enviar as coordenadas para o cliente em intervalos de tempo
async function sendCoordinatesToClient(socket) {
    const coordinates = await getRouteCoordinates();
  
    let currentIndex = 0;
  
    const intervalId = setInterval(() => {
      if (currentIndex >= coordinates.length) {
        clearInterval(intervalId);
        return;
      }
      console.log('Enviando coordenadas para o cliente:', coordinates[currentIndex]);
      socket.emit('coordinate', coordinates[currentIndex]);
      currentIndex++;
    }, 4000);
  }
  
  // Iniciar o servidor e enviar as coordenadas para o cliente quando ele se conectar
  io.on('connection', (socket) => {
    console.log('Cliente conectado');
  
    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });
  
    sendCoordinatesToClient(socket);
  });
  
  const port = 4000;
  server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });