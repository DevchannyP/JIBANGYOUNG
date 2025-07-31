"use client";

import styles from "../RegisterPage.module.css";

interface Props {
  password: string;
}
export default function PasswordRules({ password }: Props) {
  // 백엔드 AuthConstants와 동일 규칙 적용
  const rules = [
    { check: password.length >= 8, text: "8자 이상" },
    { check: /[A-Z]/.test(password), text: "대문자 포함" },
    { check: /[a-z]/.test(password), text: "소문자 포함" },
    { check: /[0-9]/.test(password), text: "숫자 포함" },
    { check: /[\!\@\#\$\%\^\&\*]/.test(password), text: "특수문자 포함" },
  ];
  return (
    <ul className={styles.ruleList}>
      {rules.map((rule, i) => (
        <li
          key={i}
          className={rule.check ? styles.rulePass : styles.ruleFail}
          // aria-checked 제거! 
          // 접근성: "통과"/"실패" 텍스트를 숨긴 span으로도 노출 가능
        >
          <span
            aria-hidden="true"
            className={styles.ruleIcon}
            style={{ marginRight: 6 }}
          >
            {rule.check ? "✔️" : "❌"}
          </span>
          {rule.text}
          <span className="sr-only">
            {rule.check ? " (통과)" : " (미충족)"}
          </span>
        </li>
      ))}
    </ul>
  );
}
