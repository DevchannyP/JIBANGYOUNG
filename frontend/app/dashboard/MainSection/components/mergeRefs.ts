import { MutableRefObject } from "react";

// 여러 ref를 하나로 합성(콜백ref + useRef 등)
export function mergeRefs<T>(
  ...refs: (
    | MutableRefObject<T | null>
    | ((el: T | null) => void)
    | null
    | undefined
  )[]
) {
  return (el: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(el);
      } else {
        (ref as MutableRefObject<T | null>).current = el;
      }
    });
  };
}
