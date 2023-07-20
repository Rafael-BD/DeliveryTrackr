const dgram = require('dgram');

const server = dgram.createSocket('udp4');

// Função para enviar uma mensagem UDP para o servidor
const sendMessage = (message, host, port) => {
  const client = dgram.createSocket('udp4');
  client.send(message, port, host, (error) => {
    if (error) {
      console.error('Erro ao enviar a mensagem:', error);
    }
    client.close();
  });
};

// Função para receber mensagens UDP no servidor
const startServer = (port) => {
  server.on('message', (message, remote) => {
    console.log(`Mensagem recebida: ${message} de ${remote.address}:${remote.port}`);
    // Trate a mensagem recebida aqui, por exemplo, atualize a localização dos entregadores no mapa
  });

  server.on('listening', () => {
    const address = server.address();
    console.log(`Servidor UDP iniciado em ${address.address}:${address.port}`);
  });

  server.bind(port);
};

module.exports = { sendMessage, startServer };
