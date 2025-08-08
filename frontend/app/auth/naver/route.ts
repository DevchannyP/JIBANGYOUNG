// app/api/auth/naver/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // 백엔드 베이스 URL (반드시 NEXT_PUBLIC_* 로 노출 가능한 값이어야 브라우저 리다이렉트와 일관)
  const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const target = `${backendBase}/api/auth/naver`; // 백엔드 스프링 컨트롤러로 전달
  return NextResponse.redirect(target);
}
