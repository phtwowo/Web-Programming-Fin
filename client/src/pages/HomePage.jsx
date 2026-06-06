import { useEffect, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const MARQUEE_ITEMS = ['REAL-TIME','POPUP NOW','크라우드소싱','PUN','LIVE DATA','팝업나우','INTELLIGENCE','NO WAITING'];

export default function HomePage({ stores = [] }) {
  const heroRef = useRef(null);
  useScrollReveal([]);

  // 히어로 텍스트 리빌 트리거
  useEffect(() => {
    const t = setTimeout(() => {
      heroRef.current?.classList.add('ready');
    }, 100);
    return () => clearTimeout(t);
  }, []);

  // 간단한 통계 (stores 데이터 활용)
  const total   = stores.length;
  const crowded = stores.filter(s => s.crowd === '혼잡').length;
  const waiting = stores.reduce((acc, s) => acc + (s.waitTeams || 0), 0);

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero" ref={heroRef}>
        <div className="pun-3d" aria-hidden="true">PUN</div>
        <div className="hero-inner">
          <p className="hero-label">POPUP NOW · 팝업나우 · PUN</p>

          <h1 className="hero-title">
            <span className="line"><span>실시간으로</span></span>
            <span className="line"><span>연결하는 <em className="accent">팝업</em></span></span>
            <span className="line"><span>플랫폼</span></span>
          </h1>

          <p className="hero-desc">
            기다림을 없앱니다. 현장 크라우드소싱 데이터로<br />
            팝업스토어 혼잡도를 실시간으로 공유하세요.
          </p>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">{total || '—'}</span>
              <span className="hero-stat-label">운영 중</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">{crowded || '—'}</span>
              <span className="hero-stat-label">혼잡</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">{waiting || '—'}</span>
              <span className="hero-stat-label">총 대기팀</span>
            </div>
          </div>
        </div>

        <div className="scroll-hint">
          <div className="scroll-hint-line" />
          SCROLL
        </div>
      </section>

      {/* ── 마퀴 구분선 ── */}
      <div className="marquee-divider">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <div className="marquee-item" key={i}>
              {item}
              <span className="marquee-dot" />
            </div>
          ))}
        </div>
      </div>

      {/* ── VALUE SECTION ── */}
      <section className="value-section">
        <div className="value-section-header sr">
          <p className="section-eyebrow">OUR CORE VALUE</p>
          <h2 className="section-heading">
            불필요한 대기를 없애고<br />
            <em>경험에만 집중</em>하게 합니다
          </h2>
        </div>

        <div className="value-grid">
          <div className="value-card sr sd-1">
            <span className="value-num">01</span>
            <h3>Real-Time Check</h3>
            <p>기다림의 시간을 가치 있게. 현장 적체 현상과 혼잡도를 실시간 실측 데이터 기반으로 가장 빠르게 제공합니다.</p>
          </div>
          <div className="value-card sr sd-2">
            <span className="value-num">02</span>
            <h3>Collective Intel</h3>
            <p>유저들의 자발적인 크라우드소싱 제보 시스템을 통해 데이터의 신뢰성을 함께 검증하고 고도화합니다.</p>
          </div>
          <div className="value-card sr sd-3">
            <span className="value-num">03</span>
            <h3>No Waiting, Just Enjoy</h3>
            <p>불필요한 대기 동선을 최소화하여 브랜드와 소비자 모두가 팝업스토어 고유의 경험에만 몰입할 수 있도록 돕습니다.</p>
          </div>
        </div>
      </section>
    </>
  );
}
