"use client";

import { AnimatePresence, motion } from "framer-motion";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  useCheckEmail,
  useCheckUsername,
  useSendCode,
  useSignup,
  useVerifyCode,
} from "../../../../libs/hooks/useAuth";
import styles from "../RegisterPage.module.css";

// --- 비밀번호 규칙 안내 컴포넌트(내부) ---
function PasswordRules({ password }: { password: string }) {
  const rules = [
    { check: password.length >= 8, text: "8자 이상" },
    { check: /[A-Z]/.test(password), text: "대문자 포함" },
    { check: /[a-z]/.test(password), text: "소문자 포함" },
    { check: /[0-9]/.test(password), text: "숫자 포함" },
    { check: /[\!\@\#\$\%\^\&\*]/.test(password), text: "특수문자 포함" },
  ];
  return (
    <ul className={styles.ruleList} style={{ margin: "4px 0 12px 2px" }}>
      {rules.map((rule, i) => (
        <li
          key={i}
          className={rule.check ? styles.rulePass : styles.ruleFail}
          aria-checked={rule.check}
        >
          {rule.text}
        </li>
      ))}
    </ul>
  );
}

// --- 기타 상수 ---
type MessageState = { type: "success" | "error" | "info"; text: string };

const REGION_OPTIONS = ["서울", "경기도", "전라남도", "부산", "대전"];
const GENDER_OPTIONS = [
  { value: "", label: "성별 선택" },
  { value: "M", label: "남성" },
  { value: "F", label: "여성" },
  { value: "O", label: "기타/선택안함" },
];

// --- 비밀번호 규칙 함수 ---
function checkPasswordRules(password: string) {
  return [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[!@#$%^&*]/.test(password),
  ];
}
function isPasswordValid(password: string) {
  return checkPasswordRules(password).every(Boolean);
}

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    email: "",
    code: "",
    nickname: "",
    phone: "",
    region: "",
    profileImageUrl: "",
    gender: "",
    birthDate: "",
  });

  // 상태 관리
  const [usernameMsg, setUsernameMsg] = useState<MessageState | null>(null);
  const [emailMsg, setEmailMsg] = useState<MessageState | null>(null);
  const [codeMsg, setCodeMsg] = useState<MessageState | null>(null);
  const [pwMsg, setPwMsg] = useState<MessageState | null>(null);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [codeInputVisible, setCodeInputVisible] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [codeChecked, setCodeChecked] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const userInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  // React Query hooks
  const checkUsernameMut = useCheckUsername();
  const checkEmailMut = useCheckEmail();
  const sendCodeMut = useSendCode();
  const verifyCodeMut = useVerifyCode();
  const signupMut = useSignup();

  // 아이디 중복확인
  const debouncedCheckUsername = useCallback(
    debounce(async (username: string) => {
      if (!username || username.length < 3) {
        setUsernameMsg(null);
        setIsUsernameValid(false);
        return;
      }
      setUsernameMsg({ type: "info", text: "확인중..." });
      try {
        const res = await checkUsernameMut.mutateAsync(username);
        if (res.available) {
          setUsernameMsg({
            type: "success",
            text: "사용 가능한 아이디입니다.",
          });
          setIsUsernameValid(true);
        } else {
          setUsernameMsg({
            type: "error",
            text: "이미 사용중인 아이디입니다.",
          });
          setIsUsernameValid(false);
        }
      } catch (e: any) {
        setUsernameMsg({ type: "error", text: e?.message || "서버 오류" });
        setIsUsernameValid(false);
      }
    }, 500),
    []
  );
  useEffect(() => {
    setIsUsernameValid(false);
    if (form.username.length >= 3) debouncedCheckUsername(form.username);
    else setUsernameMsg(null);
    return () => debouncedCheckUsername.cancel();
  }, [form.username]);

  // 이메일 중복확인
  const debouncedCheckEmail = useCallback(
    debounce(async (email: string) => {
      if (!email || !email.includes("@")) {
        setEmailMsg(null);
        setIsEmailValid(false);
        return;
      }
      setEmailMsg({ type: "info", text: "확인중..." });
      try {
        const res = await checkEmailMut.mutateAsync(email);
        if (res.available) {
          setEmailMsg({ type: "success", text: "사용 가능한 이메일입니다." });
          setIsEmailValid(true);
        } else {
          setEmailMsg({ type: "error", text: "이미 등록된 이메일입니다." });
          setIsEmailValid(false);
        }
      } catch (e: any) {
        setEmailMsg({ type: "error", text: e?.message || "서버 오류" });
        setIsEmailValid(false);
      }
    }, 500),
    []
  );
  useEffect(() => {
    setIsEmailValid(false);
    setCodeSent(false);
    setCodeChecked(false);
    setCodeInputVisible(false);
    setShowNext(false);
    setCodeMsg(null);
    if (form.email.includes("@")) debouncedCheckEmail(form.email);
    else setEmailMsg(null);
    return () => debouncedCheckEmail.cancel();
  }, [form.email]);

  // 코드발송
  const handleSendCode = useCallback(async () => {
    if (!form.email || !isEmailValid) {
      setEmailMsg({ type: "error", text: "유효한 이메일을 입력하세요." });
      return;
    }
    setCodeMsg({ type: "info", text: "인증코드 발송중..." });
    try {
      const res = await sendCodeMut.mutateAsync(form.email);
      setCodeInputVisible(true);
      setCodeSent(true);
      setShowNext(true); // ⭐ 추가필드 노출
      setCodeMsg({
        type: "success",
        text: res.message || "인증코드가 발송되었습니다.",
      });
      setTimeout(() => codeInputRef.current?.focus(), 300);
    } catch (e: any) {
      setCodeMsg({ type: "error", text: e?.message || "발송 실패(서버 오류)" });
    }
  }, [form.email, isEmailValid]);

  // 코드확인
  const handleVerifyCode = useCallback(async () => {
    if (!form.email || !form.code) {
      setCodeMsg({ type: "error", text: "인증코드를 입력하세요." });
      return;
    }
    setCodeMsg({ type: "info", text: "인증코드 확인중..." });
    try {
      const res = await verifyCodeMut.mutateAsync({
        email: form.email,
        code: form.code,
      });
      setCodeChecked(res.valid);
      setCodeMsg({
        type: res.valid ? "success" : "error",
        text: res.valid ? "인증 성공!" : "코드가 올바르지 않습니다.",
      });
    } catch (e: any) {
      setCodeMsg({ type: "error", text: e?.message || "인증 실패(서버 오류)" });
    }
  }, [form.email, form.code]);

  // 비밀번호 실시간 체크 (규칙)
  useEffect(() => {
    if (!form.password && !form.passwordConfirm) {
      setPwMsg(null);
      return;
    }
    if (!isPasswordValid(form.password)) {
      setPwMsg({
        type: "error",
        text: "비밀번호 규칙을 모두 만족해야 합니다.",
      });
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setPwMsg({ type: "error", text: "비밀번호가 일치하지 않습니다." });
      return;
    }
    setPwMsg({ type: "success", text: "비밀번호 일치" });
  }, [form.password, form.passwordConfirm]);

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !isUsernameValid ||
      !isEmailValid ||
      !codeChecked ||
      !form.nickname.trim() ||
      !form.password ||
      form.password !== form.passwordConfirm ||
      !isPasswordValid(form.password) ||
      !form.phone.trim() ||
      !form.birthDate ||
      !form.gender ||
      !form.region
    ) {
      alert("모든 정보를 정확히 입력하세요.");
      return;
    }
    const payload = {
      username: form.username,
      password: form.password,
      passwordConfirm: form.passwordConfirm,
      email: form.email,
      nickname: form.nickname,
      region: form.region,
      phone: form.phone,
      profileImageUrl: form.profileImageUrl,
      birthDate: form.birthDate,
      gender: form.gender,
    };
    try {
      await signupMut.mutateAsync(payload);
      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      router.push("/auth/login");
    } catch (e: any) {
      alert("회원가입 실패: " + (e?.message || "오류"));
    }
  };

  // 메시지 렌더
  const renderMsg = (msg: MessageState | null) =>
    msg ? (
      <div
        className={
          msg.type === "success"
            ? styles.successMsg
            : msg.type === "error"
              ? styles.errorMsg
              : styles.infoMsg
        }
        style={{ marginTop: "4px", fontSize: "0.95em" }}
        aria-live="polite"
      >
        {msg.text}
      </div>
    ) : null;

  return (
    <div className={styles.outerBox}>
      <div className={styles.titleBar}>회원가입</div>
      <div className={styles.formSection}>
        <form
          className={styles.innerForm}
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          {/* 1단계: 아이디, 이메일, 코드발송, 비밀번호 */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* 아이디 */}
            <div className={styles.formRow}>
              <input
                ref={userInputRef}
                name="username"
                value={form.username}
                onChange={(e) =>
                  setForm((f) => ({ ...f, username: e.target.value }))
                }
                className={`${styles.inputField} ${isUsernameValid ? styles.inputSuccess : ""} ${usernameMsg?.type === "error" ? styles.inputError : ""}`}
                placeholder="아이디 입력"
                autoComplete="username"
                inputMode="text"
                disabled={signupMut.isPending}
                aria-invalid={usernameMsg?.type === "error"}
                aria-label="아이디"
                required
              />
              {isUsernameValid && (
                <span
                  aria-label="확인됨"
                  style={{
                    marginLeft: 8,
                    color: "#20c37b",
                    fontSize: "1.3em",
                    fontWeight: 700,
                  }}
                >
                  ✔
                </span>
              )}
            </div>
            {renderMsg(usernameMsg)}

            {/* 이메일 */}
            <div className={styles.formRow}>
              <input
                ref={emailInputRef}
                name="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className={`${styles.inputField} ${isEmailValid ? styles.inputSuccess : ""} ${emailMsg?.type === "error" ? styles.inputError : ""}`}
                placeholder="이메일 주소 입력"
                autoComplete="email"
                inputMode="email"
                disabled={signupMut.isPending}
                aria-invalid={emailMsg?.type === "error"}
                aria-label="이메일"
                required
              />
              {isEmailValid && (
                <span
                  aria-label="확인됨"
                  style={{
                    marginLeft: 8,
                    color: "#20c37b",
                    fontSize: "1.3em",
                    fontWeight: 700,
                  }}
                >
                  ✔
                </span>
              )}
            </div>
            {renderMsg(emailMsg)}

            {/* 코드발송 버튼 */}
            <div className={styles.formRow}>
              <button
                type="button"
                className={styles.sideButton}
                onClick={handleSendCode}
                disabled={
                  sendCodeMut.isPending || !isEmailValid || signupMut.isPending
                }
                style={{ width: "100%", fontWeight: 600, letterSpacing: "1px" }}
              >
                {codeSent
                  ? "인증코드 재발송"
                  : sendCodeMut.isPending
                    ? "발송중..."
                    : "코드발송"}
              </button>
            </div>
          </div>

          {/* 인증코드 입력/확인 */}
          <AnimatePresence>
            {codeInputVisible && (
              <motion.div
                key="codeInput"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 250, damping: 30 }}
                style={{
                  marginTop: 8,
                  marginBottom: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <input
                  ref={codeInputRef}
                  name="code"
                  value={form.code}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, code: e.target.value }))
                  }
                  className={`${styles.inputField} ${codeChecked ? styles.inputSuccess : ""} ${codeMsg?.type === "error" ? styles.inputError : ""}`}
                  placeholder="인증코드"
                  inputMode="numeric"
                  disabled={verifyCodeMut.isPending || signupMut.isPending}
                  aria-invalid={codeMsg?.type === "error"}
                  aria-label="인증코드"
                  style={{ flex: 1 }}
                  required
                />
                <button
                  type="button"
                  className={styles.sideButton}
                  onClick={handleVerifyCode}
                  disabled={
                    verifyCodeMut.isPending ||
                    !form.code ||
                    codeChecked ||
                    signupMut.isPending
                  }
                  style={{ minWidth: 92 }}
                >
                  {codeChecked
                    ? "확인완료"
                    : verifyCodeMut.isPending
                      ? "확인중..."
                      : "코드확인"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {renderMsg(codeMsg)}

          {/* 비밀번호 입력 */}
          <div className={styles.formRow}>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              className={`${styles.inputField} ${
                isPasswordValid(form.password)
                  ? styles.inputSuccess
                  : form.password
                    ? styles.inputError
                    : ""
              }`}
              placeholder="비밀번호"
              autoComplete="new-password"
              disabled={signupMut.isPending}
              required
              aria-label="비밀번호"
            />
          </div>
          {/* === 비밀번호 규칙 안내 바로 아래에 출력 === */}
          <PasswordRules password={form.password} />

          <div className={styles.formRow}>
            <input
              name="passwordConfirm"
              type="password"
              value={form.passwordConfirm}
              onChange={(e) =>
                setForm((f) => ({ ...f, passwordConfirm: e.target.value }))
              }
              className={styles.inputField}
              placeholder="비밀번호 확인"
              autoComplete="new-password"
              disabled={signupMut.isPending}
              required
              aria-label="비밀번호 확인"
            />
          </div>
          {renderMsg(pwMsg)}

          {/* 2단계: 코드발송 후 모든 추가필드 슬라이드 등장 */}
          <AnimatePresence>
            {showNext && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 32 }}
                transition={{ type: "spring", stiffness: 250, damping: 30 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  marginTop: "20px",
                  background: "#fffbea",
                  borderRadius: "14px",
                  padding: "20px 14px 16px 14px",
                  boxShadow: "0 3px 12px 0 rgba(255,225,64,0.09)",
                }}
              >
                <div className={styles.formRow}>
                  <input
                    name="nickname"
                    value={form.nickname}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, nickname: e.target.value }))
                    }
                    className={styles.inputField}
                    placeholder="닉네임"
                    autoComplete="nickname"
                    disabled={signupMut.isPending}
                    required
                    aria-label="닉네임"
                  />
                </div>
                <div className={styles.formRow}>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    className={styles.inputField}
                    placeholder="휴대폰 번호(- 포함)"
                    inputMode="tel"
                    autoComplete="tel"
                    disabled={signupMut.isPending}
                    required
                    aria-label="휴대폰 번호"
                  />
                </div>
                <div className={styles.formRow}>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, gender: e.target.value }))
                    }
                    className={styles.inputField}
                    disabled={signupMut.isPending}
                    required
                    aria-label="성별"
                  >
                    {GENDER_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formRow}>
                  <input
                    name="birthDate"
                    type="date"
                    value={form.birthDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, birthDate: e.target.value }))
                    }
                    className={styles.inputField}
                    placeholder="생년월일"
                    autoComplete="bday"
                    disabled={signupMut.isPending}
                    required
                    aria-label="생년월일"
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className={styles.formRow}>
                  <select
                    name="region"
                    value={form.region}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, region: e.target.value }))
                    }
                    className={styles.inputField}
                    disabled={signupMut.isPending}
                    required
                    aria-label="지역"
                  >
                    <option value="">지역 선택</option>
                    {REGION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formRow}>
                  <input
                    name="profileImageUrl"
                    value={form.profileImageUrl}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        profileImageUrl: e.target.value,
                      }))
                    }
                    className={styles.inputField}
                    placeholder="프로필 이미지 URL (선택)"
                    autoComplete="off"
                    disabled={signupMut.isPending}
                    aria-label="프로필 이미지 URL"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            className={styles.submitButton}
            type="submit"
            disabled={signupMut.isPending}
            style={{ marginTop: showNext ? "18px" : "8px" }}
          >
            {signupMut.isPending ? "가입 중..." : "가입완료"}
          </button>
        </form>
      </div>
    </div>
  );
}
