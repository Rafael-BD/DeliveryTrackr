// App.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import socketIOClient from 'socket.io-client';

const App = () => {
  const [center, setCenter] = useState(null);
  const [currentMarkers, setCurrentMarkers] = useState({});


  useEffect(() => {
    // Conectar-se ao servidor Socket.IO
    const socket = socketIOClient('http://localhost:4000');

    // Receber as coordenadas em tempo real do servidor
    socket.on('coordinate', ({ deviceId, coordinate }) => {
      setCurrentMarkers((prevDevicesData) => ({
        ...prevDevicesData,
        [deviceId]: coordinate,
      }));
      !center && setCenter(coordinate);
      console.log('Recebendo coordenadas do servidor:', coordinate);
      console.log('Dispositivo:', deviceId);
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
          center && (
            <MapContainer center={center} zoom={13} style={{ height: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
              {currentMarkers && 
                Object.entries(currentMarkers).map(([deviceId, coordinates]) => (
                  <Marker key={deviceId} position={coordinates} icon={createCustomIcon()} />
                ))
              }
            </MapContainer>
          )
        }
        
    </div>
  );
};

export default App;
