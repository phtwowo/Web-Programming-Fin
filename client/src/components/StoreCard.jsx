import { useRef } from 'react';

const CROWD_EMOJI = { 여유: '🟢', 보통: '🟡', 혼잡: '🔴' };

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return '방금 전';
  if (diff < 3600)  return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

export default function StoreCard({ store, notices = [], onToggleGoods, onCardClick, style }) {
  const cardRef   = useRef(null);
  const rafRef    = useRef(null);

  const crowdEmoji = CROWD_EMOJI[store.crowd] ?? '⚪';
  const goodsClass = store.soldout ? 'sold-out' : 'in-stock';
  const goodsText  = store.soldout ? '품절'    : '재고 있음';
  const urgentNotice = notices.find(n => n.storeId === store._id && n.type === '긴급');

  // ── 3D 틸트 ──
  function handleMouseMove(e) {
    const card = cardRef.current;
    if (!card) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 ~ 0.5
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateZ(8px)`;
      // 마우스 위치에 따라 그라디언트 이동
      card.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
      card.style.setProperty('--my', `${(y + 0.5) * 100}%`);
    });
  }

  function handleMouseLeave() {
    cancelAnimationFrame(rafRef.current);
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s, box-shadow 0.3s';
    setTimeout(() => { if (card) card.style.transition = ''; }, 500);
  }

  return (
    <div
      className={`store-card sr crowd-${store.crowd}`}
      ref={cardRef}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onCardClick(store._id)}
    >
      <div className="card-top">
        <div className="store-name" dangerouslySetInnerHTML={{ __html: store.name.replace('\n','<br>') }} />
        <div className={`crowd-badge ${store.crowd}`}>{crowdEmoji} {store.crowd}</div>
      </div>

      <div className="card-wait">
        <span className="wait-num">{store.waitTeams}</span>
        <span className="wait-unit">팀 대기</span>
      </div>

      <div className="crowd-gauge">
        <div className={`crowd-gauge-fill ${store.crowd}`} />
      </div>

      <div className="card-bottom">
        <div>
          <div className="goods-label">굿즈 재고</div>
          <div className={`goods-status ${goodsClass}`}>{goodsText}</div>
        </div>
        <button
          className="btn-toggle-goods"
          onClick={e => { e.stopPropagation(); onToggleGoods(store._id, !store.soldout); }}
        >
          {store.soldout ? '재고 복구' : '품절 처리'}
        </button>
      </div>

      {urgentNotice && (
        <div className="card-notice-preview">
          <span className="notice-dot" />
          <span>{urgentNotice.title}</span>
        </div>
      )}

      <div className="card-updated">📍 {store.address} · {timeAgo(store.updatedAt)}</div>
    </div>
  );
}
