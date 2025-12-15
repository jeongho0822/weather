// ========================
// 환경변수 로드 (Vercel/로컬 환경 모두 지원)
// ========================
let config = {
    API_KEY: '',
    BASE_URL: 'https://api.weatherapi.com/v1',
    LANGUAGE: 'ko',
    UNIT: 'metric'
};

// Vercel 배포 또는 API 엔드포인트에서 환경변수 로드
async function loadConfig() {
    try {
        const response = await fetch('/api/config');
        config = await response.json();
        console.log('✅ 환경변수 로드 완료');
    } catch (error) {
        console.warn('⚠️ API에서 환경변수 로드 실패:', error.message);
    }
}

// 초기 로드
loadConfig();

// ========================
// DOM 요소
// ========================
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('errorMessage');
const weatherContainer = document.getElementById('weatherContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const initialMessage = document.getElementById('initialMessage');

// ========================
// 날씨 아이콘 매핑
// ========================
const weatherIcons = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Smoke': '💨',
    'Haze': '🌫️',
    'Dust': '🌪️',
    'Fog': '🌫️',
    'Sand': '🌪️',
    'Ash': '💨',
    'Squall': '💨',
    'Tornado': '🌪️'
};

// ========================
// 날씨 정보 가져오기
// ========================
async function fetchWeather(city) {
    if (!config.API_KEY) {
        showError('API 키가 설정되지 않았습니다. Vercel 대시보드에서 WEATHER_API_KEY 환경변수를 설정해주세요.');
        return;
    }

    try {
        showLoading(true);
        errorMessage.textContent = '';

        // WeatherAPI.com 엔드포인트
        const url = `${config.BASE_URL}/current.json?key=${config.API_KEY}&q=${encodeURIComponent(city)}&lang=${config.LANGUAGE}&aqi=no`;
        
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 400) {
                showError('도시를 찾을 수 없습니다. 도시 이름을 확인해주세요.');
            } else if (response.status === 403) {
                showError('API 키가 유효하지 않습니다.');
            } else {
                showError('날씨 정보를 불러올 수 없습니다. 다시 시도해주세요.');
            }
            showLoading(false);
            return;
        }

        const data = await response.json();
        displayWeather(data);
        showLoading(false);
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError('오류가 발생했습니다: ' + error.message);
        showLoading(false);
    }
}

// ========================
// 날씨 정보 표시
// ========================
function displayWeather(data) {
    // WeatherAPI.com 응답 형식
    const { current, location } = data;

    // 도시 이름 및 날짜
    document.getElementById('cityName').textContent = `${location.name}, ${location.country}`;
    document.getElementById('weatherDate').textContent = new Date().toLocaleDateString('ko-KR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // 아이콘 설정
    const icon = weatherIcons[current.condition.text] || '🌤️';
    document.getElementById('weatherIcon').textContent = icon;

    // 현재 온도 및 설명
    document.getElementById('temp').textContent = Math.round(current.temp_c);
    document.getElementById('description').textContent = current.condition.text;

    // 상세 정보
    document.getElementById('feelsLike').textContent = `${Math.round(current.feelslike_c)}°C`;
    document.getElementById('humidity').textContent = `${current.humidity}%`;
    document.getElementById('windSpeed').textContent = `${current.wind_kph.toFixed(1)} km/h`;
    document.getElementById('pressure').textContent = `${current.pressure_mb} hPa`;

    // UI 업데이트
    initialMessage.style.display = 'none';
    weatherContainer.style.display = 'block';
}

// ========================
// UI 제어 함수
// ========================
function showLoading(show) {
    loadingSpinner.style.display = show ? 'block' : 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    weatherContainer.style.display = 'none';
    initialMessage.style.display = 'block';
}

// ========================
// 이벤트 리스너
// ========================
searchBtn.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (city) {
        fetchWeather(city);
        searchInput.value = '';
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = searchInput.value.trim();
        if (city) {
            fetchWeather(city);
            searchInput.value = '';
        }
    }
});
