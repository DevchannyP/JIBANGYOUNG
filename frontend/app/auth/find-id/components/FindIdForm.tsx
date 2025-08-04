"use client";
import { checkEmail, findIdByEmailAndCode, sendFindIdCode, verifyFindIdCode } from "@/libs/api/auth/auth.api";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styles from "../FindIdPage.module.css";


//  Props 타입 정의
interface Props {
  onSuccess: (username: string) => void;
  onError: (msg: string) => void;
  error?: string;
}

// 아이디 찾기 폼 컴포넌트
export default function FindIdForm({ onSuccess, onError, error }: Props) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [finding, setFinding] = useState(false);
  const [emailMsg, setEmailMsg] = useState("");
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const [codeMsg, setCodeMsg] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (codeSent && codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, [codeSent]);

  const emailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 100;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value.replace(/[<>'"`;]/g, ""));
    setCodeSent(false);
    setCode("");
    setCodeMsg("");
    setEmailMsg("");
    setEmailChecked(false);
    setCodeVerified(false);
  };

  const handleEmailCheck = async () => {
    setEmailMsg("");
    setEmailChecked(false);
    if (!emailValid) {
      setEmailMsg("올바른 이메일 형식을 입력하세요.");
      return;
    }
    setEmailChecking(true);
    setEmailMsg("이메일을 확인 중입니다...");
    try {
      const res = await checkEmail(email.trim());
      if (res.available === false) {
        setEmailChecked(true);
        setEmailMsg("");
      } else {
        setEmailChecked(false);
        setEmailMsg("해당 이메일로 가입된 계정이 없습니다.");
      }
    } catch (e: any) {
      setEmailChecked(false);
      setEmailMsg(e?.message || "이메일 확인 중 오류");
    } finally {
      setEmailChecking(false);
    }
  };

  const handleSendCode = async () => {
    if (!emailValid || sending || !emailChecked || emailChecking) {
      if (!emailChecked && !emailChecking)
        setEmailMsg("이메일 확인을 먼저 해주세요.");
      return;
    }
    setSending(true);
    setCodeMsg("");
    setCodeVerified(false);
    try {
      await sendFindIdCode(email.trim());
      setCodeSent(true);
      setCode("");
      setCodeMsg("이메일로 인증코드가 발송되었습니다. 새 코드를 입력하세요.");
    } catch (err: any) {
      setCodeMsg(err?.message || "코드 발송에 실패했습니다.");
    } finally {
      setSending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code || !emailChecked || !codeSent || sending) return;
    setSending(true);
    setCodeMsg("");
    try {
      const res = await verifyFindIdCode(email.trim(), code.trim());
      if (res.valid) {
        setCodeVerified(true);
        setCodeMsg("인증 성공! 아이디 찾기 버튼을 눌러주세요.");
      } else {
        setCodeVerified(false);
        setCodeMsg("인증코드가 올바르지 않습니다.");
      }
    } catch (err: any) {
      setCodeVerified(false);
      setCodeMsg(err?.message || "코드 검증에 실패했습니다.");
    } finally {
      setSending(false);
    }
  };

  // ★ 성공시 팝업/라우팅만! 폼은 숨겨지고 상태 리셋 필요 없음
  const handleFindId = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValid || !code || finding || !emailChecked || !codeSent || !codeVerified) return;
    setFinding(true);
    setCodeMsg("");
    try {
      const data = await findIdByEmailAndCode(email.trim(), code.trim());
      if (!data?.username) {
        onError("일치하는 아이디가 없습니다.");
      } else {
        onSuccess(data.username);
      }
    } catch (err: any) {
      onError(
        err?.message ||
        "아이디 찾기에 실패하였습니다. 정보를 확인해주세요."
      );
    } finally {
      setFinding(false);
    }
  };

  // 이메일 인풋: Enter 시 이메일 확인
  const handleEmailInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Enter" &&
      !emailChecking &&
      !sending &&
      !finding &&
      !emailChecked && // "확인완료" 상태가 아닐 때만
      emailValid
    ) {
      e.preventDefault();
      handleEmailCheck();
    }
  };
  // 코드 인풋: Enter 시 코드 검증
  const handleCodeInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (
        emailValid &&
        code &&
        emailChecked &&
        codeSent &&
        !finding &&
        !emailChecking
      ) {
        handleVerifyCode();
      }
    }
  };

  return (
    <form
      className={styles.formContainer}
      autoComplete="off"
      aria-label="아이디 찾기 폼"
      aria-busy={sending || finding}
      onSubmit={handleFindId}
      style={{ gap: 0 }}
    >
      <div className={styles.inputRow}>
        <input
          ref={inputRef}
          type="email"
          value={email}
          onChange={handleEmailChange}
          onKeyDown={handleEmailInputKeyDown}
          placeholder="이메일 입력"
          autoComplete="email"
          aria-label="이메일"
          required
          className={styles.inputField}
          disabled={sending || finding || emailChecking}
          spellCheck={false}
        />
        <button
          type="button"
          className={styles.codeButton}
          onClick={handleEmailCheck}
          disabled={
            !emailValid ||
            sending ||
            finding ||
            emailChecking
          }
        >
          {emailChecking ? "확인중..." : emailChecked ? "확인완료" : "이메일 확인"}
        </button>
      </div>
      {emailMsg && (
        <div
          style={{
            color:
              emailMsg === "이메일을 확인 중입니다..."
                ? "#a09e32"
                : "#b02c2c",
            fontWeight: 500,
            fontSize: "0.98rem",
            marginBottom: 6,
            textAlign: "center",
          }}
        >
          {emailMsg}
        </div>
      )}

      <AnimatePresence>
        {emailChecked && !codeSent && (
          <motion.div
            key="codesend-btn"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            style={{ width: "100%" }}
          >
            <button
              type="button"
              className={styles.codeButton}
              style={{ width: "100%", margin: "8px 0 12px 0" }}
              onClick={handleSendCode}
              disabled={
                !emailValid ||
                sending ||
                !emailChecked ||
                emailChecking
              }
            >
              {sending ? "코드발송중..." : "코드발송"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {codeSent && emailChecked && (
          <motion.div
            key="code-section"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            style={{ width: "100%" }}
          >
            {codeMsg && (
              <div
                style={{
                  color: codeMsg.startsWith("인증 성공") ? "#147833" : "#b02c2c",
                  fontWeight: 500,
                  fontSize: "0.96rem",
                  margin: "0 0 6px 0",
                  textAlign: "center",
                  letterSpacing: "-0.01em",
                }}
              >
                {codeMsg}
              </div>
            )}
            <div className={styles.inputRow}>
              <input
                ref={codeInputRef}
                type="text"
                value={code}
                onChange={e => {
                  setCode(e.target.value.replace(/[<>'"`;]/g, ""));
                  setCodeVerified(false);
                }}
                onKeyDown={handleCodeInputKeyDown}
                placeholder="인증코드"
                aria-label="인증코드"
                className={styles.inputField}
                disabled={sending || finding}
              />
              <button
                type="button"
                className={styles.codeButton}
                onClick={handleSendCode}
                disabled={
                  !emailValid ||
                  sending ||
                  !emailChecked ||
                  emailChecking
                }
              >
                {sending ? "코드재발송..." : "재발송"}
              </button>
              <button
                type="button"
                className={styles.codeButton}
                onClick={handleVerifyCode}
                disabled={
                  !emailValid ||
                  !code ||
                  !emailChecked ||
                  !codeSent ||
                  sending
                }
                style={{ marginLeft: 4 }}
              >
                {sending ? "확인중..." : "코드확인"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={
          !emailValid || !code || finding || !emailChecked || !codeSent || !codeVerified || emailChecking
        }
        aria-disabled={
          !emailValid || !code || finding || !emailChecked || !codeSent || !codeVerified || emailChecking
        }
        className={styles.findIdButton}
        tabIndex={0}
        style={{ marginBottom: "12px" }}
      >
        {finding ? "아이디 찾기..." : "아이디 찾기"}
      </button>
      {error && (
        <div className={styles.errorMsg} role="alert">
          {error}
        </div>
      )}
    </form>
  );
}
