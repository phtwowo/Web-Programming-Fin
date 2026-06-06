import { useState } from 'react';

const CROWD_EMOJI = { 여유: '🟢', 보통: '🟡', 혼잡: '🔴' };

export default function DetailModal({ store, notices = [], onClose }) {
  const [accordionOpen, setAccordionOpen] = useState(false);

  if (!store) return null;

  const storeNotices = [...notices.filter(n => n.storeId === store._id)].sort((a, b) => {
    if (a.type === '긴급' && b.type !== '긴급') return -1;
    if (a.type !== '긴급' && b.type === '긴급') return  1;
    return new Date(b.date) - new Date(a.date);
  });

  const unreadCount = storeNotices.filter(n => !n.read).length;
  const crowdEmoji  = CROWD_EMOJI[store.crowd] ?? '⚪';

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-detail">
        <div className="modal-header">
          <h3 className="modal-title">{store.name.replace('\n', ' ')}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="detail-summary">
            <div className="detail-chip">{crowdEmoji} 혼잡도<strong>{store.crowd}</strong></div>
            <div className="detail-chip">⏳ 대기<strong>{store.waitTeams}팀</strong></div>
            <div className="detail-chip">🎁 굿즈<strong>{store.soldout ? '품절' : '재고 있음'}</strong></div>
            <div className="detail-chip">📍 위치<strong style={{ fontSize: '0.8rem' }}>{store.address}</strong></div>
          </div>

          <div className="accordion-wrap">
            <button
              className={`accordion-trigger${accordionOpen ? ' open' : ''}`}
              onClick={() => setAccordionOpen(v => !v)}
            >
              <span>매장 공지사항</span>
              {unreadCount > 0 && <span className="accordion-badge">{unreadCount}</span>}
              <span className="accordion-arrow">▾</span>
            </button>

            <div className={`accordion-body${accordionOpen ? ' open' : ''}`}>
              {storeNotices.length === 0 ? (
                <div className="accordion-empty">이 매장의 공지사항이 없습니다</div>
              ) : (
                storeNotices.map(n => (
                  <div key={n._id} className={`accordion-notice-item${n.type === '긴급' ? ' urgent' : ''}`}>
                    <div className="accordion-notice-header">
                      <div className={`notice-type-badge ${n.type}`}>{n.type}</div>
                      <div className="accordion-notice-title">{n.title}</div>
                      <div className="accordion-notice-date">{n.date}</div>
                    </div>
                    <div className="accordion-notice-body">{n.content}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
