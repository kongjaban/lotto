const fs = require('fs');
const path = require('path');

// 로또 데이터 업데이트 스크립트
async function fetchLottoDraw(drawNumber) {
    try {
        const response = await fetch(`https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${drawNumber}`);
        if (!response.ok) return null;
        const data = await response.json();
        if (data.returnValue === 'success') {
            return {
                drawNo: drawNumber,
                mainNumbers: [data.drwtNo1, data.drwtNo2, data.drwtNo3, data.drwtNo4, data.drwtNo5, data.drwtNo6],
                bonusNo: data.bnusNo,
                drawDate: data.drwNoDate
            };
        }
        return null;
    } catch (error) {
        console.error(`Error fetching draw ${drawNumber}:`, error);
        return null;
    }
}

async function getLatestDrawNumber() {
    const startDate = new Date('2002-12-07T21:00:00+0900');
    const now = new Date();
    const weeks = Math.floor((now - startDate) / (1000 * 60 * 60 * 24 * 7));
    return weeks + 1;
}

async function updateLottoData() {
    console.log('🔄 로또 데이터 업데이트 시작...');
    
    const latestDraw = await getLatestDrawNumber();
    const startDraw = Math.max(1, latestDraw - 300 + 1);
    
    console.log(`📊 ${startDraw}회 ~ ${latestDraw}회 데이터 수집 중...`);
    
    const lottoData = [];
    let successCount = 0;
    
    for (let i = latestDraw; i >= startDraw; i--) {
        try {
            const data = await fetchLottoDraw(i);
            if (data) {
                lottoData.push(data);
                successCount++;
                console.log(`✅ ${i}회차 완료 (${successCount}개)`);
            } else {
                console.log(`❌ ${i}회차 실패`);
            }
            
            // 서버 부하 방지를 위한 지연
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (error) {
            console.error(`❌ ${i}회차 오류:`, error.message);
        }
    }
    
    // 최신 순으로 정렬
    lottoData.sort((a, b) => b.drawNo - a.drawNo);
    
    // JSON 파일로 저장
    const dataPath = path.join(__dirname, 'lotto-data.json');
    fs.writeFileSync(dataPath, JSON.stringify({
        lastUpdated: new Date().toISOString(),
        totalDraws: lottoData.length,
        latestDraw: latestDraw,
        data: lottoData
    }, null, 2));
    
    console.log(`🎉 업데이트 완료!`);
    console.log(`📁 파일 저장: ${dataPath}`);
    console.log(`📈 총 ${successCount}개 회차 데이터 저장됨`);
    console.log(`🕐 마지막 업데이트: ${new Date().toLocaleString('ko-KR')}`);
}

// 스크립트 실행
updateLottoData().catch(console.error);
