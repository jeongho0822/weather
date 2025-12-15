# 날씨 정보 웹사이트

현대적이고 세련된 Vanilla JavaScript 기반 날씨 정보 웹사이트입니다.

## 🎨 주요 기능

- **도시 검색**: 검색창에 도시명을 입력하여 날씨 정보 조회
- **현재 날씨**: 온도, 날씨 상태, 습도, 풍속, 체감 온도, 기압 표시
- **5일 예보**: 향후 5일간의 날씨 정보 카드 형식으로 표시
- **동적 배경**: 날씨 상태(맑음, 흐림, 비, 눈, 밤/낮)에 따라 배경 변경
- **Glassmorphism 디자인**: 반투명 유리 효과의 세련된 카드 디자인
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기에 최적화
- **로딩 UI**: 스켈레톤 로딩 화면으로 부드러운 사용자 경험 제공
- **환경변수 설정**: Vite를 통한 안전한 환경변수 관리

## 🚀 시작하기

### 1. OpenWeatherMap API 키 발급

1. https://openweathermap.org/api 방문
2. 회원가입 후 로그인
3. 무료 API 키(Free tier) 발급

### 2. 환경변수 설정

#### 방법 1: `.env.local` 파일 생성 (권장)

`.env.example` 파일을 참고하여 `.env.local` 파일을 생성하세요:

```bash
cp .env.example .env.local
```

그 후 `.env.local` 파일을 수정:

```env
VITE_WEATHER_API_KEY=YOUR_OPENWEATHERMAP_API_KEY
VITE_WEATHER_LANGUAGE=ko
VITE_WEATHER_UNIT=metric
VITE_DEFAULT_CITY=Seoul
VITE_API_TIMEOUT=10000
VITE_CACHE_DURATION=300000
VITE_DEBUG_MODE=false
```

### 3. 파일 구조

```
weather-api/
├── index.html              # HTML 구조
├── styles.css              # 스타일시트
├── script.js               # JavaScript 로직 (ES Module)
├── package.json            # npm 의존성
├── vite.config.js          # Vite 설정
├── .env                    # 프로덕션 환경변수
├── .env.local              # 로컬 개발 환경변수 (git 무시)
├── .env.example            # 환경변수 템플릿
├── .gitignore              # Git 무시 목록
└── README.md               # 사용 설명서
```

### 4. 설치 및 실행

#### Node.js 설치 (필수)
먼저 [Node.js](https://nodejs.org/) LTS 버전을 설치하세요.

#### 의존성 설치
```bash
npm install
```

#### 개발 서버 실행
```bash
npm run dev
```

브라우저가 자동으로 `http://localhost:5173` 열립니다.

#### 프로덕션 빌드
```bash
npm run build
```

`dist/` 디렉토리에 최적화된 파일이 생성됩니다.

#### 빌드 결과 미리보기
```bash
npm run preview
```

## 📋 환경변수 설명

| 변수명 | 기본값 | 설명 |
|--------|--------|------|
| `VITE_WEATHER_API_KEY` | - | OpenWeatherMap API 키 (필수) |
| `VITE_WEATHER_API_BASE_URL` | `https://api.openweathermap.org/data/2.5` | API 엔드포인트 |
| `VITE_WEATHER_LANGUAGE` | `ko` | UI 언어 (ko, en, es, fr 등) |
| `VITE_WEATHER_UNIT` | `metric` | 온도 단위 (metric: °C, imperial: °F) |
| `VITE_DEFAULT_CITY` | - | 페이지 로드 시 자동 검색 도시 (선택) |
| `VITE_API_TIMEOUT` | `10000` | API 요청 타임아웃 (ms) |
| `VITE_CACHE_DURATION` | `300000` | 캐시 지속 시간 (ms) |
| `VITE_DEBUG_MODE` | `false` | 콘솔 로그 활성화 (true/false) |

## 🎯 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: Glassmorphism, 그라디언트, 애니메이션
- **Vanilla JavaScript (ES Modules)**: DOM 조작, 비동기 처리
- **Vite**: 번들러 및 개발 서버
- **OpenWeatherMap API**: 실시간 날씨 데이터

## 🌐 Vercel 배포

### 배포 전 체크리스트

1. GitHub에 프로젝트 업로드
2. `.env.local`은 `.gitignore`에 포함되어 있으므로 업로드 안 됨 ✅

### Vercel에 배포하기

1. [Vercel.com](https://vercel.com) 접속
2. GitHub 계정으로 로그인
3. 새 프로젝트 생성 및 GitHub 리포지토리 연결
4. **Environment Variables** 설정:
   - `VITE_WEATHER_API_KEY` = `YOUR_API_KEY`
   - `VITE_WEATHER_LANGUAGE` = `ko`
   - `VITE_WEATHER_UNIT` = `metric`
5. Deploy 클릭

### 환경별 설정

#### 로컬 개발 (`.env.local`)
```env
VITE_WEATHER_API_KEY=your_local_key
VITE_DEBUG_MODE=true
```

#### Vercel 프로덕션
```
VITE_WEATHER_API_KEY=your_production_key
VITE_DEBUG_MODE=false
```

## 🔒 보안 설정

### API 키 관리

```javascript
// ❌ 절대 이렇게 하지 마세요
const API_KEY = 'sk_live_1234567890'; // 코드에 직접 입력

// ✅ 이렇게 하세요
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
```

### 환경변수 규칙

- `VITE_` 접두사로 시작하는 변수만 클라이언트에서 접근 가능
- `.env.local`은 `.gitignore`에 자동 포함
- Git에 환경변수가 올라가지 않도록 주의

## 🐛 디버그 모드

`.env.local`에서 `VITE_DEBUG_MODE=true`로 설정하면:

```
[WeatherApp] Fetching weather for city: Seoul
[WeatherApp] Weather data received: {...}
[WeatherApp] Loading default city: Seoul
```

이런 식으로 상세한 로그가 콘솔에 출력됩니다.

## ⚠️ 주의사항

1. **API 키**: 반드시 자신의 OpenWeatherMap API 키로 설정하세요
2. **Rate Limit**: 무료 API는 1분에 60개의 요청 제한
3. **캐시**: `VITE_CACHE_DURATION=0`으로 캐시 비활성화 가능

## 📝 라이센스

MIT License - 자유롭게 사용, 수정, 배포할 수 있습니다.

## 🤝 기여

버그 보고나 기능 제안은 언제든 환영합니다!

---

**Author**: Weather App Team  
**Last Updated**: 2025년 12월 15일
