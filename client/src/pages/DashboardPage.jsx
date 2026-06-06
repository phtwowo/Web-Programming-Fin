import { useState, useEffect, useRef } from 'react';
import StoreCard   from '../components/StoreCard';
import NoticeList  from '../components/NoticeList';
import DetailModal from '../components/DetailModal';
import ReportModal from '../components/ReportModal';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useCountUp }      from '../hooks/useCountUp';

/* 스탯 아이템 — 숫자가 뷰포트에 들어오면 카운트업 */
function StatItem({ value, label, icon, numColor, accentColor }) {
  const ref     = useRef(null);
  const [vis, setVis] = useState(false);
  const count   = useCountUp(vis ? value : 0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="stat-item sr" ref={ref} style={accentColor ? { '--stat-accent': accentColor } : undefined}>
      {icon && <span className="stat-icon">{icon}</span>}
      <span className={`stat-num${numColor ? ` ${numColor}` : ''}`}>{count}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function DashboardPage({ stores, notices, onRefresh, onToggleGoods, onMarkRead, onMarkAll, onReport, showToast }) {
  const [detailStoreId, setDetailStoreId] = useState(null);
  const [reportOpen, setReportOpen]       = useState(false);

  // stores/notices가 바뀔 때 새 .sr 요소들 재감시
  useScrollReveal([stores.length, notices.length]);

  const detailStore = stores.find(s => s._id === detailStoreId) ?? null;

  async function handleReport(data) {
    await onReport(data);
    setReportOpen(false);
    showToast('🎉 제보가 반영되었습니다!');
  }

  return (
    <div className="dashboard-page">
      {/* 통계 바 */}
      <section className="stats-bar">
        <StatItem value={stores.length}                             label="운영 중"  icon="🏪" />
        <StatItem value={stores.filter(s=>s.crowd==='혼잡').length} label="혼잡"     icon="🔴" numColor="red"    accentColor="var(--red)" />
        <StatItem value={stores.filter(s=>s.soldout).length}       label="품절 굿즈" icon="📦" numColor="yellow" accentColor="var(--yellow)" />
        <StatItem value={notices.filter(n=>!n.read).length}        label="새 공지"  icon="📢" numColor="blue"   accentColor="var(--blue)" />
      </section>

      {/* 공지사항 */}
      <NoticeList notices={notices} onMarkRead={onMarkRead} onMarkAll={onMarkAll} />

      {/* 카드 그리드 */}
      <section className="dashboard">
        <div className="section-title-row sr">
          <h2 className="section-title">실시간 현황</h2>
          <button className="btn-refresh" onClick={onRefresh}>↻ 새로고침</button>
        </div>

        <div className="card-grid">
          {stores.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📍</div>
              <p>등록된 팝업 매장이 없습니다</p>
            </div>
          ) : (
            stores.map((store, i) => (
              <StoreCard
                key={store._id}
                store={store}
                notices={notices}
                style={{ animationDelay: `${i * 0.07}s` }}
                onToggleGoods={(id, soldout) => {
                  onToggleGoods(id, soldout);
                  showToast(soldout ? '🚫 품절 처리 완료' : '✅ 재고 복구 완료');
                }}
                onCardClick={id => setDetailStoreId(id)}
              />
            ))
          )}
        </div>
      </section>

      {/* FAB */}
      <button className="fab" onClick={() => setReportOpen(true)}>
        <span className="fab-icon">＋</span>
        <span>제보</span>
      </button>

      {detailStoreId && (
        <DetailModal store={detailStore} notices={notices} onClose={() => setDetailStoreId(null)} />
      )}
      {reportOpen && (
        <ReportModal stores={stores} onSubmit={handleReport} onClose={() => setReportOpen(false)} />
      )}
    </div>
  );
}
