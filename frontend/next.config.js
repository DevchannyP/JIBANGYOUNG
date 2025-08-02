const path = require('path');

/**
 * @type {import('next').NextConfig}
 * - TypeScript 기반 자동 완성 및 타입 검사 지원을 위한 JSDoc 주석입니다.
 * - Next.js 15 기준으로 deprecated된 항목 제거 및 호환성 유지
 */
const nextConfig = {
  // ✅ React 개발 모드에서 엄격한 검사 활성화 (렌더링 두 번 수행 등 부작용 탐지)
  reactStrictMode: true,

  // 🖼️ 외부 이미지 도메인 허용 설정 (next/image 최적화용)
  // 👉 Next.js 15 기준으로 domains 대신 remotePatterns 사용
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**', // 모든 경로 허용
      },
      {
        protocol: 'https',
        hostname: 'jibangyoung-s3.s3.ap-northeast-2.amazonaws.com',
        pathname: '/**',
      },
    ],
  },

  // 🔧 Webpack 설정 확장: Vercel에서 @/ 경로 인식하도록 alias 추가
  webpack(config, options) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname), // ✅ 핵심 추가 라인
    };
    return config;
  },
};

// 📤 Next.js가 설정을 읽을 수 있도록 외부로 내보냄
module.exports = nextConfig;
