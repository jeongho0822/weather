// ========================
// 환경변수 설정
// ========================
// window.APP_CONFIG에서 읽기 (HTML에서 정의되고 Vite에서 주입됨)
const API_KEY = window.APP_CONFIG?.WEATHER_API_KEY || 'YOUR_OPENWEATHERMAP_API_KEY';
const BASE_URL = window.APP_CONFIG?.BASE_URL || 'https://api.openweathermap.org/data/2.5';
const LANGUAGE = window.APP_CONFIG?.LANGUAGE || 'ko';
const UNIT = window.APP_CONFIG?.UNIT || 'metric';
const DEFAULT_CITY = window.APP_CONFIG?.DEFAULT_CITY || null;
const API_TIMEOUT = window.APP_CONFIG?.API_TIMEOUT || 10000;
const CACHE_DURATION = window.APP_CONFIG?.CACHE_DURATION || 300000;
const DEBUG_MODE = window.APP_CONFIG?.DEBUG_MODE || false;

// 디버그 로거
function debugLog(message, data = null) {
    if (DEBUG_MODE) {
        console.log(`[WeatherApp] ${message}`, data || '');
    }
}

// DOM 요소
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('errorMessage');
const currentWeatherContent = document.getElementById('currentWeatherContent');
const weatherLoadingSkeleton = document.getElementById('weatherLoadingSkeleton');
const currentWeatherContainer = document.getElementById('currentWeatherContainer');
const forecastContainer = document.getElementById('forecastContainer');
const forecastContent = document.getElementById('forecastContent');
const initialMessage = document.getElementById('initialMessage');

// 날씨 아이콘 매핑
const weatherIconMap = {
    '맑음': '☀️',
    '구름': '☁️',
    '흐림': '🌤️',
    '비': '🌧️',
    '천둥': '⛈️',
    '눈': '❄️',
    '안개': '🌫️',
};

// 날씨 상태 분류
function getWeatherCategory(description, main) {
    const time = new Date().getHours();
    const isNight = time < 6 || time >= 18;

    if (main.includes('Clear') || main.includes('Sunny')) {
        return isNight ? 'night' : 'sunny';
    }
    if (main.includes('Cloud')) {
        return 'cloudy';
    }
    if (main.includes('Rain') || main.includes('Drizzle')) {
        return 'rainy';
    }
    if (main.includes('Snow')) {
        return 'snowy';
    }
    if (main.includes('Thunder')) {
        return 'rainy';
    }
    return isNight ? 'night' : 'sunny';
}

// 날씨에 맞는 아이콘 가져오기
function getWeatherEmoji(description, main) {
    const desc = description.toLowerCase();
    
    if (main.includes('Clear') || main.includes('Sunny')) {
        return '☀️';
    }
    if (main.includes('Cloud')) {
        return '☁️';
    }
    if (main.includes('Rain')) {
        return '🌧️';
    }
    if (main.includes('Drizzle')) {
        return '🌦️';
    }
    if (main.includes('Thunderstorm')) {
        return '⛈️';
    }
    if (main.includes('Snow')) {
        return '❄️';
    }
    if (main.includes('Mist') || main.includes('Smoke') || main.includes('Fog')) {
        return '🌫️';
    }
    return '🌤️';
}

// 형식화된 날짜 문자열 생성
function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date * 1000).toLocaleDateString('ko-KR', options);
}

// 시간 형식화
function formatTime(date) {
    return new Date(date * 1000).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// 에러 메시지 표시
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 5000);
}

