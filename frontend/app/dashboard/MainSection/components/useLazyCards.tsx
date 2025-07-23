import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useLazyCards
 * - 여러 카드 지연 mount를 1개의 IntersectionObserver로 관리
 * - 모바일/Safari 등에서 requestIdleCallback 미지원 시 setTimeout 대체
 */
export function useLazyCards(cardCount: number) {
  const [visible, setVisible] = useState<boolean[]>(
    Array(cardCount).fill(false)
  );
  // DOM ref를 담을 배열
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  // 콜백 ref를 cardCount만큼 생성, return void!
  const setRef = useCallback(
    (idx: number) => (el: HTMLDivElement | null) => {
      refs.current[idx] = el;
    },
    []
  );

  // 모든 ref 콜백 배열화
  const refCallbacks = Array.from({ length: cardCount }, (_, i) => setRef(i));

  useEffect(() => {
    // 폴리필
    const ric: any = (window as any).requestIdleCallback
      ? (cb: Function) =>
          (window as any).requestIdleCallback(cb, { timeout: 500 })
      : (cb: Function) => setTimeout(cb, 60);

    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting && !visible[i]) {
            ric(() =>
              setVisible((prev) => {
                if (!prev[i]) {
                  const next = [...prev];
                  next[i] = true;
                  return next;
                }
                return prev;
              })
            );
          }
        });
      },
      { threshold: 0.14 }
    );

    refs.current.forEach((ref, i) => {
      if (ref && !visible[i]) observer.observe(ref);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line
  }, [visible, cardCount]);

  // refCallbacks[i]를 <div ref={refCallbacks[i]}/>처럼 사용
  return {
    refs: refCallbacks,
    visible,
  };
}
