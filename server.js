const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 방문자 카운터 데이터 파일 경로
const VISITOR_DATA_FILE = path.join(__dirname, 'visitor-data.json');

// 방문자 데이터 초기화
let visitorData = {
    total: 0,
    today: 0,
    lastResetDate: new Date().toDateString()
};

// 방문자 데이터 로드
function loadVisitorData() {
    try {
        if (fs.existsSync(VISITOR_DATA_FILE)) {
            const data = fs.readFileSync(VISITOR_DATA_FILE, 'utf8');
            visitorData = JSON.parse(data);
            
            // 날짜가 바뀌었으면 오늘 방문자 수 리셋
            const today = new Date().toDateString();
            if (visitorData.lastResetDate !== today) {
                visitorData.today = 0;
                visitorData.lastResetDate = today;
                saveVisitorData();
            }
        }
    } catch (error) {
        console.error('Error loading visitor data:', error);
    }
}

// 방문자 데이터 저장
function saveVisitorData() {
    try {
        fs.writeFileSync(VISITOR_DATA_FILE, JSON.stringify(visitorData, null, 2));
    } catch (error) {
        console.error('Error saving visitor data:', error);
    }
}

// 방문자 카운트 증가
function incrementVisitor() {
    visitorData.total++;
    visitorData.today++;
    saveVisitorData();
    return visitorData;
}

// 초기 데이터 로드
loadVisitorData();

// 보안 미들웨어
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://d3js.org"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.allorigins.win", "https://www.dhlottery.co.kr"],
            fontSrc: ["'self'", "https:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false
}));

// CORS 설정
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : true,
    credentials: true
}));

// 정적 파일 서빙
app.use(express.static(path.join(__dirname)));

// 개발자 도구 차단을 위한 추가 보안 헤더
app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
});

// 방문자 카운터 API
app.get('/api/visitors', (req, res) => {
    res.json(visitorData);
});

app.post('/api/visitors/increment', (req, res) => {
    const updatedData = incrementVisitor();
    res.json(updatedData);
});

// 정적 로또 데이터 제공
app.get('/api/lotto-data', (req, res) => {
    try {
        const dataPath = path.join(__dirname, 'lotto-data.json');
        if (fs.existsSync(dataPath)) {
            const data = fs.readFileSync(dataPath, 'utf8');
            res.json(JSON.parse(data));
        } else {
            res.status(404).json({ error: 'Lotto data not found' });
        }
    } catch (error) {
        console.error('Error reading lotto data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 로또 데이터 프록시 API (백업용)
app.get('/api/lotto/:drawNumber', async (req, res) => {
    try {
        const drawNumber = req.params.drawNumber;
        const response = await fetch(`https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${drawNumber}`);
        
        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch lotto data' });
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Lotto API error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 메인 페이지
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API 엔드포인트 (필요시 추가)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 처리
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// 에러 처리
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Lotto Network Analyzer is ready!`);
});
