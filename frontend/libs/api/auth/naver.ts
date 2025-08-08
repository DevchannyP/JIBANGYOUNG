// pages/api/auth/naver.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // 백엔드의 네이버 OAuth 시작 엔드포인트로 직접 리다이렉트
  const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const naverAuthUrl = `${backendBase}/api/auth/naver`;
  
  console.log("[Next.js] 네이버 OAuth 시작 - 백엔드로 리다이렉트:", naverAuthUrl);
  
  res.redirect(naverAuthUrl);
}