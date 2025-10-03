# 로또 번호 네트워크 분석기 🎲

실제 로또 당첨 데이터를 기반으로 한 네트워크 분석 및 운세 추첨 애플리케이션입니다.

## 🚀 Railway 배포 가이드

### 1. GitHub에 코드 업로드
```bash
# Git 저장소 초기화
git init
git add .
git commit -m "Initial commit: Lotto Network Analyzer"

# GitHub에 새 저장소 생성 후 연결
git remote add origin https://github.com/yourusername/lotto-analyzer.git
git push -u origin main
```

### 2. Railway 배포
1. [Railway.app](https://railway.app) 접속
2. GitHub 계정으로 로그인
3. "New Project" 클릭
4. "Deploy from GitHub repo" 선택
5. 방금 업로드한 저장소 선택
6. 자동 배포 시작

### 3. 도메인 설정 (선택사항)
- Railway 대시보드에서 "Settings" → "Domains" 
- 커스텀 도메인 추가 가능

## 🛡️ 보안 기능

- **개발자 도구 차단**: F12, Ctrl+Shift+I 등 감지 및 차단
- **우클릭 방지**: 마우스 우클릭 컨텍스트 메뉴 비활성화
- **텍스트 선택 방지**: CSS로 사용자 선택 비활성화
- **코드 난독화**: JavaScript 코드 변수명 난독화
- **CSP 헤더**: Content Security Policy로 XSS 공격 방지

## 📁 프로젝트 구조

```
로또/
├── index.html          # 메인 HTML 파일
├── app.js             # 난독화된 JavaScript 코드
├── server.js          # Express 서버
├── package.json       # Node.js 의존성
├── railway.json       # Railway 배포 설정
├── .gitignore         # Git 무시 파일
└── README.md          # 이 파일
```

## 🔧 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:3000 접속
```

## 📊 주요 기능

- **실시간 데이터**: 실제 로또 당첨 번호 API 연동
- **네트워크 분석**: D3.js를 이용한 번호 간 관계 시각화
- **커뮤니티 감지**: 번호들의 그룹화 및 연결성 분석
- **운세 추첨**: 네트워크 분석 기반 번호 추천
- **반응형 디자인**: 모바일/데스크톱 최적화

## ⚠️ 주의사항

- 이 애플리케이션은 오락 목적으로만 사용하세요
- 실제 로또 당첨을 보장하지 않습니다
- 과도한 도박은 위험하니 책임감 있게 사용하세요

## 📝 라이선스

MIT License - 자유롭게 사용 가능하지만 코드 복제 시 출처 명시 권장
