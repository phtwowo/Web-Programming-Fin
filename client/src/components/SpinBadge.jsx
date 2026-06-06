import { useEffect, useRef } from 'react';

/* 스크롤에 맞춰 회전하는 원형 텍스트 엠블럼 */
export default function SpinBadge({ variant = '' }) {
  const svgRef = useRef(null);

  useEffect(() => {
    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (svgRef.current)
          svgRef.current.style.transform = `rotate(${window.scrollY * 0.18}deg)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  // 원 둘레(2πr, r=72) ≈ 452 → textLength로 정확히 한 바퀴 채움
  const ring = 'POPUP NOW · 팝업나우 · REAL-TIME DATA · PUN · ';

  return (
    <div className={`spin-badge sr ${variant}`.trim()}>
      <svg ref={svgRef} className="spin-badge-svg" viewBox="0 0 200 200">
        <defs>
          <path id="spinPath" fill="none"
            d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
        </defs>
        <text className="spin-badge-text">
          <textPath href="#spinPath" xlinkHref="#spinPath"
            startOffset="0" textLength="452" lengthAdjust="spacing">
            {ring}
          </textPath>
        </text>
      </svg>

      <div className="spin-badge-center">
        <div className="spin-badge-logo">
          {['P', 'U', 'N'].map((ch, i) => (
            <span className="spin-badge-letter" key={i}>{ch}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
