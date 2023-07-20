import Axios from "axios";

export async function getRouteCoordinates() { 
    const start = '-45.893876,-23.221070'; // Coordenadas de partida
    const end = '-45.890856,-23.221954'; // Coordenadas de destino

    const apiKey = '5b3ce3597851110001cf6248190eec529bcc4b8b8162f575c2629104';
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

