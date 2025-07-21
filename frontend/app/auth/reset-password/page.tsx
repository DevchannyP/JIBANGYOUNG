// ✅ app/auth/reset-password/page.tsx
import ClientResetPwShell from "./ClientResetPwShell";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ResetPasswordPage({ searchParams }: PageProps) {
  const token = Array.isArray(searchParams.token)
    ? searchParams.token[0]
    : (searchParams.token ?? "");

  return <ClientResetPwShell token={token} />;
}
