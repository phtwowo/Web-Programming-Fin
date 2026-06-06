import { useState, useEffect } from 'react';

const GPS_RADIUS = 500;

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = d => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function ReportModal({ stores, onSubmit, onClose }) {
  const [gpsState, setGpsState]       = useState({ status: '', msg: '위치 확인 중…' });
  const [userPos, setUserPos]         = useState(null);   // { lat, lng }
  const [selectedId, setSelectedId]   = useState('');
  const [selectedCrowd, setCrowd]     = useState('');
  const [waitCount, setWaitCount]     = useState(0);
  const [soldout, setSoldout]         = useState(false);
  const [notice, setNotice]           = useState('');

  // GPS 요청
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsState({ status: 'error', msg: 'GPS를 지원하지 않는 브라우저입니다.' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsState({ status: 'ok', msg: `GPS 확인됨 (정확도 ±${Math.round(pos.coords.accuracy)}m)` });
      },
      err => {
        const msgs = { 1: '위치 권한이 거부되었습니다.', 2: '위치를 가져올 수 없습니다.', 3: '위치 요청 시간 초과' };
        setGpsState({ status: 'error', msg: msgs[err.code] ?? '위치 오류 발생' });
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  // 제출 가능 여부 & 안내 메시지 계산
  const canSubmit = (() => {
    if (!selectedId || !selectedCrowd) { return false; }
    if (!userPos) { return false; }
    const store = stores.find(s => s._id === selectedId);
    if (!store) return false;
    const dist = getDistance(userPos.lat, userPos.lng, store.lat, store.lng);
    if (dist > GPS_RADIUS) {
      return false;
    }
    return true;
  })();

  useEffect(() => {
    if (!selectedId || !selectedCrowd) { setNotice(''); return; }
    if (!userPos) { setNotice('GPS 위치 확인 후 제보할 수 있습니다.'); return; }
    const store = stores.find(s => s._id === selectedId);
    if (!store) return;
    const dist = getDistance(userPos.lat, userPos.lng, store.lat, store.lng);
    if (dist > GPS_RADIUS) {
      setNotice(`📍 매장까지 ${Math.round(dist)}m — 500m 이내에서만 제보 가능합니다.`);
    } else {
      setNotice(`✅ 매장 ${Math.round(dist)}m 근처 — 제보 가능합니다.`);
    }
  }, [selectedId, selectedCrowd, userPos, stores]);

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit({ storeId: selectedId, crowd: selectedCrowd, waitTeams: waitCount, soldout });
  }

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">현장 제보</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className={`gps-status ${gpsState.status}`}>
            <span>◎</span>
            <span>{gpsState.msg}</span>
          </div>

          <label className="field-label">매장 선택</label>
          <select className="field-select" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
            <option value="">— 매장을 선택하세요 —</option>
            {stores.map(s => (
              <option key={s._id} value={s._id}>{s.name.replace('\n', ' ')}</option>
            ))}
          </select>

          <label className="field-label">현재 혼잡도</label>
          <div className="crowd-btns">
            {['여유', '보통', '혼잡'].map(v => (
              <button
                key={v}
                className={`crowd-btn${selectedCrowd === v ? ' selected' : ''}`}
                onClick={() => setCrowd(v)}
              >
                {v === '여유' ? '🟢' : v === '보통' ? '🟡' : '🔴'} {v}
              </button>
            ))}
          </div>

          <label className="field-label">대기 팀수</label>
          <div className="number-input-row">
            <button className="num-btn" onClick={() => setWaitCount(c => Math.max(0, c - 1))}>−</button>
            <span className="num-display">{waitCount}</span>
            <button className="num-btn" onClick={() => setWaitCount(c => Math.min(99, c + 1))}>＋</button>
            <span className="num-unit">팀</span>
          </div>

          <label className="field-label">굿즈 품절 여부</label>
          <label className="toggle-wrap">
            <input type="checkbox" checked={soldout} onChange={e => setSoldout(e.target.checked)} />
            <span className="toggle-slider" />
            <span className="toggle-text">{soldout ? '품절 상태' : '재고 있음'}</span>
          </label>
        </div>

        <div className="modal-footer">
          <p className="modal-notice">{notice}</p>
          <button className="btn-submit" disabled={!canSubmit} onClick={handleSubmit}>
            제보 제출
          </button>
        </div>
      </div>
    </div>
  );
}
