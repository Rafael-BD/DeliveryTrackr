// App.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import socketIOClient from 'socket.io-client';

const App = () => {
  const [location, setLocation] = useState([-23.221070, -45.893876]);
  const [center, setCenter] = useState(null);
  const [currentMarker, setCurrentMarker] = useState(null);

  useEffect(() => {
    // Conectar-se ao servidor Socket.IO
    const socket = socketIOClient('http://localhost:4000');

    // Receber as coordenadas em tempo real do servidor
    socket.on('coordinate', (coordinate) => {
      setCurrentMarker([coordinate[1], coordinate[0]]);
      !center && setCenter([coordinate[1], coordinate[0]]);
      console.log('Recebendo coordenadas do servidor:', coordinate);
    });

    // Desconectar-se do servidor ao desmontar o componente
    return () => {
      socket.disconnect();
    };
  }, [center]);

  const createCustomIcon = () =>
    new Icon({
      iconUrl: require('./assets/marker.png'),
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

  return (
    <div style={{ height: '100vh' }}>
      {
        currentMarker && 
        (
          <MapContainer center={center} zoom={13} style={{ height: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
            {currentMarker && <Marker position={currentMarker} icon={createCustomIcon()} />}
          </MapContainer>
        )
      }
    </div>
  );
};

export default App;
