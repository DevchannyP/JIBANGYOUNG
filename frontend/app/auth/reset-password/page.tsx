// app/auth/reset-password/page.tsx
import ClientResetPwShell from "./ClientResetPwShell";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // token이 배열로 올 수 있으니 안전하게 처리
  const tokenRaw = searchParams.token;
  const token = Array.isArray(tokenRaw) ? tokenRaw[0] : tokenRaw || "";

  return <ClientResetPwShell token={token} />;
}
