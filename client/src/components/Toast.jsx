import { useEffect, useState } from 'react';

// 전역 토스트 — App에서 setToast(msg) 로 호출
export default function Toast({ message }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2400);
    return () => clearTimeout(t);
  }, [message]);

  return (
    <div className={`toast${visible ? ' show' : ''}`}>
      {message}
    </div>
  );
}
