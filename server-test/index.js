const Axios = require('axios');
const { io } = require('socket.io-client');

require('dotenv').config();

// Função para obter as coordenadas da rota do OpenRouteService
async function getRouteCoordinates(start, end) {
  const apiKey = process.env.TOKEN;
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start}&end=${end}`;

  try {
    const response = await Axios.get(url);
    const data = response.data;
    const coordinates = data.features[0].geometry.coordinates;
    return coordinates;
  } catch (error) {
    console.error('Erro ao obter as coordenadas do caminho:', error);
    return [];
  }
}

// Enviar as coordenadas para o servidor em intervalos de tempo
async function sendCoordinatesToServer(socket, deviceId, start, end) {
  const coordinates = await getRouteCoordinates(start, end);

  let currentIndex = 0;

  const intervalId = setInterval(() => {
    if (currentIndex >= coordinates.length) {
      clearInterval(intervalId);
      return;
    }

    const coordinate = [coordinates[currentIndex][1], coordinates[currentIndex][0]];
    console.log(`Enviando coordenadas para o servidor ${deviceId}:`, coordinate);
    socket.emit('coordinate', { deviceId, coordinate });
    currentIndex++;
  }, 4000);
}

// Conjuntos de coordenadas de diferentes objetos em movimento
const routes = [
  { start: '-45.893876,-23.221070', end: '-45.890856,-23.221954' },
  { start: '-45.892000,-23.220000', end: '-45.894614,-23.223522' },
  { start: '-45.886534,-23.227235', end: '-45.884592,-23.222713' },
  // Adicione quantos conjuntos de coordenadas quiser aqui
];

// Conectar ao servidor na porta 4000
const socket = io('http://localhost:4000');

// Enviar as coordenadas para o servidor quando a conexão for estabelecida
socket.on('connect', () => {
  console.log('Cliente conectado ao servidor');

  // Enviar as coordenadas para o servidor para cada rota
  routes.forEach((route, index) => {
    const deviceId = `device${index + 1}`;
    sendCoordinatesToServer(socket, deviceId, route.start, route.end);
  });
});

// Tratar a desconexão do servidor
socket.on('disconnect', () => {
  console.log('Cliente desconectado do servidor');
});
