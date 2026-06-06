import { useEffect } from 'react';

/**
 * 페이지 내 .sr 클래스 요소들을 IntersectionObserver로 감시해서
 * 뷰포트에 들어오면 .sr-visible 추가 → CSS 트랜지션 실행
 */
export function useScrollReveal(deps = []) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sr-visible');
            observer.unobserve(entry.target); // 한 번만 실행
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.sr');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
