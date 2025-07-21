"use client";
import { useState } from "react";
import ResetPasswordForm from "./components/ResetPasswordForm";
import ResetPasswordResult from "./components/ResetPasswordResult";

interface Props {
  token: string;
}

export default function ClientResetPwShell({ token }: Props) {
  const [result, setResult] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);

  if (!token) {
    return (
      <ResetPasswordResult status="error" message="토큰이 누락되었습니다." />
    );
  }

  return result ? (
    <ResetPasswordResult {...result} />
  ) : (
    <ResetPasswordForm token={token} onResult={setResult} />
  );
}
