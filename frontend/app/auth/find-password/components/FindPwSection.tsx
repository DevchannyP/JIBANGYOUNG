"use client";
import { useState } from "react";
import FindPwForm from "./FindPwForm";
import FindPwResult from "./FindPwResult";

export default function FindPwSection() {
  const [result, setResult] = useState<{ email: string } | null>(null);
  const [error, setError] = useState<string>("");

  const handleSuccess = (email: string) => {
    setResult({ email });
    setError("");
  };
  const handleError = (errMsg: string) => {
    setResult(null);
    setError(errMsg);
  };
  const handleRetry = () => {
    setResult(null);
    setError("");
  };

  return result ? (
    <FindPwResult email={result.email} onRetry={handleRetry} />
  ) : (
    <FindPwForm onSuccess={handleSuccess} onError={handleError} error={error} />
  );
}
