import ClientResetPwShell from "./ClientResetPwShell";

// ✅ searchParams는 선택적이 아니어야 Next.js PageProps 조건을 만족함
interface ResetPasswordPageProps {
  searchParams: { token?: string };
}

export default function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  return <ClientResetPwShell token={searchParams?.token || ""} />;
}
