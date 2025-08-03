// app/layout.tsx
import type { Metadata } from "next";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import "../styles/globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "지방청년 플랫폼",
  description: "정책 추천과 커뮤니티를 지원하는 지역 정착 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      {/* suppressHydrationWarning 제거: SSR/CSR 결과 일치시 불필요 */}
      <body>
        <Providers>
          <Header />
          <main className="container">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
