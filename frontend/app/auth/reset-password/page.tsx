import ClientResetPwShell from "./ClientResetPwShell";

// ✅ 최소한의 타입 명시로 TS 에러 해결
interface ResetPasswordPageProps {
  searchParams?: { token?: string };
}

export default function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  return <ClientResetPwShell token={searchParams?.token || ""} />;
}
