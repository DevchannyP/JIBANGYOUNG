// 📌 ESLint 설정 파일 (Next.js + TypeScript + Prettier 최적화)
// 기존 .eslintrc.json 기능 100% 보존 + 동적 설정 확장

const path = require('path');

module.exports = {
  root: true,
  extends: [
    'next',
    'next/core-web-vitals', // ✅ Next.js 권장 웹 바이탈 규칙
    'prettier',              // ✅ Prettier 포맷 규칙과 충돌 방지
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    babelOptions: {
      // ✅ 명시적 설정으로 next/babel preset 오류 방지
      presets: [require.resolve('next/babel')],
    },
  },
  settings: {
    next: {
      rootDir: './', // 앱 루트 명시 (monorepo 대응)
    },
  },
  rules: {
    // ✅ 기존 JSON 파일 규칙 1:1 이전
    'react/jsx-key': 'warn',                     // JSX map 반복 시 key 경고
    'react/react-in-jsx-scope': 'off',           // React 17+에서는 필요 없음
    'react-hooks/rules-of-hooks': 'error',       // 훅 사용 규칙 강제
    'react-hooks/exhaustive-deps': 'warn',       // 의존성 배열 누락 경고
  },
};
