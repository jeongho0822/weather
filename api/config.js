export default function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // 환경변수에서 읽기
    const config = {
        API_KEY: process.env.VITE_WEATHER_API_KEY || 'YOUR_OPENWEATHERMAP_API_KEY',
        BASE_URL: process.env.VITE_WEATHER_API_BASE_URL || 'https://api.openweathermap.org/data/2.5',
        LANGUAGE: process.env.VITE_WEATHER_LANGUAGE || 'ko',
        UNIT: process.env.VITE_WEATHER_UNIT || 'metric',
        DEFAULT_CITY: process.env.VITE_DEFAULT_CITY || 'Seoul',
        API_TIMEOUT: parseInt(process.env.VITE_API_TIMEOUT || '10000'),
        CACHE_DURATION: parseInt(process.env.VITE_CACHE_DURATION || '300000'),
        DEBUG_MODE: process.env.VITE_DEBUG_MODE === 'true'
    };
    
    res.status(200).json(config);
}
