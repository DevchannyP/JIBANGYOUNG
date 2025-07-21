import ClientResetPwShell from "./ClientResetPwShell";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  return <ClientResetPwShell token={searchParams?.token || ""} />;
}
