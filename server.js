// 간단한 Node.js 서버 (npm 필요 없음 - 순수 Node.js 내장 모듈만 사용)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env.local 파일 읽기
function loadEnv() {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const env = {};
    
    envContent.split('\n').forEach(line => {
        line = line.trim();
        if (!line || line.startsWith('#')) return;
        
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=');
        env[key.trim()] = value.trim();
    });
    
    return env;
}

const env = loadEnv();

// HTTP 서버 생성
const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    
    // 파일 확장자 확인
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };
    
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            // HTML 파일인 경우 환경변수 주입
            if (extname === '.html') {
                let htmlContent = content.toString();
                
                // 환경변수를 HTML에 주입
                htmlContent = htmlContent.replace(
                    '<script>',
                    `<script>
                    // 환경변수 자동 로드
                    window.APP_CONFIG = ${JSON.stringify({
                        API_KEY: env.WEATHER_API_KEY || 'YOUR_OPENWEATHERMAP_API_KEY',
                        BASE_URL: env.WEATHER_API_BASE_URL || 'http://api.weatherapi.com/v1',
                        LANGUAGE: env.WEATHER_LANGUAGE || 'ko',
                        UNIT: env.WEATHER_UNIT || 'metric',
                        DEFAULT_CITY: env.WEATHER_DEFAULT_CITY || 'Seoul',
                        API_TIMEOUT: parseInt(env.WEATHER_API_TIMEOUT || '10000'),
                        CACHE_DURATION: parseInt(env.WEATHER_CACHE_DURATION || '300000'),
                        DEBUG_MODE: env.WEATHER_DEBUG_MODE === 'true'
                    }, null, 2)};
                    </script>
                    <script>`
                );
                
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(htmlContent, 'utf-8');
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        }
    });
});

const PORT = 8000;
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📝 Environment variables loaded from .env.local`);
    console.log(`\n환경변수:`);
    console.log(`  API_KEY: ${env.WEATHER_API_KEY ? '***SET***' : 'NOT SET'}`);
    console.log(`  LANGUAGE: ${env.WEATHER_LANGUAGE || 'ko'}`);
    console.log(`  UNIT: ${env.WEATHER_UNIT || 'metric'}`);
});

