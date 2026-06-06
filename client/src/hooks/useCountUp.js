import { useEffect, useRef, useState } from 'react';

/** 숫자가 0 → target 으로 부드럽게 올라가는 훅 */
export function useCountUp(target, duration = 900) {
  const [count, setCount]   = useState(0);
  const frameRef            = useRef(null);
  const prevTargetRef       = useRef(target);

  useEffect(() => {
    if (prevTargetRef.current === target && count !== 0) return;
    prevTargetRef.current = target;

    const startTime = Date.now();
    const startVal  = count;

    const tick = () => {
      const elapsed  = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(startVal + (target - startVal) * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };

    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return count;
}
