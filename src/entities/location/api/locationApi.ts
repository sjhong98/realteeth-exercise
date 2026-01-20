import axios from "axios"

export const getCoordinatesByCity = async (city: string) => {
    const response = await axios.post(
        `https://hydhqrohhpgwybhlhwun.supabase.co/functions/v1/geocoding`,
        { city: city.replaceAll('-', ' ') },
        {
            headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    )

    return {
        lat: response?.data?.response?.result?.point?.y,
        lon: response?.data?.response?.result?.point?.x,
    }
}

export const getAddressByCoordinates = async (lat: number, lon: number) => {
    const response = await axios.post(
        `https://hydhqrohhpgwybhlhwun.supabase.co/functions/v1/geocoding`,
        { type: 'address', x: lon.toString(), y: lat.toString() },
        {
            headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    )
    return response?.data?.response?.result?.[0]?.text
}