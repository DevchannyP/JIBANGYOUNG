"use client";
import { useState } from "react";
import FindIdForm from "./FindIdForm";
import FindIdSuccessModal from "./FindIdSuccessModal";

export default function FindIdSection() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);

  // 성공시 팝업만 띄움!
  const handleSuccess = (username: string) => {
    setResult(username);
    setModalOpen(true);
  };

  const handleError = (errMsg: string) => {
    setResult(null);
    setModalOpen(false);
    setError(errMsg);
  };

  const handleCloseModal = () => {
    setResult(null);
    setModalOpen(false);
    setError("");
  };

  return (
    <>
      <FindIdForm onSuccess={handleSuccess} onError={handleError} error={error} />
      <FindIdSuccessModal
        username={result || ""}
        open={!!modalOpen && !!result}
        onClose={handleCloseModal}
      />
    </>
  );
}
