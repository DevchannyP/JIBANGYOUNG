// app/mypage/page.tsx
import MyPageClient from "./MyPageClient";

export const metadata = {
  title: "마이페이지 – 지방청년",
  description: "내 활동, 점수, 프로필까지 한눈에!",
};

export default function MyPagePage() {
  // SSR: SEO/메타만
  // CSR: 내부 Shell에서 상태/탭/데이터 전부 처리
  return <MyPageClient />;
}
