import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getRouteCoordinates } from './utils/generateRoutes';

const App = () => {
  const [location, setLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [currentMarker, setCurrentMarker] = useState(null);

  useEffect(() => {
    getRouteCoordinates()
      .then((coordinates) => {
        setRouteCoordinates(coordinates);
      })
      .catch((error) => {
        console.error('Erro ao obter as coordenadas do caminho:', error);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMarker((prevMarker) => {
        const nextMarkerIndex = (prevMarker ? routeCoordinates.findIndex((coord) => coord === prevMarker) : -1) + 1;
        if (nextMarkerIndex >= routeCoordinates.length) {
          clearInterval(interval);
        }
        return routeCoordinates[nextMarkerIndex];
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [routeCoordinates]);

  const createCustomIcon = () =>
    new Icon({
      iconUrl: require('./assets/marker.png'),
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

  return (
    <div style={{ height: '100vh' }}>
      {routeCoordinates.length > 0 && (
        <MapContainer center={[-23.221070,-45.893876]} zoom={13} style={{ height: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
          {currentMarker && <Marker position={[currentMarker[1], currentMarker[0]]} icon={createCustomIcon()} />}
        </MapContainer>
      )}
    </div>
  );
};

export default App;
