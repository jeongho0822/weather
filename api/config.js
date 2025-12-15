export default function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // 환경변수에서 읽기
    const config = {
        API_KEY: process.env.WEATHER_API_KEY || 'YOUR_WEATHERAPI_KEY',
        BASE_URL: process.env.WEATHER_API_BASE_URL || 'https://api.weatherapi.com/v1',
        LANGUAGE: process.env.WEATHER_LANGUAGE || 'ko',
        UNIT: process.env.WEATHER_UNIT || 'metric',
        DEFAULT_CITY: process.env.WEATHER_DEFAULT_CITY || 'Seoul',
        API_TIMEOUT: parseInt(process.env.WEATHER_API_TIMEOUT || '10000'),
        CACHE_DURATION: parseInt(process.env.WEATHER_CACHE_DURATION || '300000'),
        DEBUG_MODE: process.env.WEATHER_DEBUG_MODE === 'true'
    };
    
    res.status(200).json(config);
}
