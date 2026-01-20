import axios from "axios"

export const getWeatherByCoordinates = async (coordinates: any) => {
    const response = await axios.get(`https://api.openweathermap.org/data/3.0/onecall`, {
        params: {
            lat: coordinates.lat,
            lon: coordinates.lon,
            appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
            lang: 'kr',
            units: 'metric'
        }
    });
    return response.data;
}