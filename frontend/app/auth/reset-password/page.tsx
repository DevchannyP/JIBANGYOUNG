// app/auth/reset-password/page.tsx
import ClientResetPwShell from "./ClientResetPwShell";

export default function ResetPasswordPage(props: any) {
  const searchParams = props?.searchParams ?? {};
  const tokenRaw = searchParams.token;
  const token = Array.isArray(tokenRaw) ? tokenRaw[0] : (tokenRaw ?? "");

  return <ClientResetPwShell token={token} />;
}
