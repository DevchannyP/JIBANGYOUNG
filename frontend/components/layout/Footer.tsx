"use client";

import Link from "next/link";

const siteLinks = [
  { href: "/about", text: "서비스 소개" },
  { href: "/mentor/info", text: "멘토" },
];

const policyLinks = [
  { href: "/terms", text: "이용약관" },
  { href: "/privacy", text: "개인정보처리방침" },
];

export default function Footer() {
  return (
    <footer className="footer-root">
      <div className="footer-inner">
        <div className="footer-layout">
          {" "}
          {/* 가로 배치를 위한 래퍼 */}
          <div className="footer-brand">
            <h3>JIBANGYOUNG</h3>
            <p>지방 청년들의 새로운 시작과 성장을 응원합니다.</p>
          </div>
          <div className="footer-links-group">
            <h4>바로가기</h4>
            {siteLinks.map((link) => (
              <Link key={link.href} href={link.href} className="footer-link">
                {link.text}
              </Link>
            ))}
          </div>
          <div className="footer-links-group">
            <h4>약관 및 정책</h4>
            {policyLinks.map((link) => (
              <Link key={link.href} href={link.href} className="footer-link">
                {link.text}
              </Link>
            ))}
          </div>
        </div>

        <div className="footer-info">
          <div className="copyright">
            <span>© 2024 JIBANGYOUNG. All Rights Reserved.</span>
            <span className="separator">|</span>
            <span>Team JIBANGYOUNG</span>
          </div>
          <div className="contact">
            <span>문의: </span>
            <a href="mailto:yelock@naver.com" className="footer-link">
              yelock@naver.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
