"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer-root">
      <div className="footer-inner">
        <div
          className="copyright"
          style={{ display: "flex", gap: 10, alignItems: "center" }}
        >
          <span>&copy; 지방청년 플랫폼</span>
          <Link href="/policy" className="footer-link">
            개인정보처리방침
          </Link>
        </div>
        <div className="footer-links">
          <Link href="/policy" className="footer-link">
            전체 정책
          </Link>
          <Link href="/recommendation" className="footer-link">
            추천 정책
          </Link>
          <Link href="/community" className="footer-link">
            커뮤니티
          </Link>
          <Link href="/mentor" className="footer-link">
            멘토 공지
          </Link>
          <Link href="/admin" className="footer-link">
            관리자
          </Link>
        </div>
      </div>
    </footer>
  );
}
