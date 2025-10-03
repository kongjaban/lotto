// 난독화된 JavaScript 코드
(function(){
    'use strict';
    
    // 전역 변수들
    const _0x1a2b = 45, _0x3c4d = 200, _0x5e6f = 6;
    let _0x7g8h = null;
    const _0x9i0j = d3.scaleOrdinal(d3.schemeCategory10);

    // API 호출 함수들
    async function _0xa1b2(_0xc3d4) {
        try {
            const _0xe5f6 = await fetch(`/api/lotto/${_0xc3d4}`);
            if (!_0xe5f6.ok) return null;
            const _0xk1l2 = await _0xe5f6.json();
            if (_0xk1l2.returnValue === 'success') {
                return {
                    mainNumbers: [_0xk1l2.drwtNo1, _0xk1l2.drwtNo2, _0xk1l2.drwtNo3, _0xk1l2.drwtNo4, _0xk1l2.drwtNo5, _0xk1l2.drwtNo6],
                    bonusNo: _0xk1l2.bnusNo
                };
            }
            return null;
        } catch (_0xm3n4) {
            console.error(`Error fetching draw ${_0xc3d4}:`, _0xm3n4);
            return null;
        }
    }

    async function _0xo5p6() {
        const _0xq7r8 = new Date('2002-12-07T21:00:00+0900');
        const _0xs9t0 = new Date();
        const _0xu1v2 = Math.floor((_0xs9t0 - _0xq7r8) / (1000 * 60 * 60 * 24 * 7));
        let _0xw3x4 = _0xu1v2 + 1;
        
        for(let _0xy5z6 = 0; _0xy5z6 < 5; _0xy5z6++) {
            const _0xa7b8 = await _0xa1b2(_0xw3x4 + _0xy5z6);
            if (!_0xa7b8) return _0xw3x4 + _0xy5z6 - 1;
        }
        return _0xw3x4 + 4;
    }

    async function _0xc9d0() {
        const _0xe1f2 = document.getElementById('loading-progress');
        const _0xg3h4 = await _0xo5p6();
        const _0xi5j6 = _0xg3h4 - _0x3c4d + 1;
        const _0xo1p2 = [];
        
        try {
            for (let _0xm9n0 = _0xg3h4; _0xm9n0 >= _0xi5j6; _0xm9n0--) {
                try {
                    const _0xs5t6 = await _0xa1b2(_0xm9n0);
                    if (_0xs5t6) _0xo1p2.push(_0xs5t6);
                    _0xe1f2.textContent = `(${_0xo1p2.length}/${_0x3c4d}) 회차 데이터 로드 완료`;
                    
                    // 너무 빠르게 요청하지 않도록 지연
                    if (_0xo1p2.length % 10 === 0) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                } catch (error) {
                    console.warn(`회차 ${_0xm9n0} 로드 실패:`, error);
                }
            }
        } catch (error) {
            console.error('데이터 로드 중 오류:', error);
            _0xe1f2.textContent = '데이터 로드 중 오류가 발생했습니다.';
        }

        if (_0xo1p2.length > 0) {
            document.getElementById('data-info').textContent = `실제 데이터 (${_0xi5j6}회 ~ ${_0xg3h4}회) 분석 완료 - ${_0xo1p2.length}개 회차`;
        } else {
            document.getElementById('data-info').textContent = '데이터 로드에 실패했습니다.';
        }
        
        return _0xo1p2;
    }

    // 데이터 처리 함수들
    function _0xu7v8(_0xw9x0) {
        const _0xy1z2 = Array.from({ length: _0x1a2b }, (_, _0xa3b4) => ({ id: _0xa3b4 + 1, count: 0 }));
        const _0xc5d6 = new Map();

        _0xw9x0.forEach(_0xe7f8 => {
            _0xe7f8.mainNumbers.forEach(_0xg9h0 => { _0xy1z2[_0xg9h0 - 1].count++; });
            if (_0xe7f8.bonusNo) _0xy1z2[_0xe7f8.bonusNo - 1].count++;

            for (let _0xi1j2 = 0; _0xi1j2 < _0xe7f8.mainNumbers.length; _0xi1j2++) {
                for (let _0xk3l4 = _0xi1j2 + 1; _0xk3l4 < _0xe7f8.mainNumbers.length; _0xk3l4++) {
                    const _0xm5n6 = Math.min(_0xe7f8.mainNumbers[_0xi1j2], _0xe7f8.mainNumbers[_0xk3l4]);
                    const _0xo7p8 = Math.max(_0xe7f8.mainNumbers[_0xi1j2], _0xe7f8.mainNumbers[_0xk3l4]);
                    const _0xq9r0 = `${_0xm5n6}-${_0xo7p8}`;
                    if (!_0xc5d6.has(_0xq9r0)) _0xc5d6.set(_0xq9r0, { source: _0xm5n6, target: _0xo7p8, weight: 0 });
                    _0xc5d6.get(_0xq9r0).weight++;
                }
            }
        });

        const _0xs1t2 = Array.from(_0xc5d6.values()).filter(_0xu3v4 => _0xu3v4.weight > 0);
        return { nodes: _0xy1z2, links: _0xs1t2 };
    }

    function _0xw5x6(_0xy7z8, _0xa9b0) {
        const _0xc1d2 = new Map(_0xy7z8.map(_0xe3f4 => [_0xe3f4.id, []]));
        _0xa9b0.forEach(_0xg5h6 => {
            _0xc1d2.get(_0xg5h6.source).push({ target: _0xg5h6.target, weight: _0xg5h6.weight });
            _0xc1d2.get(_0xg5h6.target).push({ target: _0xg5h6.source, weight: _0xg5h6.weight });
        });

        const _0xi7j8 = new Map();
        let _0xk9l0 = 0;
        _0xy7z8.forEach(_0xm1n2 => {
            if (!_0xi7j8.has(_0xm1n2.id)) {
                _0xk9l0++;
                const _0xo3p4 = [_0xm1n2.id];
                _0xi7j8.set(_0xm1n2.id, _0xk9l0);
                while (_0xo3p4.length > 0) {
                    const _0xq5r6 = _0xo3p4.pop();
                    _0xc1d2.get(_0xq5r6).forEach(_0xs7t8 => {
                       if (!_0xi7j8.has(_0xs7t8.target)) {
                           _0xi7j8.set(_0xs7t8.target, _0xk9l0);
                           _0xo3p4.push(_0xs7t8.target);
                       }
                    });
                }
            }
        });
        _0xy7z8.forEach(_0xu9v0 => { _0xu9v0.community = _0xi7j8.get(_0xu9v0.id) || 0; });
    }

    // 시각화 함수들
    function _0xw1x2() {
        const _0xy3z4 = document.getElementById('graph');
        const _0xa5b6 = _0xy3z4.clientWidth;
        const _0xc7d8 = _0xy3z4.clientHeight;
        const _0xe9f0 = d3.select("#graph").append("svg")
            .attr("width", _0xa5b6)
            .attr("height", _0xc7d8)
            .attr("viewBox", [-_0xa5b6 / 2, -_0xc7d8 / 2, _0xa5b6, _0xc7d8]);

        const _0xg1h2 = d3.select("#tooltip");

        const _0xi3j4 = d3.forceSimulation(_0x7g8h.nodes)
            .force("link", d3.forceLink(_0x7g8h.links).id(_0xk5l6 => _0xk5l6.id).distance(_0xm7n8 => 100 - _0xm7n8.weight * 8))
            .force("charge", d3.forceManyBody().strength(-150))
            .force("center", d3.forceCenter(0, 0));

        const _0xo9p0 = _0xe9f0.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(_0x7g8h.links)
            .join("line")
            .attr("stroke-width", _0xq1r2 => Math.sqrt(_0xq1r2.weight));

        const _0xs3t4 = _0xe9f0.append("g")
            .selectAll("g")
            .data(_0x7g8h.nodes)
            .join("g")
            .call(_0xu5v6(_0xi3j4));

        _0xs3t4.append("circle")
            .attr("r", _0xw7x8 => 5 + _0xw7x8.count / 5)
            .attr("fill", _0xy9z0 => _0x9i0j(_0xy9z0.community))
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5);
            
        _0xs3t4.append("text")
            .text(_0xa1b2 => _0xa1b2.id)
            .attr("x", 0)
            .attr("y", "0.3em")
            .style("font-size", "10px")
            .style("text-anchor", "middle")
            .style("fill", "#111")
            .style("font-weight", "bold");

        _0xs3t4.on("mouseover", (_0xc3d4, _0xe5f6) => {
            _0xg1h2.transition().duration(200).style("opacity", .9);
            _0xg1h2.html(`<b>번호: ${_0xe5f6.id}</b><br/>등장: ${_0xe5f6.count}회<br/>연결성: ${_0xe5f6.centrality}`)
                .style("left", `${_0xc3d4.pageX + 15}px`)
                .style("top", `${_0xc3d4.pageY - 28}px`);
        }).on("mouseout", () => {
            _0xg1h2.transition().duration(500).style("opacity", 0);
        });
        
        _0xi3j4.on("tick", () => {
            _0xo9p0.attr("x1", _0xg1h2 => _0xg1h2.source.x).attr("y1", _0xi3j4 => _0xi3j4.source.y)
                .attr("x2", _0xk5l6 => _0xk5l6.target.x).attr("y2", _0xm7n8 => _0xm7n8.target.y);
            _0xs3t4.attr("transform", _0xo9p0 => `translate(${_0xo9p0.x}, ${_0xo9p0.y})`);
        });

        function _0xu5v6(_0xw7x8) {
          function _0xy9z0(_0xa1b2) {
            if (!_0xa1b2.active) _0xw7x8.alphaTarget(0.3).restart();
            _0xa1b2.subject.fx = _0xa1b2.subject.x;
            _0xa1b2.subject.fy = _0xa1b2.subject.y;
          }
          function _0xc3d4(_0xe5f6) { _0xe5f6.subject.fx = _0xe5f6.x; _0xe5f6.subject.fy = _0xe5f6.y; }
          function _0xg7h8(_0xi9j0) {
            if (!_0xi9j0.active) _0xw7x8.alphaTarget(0);
            _0xi9j0.subject.fx = null;
            _0xi9j0.subject.fy = null;
          }
          return d3.drag().on("start", _0xy9z0).on("drag", _0xc3d4).on("end", _0xg7h8);
        }
    }

    // 추첨 및 결과 표시 함수들
    function _0xk1l2() {
        const _0xm3n4 = d3.selectAll("#graph svg g > g");

        _0xm3n4.select("circle").transition().duration(100)
            .attr("fill", _0xo5p6 => _0x9i0j(_0xo5p6.community))
            .attr("r", _0xq7r8 => 5 + _0xq7r8.count / 5);

        const _0xs9t0 = new Set();
        while(_0xs9t0.size < _0x5e6f) {
            const _0xu1v2 = _0x7g8h.nodes.map(_0xw3x4 => ({ ..._0xw3x4, weight: 1 + Math.log((_0xw3x4.centrality || 0) + 1) }));
            const _0xy5z6 = _0xu1v2.reduce((_0xa7b8, _0xc9d0) => _0xa7b8 + _0xc9d0.weight, 0);
            let _0xe1f2 = Math.random() * _0xy5z6;
            for (const _0xg3h4 of _0xu1v2) {
                _0xe1f2 -= _0xg3h4.weight;
                if (_0xe1f2 <= 0) {
                    if (!_0xs9t0.has(_0xg3h4.id)) {
                       _0xs9t0.add(_0xg3h4.id);
                       break;
                    }
                }
            }
        }
        const _0xi5j6 = Array.from(_0xs9t0).sort((_0xk7l8,_0xm9n0) => _0xk7l8 - _0xm9n0);
        
        const _0xo1p2 = _0x7g8h.nodes.filter(_0xq3r4 => !_0xi5j6.includes(_0xq3r4.id));
        const _0xs5t6 = _0xo1p2[Math.floor(Math.random() * _0xo1p2.length)].id;
        
        const _0xu7v8 = [..._0xi5j6, _0xs5t6];
        _0xm3n4.filter(_0xw9x0 => _0xu7v8.includes(_0xw9x0.id))
            .select("circle")
            .transition().duration(500)
            .attr("r", _0xy1z2 => 15 + _0xy1z2.count / 5)
            .attr("fill", "gold")
            .transition().duration(500)
            .attr("r", _0xa3b4 => 5 + _0xa3b4.count / 5)
            .attr("fill", _0xc5d6 => _0x9i0j(_0xc5d6.community));
        
        _0xe7f8(_0xi5j6, _0xs5t6);
    }

    function _0xg9h0(_0xi1j2) {
        if (_0xi1j2 <= 10) return 'bg-yellow-400';
        if (_0xi1j2 <= 20) return 'bg-blue-400';
        if (_0xi1j2 <= 30) return 'bg-red-400';
        if (_0xi1j2 <= 40) return 'bg-gray-400';
        return 'bg-green-400';
    }

    function _0xe7f8(_0xg1h2, _0xi3j4) {
        const _0xk5l6 = document.getElementById('picked-numbers');
        const _0xm7n8 = document.getElementById('fortune-message');
        const _0xo9p0 = document.getElementById('result');

        const _0xq1r2 = _0xg1h2.map(_0xs3t4 => 
            `<div class="lotto-ball ${_0xg9h0(_0xs3t4)}">${_0xs3t4}</div>`
        ).join('');

        const _0xu5v6 = `<div class="text-2xl font-bold mx-2 text-white">+</div> <div class="lotto-ball ${_0xg9h0(_0xi3j4)}">${_0xi3j4}</div>`;

        _0xk5l6.innerHTML = _0xq1r2 + _0xu5v6;
        
        _0xm7n8.textContent = _0xw7x8(_0xg1h2);
        _0xo9p0.classList.remove('opacity-0');
    }

    function _0xw7x8(_0xy9z0) {
        const _0xa1b2 = _0xy9z0.map(_0xc3d4 => _0x7g8h.nodes.find(_0xe5f6 => _0xe5f6.id === _0xc3d4));
        if(_0xa1b2.some(_0xg7h8 => !_0xg7h8)) return "번호 정보를 분석하는 데 오류가 발생했습니다.";

        const _0xi9j0 = new Set(_0xa1b2.map(_0xk1l2 => _0xk1l2.community));
        const _0xm3n4 = _0xa1b2.reduce((_0xo5p6, _0xq7r8) => _0xo5p6 + (_0xq7r8.centrality || 0), 0) / _0xy9z0.length;
        const _0xs9t0 = _0xa1b2.reduce((_0xu1v2, _0xw3x4) => _0xu1v2 + _0xw3x4.count, 0) / _0xy9z0.length;
        
        if (_0xi9j0.size === 1) return "강력하게 연결된 '행운의 그룹'입니다. 팀워크와 협력이 큰 성과를 가져올 것입니다!";
        if (_0xi9j0.size <= 2) return "소수 그룹의 집중된 조합입니다. 당신의 노력이 곧 결실을 맺을 징조입니다!";
        if (_0xm3n4 > 30) return "중심의 강력한 번호들입니다! 리더십을 발휘하고 중요한 결정을 내리기에 좋은 날입니다.";
        if (_0xs9t0 < 20) return "신선한 번호들의 조합입니다. 예상치 못한 곳에서 새로운 기회가 찾아올 수 있습니다.";
        if (_0xi9j0.size >= 5) return "다양한 그룹의 번호들처럼, 오늘은 여러 분야에서 행운이 따를 수 있습니다. 시야를 넓혀보세요!";
        
        return "균형 잡힌 조합입니다. 꾸준함이 당신을 성공으로 이끌 것이니, 현재의 페이스를 유지하세요.";
    }

    // 방문자 카운터 함수들
    async function _0xv1w2() {
        try {
            const _0xy3z4 = await fetch('/api/visitors');
            const _0xa5b6 = await _0xy3z4.json();
            
            document.getElementById('total-visitors').textContent = _0xa5b6.total.toLocaleString();
            document.getElementById('today-visitors').textContent = _0xa5b6.today.toLocaleString();
            
            // 로컬 스토리지에서 오늘 방문 여부 확인
            const _0xc7d8 = localStorage.getItem('visited_today');
            const _0xe9f0 = new Date().toDateString();
            
            if (_0xc7d8 !== _0xe9f0) {
                // 오늘 첫 방문이면 카운터 증가
                await fetch('/api/visitors/increment', { method: 'POST' });
                localStorage.setItem('visited_today', _0xe9f0);
                
                // 카운터 다시 로드
                const _0xg1h2 = await fetch('/api/visitors');
                const _0xi3j4 = await _0xg1h2.json();
                document.getElementById('total-visitors').textContent = _0xi3j4.total.toLocaleString();
                document.getElementById('today-visitors').textContent = _0xi3j4.today.toLocaleString();
            }
        } catch (_0xk5l6) {
            console.error('방문자 카운터 로드 실패:', _0xk5l6);
        }
    }

    // 메인 실행 함수
    async function _0xa1b2() {
        try {
            // 방문자 카운터 초기화
            await _0xv1w2();
            
            const _0xc3d4 = await _0xc9d0();
            if(_0xc3d4.length === 0) {
                document.getElementById('loader').innerHTML = '<p class="text-red-400 text-xl">데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.</p>';
                return;
            }

            _0x7g8h = _0xu7v8(_0xc3d4);
            _0xw5x6(_0x7g8h.nodes, _0x7g8h.links);
            
            const _0xe5f6 = new Map(_0x7g8h.nodes.map(_0xg7h8 => [_0xg7h8.id, 0]));
            _0x7g8h.links.forEach(_0xi9j0 => {
                _0xe5f6.set(_0xi9j0.source, (_0xe5f6.get(_0xi9j0.source) || 0) + _0xi9j0.weight);
                _0xe5f6.set(_0xi9j0.target, (_0xe5f6.get(_0xi9j0.target) || 0) + _0xi9j0.weight);
            });
            _0x7g8h.nodes.forEach(_0xk1l2 => _0xk1l2.centrality = _0xe5f6.get(_0xk1l2.id) || 0);

            _0xw1x2();

            const _0xm3n4 = document.getElementById('loader');
            _0xm3n4.style.opacity = '0';
            setTimeout(() => _0xm3n4.style.display = 'none', 500);
            
            const _0xo5p6 = document.getElementById('draw-button');
            _0xo5p6.disabled = false;
            _0xo5p6.addEventListener('click', _0xk1l2);
        } catch (error) {
            console.error('애플리케이션 초기화 오류:', error);
            document.getElementById('loader').innerHTML = '<p class="text-red-400 text-xl">애플리케이션 초기화 중 오류가 발생했습니다.</p>';
        }
    }

    // 페이지 로드 시 실행
    document.addEventListener('DOMContentLoaded', _0xa1b2);
})();
