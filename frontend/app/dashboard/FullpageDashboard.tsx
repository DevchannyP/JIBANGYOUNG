// "use client";

// import { useRef } from "react";
// import styles from "./components/styles/FullpageDashboard.module.css";
// import CommunitySection from "./sections/CommunitySection";
// import MainSection from "./sections/MainSection";
// import RankingSection from "./sections/RankingSection";

// export default function FullpageDashboard() {
//   const mainRef = useRef<HTMLDivElement>(null);
//   const commRef = useRef<HTMLDivElement>(null);
//   const rankRef = useRef<HTMLDivElement>(null);

//   const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
//     ref.current?.scrollIntoView({ behavior: "smooth" });
//     setTimeout(() => ref.current?.focus(), 420);
//   };

//   return (
//     <div className={styles.fullpageRoot} tabIndex={0}>
//       <section
//         ref={mainRef}
//         className={styles.snapSection}
//         tabIndex={-1}
//         aria-label="메인 대시보드"
//       >
//         <MainSection onScrollNext={() => scrollTo(commRef)} />
//       </section>

//       <section
//         ref={commRef}
//         className={styles.snapSection}
//         tabIndex={-1}
//         aria-label="커뮤니티 HOT"
//       >
//         <CommunitySection
//           onScrollPrev={() => scrollTo(mainRef)}
//           onScrollNext={() => scrollTo(rankRef)}
//         />
//       </section>

//       <section
//         ref={rankRef}
//         className={styles.snapSection}
//         tabIndex={-1}
//         aria-label="지역 랭킹 슬라이더"
//       >
//         <RankingSection onScrollPrev={() => scrollTo(commRef)} />
//       </section>
//     </div>
//   );
// }
