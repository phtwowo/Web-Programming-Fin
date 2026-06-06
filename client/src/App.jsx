import { useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';

import Header        from './components/Header';
import Toast         from './components/Toast';
import HomePage      from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';

const API = '/api';

function nowHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

export default function App() {
  const [stores, setStores]           = useState([]);
  const [notices, setNotices]         = useState([]);
  const [lastUpdated, setLastUpdated] = useState('');
  const [toastMsg, setToastMsg]       = useState('');
  const toastKey                      = useRef(0);

  // ── 배경 오브 마우스 패럴랙스 ──
  const orb1Ref  = useRef(null);
  const orb2Ref  = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const posRef   = useRef({ x1:0, y1:0, x2:0, y2:0 });

  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t;

    const onMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);

    let id;
    const animate = () => {
      const { x, y } = mouseRef.current;
      const { innerWidth: W, innerHeight: H } = window;
      const nx = (x / W - 0.5) * 2;  // -1 ~ 1
      const ny = (y / H - 0.5) * 2;

      posRef.current.x1 = lerp(posRef.current.x1, nx * 50, 0.04);
      posRef.current.y1 = lerp(posRef.current.y1, ny * 40, 0.04);
      posRef.current.x2 = lerp(posRef.current.x2, -nx * 35, 0.03);
      posRef.current.y2 = lerp(posRef.current.y2, -ny * 30, 0.03);

      if (orb1Ref.current)
        orb1Ref.current.style.transform = `translate(${posRef.current.x1}px, ${posRef.current.y1}px)`;
      if (orb2Ref.current)
        orb2Ref.current.style.transform = `translate(${posRef.current.x2}px, ${posRef.current.y2}px)`;

      id = requestAnimationFrame(animate);
    };
    animate();

    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(id); };
  }, []);

  // ── 커서 글로우 ──
  useEffect(() => {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;
    let cx = 0, cy = 0, tx = 0, ty = 0, id;
    const lerp = (a, b, t) => a + (b - a) * t;

    const onMove = (e) => { tx = e.clientX; ty = e.clientY; };
    window.addEventListener('mousemove', onMove);

    const tick = () => {
      cx = lerp(cx, tx, 0.1); cy = lerp(cy, ty, 0.1);
      glow.style.left = `${cx}px`;
      glow.style.top  = `${cy}px`;
      id = requestAnimationFrame(tick);
    };
    tick();

    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(id); };
  }, []);

  // ── 스크롤 진행바 ──
  useEffect(() => {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    const update = () => {
      const { scrollY, innerHeight } = window;
      const { scrollHeight } = document.documentElement;
      const pct = scrollY / (scrollHeight - innerHeight) * 100;
      bar.style.width = `${Math.min(pct, 100)}%`;
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  // ── 토스트 ──
  function showToast(msg) {
    toastKey.current += 1;
    setToastMsg(msg + '​'.repeat(toastKey.current % 5));
  }

  // ── API ──
  const fetchAll = useCallback(async () => {
    try {
      const [sRes, nRes] = await Promise.all([fetch(`${API}/stores`), fetch(`${API}/notices`)]);
      setStores(await sRes.json());
      setNotices(await nRes.json());
      setLastUpdated(`업데이트 ${nowHHMM()}`);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function handleToggleGoods(storeId, soldout) {
    const res     = await fetch(`${API}/stores/${storeId}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ soldout }) });
    const updated = await res.json();
    setStores(prev => prev.map(s => s._id === storeId ? updated : s));
  }

  async function handleMarkRead(noticeId) {
    const res     = await fetch(`${API}/notices/${noticeId}/read`, { method:'PATCH' });
    const updated = await res.json();
    setNotices(prev => prev.map(n => n._id === noticeId ? updated : n));
  }

  async function handleMarkAll() {
    await fetch(`${API}/notices/read-all`, { method:'POST' });
    setNotices(prev => prev.map(n => ({ ...n, read: true })));
    showToast('✅ 모든 공지를 읽음 처리했습니다.');
  }

  async function handleReport({ storeId, crowd, waitTeams, soldout }) {
    const res     = await fetch(`${API}/stores/${storeId}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ crowd, waitTeams, soldout }) });
    const updated = await res.json();
    setStores(prev => prev.map(s => s._id === storeId ? updated : s));
    setLastUpdated(`업데이트 ${nowHHMM()}`);
  }

  return (
    <>
      {/* 스크롤 진행바 */}
      <div id="scroll-progress" />

      {/* 커서 글로우 */}
      <div id="cursor-glow" />

      {/* 배경 오브 */}
      <div className="bg-orb bg-orb-1" ref={orb1Ref} />
      <div className="bg-orb bg-orb-2" ref={orb2Ref} />
      <div className="bg-orb bg-orb-3" />

      <Header lastUpdated={lastUpdated} />

      <main>
        <Routes>
          <Route path="/" element={<HomePage stores={stores} />} />
          <Route
            path="/dashboard"
            element={
              <DashboardPage
                stores={stores} notices={notices}
                onRefresh={() => { fetchAll(); showToast('🔄 새로고침 완료'); }}
                onToggleGoods={handleToggleGoods}
                onMarkRead={handleMarkRead}
                onMarkAll={handleMarkAll}
                onReport={handleReport}
                showToast={showToast}
              />
            }
          />
        </Routes>
      </main>

      <Toast message={toastMsg} />
    </>
  );
}
