export default function SkeletonDashboard() {
  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(110deg, #ffe447 0% 44%, #fff 44% 100%)",
      }}
    >
      <span
        style={{
          fontSize: "1.42rem",
          fontWeight: 700,
          color: "#222",
          letterSpacing: "0.02em",
          background: "#fffbe6",
          borderRadius: 18,
          boxShadow: "0 4px 32px #ffe44740",
          padding: "22px 38px",
          display: "flex",
          alignItems: "center",
          animation: "fadein-pulse 1.22s infinite alternate",
        }}
      >
        <svg
          width={28}
          height={28}
          viewBox="0 0 24 24"
          fill="none"
          style={{ marginRight: 12, animation: "spinner 1.4s linear infinite" }}
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="#ffd600"
            strokeWidth="4"
            opacity="0.18"
          />
          <path
            d="M22 12a10 10 0 0 1-10 10"
            stroke="#ffd600"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
        메인 페이지로 진입중...
      </span>
      <style>{`
        @keyframes fadein-pulse {
          0% { box-shadow: 0 4px 32px #ffe44710; background: #fffbe6; opacity: 0.85; }
          100% { box-shadow: 0 6px 40px #ffe44750; background: #fffde0; opacity: 1; }
        }
        @keyframes spinner {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
}
