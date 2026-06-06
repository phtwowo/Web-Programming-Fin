export default function NoticeList({ notices, onMarkRead, onMarkAll }) {
  const unreadCount = notices.filter(n => !n.read).length;

  // 전체 공지(storeId === null)만 표시, 긴급 우선 + 날짜 최신순 정렬
  const globalNotices = [...notices.filter(n => !n.storeId)].sort((a, b) => {
    if (a.type === '긴급' && b.type !== '긴급') return -1;
    if (a.type !== '긴급' && b.type === '긴급') return  1;
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <section className="notice-section">
      <div className="section-title-row">
        <h2 className="section-title">
          전체 공지
          {unreadCount > 0 && (
            <span className="notice-count-badge">{unreadCount}</span>
          )}
        </h2>
        <button className="btn-mark-all" onClick={onMarkAll}>모두 읽음</button>
      </div>

      <div className="notice-list">
        {globalNotices.length === 0 ? (
          <div className="empty-state" style={{ padding: '30px 0' }}>
            <p>등록된 공지사항이 없습니다</p>
          </div>
        ) : (
          globalNotices.map(n => (
            <div
              key={n._id}
              className={`notice-item ${n.type === '긴급' ? 'urgent' : ''} ${n.read ? 'read' : ''}`}
              onClick={() => !n.read && onMarkRead(n._id)}
            >
              <div className={`notice-type-badge ${n.type}`}>{n.type}</div>
              <div className="notice-content-wrap">
                <div className="notice-store-tag">📢 전체 공지</div>
                <div className="notice-title">{n.title}</div>
                <div className="notice-preview">{n.content}</div>
              </div>
              <div className="notice-date">{n.date}</div>
              {!n.read && <div className="unread-dot" />}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
