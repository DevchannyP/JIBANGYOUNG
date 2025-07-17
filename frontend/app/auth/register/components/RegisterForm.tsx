"use client";
import { useState } from "react";
import styles from "../RegisterPage.module.css";

const REGIONS = ["서울", "경기도", "전라남도"];

export default function RegisterForm() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    code: "",
    nickname: "",
    regionMulti: [] as string[],
    regionSingle: "",
    age: "",
  });
  const [dupChecked, setDupChecked] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [codeChecked, setCodeChecked] = useState(false);

  const addRegion = (val: string) => {
    if (!form.regionMulti.includes(val)) {
      setForm((f) => ({ ...f, regionMulti: [...f.regionMulti, val] }));
    }
  };
  const removeRegion = (val: string) => {
    setForm((f) => ({
      ...f,
      regionMulti: f.regionMulti.filter((r) => r !== val),
    }));
  };
  const handleRegionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value && !form.regionMulti.includes(e.target.value)) {
      addRegion(e.target.value);
      setForm((f) => ({ ...f, regionSingle: "" }));
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  return (
    <div className={styles.outerBox}>
      <div className={styles.titleBar}>회원가입</div>
      <div className={styles.formSection}>
        <form className={styles.innerForm} autoComplete="off">
          {/* 아이디 입력 + 중복확인 */}
          <div className={styles.formRow}>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className={styles.inputField}
              placeholder="아이디 입력"
              autoComplete="username"
            />
            <button
              type="button"
              className={styles.sideButton}
              onClick={() => setDupChecked(true)}
              tabIndex={0}
            >
              중복확인
            </button>
          </div>
          {/* 비밀번호 입력 */}
          <div className={styles.formRow}>
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              className={styles.inputField}
              placeholder="비밀번호를 입력하세요"
              autoComplete="new-password"
            />
          </div>
          {/* 이메일 입력 + 코드발송 */}
          <div className={styles.formRow}>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className={styles.inputField}
              placeholder="이메일 주소 입력"
              autoComplete="email"
            />
            <button
              type="button"
              className={styles.sideButton}
              onClick={() => setCodeSent(true)}
              tabIndex={0}
            >
              코드발송
            </button>
          </div>
          {/* 인증코드 입력 + 중복확인 */}
          <div className={styles.formRow}>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              className={styles.inputField}
              placeholder="인증코드"
            />
            <button
              type="button"
              className={styles.sideButton}
              onClick={() => setCodeChecked(true)}
              tabIndex={0}
            >
              중복확인
            </button>
          </div>
          {/* 닉네임 입력 */}
          <div className={styles.formRow}>
            <input
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              className={styles.inputField}
              placeholder="닉네임"
              autoComplete="nickname"
            />
          </div>
          {/* 관심지역(Chip) + 지역선택 Select */}
          <div className={styles.formRow} style={{ alignItems: "flex-start" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div className={styles.chipRegionLabel}>관심지역</div>
              <div className={styles.chipContainer}>
                {form.regionMulti.map((region) => (
                  <span key={region} className={styles.chip}>
                    {region}
                    <button
                      type="button"
                      className={styles.chipRemove}
                      onClick={() => removeRegion(region)}
                      tabIndex={0}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <select
              className={styles.selectField}
              value={form.regionSingle}
              onChange={handleRegionSelect}
              aria-label="지역 선택"
            >
              <option value="">지역 선택</option>
              {REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
          {/* 나이 */}
          <div className={styles.formRow}>
            <input
              name="age"
              value={form.age}
              onChange={handleChange}
              className={styles.inputFieldSmall}
              placeholder="나이"
              type="number"
              min="0"
              max="100"
              autoComplete="off"
            />
          </div>
          {/* 가입완료 버튼 */}
          <button className={styles.submitButton} type="submit" tabIndex={0}>
            가입완료
          </button>
        </form>
      </div>
    </div>
  );
}