// 현재 날씨 API 호출
async function fetchWeather(city) {
    try {
        showLoading();
        errorMessage.classList.remove('show');

        debugLog(`Fetching weather for city: ${city}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

        const response = await fetch(
            `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${UNIT}&lang=${LANGUAGE}`,
            { signal: controller.signal }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
            if (response.status === 404) {
                showError('찾을 수 없는 도시입니다. 다른 도시를 검색해주세요.');
            } else {
                showError('날씨 정보를 가져올 수 없습니다. 다시 시도해주세요.');
            }
            hideLoading();
            return;
        }

        const data = await response.json();
        debugLog('Weather data received:', data);
        
        // 캐시에 저장
        if (CACHE_DURATION > 0) {
            localStorage.setItem(`weather_${city}`, JSON.stringify({
                data: data,
                timestamp: Date.now()
            }));
        }

        displayCurrentWeather(data);
        fetchForecast(data.coord.lat, data.coord.lon);
    } catch (error) {
        if (error.name === 'AbortError') {
            showError('요청 시간이 초과되었습니다. 다시 시도해주세요.');
        } else {
            console.error('Error fetching weather:', error);
            showError('오류가 발생했습니다. API 키를 확인해주세요.');
        }
        hideLoading();
    }
}

// 5일 예보 API 호출
async function fetchForecast(lat, lon) {
    try {
        debugLog(`Fetching forecast for coordinates: ${lat}, ${lon}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

        const response = await fetch(
            `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${UNIT}&lang=${LANGUAGE}`,
            { signal: controller.signal }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error('Forecast fetch failed');
        }

        const data = await response.json();
        debugLog('Forecast data received:', data);
        
        displayForecast(data.list);
        hideLoading();
    } catch (error) {
        if (error.name === 'AbortError') {
            showError('예보 데이터 요청 시간이 초과되었습니다.');
        } else {
            console.error('Error fetching forecast:', error);
        }
        hideLoading();
    }
}

// 현재 날씨 표시
function displayCurrentWeather(data) {
    const { main, weather, wind, clouds, sys } = data;
    const description = weather[0].main;
    const weatherDesc = weather[0].description;

    // 배경 변경
    const category = getWeatherCategory(weatherDesc, description);
    document.body.className = category;

    // 날씨 정보 업데이트
    document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('currentDate').textContent = formatDate(data.dt);
    document.getElementById('temperature').textContent = Math.round(main.temp);
    document.getElementById('weatherDescription').textContent = weatherDesc;
    document.getElementById('weatherIcon').textContent = getWeatherEmoji(weatherDesc, description);
    document.getElementById('feelsLike').textContent = `${Math.round(main.feels_like)}°C`;
    document.getElementById('humidity').textContent = `${main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${(wind.speed * 3.6).toFixed(1)} km/h`;
    document.getElementById('pressure').textContent = `${main.pressure} hPa`;

    // UI 업데이트
    initialMessage.style.display = 'none';
    currentWeatherContent.style.display = 'block';
}

// 5일 예보 표시
function displayForecast(forecastList) {
    // 일별로 데이터 그룹화 (하루에 8개 데이터 포인트)
    const dailyForecasts = {};

    forecastList.forEach(forecast => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString('ko-KR');
        
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = {
                date: forecast.dt,
                temps: [],
                descriptions: [],
                main: forecast.weather[0].main,
                description: forecast.weather[0].description,
                humidity: forecast.main.humidity,
            };
        }

        dailyForecasts[date].temps.push(forecast.main.temp);
        if (!dailyForecasts[date].descriptions.includes(forecast.weather[0].description)) {
            dailyForecasts[date].descriptions.push(forecast.weather[0].description);
        }
    });

    // HTML 생성
    let forecastHTML = '';
    let count = 0;

    for (const date in dailyForecasts) {
        if (count >= 5) break;

        const forecast = dailyForecasts[date];
        const minTemp = Math.min(...forecast.temps);
        const maxTemp = Math.max(...forecast.temps);
        const emoji = getWeatherEmoji(forecast.description, forecast.main);

        forecastHTML += `
            <div class="forecast-card">
                <div class="forecast-date">${new Date(forecast.date * 1000).toLocaleDateString('ko-KR', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                <div class="forecast-icon">${emoji}</div>
                <div class="forecast-temp">
                    <div class="forecast-temp-high">최고 ${Math.round(maxTemp)}°C</div>
                    <div class="forecast-temp-low">최저 ${Math.round(minTemp)}°C</div>
                </div>
                <div class="forecast-description">${forecast.description}</div>
            </div>
        `;

        count++;
    }

    forecastContent.innerHTML = forecastHTML;
    forecastContainer.style.display = 'block';
}

// 로딩 상태 표시
function showLoading() {
    initialMessage.style.display = 'none';
    currentWeatherContent.style.display = 'none';
    weatherLoadingSkeleton.style.display = 'flex';
    forecastContainer.style.display = 'none';
}

// 로딩 상태 숨기기
function hideLoading() {
    weatherLoadingSkeleton.style.display = 'none';
}

// 검색 기능
function performSearch() {
    const city = searchInput.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        showError('도시 이름을 입력해주세요.');
    }
}

// 이벤트 리스너
searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// 페이지 로드 시 기본 도시 표시
document.addEventListener('DOMContentLoaded', () => {
    debugLog('Application started');
    debugLog('Environment variables loaded:', {
        API_KEY: API_KEY ? '***SET***' : 'NOT SET',
        LANGUAGE: LANGUAGE,
        UNIT: UNIT,
        DEFAULT_CITY: DEFAULT_CITY,
        CACHE_DURATION: CACHE_DURATION,
        DEBUG_MODE: DEBUG_MODE
    });

    // API 키가 설정되지 않은 경우 경고
    if (API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
        showError('⚠️ API 키가 설정되지 않았습니다. .env.local 파일을 확인하세요.');
    }

    // 기본 도시 자동 로드
    if (DEFAULT_CITY) {
        debugLog(`Loading default city: ${DEFAULT_CITY}`);
        fetchWeather(DEFAULT_CITY);
    }
});
